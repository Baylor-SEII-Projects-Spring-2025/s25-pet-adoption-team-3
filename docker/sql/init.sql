CREATE DATABASE IF NOT EXISTS petadoption;
USE petadoption;

DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    user_id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    password          VARCHAR(255),
    email             VARCHAR(255)                        NOT NULL UNIQUE,
    first_name        VARCHAR(255)                        NOT NULL,
    last_name         VARCHAR(255),
    role              ENUM ('ADOPTER', 'ADOPTION_CENTER') NOT NULL,
    is_email_verified BIT(1)                              NOT NULL,
    profile_photo     VARCHAR(255)
);

DROP TABLE IF EXISTS users_sequence;
CREATE TABLE users_sequence
(
    next_val BIGINT
);
