import 'server-only';

/**
 * Enforces compilation failure if these environment variables
 * or configs are imported anywhere in client-side code bundles.
 */
export const serverConfig = {
  dbConnectionUrl: process.env.DATABASE_URL || 'postgresql://db_user:password@localhost:5432/db_name',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key-never-shared',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_51...your_secret_key',
  upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL || '',
  upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN || '',
};
