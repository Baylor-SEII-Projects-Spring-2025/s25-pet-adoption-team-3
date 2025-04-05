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
    website              VARCHAR(255)

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

CREATE TABLE IF NOT EXISTS characteristic (
    characteristic_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
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

-- Insert initial adoption center
INSERT INTO users (
    user_id,
    password,
    email,
    first_name,
    last_name,
    role,
    is_email_verified,
    adoption_center_name,
    bio,
    phone_number,
    website
) VALUES (
    1,
    '$2a$10$qLPzS/zi.Fya7pAcbRtkmu3oDh63rIovhEvg1S.fI9hDeMAsPbDAy',
    'happy_paws@adoptcenter.com',
    'Lisa',
    'Mendez',
    'ADOPTION_CENTER',
    0x01,
    'Happy Paws Rescue',
    'We help dogs and cats find loving homes.',
    '123-456-7890',
    'https://happypawsrescue.org'
);

-- Insert initial pets
INSERT INTO pet (name, adoption_center_id, breed, spayed_status, birthdate, about_me, extra1, extra2, extra3) VALUES
('Toby', 1, 'Labrador', 'Neutered Male', '2022-11-29', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Molly', 1, 'Golden Retriever', 'Spayed Female', '2018-12-06', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Sadie', 1, 'German Shepherd', 'Unspayed Female', '2019-12-01', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Cooper', 1, 'Golden Retriever', 'Neutered Male', '2016-07-12', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Lily', 1, 'Golden Retriever', 'Unneutered Male', '2021-06-01', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Sadie', 1, 'Chihuahua', 'Unspayed Female', '2021-05-15', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Max', 1, 'Bulldog', 'Unspayed Female', '2021-03-10', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Bailey', 1, 'German Shepherd', 'Neutered Male', '2021-05-10', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Stella', 1, 'Chihuahua', 'Spayed Female', '2016-06-04', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Luna', 1, 'Chihuahua', 'Neutered Male', '2016-10-07', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Duke', 1, 'Labrador', 'Neutered Male', '2018-03-13', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Molly', 1, 'Golden Retriever', 'Unspayed Female', '2022-07-18', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Stella', 1, 'Shih Tzu', 'Spayed Female', '2018-08-31', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Buddy', 1, 'Golden Retriever', 'Unneutered Male', '2016-05-01', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Chloe', 1, 'Beagle', 'Spayed Female', '2023-08-06', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Bella', 1, 'Golden Retriever', 'Spayed Female', '2020-03-27', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Toby', 1, 'Chihuahua', 'Neutered Male', '2016-01-05', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Bella', 1, 'Dachshund', 'Spayed Female', '2021-12-07', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Bailey', 1, 'Shih Tzu', 'Unspayed Female', '2015-09-11', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Jack', 1, 'Labrador', 'Neutered Male', '2020-11-29', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Lily', 1, 'Beagle', 'Unspayed Female', '2016-06-30', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Bear', 1, 'German Shepherd', 'Neutered Male', '2021-01-23', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Toby', 1, 'Shih Tzu', 'Unneutered Male', '2023-02-14', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Daisy', 1, 'Beagle', 'Neutered Male', '2021-10-11', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Molly', 1, 'Bulldog', 'Spayed Female', '2020-12-30', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Duke', 1, 'Golden Retriever', 'Unspayed Female', '2017-05-30', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Bailey', 1, 'Beagle', 'Unspayed Female', '2021-06-20', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Rocky', 1, 'Boxer', 'Unspayed Female', '2015-06-08', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Rocky', 1, 'Poodle', 'Neutered Male', '2019-02-17', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Chloe', 1, 'Beagle', 'Spayed Female', '2015-01-13', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Cooper', 1, 'Bulldog', 'Neutered Male', '2017-04-07', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Buddy', 1, 'Labrador', 'Spayed Female', '2023-07-26', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Lily', 1, 'Poodle', 'Neutered Male', '2022-08-08', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Bailey', 1, 'German Shepherd', 'Unspayed Female', '2016-06-04', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Luna', 1, 'Labrador', 'Neutered Male', '2019-04-20', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Zeus', 1, 'Dachshund', 'Neutered Male', '2015-05-20', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Zeus', 1, 'Chihuahua', 'Neutered Male', '2017-02-15', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Bailey', 1, 'Boxer', 'Unneutered Male', '2018-06-01', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Chloe', 1, 'Bulldog', 'Neutered Male', '2022-12-02', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Bear', 1, 'German Shepherd', 'Unspayed Female', '2017-12-18', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Jack', 1, 'Golden Retriever', 'Spayed Female', '2020-05-01', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Duke', 1, 'Dachshund', 'Unneutered Male', '2023-06-29', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Daisy', 1, 'Beagle', 'Spayed Female', '2020-02-04', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Bear', 1, 'Beagle', 'Spayed Female', '2023-03-12', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Daisy', 1, 'Dachshund', 'Neutered Male', '2016-05-09', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Jack', 1, 'Poodle', 'Spayed Female', '2022-08-19', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Rocky', 1, 'Chihuahua', 'Unspayed Female', '2017-09-18', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Jack', 1, 'Dachshund', 'Spayed Female', '2017-04-22', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Buddy', 1, 'Poodle', 'Unneutered Male', '2015-02-28', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Luna', 1, 'Shih Tzu', 'Spayed Female', '2021-12-03', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Lily', 1, 'Poodle', 'Spayed Female', '2020-11-26', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Cooper', 1, 'Beagle', 'Spayed Female', '2019-09-16', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Jack', 1, 'Bulldog', 'Unspayed Female', '2023-05-01', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Jack', 1, 'Shih Tzu', 'Unspayed Female', '2023-04-15', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Toby', 1, 'Dachshund', 'Unspayed Female', '2018-03-16', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Toby', 1, 'Shih Tzu', 'Unneutered Male', '2015-05-17', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Charlie', 1, 'Boxer', 'Unneutered Male', '2023-05-26', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Daisy', 1, 'Bulldog', 'Neutered Male', '2023-04-26', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Duke', 1, 'German Shepherd', 'Spayed Female', '2022-03-23', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Molly', 1, 'Dachshund', 'Unspayed Female', '2019-06-16', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Cooper', 1, 'Labrador', 'Unspayed Female', '2015-11-10', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Max', 1, 'Labrador', 'Spayed Female', '2023-04-30', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Stella', 1, 'German Shepherd', 'Unneutered Male', '2020-01-11', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Bella', 1, 'Beagle', 'Unspayed Female', '2020-02-20', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Luna', 1, 'Beagle', 'Neutered Male', '2016-07-20', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Bailey', 1, 'Chihuahua', 'Unspayed Female', '2016-11-05', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Daisy', 1, 'Beagle', 'Unneutered Male', '2022-04-27', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Lily', 1, 'Beagle', 'Neutered Male', '2016-07-08', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Lily', 1, 'Golden Retriever', 'Unspayed Female', '2021-07-13', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Cooper', 1, 'Golden Retriever', 'Unneutered Male', '2017-12-12', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Bella', 1, 'Labrador', 'Unneutered Male', '2015-10-13', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Max', 1, 'Shih Tzu', 'Unspayed Female', '2020-07-16', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Chloe', 1, 'Beagle', 'Unspayed Female', '2018-02-16', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Buddy', 1, 'Dachshund', 'Unneutered Male', '2018-08-24', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Charlie', 1, 'German Shepherd', 'Unneutered Male', '2023-03-08', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Max', 1, 'Poodle', 'Unneutered Male', '2022-05-22', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Rocky', 1, 'Beagle', 'Unneutered Male', '2023-05-09', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Buddy', 1, 'Dachshund', 'Neutered Male', '2017-08-30', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Daisy', 1, 'Labrador', 'Unspayed Female', '2020-06-27', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Buddy', 1, 'Labrador', 'Unspayed Female', '2015-05-15', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Charlie', 1, 'Dachshund', 'Spayed Female', '2018-09-03', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Bella', 1, 'German Shepherd', 'Unspayed Female', '2021-09-27', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Jack', 1, 'Boxer', 'Spayed Female', '2021-08-27', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Zeus', 1, 'Labrador', 'Neutered Male', '2018-02-01', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Daisy', 1, 'German Shepherd', 'Unspayed Female', '2018-12-16', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Bella', 1, 'Labrador', 'Neutered Male', '2017-04-30', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Max', 1, 'Chihuahua', 'Neutered Male', '2021-03-27', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Bailey', 1, 'Golden Retriever', 'Unspayed Female', '2021-06-14', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Chloe', 1, 'Bulldog', 'Neutered Male', '2022-11-09', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Sadie', 1, 'Dachshund', 'Unspayed Female', '2021-08-19', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Daisy', 1, 'Chihuahua', 'Neutered Male', '2021-04-04', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Rocky', 1, 'German Shepherd', 'Unspayed Female', '2016-10-22', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Charlie', 1, 'Beagle', 'Unneutered Male', '2023-04-09', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated'),
('Max', 1, 'Poodle', 'Neutered Male', '2022-10-11', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Buddy', 1, 'Poodle', 'Unneutered Male', '2021-05-04', 'Loves belly rubs and playtime.', 'Low energy', 'Good for apartment', 'Friendly with all'),
('Charlie', 1, 'Shih Tzu', 'Unneutered Male', '2022-09-27', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Charlie', 1, 'Poodle', 'Unneutered Male', '2021-04-26', 'Loves belly rubs and playtime.', 'Trained for commands', 'Good with children', 'Prefers fenced yard'),
('Buddy', 1, 'German Shepherd', 'Spayed Female', '2023-10-06', 'Loves belly rubs and playtime.', 'Knows basic commands', 'Crate-trained', 'Needs daily walks'),
('Luna', 1, 'Labrador', 'Unspayed Female', '2023-12-18', 'Loves belly rubs and playtime.', 'Good with dogs', 'Microchipped', 'Leash trained'),
('Chloe', 1, 'Shih Tzu', 'Unspayed Female', '2022-01-04', 'Loves belly rubs and playtime.', 'Good with kids', 'House-trained', 'Fully vaccinated');

-- Insert characteristics
INSERT INTO characteristic (characteristic_id, name) VALUES
(1, 'Short fur'),
(2, 'Medium fur'),
(3, 'Long fur'),
(4, 'Curly fur'),
(5, 'Wavy fur'),
(6, 'Straight fur'),
(7, 'Hairless fur'),
(8, 'Double coat fur'),
(9, 'Silky fur'),
(10, 'Wiry fur'),
(11, 'Long tail'),
(12, 'Short tail'),
(13, 'Docked tail'),
(14, 'Bobtail'),
(15, 'Curled tail'),
(16, 'Straight tail'),
(17, 'Plumed tail'),
(18, 'Whip-like tail'),
(19, 'Kinked tail'),
(20, 'Tufted tip tail'),
(21, 'Erect ears'),
(22, 'Droopy ears'),
(23, 'Semi-erect ears'),
(24, 'Folded ears'),
(25, 'Floppy ears'),
(26, 'Feathered ears'),
(27, 'Bat ears'),
(28, 'Cropped ears'),
(29, 'Tufted ears'),
(30, 'Button ears'),
(31, 'Lean body'),
(32, 'Muscular body'),
(33, 'Stocky body'),
(34, 'Slender body'),
(35, 'Compact body'),
(36, 'Elongated body'),
(37, 'Cobby body'),
(38, 'Athletic body'),
(39, 'Heavy-boned body');
