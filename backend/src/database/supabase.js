const { createClient } = require('@supabase/supabase-js');
const env = require('../config/env');

let supabase = null;

try {
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && !env.SUPABASE_URL.includes('placeholder')) {
    supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }
} catch (err) {
  console.warn('⚠️ Supabase client initialization warning:', err.message);
}

const isSupabaseConfigured = () => {
  return !!supabase && !env.SUPABASE_URL.includes('placeholder');
};

const checkDatabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase credentials not configured or placeholder detected.'
    };
  }

  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      return { connected: false, message: error.message };
    }
    return { connected: true, message: 'Connected to Supabase PostgreSQL & pgvector' };
  } catch (err) {
    return { connected: false, message: err.message };
  }
};

module.exports = {
  supabase,
  isSupabaseConfigured,
  checkDatabaseConnection
};

