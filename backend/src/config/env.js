const dotenv = require('dotenv');

dotenv.config();

const REQUIRED_ENV_VARS = ['PORT', 'DATABASE_URL', 'JWT_SECRET', 'JWT_EXPIRES_IN'];

const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.warn(`Missing environment variables: ${missingEnvVars.join(', ')}`);
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || ''
};

module.exports = { env };
