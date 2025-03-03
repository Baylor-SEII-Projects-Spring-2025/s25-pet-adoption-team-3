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

CREATE TABLE IF NOT EXISTS token (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    token       VARCHAR(255) NOT NULL UNIQUE,
    user_id     BIGINT NOT NULL UNIQUE,
    expiry_date DATETIME(6) NOT NULL,
    token_type  ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS adoption_centers (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    adoptionCenterName  VARCHAR(255) NOT NULL UNIQUE,
    email               VARCHAR(255) NOT NULL UNIQUE,
    password            VARCHAR(255) NOT NULL,
    phone               VARCHAR(50) NOT NULL,
    website             VARCHAR(255),
    bio                 TEXT,
    photo               VARCHAR(255)
    );

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'token' AND COLUMN_NAME = 'token_type'
LIMIT 1 INTO @column_exists;

SET @query = IF(@column_exists IS NULL,
    'ALTER TABLE token ADD COLUMN token_type ENUM("EMAIL_VERIFICATION", "PASSWORD_RESET") NOT NULL;',
    'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'token' AND COLUMN_NAME = 'user_id'
LIMIT 1 INTO @column_exists;

SET @query = IF(@column_exists IS NULL,
    'ALTER TABLE token ADD COLUMN user_id BIGINT NOT NULL UNIQUE;',
    'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'token' AND COLUMN_NAME = 'expiry_date'
LIMIT 1 INTO @column_exists;

SET @query = IF(@column_exists IS NULL,
    'ALTER TABLE token ADD COLUMN expiry_date DATETIME(6) NOT NULL;',
    'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'token' AND COLUMN_NAME = 'user_id'
LIMIT 1 INTO @fk_exists;

SET @query = IF(@fk_exists IS NULL,
    'ALTER TABLE token ADD CONSTRAINT fk_token_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;',
    'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'password'
LIMIT 1 INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users ADD COLUMN password VARCHAR(255);', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'email'
LIMIT 1
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users ADD COLUMN email VARCHAR(255) NOT NULL UNIQUE;', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'first_name'
LIMIT 1
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users ADD COLUMN first_name VARCHAR(255) NOT NULL;', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'last_name'
LIMIT 1
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users ADD COLUMN last_name VARCHAR(255);', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'role'
LIMIT 1
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users MODIFY COLUMN role ENUM ("ADOPTER", "ADOPTION_CENTER", "ADMIN") NOT NULL;', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'is_email_verified'
LIMIT 1
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users ADD COLUMN is_email_verified BIT(1) NOT NULL;', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'profile_photo'
LIMIT 1
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
LIMIT 1
INTO @column_exists;

SET @query = IF(@column_exists IS NULL, 'ALTER TABLE users_sequence ADD COLUMN next_val BIGINT;', 'SELECT 1;');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
