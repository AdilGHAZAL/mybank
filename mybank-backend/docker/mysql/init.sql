-- Initialize mybank database with sample data
USE mybank;

-- Create tables will be handled by Doctrine migrations
-- This script just ensures the database is ready

-- Grant permissions
GRANT ALL PRIVILEGES ON mybank.* TO 'mybank_user'@'%';
FLUSH PRIVILEGES;
