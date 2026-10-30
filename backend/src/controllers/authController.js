const { registerSchema, loginSchema, forgotPasswordSchema } = require('../validators/authValidator');
const userService = require('../services/userService');

const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await userService.registerUser(validatedData);
    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'ValidationError',
        details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await userService.loginUser(validatedData);
    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'ValidationError',
        details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'UserNotFound', message: 'User profile not found.' });
    }
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    // Honest check: No mock email sending
    res.status(200).json({
      message: `If an account exists for ${email}, a reset procedure applies. (Note: External SMTP/Email dispatch service is currently not configured on this instance. Please contact your system administrator).`,
      emailConfigured: false
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'ValidationError',
        details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword
};

