USE petadoption;

CREATE TABLE IF NOT EXISTS users (user_id BIGINT AUTO_INCREMENT PRIMARY KEY, password VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    role ENUM('ADOPTER', 'ADOPTION_CENTER') NOT NULL,
    is_email_verified BIT(1) NOT NULL,
    profile_photo VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS users_sequence (next_val BIGINT);
