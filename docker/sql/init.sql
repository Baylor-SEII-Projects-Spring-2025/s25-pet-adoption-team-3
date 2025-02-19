CREATE DATABASE IF NOT EXISTS petadoption;
USE petadoption;

CREATE TABLE IF NOT EXISTS users (
    user_id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    password          VARCHAR(255),
    email             VARCHAR(255)                        NOT NULL UNIQUE,
    first_name        VARCHAR(255)                        NOT NULL,
    last_name         VARCHAR(255),
    role              ENUM ('ADOPTER', 'ADOPTION_CENTER') NOT NULL,
    is_email_verified BIT(1)                              NOT NULL,
    profile_photo     VARCHAR(255)
);

-- Ensure all columns exist (without IF NOT EXISTS)
-- Check if the column exists before altering
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'password'
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users ADD COLUMN password VARCHAR(255);', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'email'
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users ADD COLUMN email VARCHAR(255) NOT NULL UNIQUE;', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'first_name'
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users ADD COLUMN first_name VARCHAR(255) NOT NULL;', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'last_name'
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users ADD COLUMN last_name VARCHAR(255);', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'role'
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users MODIFY COLUMN role ENUM ("ADOPTER", "ADOPTION_CENTER", "ADMIN") NOT NULL;', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'is_email_verified'
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users ADD COLUMN is_email_verified BIT(1) NOT NULL;', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'profile_photo'
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users ADD COLUMN profile_photo VARCHAR(255);', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS users_sequence (
    next_val BIGINT
);

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users_sequence' AND COLUMN_NAME = 'next_val'
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users_sequence ADD COLUMN next_val BIGINT;', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
