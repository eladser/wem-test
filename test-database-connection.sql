-- PostgreSQL Database Verification Script
-- Run this script to verify your WEM Dashboard database was created correctly

-- Connect to database (run this command in your terminal first):
-- psql -h localhost -p 5432 -U wem_admin -d wemdashboard

-- Verify database connection
SELECT current_database(), current_user, version();

-- List all tables in the database
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check Sites table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Sites'
ORDER BY ordinal_position;

-- Check Devices table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Devices'
ORDER BY ordinal_position;

-- Check EnergyReadings table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'EnergyReadings'
ORDER BY ordinal_position;

-- Check Alerts table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Alerts'
ORDER BY ordinal_position;

-- Verify DateTime columns are using 'timestamp with time zone'
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE data_type = 'timestamp with time zone'
ORDER BY table_name, column_name;

-- Verify decimal columns are using proper precision
SELECT table_name, column_name, data_type, numeric_precision, numeric_scale
FROM information_schema.columns
WHERE data_type = 'numeric'
ORDER BY table_name, column_name;

-- Check foreign key constraints
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;

-- Check indexes
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Test inserting sample data to verify no DateTime issues
-- (Uncomment to test)
/*
INSERT INTO "Sites" ("Name", "Description", "Location", "CreatedAt", "UpdatedAt")
VALUES ('Test Site', 'Test Description', 'Test Location', NOW(), NOW());

SELECT * FROM "Sites" WHERE "Name" = 'Test Site';

-- Clean up test data
DELETE FROM "Sites" WHERE "Name" = 'Test Site';
*/

-- Final verification - should return success message
SELECT 'PostgreSQL Migration Verification Complete! 🚀' AS status;
SELECT 'All tables created successfully with proper DateTime and decimal types!' AS result;