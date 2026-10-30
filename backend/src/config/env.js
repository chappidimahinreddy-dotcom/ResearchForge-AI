const dotenv = require('dotenv');
const { z } = require('zod');
const path = require('path');

// Load .env from backend folder or root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().default('http://localhost:5173'),

  // JWT Secret must be at least 32 characters for security
  JWT_SECRET: z.string().min(32, {
    message: 'JWT_SECRET must be at least 32 characters long for cryptographic security.'
  }).default('dev_jwt_secret_at_least_32_characters_for_local_dev_only!'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Supabase (PostgreSQL + pgvector + Storage)
  SUPABASE_URL: z.string().default('https://placeholder.supabase.co'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('placeholder_service_role_key_for_setup'),

  // Google Gemini API Key
  GEMINI_API_KEY: z.string().default('placeholder_gemini_api_key'),

  // Optional Academic & Web Discovery Keys
  OPENALEX_API_KEY: z.string().optional().default(''),
  SEMANTIC_SCHOLAR_API_KEY: z.string().optional().default(''),
  CROSSREF_MAILTO: z.string().optional().default('researcher@example.com'),
  WEB_SEARCH_PROVIDER: z.enum(['tavily', 'none']).default('tavily'),
  WEB_SEARCH_API_KEY: z.string().optional().default('')
});

let parsedEnv;

try {
  parsedEnv = envSchema.parse(process.env);

  // In production, enforce strict presence of real credentials
  if (parsedEnv.NODE_ENV === 'production') {
    if (parsedEnv.SUPABASE_URL.includes('placeholder') || !parsedEnv.SUPABASE_SERVICE_ROLE_KEY.includes('key')) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be provided in production.');
    }
    if (parsedEnv.GEMINI_API_KEY.includes('placeholder')) {
      throw new Error('GEMINI_API_KEY must be provided in production.');
    }
    if (parsedEnv.JWT_SECRET.includes('dev_jwt_secret')) {
      throw new Error('A strong, production-grade JWT_SECRET must be set in production.');
    }
  }
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Configuration validation failed! Please check your backend/.env file:');
    error.errors.forEach(err => {
      console.error(`   - ${err.path.join('.')}: ${err.message}`);
    });
  } else {
    console.error('❌ Production Configuration Error:', error.message);
  }
  process.exit(1);
}

module.exports = parsedEnv;
