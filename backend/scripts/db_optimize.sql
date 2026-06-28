-- E-commerce PostgreSQL configuration optimization script for a low-powered VPS (e.g. 1GB RAM)

-- 1. Memory and Buffer Optimizations
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '768MB';
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- 2. Connections Configuration
ALTER SYSTEM SET max_connections = '100';

-- 3. Query Statistics extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 4. Reload configuration settings to apply adjustments dynamically
SELECT pg_reload_conf();
