CREATE DATABASE IF NOT EXISTS petadoption;
USE petadoption;

CREATE TABLE IF NOT EXISTS users (
    user_id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    password             VARCHAR(255)                        NOT NULL,
    email                VARCHAR(255)                        NOT NULL UNIQUE,
    first_name           VARCHAR(255),
    last_name            VARCHAR(255),
    role                 ENUM ('ADOPTER', 'ADOPTION_CENTER') NOT NULL,
    is_email_verified    BIT(1)                              NOT NULL,
    profile_photo        VARCHAR(255),
    adoption_center_name VARCHAR(255),
    bio                  TEXT,
    phone_number         VARCHAR(255),
    website              VARCHAR(255),
    address              VARCHAR(255)

);
INSERT INTO users(user_id, password, email, role, is_email_verified) VALUES(2, '$2a$10$rhxduNZL9EsagAP8ubcpWOrddEbkrJwa5R0ru2rIuH8tfNy6PUTLq', 'chase_crayne1@baylor.edu', 'ADOPTION_CENTER', 1);


CREATE TABLE IF NOT EXISTS token (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    token       VARCHAR(255) NOT NULL UNIQUE,
    user_id     BIGINT NOT NULL UNIQUE,
    expiry_date DATETIME(6) NOT NULL,
    token_type  ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pet (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    adoption_center_id  BIGINT       NOT NULL,
    breed               VARCHAR(255) NOT NULL,
    spayed_status       VARCHAR(255) NOT NULL,
    birthdate           DATE         NOT NULL,
    about_me            TEXT,
    extra1              VARCHAR(255) NOT NULL,
    extra2              VARCHAR(255) NOT NULL,
    extra3              VARCHAR(255) NOT NULL,
    availability_status   ENUM('AVAILABLE', 'ARCHIVED') NOT NULL DEFAULT 'AVAILABLE',
    FOREIGN KEY (adoption_center_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pet_images (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    pet_id      BIGINT NOT NULL,
    image_url   VARCHAR(255) NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS event (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    adoption_center_id  BIGINT       NOT NULL,
    image               VARCHAR(255) NOT NULL,
    title               VARCHAR(255) NOT NULL,
    description         TEXT         NOT NULL,
    start_date          DATE         NOT NULL,
    end_date            DATE         NOT NULL,
    FOREIGN KEY (adoption_center_id) REFERENCES users(user_id) ON DELETE CASCADE
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
