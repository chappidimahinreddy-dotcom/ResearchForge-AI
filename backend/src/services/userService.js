const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');
const { supabase, isSupabaseConfigured } = require('../database/supabase');

// Fallback in-memory store for local testing/dev before Supabase is connected
const memoryUsers = new Map();

const BCRYPT_ROUNDS = 12;

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

const registerUser = async ({ email, password, name }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  if (isSupabaseConfigured()) {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existingUser) {
      const err = new Error('An account with this email already exists.');
      err.status = 409;
      throw err;
    }

    const newProfile = {
      id: uuidv4(),
      email: normalizedEmail,
      password_hash: passwordHash,
      name: name || normalizedEmail.split('@')[0],
      ai_training_opt_out: true,
      ephemeral_mode: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select('id, email, name, ai_training_opt_out, ephemeral_mode, created_at')
      .single();

    if (error) throw error;

    const token = generateToken(data);
    return { user: data, token };
  } else {
    // Fallback store
    if (memoryUsers.has(normalizedEmail)) {
      const err = new Error('An account with this email already exists.');
      err.status = 409;
      throw err;
    }

    const user = {
      id: uuidv4(),
      email: normalizedEmail,
      password_hash: passwordHash,
      name: name || normalizedEmail.split('@')[0],
      ai_training_opt_out: true,
      ephemeral_mode: false,
      created_at: new Date().toISOString()
    };

    memoryUsers.set(normalizedEmail, user);
    const { password_hash: _, ...safeUser } = user;
    const token = generateToken(safeUser);
    return { user: safeUser, token };
  }
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  let user = null;

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (error || !data) {
      const err = new Error('Invalid email or password.');
      err.status = 401;
      throw err;
    }
    user = data;
  } else {
    user = memoryUsers.get(normalizedEmail);
    if (!user) {
      const err = new Error('Invalid email or password.');
      err.status = 401;
      throw err;
    }
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }

  const { password_hash: _, ...safeUser } = user;
  const token = generateToken(safeUser);
  return { user: safeUser, token };
};

const getUserById = async (userId) => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name, ai_training_opt_out, ephemeral_mode, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } else {
    for (const user of memoryUsers.values()) {
      if (user.id === userId) {
        const { password_hash: _, ...safeUser } = user;
        return safeUser;
      }
    }
    return null;
  }
};

const updateUserPrivacySettings = async (userId, { ai_training_opt_out, ephemeral_mode }) => {
  const updates = {};
  if (typeof ai_training_opt_out === 'boolean') updates.ai_training_opt_out = ai_training_opt_out;
  if (typeof ephemeral_mode === 'boolean') updates.ephemeral_mode = ephemeral_mode;
  updates.updated_at = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('id, email, name, ai_training_opt_out, ephemeral_mode, updated_at')
      .single();

    if (error) throw error;
    return data;
  } else {
    for (const [email, user] of memoryUsers.entries()) {
      if (user.id === userId) {
        Object.assign(user, updates);
        const { password_hash: _, ...safeUser } = user;
        return safeUser;
      }
    }
    return null;
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserPrivacySettings
};

