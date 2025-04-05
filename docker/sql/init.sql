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

INSERT INTO pet_images (pet_id, image_url) VALUES
(1, 'https://images.dog.ceo/breeds/labrador/Fury_01.jpg'),
(1, 'https://images.dog.ceo/breeds/labrador/Fury_02.jpg'),
(1, 'https://images.dog.ceo/breeds/labrador/IMG_2397.jpg'),
(1, 'https://images.dog.ceo/breeds/labrador/JessieIncognito.jpg'),
(2, 'https://images.dog.ceo/breeds/retriever-golden/20200731_180910_200731.jpg'),
(2, 'https://images.dog.ceo/breeds/retriever-golden/20200801_174527_200801.jpg'),
(2, 'https://images.dog.ceo/breeds/retriever-golden/20200814_163629_200814.jpg'),
(2, 'https://images.dog.ceo/breeds/retriever-golden/20200816_163418_200816.jpg'),
(3, 'https://images.dog.ceo/breeds/germanshepherd/Storm_01.jpg'),
(3, 'https://images.dog.ceo/breeds/germanshepherd/Storm_02.jpg'),
(3, 'https://images.dog.ceo/breeds/germanshepherd/Storm_03.jpg'),
(3, 'https://images.dog.ceo/breeds/germanshepherd/Storm_04.jpg'),
(4, 'https://images.dog.ceo/breeds/retriever-golden/20200814_113907_200814.jpg'),
(4, 'https://images.dog.ceo/breeds/retriever-golden/20200816_180945_200816.jpg'),
(4, 'https://images.dog.ceo/breeds/retriever-golden/PXL_20220125_060304705.MP.jpg'),
(4, 'https://images.dog.ceo/breeds/retriever-golden/PXL_20220311_055548510.MP_2.jpg'),
(5, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_3963_200731.jpg'),
(5, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4051_200803.jpg'),
(5, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4068_200803.jpg'),
(5, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4193-Edit-Edit_200806.jpg'),
(6, 'https://images.dog.ceo/breeds/chihuahua/Judy.jpg'),
(6, 'https://images.dog.ceo/breeds/chihuahua/black_chihuahua.jpg'),
(6, 'https://images.dog.ceo/breeds/chihuahua/flora.jpg'),
(6, 'https://images.dog.ceo/breeds/chihuahua/marto.jpg'),
(7, 'https://images.dog.ceo/breeds/bulldog/n0271630.jpg'),
(7, 'https://images.dog.ceo/breeds/bulldog/n0249342.jpg'),
(7, 'https://images.dog.ceo/breeds/bulldog/n0249246.jpg'),
(7, 'https://images.dog.ceo/breeds/bulldog/n0256665.jpg'),
(8, 'https://images.dog.ceo/breeds/germanshepherd/IMG_20200801_005825_408.jpg'),
(8, 'https://images.dog.ceo/breeds/germanshepherd/IMG_20200801_005827_704.jpg'),
(8, 'https://images.dog.ceo/breeds/germanshepherd/IMG_20200801_005830_387.jpg'),
(8, 'https://images.dog.ceo/breeds/germanshepherd/IMG_20200801_005834_050.jpg'),
(9, 'https://images.dog.ceo/breeds/chihuahua/mickey.jpg'),
(9, 'https://images.dog.ceo/breeds/chihuahua/msdaisy.jpg'),
(9, 'https://images.dog.ceo/breeds/chihuahua/n02085620_10131.jpg'),
(9, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1073.jpg'),
(10, 'https://images.dog.ceo/breeds/chihuahua/n02085620_10976.jpg'),
(10, 'https://images.dog.ceo/breeds/chihuahua/n02085620_11140.jpg'),
(10, 'https://images.dog.ceo/breeds/chihuahua/n02085620_11258.jpg'),
(10, 'https://images.dog.ceo/breeds/chihuahua/n02085620_11696.jpg'),
(11, 'https://images.dog.ceo/breeds/labrador/Toblerone_1.jpg'),
(11, 'https://images.dog.ceo/breeds/labrador/Toblerone_2.jpg'),
(11, 'https://images.dog.ceo/breeds/labrador/Toblerone_3.jpg'),
(11, 'https://images.dog.ceo/breeds/labrador/Toblerone_4.jpg'),
(12, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4365_200807.jpg'),
(12, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4459-Edit_200808.jpg'),
(12, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4500_200808.jpg'),
(12, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4525_200809.jpg'),
(13, 'https://images.dog.ceo/breeds/shihtzu/n0216205.jpg'),
(13, 'https://images.dog.ceo/breeds/shihtzu/n0212850.jpg'),
(13, 'https://images.dog.ceo/breeds/shihtzu/n0254428.jpg'),
(13, 'https://images.dog.ceo/breeds/shihtzu/n0238999.jpg'),
(14, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4650_200812.jpg'),
(14, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4904_200816.jpg'),
(14, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4928_200816.jpg'),
(14, 'https://images.dog.ceo/breeds/retriever-golden/dogs.boris.jasper.nixon.jpg'),
(15, 'https://images.dog.ceo/breeds/beagle/n0211107.jpg'),
(15, 'https://images.dog.ceo/breeds/beagle/n0224937.jpg'),
(15, 'https://images.dog.ceo/breeds/beagle/n0254529.jpg'),
(15, 'https://images.dog.ceo/breeds/beagle/n0214478.jpg'),
(16, 'https://images.dog.ceo/breeds/retriever-golden/joey_20210311_213829.jpg'),
(16, 'https://images.dog.ceo/breeds/retriever-golden/joey_20210802_223302.jpg'),
(16, 'https://images.dog.ceo/breeds/retriever-golden/joey_20210805_130226.jpg'),
(16, 'https://images.dog.ceo/breeds/retriever-golden/joey_IMG_0261.jpg'),
(17, 'https://images.dog.ceo/breeds/chihuahua/n02085620_11818.jpg'),
(17, 'https://images.dog.ceo/breeds/chihuahua/n02085620_11948.jpg'),
(17, 'https://images.dog.ceo/breeds/chihuahua/n02085620_12101.jpg'),
(17, 'https://images.dog.ceo/breeds/chihuahua/n02085620_12334.jpg'),
(18, 'https://images.dog.ceo/breeds/dachshund/n0230188.jpg'),
(18, 'https://images.dog.ceo/breeds/dachshund/n0257236.jpg'),
(18, 'https://images.dog.ceo/breeds/dachshund/n0287635.jpg'),
(18, 'https://images.dog.ceo/breeds/dachshund/n0242647.jpg'),
(19, 'https://images.dog.ceo/breeds/shihtzu/n0285332.jpg'),
(19, 'https://images.dog.ceo/breeds/shihtzu/n0219231.jpg'),
(19, 'https://images.dog.ceo/breeds/shihtzu/n0271733.jpg'),
(19, 'https://images.dog.ceo/breeds/shihtzu/n0273878.jpg'),
(20, 'https://images.dog.ceo/breeds/labrador/yellowlab-grace.jpg'),
(20, 'https://images.dog.ceo/breeds/labrador/pic1_l.jpg'),
(20, 'https://images.dog.ceo/breeds/labrador/n02099712_9374.jpg'),
(20, 'https://images.dog.ceo/breeds/labrador/n02099712_9373.jpg'),
(21, 'https://images.dog.ceo/breeds/beagle/n0219927.jpg'),
(21, 'https://images.dog.ceo/breeds/beagle/n0291067.jpg'),
(21, 'https://images.dog.ceo/breeds/beagle/n0259062.jpg'),
(21, 'https://images.dog.ceo/breeds/beagle/n0269034.jpg'),
(22, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_9994.jpg'),
(22, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_9936.jpg'),
(22, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_9625.jpg'),
(22, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_9556.jpg'),
(23, 'https://images.dog.ceo/breeds/shihtzu/n0284802.jpg'),
(23, 'https://images.dog.ceo/breeds/shihtzu/n0230740.jpg'),
(23, 'https://images.dog.ceo/breeds/shihtzu/n0236189.jpg'),
(23, 'https://images.dog.ceo/breeds/shihtzu/n0249214.jpg'),
(24, 'https://images.dog.ceo/breeds/beagle/n0216790.jpg'),
(24, 'https://images.dog.ceo/breeds/beagle/n0236521.jpg'),
(24, 'https://images.dog.ceo/breeds/beagle/n0243608.jpg'),
(24, 'https://images.dog.ceo/breeds/beagle/n0210440.jpg'),
(25, 'https://images.dog.ceo/breeds/bulldog/n0256795.jpg'),
(25, 'https://images.dog.ceo/breeds/bulldog/n0210749.jpg'),
(25, 'https://images.dog.ceo/breeds/bulldog/n0234536.jpg'),
(25, 'https://images.dog.ceo/breeds/bulldog/n0266829.jpg'),
(26, 'https://images.dog.ceo/breeds/retriever-golden/joey_IMG_0628.jpg'),
(26, 'https://images.dog.ceo/breeds/retriever-golden/joey_IMG_0633.jpg'),
(26, 'https://images.dog.ceo/breeds/retriever-golden/joey_IMG_20210906_091617_3.jpg'),
(26, 'https://images.dog.ceo/breeds/retriever-golden/leo_small.jpg'),
(27, 'https://images.dog.ceo/breeds/beagle/n0234669.jpg'),
(27, 'https://images.dog.ceo/breeds/beagle/n0296943.jpg'),
(27, 'https://images.dog.ceo/breeds/beagle/n0255631.jpg'),
(27, 'https://images.dog.ceo/breeds/beagle/n0234969.jpg'),
(28, 'https://images.dog.ceo/breeds/boxer/n0293915.jpg'),
(28, 'https://images.dog.ceo/breeds/boxer/n0295512.jpg'),
(28, 'https://images.dog.ceo/breeds/boxer/n0255683.jpg'),
(28, 'https://images.dog.ceo/breeds/boxer/n0223214.jpg'),
(29, 'https://images.dog.ceo/breeds/poodle/n0262021.jpg'),
(29, 'https://images.dog.ceo/breeds/poodle/n0296507.jpg'),
(29, 'https://images.dog.ceo/breeds/poodle/n0255587.jpg'),
(29, 'https://images.dog.ceo/breeds/poodle/n0229021.jpg'),
(30, 'https://images.dog.ceo/breeds/beagle/n0270109.jpg'),
(30, 'https://images.dog.ceo/breeds/beagle/n0247380.jpg'),
(30, 'https://images.dog.ceo/breeds/beagle/n0212713.jpg'),
(30, 'https://images.dog.ceo/breeds/beagle/n0271168.jpg'),
(31, 'https://images.dog.ceo/breeds/bulldog/n0241200.jpg'),
(31, 'https://images.dog.ceo/breeds/bulldog/n0294875.jpg'),
(31, 'https://images.dog.ceo/breeds/bulldog/n0246941.jpg'),
(31, 'https://images.dog.ceo/breeds/bulldog/n0260380.jpg'),
(32, 'https://images.dog.ceo/breeds/labrador/n0217854.jpg'),
(32, 'https://images.dog.ceo/breeds/labrador/n0287579.jpg'),
(32, 'https://images.dog.ceo/breeds/labrador/n0239964.jpg'),
(32, 'https://images.dog.ceo/breeds/labrador/n0241180.jpg'),
(33, 'https://images.dog.ceo/breeds/poodle/n0220775.jpg'),
(33, 'https://images.dog.ceo/breeds/poodle/n0279251.jpg'),
(33, 'https://images.dog.ceo/breeds/poodle/n0230390.jpg'),
(33, 'https://images.dog.ceo/breeds/poodle/n0238330.jpg'),
(34, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_7960.jpg'),
(34, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_7885.jpg'),
(34, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_7238.jpg'),
(34, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_7212.jpg'),
(35, 'https://images.dog.ceo/breeds/labrador/n0271224.jpg'),
(35, 'https://images.dog.ceo/breeds/labrador/n0221240.jpg'),
(35, 'https://images.dog.ceo/breeds/labrador/n0217945.jpg'),
(35, 'https://images.dog.ceo/breeds/labrador/n0294268.jpg'),
(36, 'https://images.dog.ceo/breeds/dachshund/n0289619.jpg'),
(36, 'https://images.dog.ceo/breeds/dachshund/n0225886.jpg'),
(36, 'https://images.dog.ceo/breeds/dachshund/n0215941.jpg'),
(36, 'https://images.dog.ceo/breeds/dachshund/n0255010.jpg'),
(37, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1235.jpg'),
(37, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1271.jpg'),
(37, 'https://images.dog.ceo/breeds/chihuahua/n02085620_12718.jpg'),
(37, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1298.jpg'),
(38, 'https://images.dog.ceo/breeds/boxer/n0282034.jpg'),
(38, 'https://images.dog.ceo/breeds/boxer/n0276046.jpg'),
(38, 'https://images.dog.ceo/breeds/boxer/n0292794.jpg'),
(38, 'https://images.dog.ceo/breeds/boxer/n0210619.jpg'),
(39, 'https://images.dog.ceo/breeds/bulldog/n0270429.jpg'),
(39, 'https://images.dog.ceo/breeds/bulldog/n0277236.jpg'),
(39, 'https://images.dog.ceo/breeds/bulldog/n0243977.jpg'),
(39, 'https://images.dog.ceo/breeds/bulldog/n0258300.jpg'),
(40, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_4021.jpg'),
(40, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_4059.jpg'),
(40, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_4201.jpg'),
(40, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_1812.jpg'),
(41, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_10.jpg'),
(41, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_100.jpg'),
(41, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1010.jpg'),
(41, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1028.jpg'),
(42, 'https://images.dog.ceo/breeds/dachshund/n0294325.jpg'),
(42, 'https://images.dog.ceo/breeds/dachshund/n0216614.jpg'),
(42, 'https://images.dog.ceo/breeds/dachshund/n0250735.jpg'),
(42, 'https://images.dog.ceo/breeds/dachshund/n0235210.jpg'),
(43, 'https://images.dog.ceo/breeds/beagle/n0246129.jpg'),
(43, 'https://images.dog.ceo/breeds/beagle/n0241212.jpg'),
(43, 'https://images.dog.ceo/breeds/beagle/n0223303.jpg'),
(43, 'https://images.dog.ceo/breeds/beagle/n0216944.jpg'),
(44, 'https://images.dog.ceo/breeds/beagle/n0249453.jpg'),
(44, 'https://images.dog.ceo/breeds/beagle/n0211727.jpg'),
(44, 'https://images.dog.ceo/breeds/beagle/n0218515.jpg'),
(44, 'https://images.dog.ceo/breeds/beagle/n0256001.jpg'),
(45, 'https://images.dog.ceo/breeds/dachshund/n0232970.jpg'),
(45, 'https://images.dog.ceo/breeds/dachshund/n0292454.jpg'),
(45, 'https://images.dog.ceo/breeds/dachshund/n0252476.jpg'),
(45, 'https://images.dog.ceo/breeds/dachshund/n0252211.jpg'),
(46, 'https://images.dog.ceo/breeds/poodle/n0231807.jpg'),
(46, 'https://images.dog.ceo/breeds/poodle/n0234057.jpg'),
(46, 'https://images.dog.ceo/breeds/poodle/n0214101.jpg'),
(46, 'https://images.dog.ceo/breeds/poodle/n0266961.jpg'),
(47, 'https://images.dog.ceo/breeds/chihuahua/n02085620_13151.jpg'),
(47, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1321.jpg'),
(47, 'https://images.dog.ceo/breeds/chihuahua/n02085620_13383.jpg'),
(47, 'https://images.dog.ceo/breeds/chihuahua/n02085620_13964.jpg'),
(48, 'https://images.dog.ceo/breeds/dachshund/n0258755.jpg'),
(48, 'https://images.dog.ceo/breeds/dachshund/n0228892.jpg'),
(48, 'https://images.dog.ceo/breeds/dachshund/n0297473.jpg'),
(48, 'https://images.dog.ceo/breeds/dachshund/n0239543.jpg'),
(49, 'https://images.dog.ceo/breeds/shihtzu/n0264932.jpg'), -- TODO: this is supposed to be a poodle
(49, 'https://images.dog.ceo/breeds/shihtzu/n0215595.jpg'),
(49, 'https://images.dog.ceo/breeds/shihtzu/n0258506.jpg'),
(49, 'https://images.dog.ceo/breeds/shihtzu/n0288144.jpg'),
(50, 'https://images.dog.ceo/breeds/shihtzu/n0229286.jpg'),
(50, 'https://images.dog.ceo/breeds/shihtzu/n0250532.jpg'),
(50, 'https://images.dog.ceo/breeds/shihtzu/n0279682.jpg'),
(50, 'https://images.dog.ceo/breeds/shihtzu/n0258359.jpg'),
(51, 'https://images.dog.ceo/breeds/boxer/n0249174.jpg'), -- TODO: this is a poodle
(51, 'https://images.dog.ceo/breeds/boxer/n0243465.jpg'),
(51, 'https://images.dog.ceo/breeds/boxer/n0243697.jpg'),
(51, 'https://images.dog.ceo/breeds/boxer/n0246158.jpg'),
(52, 'https://images.dog.ceo/breeds/bulldog/n0270980.jpg'), -- TODO: this is a beagle
(52, 'https://images.dog.ceo/breeds/bulldog/n0287285.jpg'),
(52, 'https://images.dog.ceo/breeds/bulldog/n0218617.jpg'),
(52, 'https://images.dog.ceo/breeds/bulldog/n0263810.jpg'),
(53, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_18268.jpg'),
(53, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_18405.jpg'),
(53, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_1841.jpg'),
(53, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_18922.jpg'),
(54, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_109.jpg'),
(54, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1162.jpg'),
(54, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_118.jpg'),
(54, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_124.jpg'),
(55, 'https://images.dog.ceo/breeds/dachshund/n0291188.jpg'),
(55, 'https://images.dog.ceo/breeds/dachshund/n0266653.jpg'),
(55, 'https://images.dog.ceo/breeds/dachshund/n0235143.jpg'),
(55, 'https://images.dog.ceo/breeds/dachshund/n0296066.jpg'),
(56, 'https://images.dog.ceo/breeds/chihuahua/n02085620_14252.jpg'),
(56, 'https://images.dog.ceo/breeds/chihuahua/n02085620_14413.jpg'),
(56, 'https://images.dog.ceo/breeds/chihuahua/n02085620_14516.jpg'),
(56, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1455.jpg'),
(57, 'https://images.dog.ceo/breeds/beagle/n0235703.jpg'),
(57, 'https://images.dog.ceo/breeds/beagle/n0258765.jpg'),
(57, 'https://images.dog.ceo/breeds/beagle/n0251228.jpg'),
(57, 'https://images.dog.ceo/breeds/beagle/n0218643.jpg'),
(58, 'https://images.dog.ceo/breeds/labrador/n02099712_5599.jpg'),
(58, 'https://images.dog.ceo/breeds/labrador/n02099712_5657.jpg'),
(58, 'https://images.dog.ceo/breeds/labrador/n02099712_5679.jpg'),
(58, 'https://images.dog.ceo/breeds/labrador/n02099712_5689.jpg'),
(59, 'https://images.dog.ceo/breeds/labrador/n02099712_57.jpg'),
(59, 'https://images.dog.ceo/breeds/labrador/n02099712_5769.jpg'),
(59, 'https://images.dog.ceo/breeds/labrador/n02099712_5787.jpg'),
(59, 'https://images.dog.ceo/breeds/labrador/n02099712_5844.jpg'),
(60, 'https://images.dog.ceo/breeds/dachshund/n0238414.jpg'),
(60, 'https://images.dog.ceo/breeds/dachshund/n0214524.jpg'),
(60, 'https://images.dog.ceo/breeds/dachshund/n0226325.jpg'),
(60, 'https://images.dog.ceo/breeds/dachshund/n0245912.jpg'),
(61, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_19641.jpg'),
(61, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_19720.jpg'),
(61, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_19791.jpg'),
(61, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_19801.jpg'),
(62, 'https://images.dog.ceo/breeds/labrador/n02099712_6646.jpg'),
(62, 'https://images.dog.ceo/breeds/labrador/n02099712_6664.jpg'),
(62, 'https://images.dog.ceo/breeds/labrador/n02099712_6684.jpg'),
(62, 'https://images.dog.ceo/breeds/labrador/n02099712_6775.jpg'),
(63, 'https://images.dog.ceo/breeds/shihtzu/n0297958.jpg'),
(63, 'https://images.dog.ceo/breeds/shihtzu/n0238289.jpg'),
(63, 'https://images.dog.ceo/breeds/shihtzu/n0241889.jpg'),
(63, 'https://images.dog.ceo/breeds/shihtzu/n0246288.jpg'),
(64, 'https://images.dog.ceo/breeds/beagle/n0276804.jpg'),
(64, 'https://images.dog.ceo/breeds/beagle/n0276202.jpg'),
(64, 'https://images.dog.ceo/breeds/beagle/n0298551.jpg'),
(64, 'https://images.dog.ceo/breeds/beagle/n0210824.jpg'),
(65, 'https://images.dog.ceo/breeds/dachshund/n0244968.jpg'),
(65, 'https://images.dog.ceo/breeds/dachshund/n0260265.jpg'),
(65, 'https://images.dog.ceo/breeds/dachshund/n0278573.jpg'),
(65, 'https://images.dog.ceo/breeds/dachshund/n0234383.jpg'),
(66, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_20036.jpg'),
(66, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_2058.jpg'),
(66, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_20711.jpg'),
(66, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_21094.jpg'),
(67, 'https://images.dog.ceo/breeds/boxer/n0285997.jpg'),
(67, 'https://images.dog.ceo/breeds/boxer/n0274375.jpg'),
(67, 'https://images.dog.ceo/breeds/boxer/n0214658.jpg'),
(67, 'https://images.dog.ceo/breeds/boxer/n0278327.jpg'),
(68, 'https://images.dog.ceo/breeds/labrador/n02099712_6823.jpg'),
(68, 'https://images.dog.ceo/breeds/labrador/n02099712_6897.jpg'),
(68, 'https://images.dog.ceo/breeds/labrador/n02099712_6901.jpg'),
(68, 'https://images.dog.ceo/breeds/labrador/n02099712_6997.jpg'),
(69, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_21348.jpg'),
(69, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_21432.jpg'),
(69, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_22245.jpg'),
(69, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_22456.jpg'),
(70, 'https://images.dog.ceo/breeds/labrador/n02099712_7049.jpg'),
(70, 'https://images.dog.ceo/breeds/labrador/n02099712_7133.jpg'),
(70, 'https://images.dog.ceo/breeds/labrador/n02099712_7142.jpg'),
(70, 'https://images.dog.ceo/breeds/labrador/n02099712_7164.jpg'),
(71, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1502.jpg'),
(71, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1558.jpg'),
(71, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1569.jpg'),
(71, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1617.jpg'),
(72, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1249.jpg'),
(72, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1259.jpg'),
(72, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1324.jpg'),
(72, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_14.jpg'),
(73, 'https://images.dog.ceo/breeds/bulldog/n0248894.jpg'),
(73, 'https://images.dog.ceo/breeds/bulldog/n0217043.jpg'),
(73, 'https://images.dog.ceo/breeds/bulldog/n0260132.jpg'),
(73, 'https://images.dog.ceo/breeds/bulldog/n0259010.jpg'),
(74, 'https://images.dog.ceo/breeds/dachshund/n0258616.jpg'),
(74, 'https://images.dog.ceo/breeds/dachshund/n0277038.jpg'),
(74, 'https://images.dog.ceo/breeds/dachshund/n0297292.jpg'),
(74, 'https://images.dog.ceo/breeds/dachshund/n0229184.jpg'),
(75, 'https://images.dog.ceo/breeds/chihuahua/n0284530.jpg'),
(75, 'https://images.dog.ceo/breeds/chihuahua/n0221238.jpg'),
(75, 'https://images.dog.ceo/breeds/chihuahua/n0294603.jpg'),
(75, 'https://images.dog.ceo/breeds/chihuahua/n0285250.jpg'),
(76, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_22730.jpg'),
(76, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_22764.jpg'),
(76, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_22854.jpg'),
(76, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_23360.jpg'),
(77, 'https://images.dog.ceo/breeds/beagle/n0295606.jpg'),
(77, 'https://images.dog.ceo/breeds/beagle/n0230759.jpg'),
(77, 'https://images.dog.ceo/breeds/beagle/n0211453.jpg'),
(77, 'https://images.dog.ceo/breeds/beagle/n0246693.jpg'),
(78, 'https://images.dog.ceo/breeds/poodle/n0276372.jpg'),
(78, 'https://images.dog.ceo/breeds/poodle/n0298333.jpg'),
(78, 'https://images.dog.ceo/breeds/poodle/n0274870.jpg'),
(78, 'https://images.dog.ceo/breeds/poodle/n0211499.jpg'),
(79, 'https://images.dog.ceo/breeds/poodle/n0241546.jpg'),
(79, 'https://images.dog.ceo/breeds/poodle/n0247715.jpg'),
(79, 'https://images.dog.ceo/breeds/poodle/n0240551.jpg'),
(79, 'https://images.dog.ceo/breeds/poodle/n0210775.jpg'),
(80, 'https://images.dog.ceo/breeds/shihtzu/n0212318.jpg'),
(80, 'https://images.dog.ceo/breeds/shihtzu/n0216829.jpg'),
(80, 'https://images.dog.ceo/breeds/shihtzu/n0247304.jpg'),
(80, 'https://images.dog.ceo/breeds/shihtzu/n0288009.jpg'),
(81, 'https://images.dog.ceo/breeds/poodle/n0215806.jpg'),
(81, 'https://images.dog.ceo/breeds/poodle/n0244329.jpg'),
(81, 'https://images.dog.ceo/breeds/poodle/n0254326.jpg'),
(81, 'https://images.dog.ceo/breeds/poodle/n0251412.jpg'),
(82, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_2358.jpg'),
(82, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_23996.jpg'),
(82, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_24110.jpg'),
(82, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_24577.jpg'),
(83, 'https://images.dog.ceo/breeds/labrador/n02099712_7179.jpg'),
(83, 'https://images.dog.ceo/breeds/labrador/n02099712_719.jpg'),
(83, 'https://images.dog.ceo/breeds/labrador/n02099712_7406.jpg'),
(83, 'https://images.dog.ceo/breeds/labrador/n02099712_7411.jpg'),
(84, 'https://images.dog.ceo/breeds/shihtzu/n0275018.jpg'),
(84, 'https://images.dog.ceo/breeds/shihtzu/n0298456.jpg'),
(84, 'https://images.dog.ceo/breeds/shihtzu/n0282593.jpg'),
(84, 'https://images.dog.ceo/breeds/shihtzu/n0271750.jpg');


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
