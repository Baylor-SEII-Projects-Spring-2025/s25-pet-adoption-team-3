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

-- Ensure all columns exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255) NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM ('ADOPTER', 'ADOPTION_CENTER') NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BIT(1) NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo VARCHAR(255);

CREATE TABLE IF NOT EXISTS users_sequence (
    next_val BIGINT
);

ALTER TABLE users_sequence ADD COLUMN IF NOT EXISTS next_val BIGINT;
