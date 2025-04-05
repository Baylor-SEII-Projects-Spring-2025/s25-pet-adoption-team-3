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

CREATE TABLE IF NOT EXISTS characteristic (
    characteristic_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS pet_pet_characteristics (
	pet_id BIGINT NOT NULL,
	pet_characteristics_characteristic_id BIGINT NOT NULL
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

INSERT INTO pet_images(pet_id, image_url) VALUES
(1, 'https://images.dog.ceo/breeds/labrador/n02099712_7406.jpg'),
(1, 'https://images.dog.ceo/breeds/labrador/n02099712_5008.jpg'),
(1, 'https://images.dog.ceo/breeds/labrador/n02099712_3835.jpg'),
(1, 'https://images.dog.ceo/breeds/labrador/n02099712_2501.jpg'),
(2, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1442.jpg'),
(2, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_544.jpg'),
(2, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_7706.jpg'),
(2, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_5051.jpg'),
(3, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_13599.jpg'),
(3, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_10552.jpg'),
(3, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_18065.jpg'),
(3, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_13050.jpg'),
(4, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_9153.jpg'),
(4, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_6331.jpg'),
(4, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1162.jpg'),
(4, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_7803.jpg'),
(5, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4193-Edit-Edit_200806.jpg'),
(5, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_5132.jpg'),
(5, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_2796.jpg'),
(5, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_280.jpg'),
(6, 'https://images.dog.ceo/breeds/chihuahua/n02085620_8636.jpg'),
(6, 'https://images.dog.ceo/breeds/chihuahua/n02085620_10131.jpg'),
(6, 'https://images.dog.ceo/breeds/chihuahua/n02085620_7700.jpg'),
(6, 'https://images.dog.ceo/breeds/chihuahua/n02085620_368.jpg'),
(7, 'https://images.dog.ceo/breeds/bulldog-french/n02108915_2603.jpg'),
(7, 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_5171.jpg'),
(7, 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_10768.jpg'),
(7, 'https://images.dog.ceo/breeds/bulldog-english/jager-1.jpg'),
(8, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_1451.jpg'),
(8, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_17240.jpg'),
(8, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_3815.jpg'),
(8, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_9994.jpg'),
(9, 'https://images.dog.ceo/breeds/chihuahua/n02085620_3742.jpg'),
(9, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1765.jpg'),
(9, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1073.jpg'),
(9, 'https://images.dog.ceo/breeds/chihuahua/n02085620_4673.jpg'),
(10, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1271.jpg'),
(10, 'https://images.dog.ceo/breeds/chihuahua/n02085620_735.jpg'),
(10, 'https://images.dog.ceo/breeds/chihuahua/mickey.jpg'),
(10, 'https://images.dog.ceo/breeds/chihuahua/n02085620_2706.jpg'),
(11, 'https://images.dog.ceo/breeds/labrador/n02099712_3773.jpg'),
(11, 'https://images.dog.ceo/breeds/labrador/IMG_4708.jpg'),
(11, 'https://images.dog.ceo/breeds/labrador/n02099712_2224.jpg'),
(11, 'https://images.dog.ceo/breeds/labrador/pic1_l.jpg'),
(12, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_7654.jpg'),
(12, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1454.jpg'),
(12, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4459-Edit_200808.jpg'),
(12, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4365_200807.jpg'),
(13, 'https://images.dog.ceo/breeds/shihtzu/n02086240_1249.jpg'),
(13, 'https://images.dog.ceo/breeds/shihtzu/n02086240_3862.jpg'),
(13, 'https://images.dog.ceo/breeds/shihtzu/n02086240_6323.jpg'),
(13, 'https://images.dog.ceo/breeds/shihtzu/n02086240_6795.jpg'),
(14, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_7588.jpg'),
(14, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_124.jpg'),
(14, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_8429.jpg'),
(14, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_5452.jpg'),
(15, 'https://images.dog.ceo/breeds/beagle/n02088364_17294.jpg'),
(15, 'https://images.dog.ceo/breeds/beagle/n02088364_10731.jpg'),
(15, 'https://images.dog.ceo/breeds/beagle/n02088364_13050.jpg'),
(15, 'https://images.dog.ceo/breeds/beagle/n02088364_13050.jpg'),
(16, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_4651.jpg'),
(16, 'https://images.dog.ceo/breeds/retriever-golden/20200816_163418_200816.jpg'),
(16, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_238.jpg'),
(16, 'https://images.dog.ceo/breeds/retriever-golden/20200814_163629_200814.jpg'),
(17, 'https://images.dog.ceo/breeds/chihuahua/n02085620_12101.jpg'),
(17, 'https://images.dog.ceo/breeds/chihuahua/mickey.jpg'),
(17, 'https://images.dog.ceo/breeds/chihuahua/n02085620_7436.jpg'),
(17, 'https://images.dog.ceo/breeds/chihuahua/n02085620_4673.jpg'),
(18, 'https://images.dog.ceo/breeds/dachshund/tina.jpg'),
(18, 'https://images.dog.ceo/breeds/dachshund/harry-646905_640.jpg'),
(18, 'https://images.dog.ceo/breeds/dachshund/dachshund-in-jacket.jpg'),
(18, 'https://images.dog.ceo/breeds/dachshund/dachshund-3.jpg'),
(19, 'https://images.dog.ceo/breeds/shihtzu/n02086240_9098.jpg'),
(19, 'https://images.dog.ceo/breeds/shihtzu/n02086240_756.jpg'),
(19, 'https://images.dog.ceo/breeds/shihtzu/n02086240_9467.jpg'),
(19, 'https://images.dog.ceo/breeds/shihtzu/n02086240_739.jpg'),
(20, 'https://images.dog.ceo/breeds/labrador/n02099712_3980.jpg'),
(20, 'https://images.dog.ceo/breeds/labrador/n02099712_2897.jpg'),
(20, 'https://images.dog.ceo/breeds/labrador/n02099712_5679.jpg'),
(20, 'https://images.dog.ceo/breeds/labrador/lab_portrait.jpg'),
(21, 'https://images.dog.ceo/breeds/beagle/n02088364_16588.jpg'),
(21, 'https://images.dog.ceo/breeds/beagle/n02088364_15111.jpg'),
(21, 'https://images.dog.ceo/breeds/beagle/n02088364_12178.jpg'),
(21, 'https://images.dog.ceo/breeds/beagle/n02088364_1507.jpg'),
(22, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_8002.jpg'),
(22, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_4059.jpg'),
(22, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_21348.jpg'),
(22, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_3815.jpg'),
(23, 'https://images.dog.ceo/breeds/shihtzu/n02086240_6911.jpg'),
(23, 'https://images.dog.ceo/breeds/shihtzu/n02086240_7248.jpg'),
(23, 'https://images.dog.ceo/breeds/shihtzu/n02086240_7093.jpg'),
(23, 'https://images.dog.ceo/breeds/shihtzu/n02086240_7221.jpg'),
(24, 'https://images.dog.ceo/breeds/beagle/n02088364_639.jpg'),
(24, 'https://images.dog.ceo/breeds/beagle/n02088364_15787.jpg'),
(24, 'https://images.dog.ceo/breeds/beagle/n02088364_9652.jpg'),
(24, 'https://images.dog.ceo/breeds/beagle/n02088364_13128.jpg'),
(25, 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_10846.jpg'),
(25, 'https://images.dog.ceo/breeds/bulldog-english/jager-1.jpg'),
(25, 'https://images.dog.ceo/breeds/bulldog-french/n02108915_3369.jpg'),
(25, 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_9681.jpg'),
(26, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1633.jpg'),
(26, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4068_200803.jpg'),
(26, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_569.jpg'),
(26, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_4256.jpg'),
(27, 'https://images.dog.ceo/breeds/beagle/n02088364_4070.jpg'),
(27, 'https://images.dog.ceo/breeds/beagle/n02088364_15370.jpg'),
(27, 'https://images.dog.ceo/breeds/beagle/n02088364_12405.jpg'),
(27, 'https://images.dog.ceo/breeds/beagle/n02088364_12973.jpg'),
(28, 'https://images.dog.ceo/breeds/boxer/n02108089_2796.jpg'),
(28, 'https://images.dog.ceo/breeds/boxer/n02108089_1571.jpg'),
(28, 'https://images.dog.ceo/breeds/boxer/n02108089_2367.jpg'),
(28, 'https://images.dog.ceo/breeds/boxer/n02108089_625.jpg'),
(29, 'https://images.dog.ceo/breeds/poodle-toy/n02113624_836.jpg'),
(29, 'https://images.dog.ceo/breeds/poodle-miniature/242981_4709618542275_742310792_o.jpg'),
(29, 'https://images.dog.ceo/breeds/poodle-standard/n02113799_2401.jpg'),
(29, 'https://images.dog.ceo/breeds/poodle-toy/n02113624_6248.jpg'),
(30, 'https://images.dog.ceo/breeds/beagle/n02088364_13627.jpg'),
(30, 'https://images.dog.ceo/breeds/beagle/n02088364_11391.jpg'),
(30, 'https://images.dog.ceo/breeds/beagle/n02088364_2000.jpg'),
(30, 'https://images.dog.ceo/breeds/beagle/603525417_Milo.jpg'),
(31, 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_976.jpg'),
(31, 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_12168.jpg'),
(31, 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_2696.jpg'),
(31, 'https://images.dog.ceo/breeds/bulldog-french/n02108915_2312.jpg'),
(32, 'https://images.dog.ceo/breeds/labrador/n02099712_610.jpg'),
(32, 'https://images.dog.ceo/breeds/labrador/n02099712_9373.jpg'),
(32, 'https://images.dog.ceo/breeds/labrador/n02099712_7815.jpg'),
(32, 'https://images.dog.ceo/breeds/labrador/n02099712_2897.jpg'),
(33, 'https://images.dog.ceo/breeds/poodle-standard/n02113799_7299.jpg'),
(33, 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_163.jpg'),
(33, 'https://images.dog.ceo/breeds/poodle-toy/n02113624_300.jpg'),
(33, 'https://images.dog.ceo/breeds/poodle-toy/n02113624_9199.jpg'),
(34, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_17446.jpg'),
(34, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_7122.jpg'),
(34, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_6966.jpg'),
(34, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_4021.jpg'),
(35, 'https://images.dog.ceo/breeds/labrador/n02099712_1930.jpg'),
(35, 'https://images.dog.ceo/breeds/labrador/n02099712_3503.jpg'),
(35, 'https://images.dog.ceo/breeds/labrador/n02099712_8242.jpg'),
(35, 'https://images.dog.ceo/breeds/labrador/n02099712_7968.jpg'),
(36, 'https://images.dog.ceo/breeds/dachshund/tina.jpg'),
(36, 'https://images.dog.ceo/breeds/dachshund/dog-495133_640.jpg'),
(36, 'https://images.dog.ceo/breeds/dachshund/dachshund-3.jpg'),
(36, 'https://images.dog.ceo/breeds/dachshund/dog-55140_640.jpg'),
(37, 'https://images.dog.ceo/breeds/chihuahua/n02085620_13151.jpg'),
(37, 'https://images.dog.ceo/breeds/chihuahua/n02085620_2693.jpg'),
(37, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1271.jpg'),
(37, 'https://images.dog.ceo/breeds/chihuahua/n02085620_11948.jpg'),
(38, 'https://images.dog.ceo/breeds/boxer/n02108089_1367.jpg'),
(38, 'https://images.dog.ceo/breeds/boxer/n02108089_6429.jpg'),
(38, 'https://images.dog.ceo/breeds/boxer/n02108089_14659.jpg'),
(38, 'https://images.dog.ceo/breeds/boxer/n02108089_5423.jpg'),
(39, 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_353.jpg'),
(39, 'https://images.dog.ceo/breeds/bulldog-french/n02108915_3098.jpg'),
(39, 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_8120.jpg'),
(39, 'https://images.dog.ceo/breeds/bulldog-french/n02108915_1752.jpg'),
(40, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_1812.jpg'),
(40, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_6088.jpg'),
(40, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_3781.jpg'),
(40, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_15429.jpg'),
(41, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_8181.jpg'),
(41, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_7432.jpg'),
(41, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_2029.jpg'),
(41, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_2663.jpg'),
(42, 'https://images.dog.ceo/breeds/dachshund/kaninchen-dachshund-953699_640.jpg'),
(42, 'https://images.dog.ceo/breeds/dachshund/puppy-1006024_640.jpg'),
(42, 'https://images.dog.ceo/breeds/dachshund/dachshund-1018409_640.jpg'),
(42, 'https://images.dog.ceo/breeds/dachshund/daschund-shorthair.jpg'),
(43, 'https://images.dog.ceo/breeds/beagle/n02088364_9652.jpg'),
(43, 'https://images.dog.ceo/breeds/beagle/n02088364_13464.jpg'),
(43, 'https://images.dog.ceo/breeds/beagle/n02088364_7784.jpg'),
(43, 'https://images.dog.ceo/breeds/beagle/n02088364_14702.jpg'),
(44, 'https://images.dog.ceo/breeds/beagle/n02088364_4052.jpg'),
(44, 'https://images.dog.ceo/breeds/beagle/n02088364_6358.jpg'),
(44, 'https://images.dog.ceo/breeds/beagle/n02088364_18403.jpg'),
(44, 'https://images.dog.ceo/breeds/beagle/n02088364_13630.jpg'),
(45, 'https://images.dog.ceo/breeds/dachshund/foxhound-53951_640.jpg'),
(45, 'https://images.dog.ceo/breeds/dachshund/Dash_Dachshund_With_Hat.jpg'),
(45, 'https://images.dog.ceo/breeds/dachshund/foxhound-53951_640.jpg'),
(45, 'https://images.dog.ceo/breeds/dachshund/Stretched_Dachshund.jpg'),
(46, 'https://images.dog.ceo/breeds/poodle-standard/n02113799_5766.jpg'),
(46, 'https://images.dog.ceo/breeds/poodle-toy/n02113624_2270.jpg'),
(46, 'https://images.dog.ceo/breeds/poodle-standard/n02113799_983.jpg'),
(46, 'https://images.dog.ceo/breeds/poodle-standard/n02113799_5766.jpg'),
(47, 'https://images.dog.ceo/breeds/chihuahua/n02085620_11696.jpg'),
(47, 'https://images.dog.ceo/breeds/chihuahua/n02085620_3423.jpg'),
(47, 'https://images.dog.ceo/breeds/chihuahua/n02085620_4515.jpg'),
(47, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1569.jpg'),
(48, 'https://images.dog.ceo/breeds/dachshund/Dash_Dachshund_With_Hat.jpg'),
(48, 'https://images.dog.ceo/breeds/dachshund/dachshund-3.jpg'),
(48, 'https://images.dog.ceo/breeds/dachshund/dog-2643027_640.jpg'),
(48, 'https://images.dog.ceo/breeds/dachshund/dachshund_4.jpg'),
(49, 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_326.jpg'),
(49, 'https://images.dog.ceo/breeds/poodle-standard/n02113799_1439.jpg'),
(49, 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_2784.jpg'),
(49, 'https://images.dog.ceo/breeds/poodle-standard/n02113799_5372.jpg'),
(50, 'https://images.dog.ceo/breeds/shihtzu/n02086240_5696.jpg'),
(50, 'https://images.dog.ceo/breeds/shihtzu/n02086240_788.jpg'),
(50, 'https://images.dog.ceo/breeds/shihtzu/n02086240_6131.jpg'),
(50, 'https://images.dog.ceo/breeds/shihtzu/n02086240_7209.jpg'),
(51, 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_478.jpg'),
(51, 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_1897.jpg'),
(51, 'https://images.dog.ceo/breeds/poodle-miniature/flowers.jpg'),
(51, 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_1448.jpg'),
(52, 'https://images.dog.ceo/breeds/beagle/n02088364_4527.jpg'),
(52, 'https://images.dog.ceo/breeds/beagle/n02088364_9825.jpg'),
(52, 'https://images.dog.ceo/breeds/beagle/n02088364_10947.jpg'),
(52, 'https://images.dog.ceo/breeds/beagle/n02088364_7784.jpg'),
(53, 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_2947.jpg'),
(53, 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_657.jpg'),
(53, 'https://images.dog.ceo/breeds/bulldog-french/n02108915_7608.jpg'),
(53, 'https://images.dog.ceo/breeds/bulldog-french/n02108915_160.jpg'),
(54, 'https://images.dog.ceo/breeds/shihtzu/n02086240_1958.jpg'),
(54, 'https://images.dog.ceo/breeds/shihtzu/n02086240_3493.jpg'),
(54, 'https://images.dog.ceo/breeds/shihtzu/n02086240_2961.jpg'),
(54, 'https://images.dog.ceo/breeds/shihtzu/n02086240_323.jpg'),
(55, 'https://images.dog.ceo/breeds/dachshund/dog-2643027_640.jpg'),
(55, 'https://images.dog.ceo/breeds/dachshund/reese.jpg'),
(55, 'https://images.dog.ceo/breeds/dachshund/dachshund-123503_640.jpg'),
(55, 'https://images.dog.ceo/breeds/dachshund/harry-646905_640.jpg'),
(56, 'https://images.dog.ceo/breeds/shihtzu/n02086240_5889.jpg'),
(56, 'https://images.dog.ceo/breeds/shihtzu/n02086240_5140.jpg'),
(56, 'https://images.dog.ceo/breeds/shihtzu/n02086240_2710.jpg'),
(56, 'https://images.dog.ceo/breeds/shihtzu/n02086240_4776.jpg'),
(57, 'https://images.dog.ceo/breeds/boxer/n02108089_4042.jpg'),
(57, 'https://images.dog.ceo/breeds/boxer/n02108089_11875.jpg'),
(57, 'https://images.dog.ceo/breeds/boxer/n02108089_11032.jpg'),
(57, 'https://images.dog.ceo/breeds/boxer/n02108089_3162.jpg'),
(58, 'https://images.dog.ceo/breeds/bulldog-french/n02108915_2514.jpg'),
(58, 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_2354.jpg'),
(58, 'https://images.dog.ceo/breeds/bulldog-french/n02108915_2980.jpg'),
(58, 'https://images.dog.ceo/breeds/bulldog-french/n02108915_11550.jpg'),
(59, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_24768.jpg'),
(59, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_8002.jpg'),
(59, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_17240.jpg'),
(59, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_22456.jpg'),
(60, 'https://images.dog.ceo/breeds/dachshund/Stretched_Dachshund.jpg'),
(60, 'https://images.dog.ceo/breeds/dachshund/Daschund-2.jpg'),
(60, 'https://images.dog.ceo/breeds/dachshund/dachshund-2033796_640.jpg'),
(60, 'https://images.dog.ceo/breeds/dachshund/dog-495133_640.jpg'),
(61, 'https://images.dog.ceo/breeds/labrador/n02099712_3185.jpg'),
(61, 'https://images.dog.ceo/breeds/labrador/n02099712_5599.jpg'),
(61, 'https://images.dog.ceo/breeds/labrador/n02099712_311.jpg'),
(61, 'https://images.dog.ceo/breeds/labrador/n02099712_7605.jpg'),
(62, 'https://images.dog.ceo/breeds/labrador/n02099712_3340.jpg'),
(62, 'https://images.dog.ceo/breeds/labrador/n02099712_3829.jpg'),
(62, 'https://images.dog.ceo/breeds/labrador/n02099712_7963.jpg'),
(62, 'https://images.dog.ceo/breeds/labrador/n02099712_365.jpg'),
(63, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_12969.jpg'),
(63, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_2358.jpg'),
(63, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_8246.jpg'),
(63, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_16129.jpg'),
(64, 'https://images.dog.ceo/breeds/beagle/n02088364_10731.jpg'),
(64, 'https://images.dog.ceo/breeds/beagle/n02088364_2499.jpg'),
(64, 'https://images.dog.ceo/breeds/beagle/n02088364_5147.jpg'),
(64, 'https://images.dog.ceo/breeds/beagle/n02088364_5282.jpg'),
(65, 'https://images.dog.ceo/breeds/beagle/n02088364_13809.jpg'),
(65, 'https://images.dog.ceo/breeds/beagle/n02088364_2566.jpg'),
(65, 'https://images.dog.ceo/breeds/beagle/n02088364_2415.jpg'),
(65, 'https://images.dog.ceo/breeds/beagle/n02088364_15093.jpg'),
(66, 'https://images.dog.ceo/breeds/chihuahua/n02085620_1558.jpg'),
(66, 'https://images.dog.ceo/breeds/chihuahua/n02085620_6931.jpg'),
(66, 'https://images.dog.ceo/breeds/chihuahua/n02085620_9414.jpg'),
(66, 'https://images.dog.ceo/breeds/chihuahua/n02085620_326.jpg'),
(67, 'https://images.dog.ceo/breeds/beagle/n02088364_4237.jpg'),
(67, 'https://images.dog.ceo/breeds/beagle/n02088364_3758.jpg'),
(67, 'https://images.dog.ceo/breeds/beagle/n02088364_12440.jpg'),
(67, 'https://images.dog.ceo/breeds/beagle/n02088364_16065.jpg'),
(68, 'https://images.dog.ceo/breeds/beagle/n02088364_13484.jpg'),
(68, 'https://images.dog.ceo/breeds/beagle/n02088364_6611.jpg'),
(68, 'https://images.dog.ceo/breeds/beagle/n02088364_639.jpg'),
(68, 'https://images.dog.ceo/breeds/beagle/n02088364_16502.jpg'),
(69, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4650_200812.jpg'),
(69, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_6820.jpg'),
(69, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_447.jpg'),
(69, 'https://images.dog.ceo/breeds/retriever-golden/joey_20210805_130226.jpg'),
(70, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3073.jpg'),
(70, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_5764.jpg'),
(70, 'https://images.dog.ceo/breeds/retriever-golden/Z6A_4365_200807.jpg'),
(70, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_215.jpg'),
(71, 'https://images.dog.ceo/breeds/labrador/n02099712_2120.jpg'),
(71, 'https://images.dog.ceo/breeds/labrador/dog2.jpg'),
(71, 'https://images.dog.ceo/breeds/labrador/n02099712_3988.jpg'),
(71, 'https://images.dog.ceo/breeds/labrador/n02099712_6421.jpg'),
(72, 'https://images.dog.ceo/breeds/shihtzu/n02086240_3254.jpg'),
(72, 'https://images.dog.ceo/breeds/shihtzu/Rudy_Small.jpg'),
(72, 'https://images.dog.ceo/breeds/shihtzu/n02086240_9.jpg'),
(72, 'https://images.dog.ceo/breeds/shihtzu/n02086240_3175.jpg'),
(73, 'https://images.dog.ceo/breeds/beagle/n02088364_5123.jpg'),
(73, 'https://images.dog.ceo/breeds/beagle/n02088364_17553.jpg'),
(73, 'https://images.dog.ceo/breeds/beagle/n02088364_959.jpg'),
(73, 'https://images.dog.ceo/breeds/beagle/n02088364_13627.jpg'),
(74, 'https://images.dog.ceo/breeds/dachshund/Daschund-2.jpg'),
(74, 'https://images.dog.ceo/breeds/dachshund/Miniature_Daschund.jpg'),
(74, 'https://images.dog.ceo/breeds/dachshund/Dash_Dachshund_With_Hat.jpg'),
(74, 'https://images.dog.ceo/breeds/dachshund/dog-55140_640.jpg'),
(75, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_6931.jpg'),
(75, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_6966.jpg'),
(75, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_12969.jpg'),
(75, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_7960.jpg'),
(76, 'https://images.dog.ceo/breeds/poodle-toy/n02113624_333.jpg'),
(76, 'https://images.dog.ceo/breeds/poodle-toy/n02113624_2883.jpg'),
(76, 'https://images.dog.ceo/breeds/poodle-standard/n02113799_4499.jpg'),
(76, 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_9682.jpg'),
(77, 'https://images.dog.ceo/breeds/beagle/n02088364_17766.jpg'),
(77, 'https://images.dog.ceo/breeds/beagle/n02088364_7784.jpg'),
(77, 'https://images.dog.ceo/breeds/beagle/n02088364_6866.jpg'),
(77, 'https://images.dog.ceo/breeds/beagle/n02088364_16588.jpg'),
(78, 'https://images.dog.ceo/breeds/dachshund/Dash_Dachshund_With_Hat.jpg'),
(78, 'https://images.dog.ceo/breeds/dachshund/Stretched_Dachshund.jpg'),
(78, 'https://images.dog.ceo/breeds/dachshund/foxhound-53951_640.jpg'),
(78, 'https://images.dog.ceo/breeds/dachshund/dachshund_4.jpg'),
(79, 'https://images.dog.ceo/breeds/labrador/n02099712_2228.jpg'),
(79, 'https://images.dog.ceo/breeds/labrador/n02099712_1414.jpg'),
(79, 'https://images.dog.ceo/breeds/labrador/n02099712_6775.jpg'),
(79, 'https://images.dog.ceo/breeds/labrador/n02099712_129.jpg'),
(80, 'https://images.dog.ceo/breeds/labrador/n02099712_7418.jpg'),
(80, 'https://images.dog.ceo/breeds/labrador/n02099712_2228.jpg'),
(80, 'https://images.dog.ceo/breeds/labrador/n02099712_5689.jpg'),
(80, 'https://images.dog.ceo/breeds/labrador/n02099712_5844.jpg'),
(81, 'https://images.dog.ceo/breeds/dachshund/dachshund-2033796_640.jpg'),
(81, 'https://images.dog.ceo/breeds/dachshund/daschund-shorthair.jpg'),
(81, 'https://images.dog.ceo/breeds/dachshund/dachshund-2033796_640.jpg'),
(81, 'https://images.dog.ceo/breeds/dachshund/dachshund-7.jpg'),
(82, 'https://images.dog.ceo/breeds/germanshepherd/pic1_g.jpg'),
(82, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_21432.jpg'),
(82, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_24786.jpg'),
(82, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_9994.jpg'),
(83, 'https://images.dog.ceo/breeds/boxer/n02108089_2723.jpg'),
(83, 'https://images.dog.ceo/breeds/boxer/n02108089_10939.jpg'),
(83, 'https://images.dog.ceo/breeds/boxer/n02108089_122.jpg'),
(83, 'https://images.dog.ceo/breeds/boxer/n02108089_7319.jpg'),
(84, 'https://images.dog.ceo/breeds/labrador/Toblerone_3.jpg'),
(84, 'https://images.dog.ceo/breeds/labrador/n02099712_5599.jpg'),
(84, 'https://images.dog.ceo/breeds/labrador/n02099712_7608.jpg'),
(84, 'https://images.dog.ceo/breeds/labrador/n02099712_5769.jpg'),
(85, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_4059.jpg'),
(85, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_4201.jpg'),
(85, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_22764.jpg'),
(85, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_23996.jpg'),
(86, 'https://images.dog.ceo/breeds/labrador/n02099712_5021.jpg'),
(86, 'https://images.dog.ceo/breeds/labrador/n02099712_4177.jpg'),
(86, 'https://images.dog.ceo/breeds/labrador/n02099712_5008.jpg'),
(86, 'https://images.dog.ceo/breeds/labrador/n02099712_4705.jpg'),
(87, 'https://images.dog.ceo/breeds/chihuahua/n02085620_11140.jpg'),
(87, 'https://images.dog.ceo/breeds/chihuahua/n02085620_11696.jpg'),
(87, 'https://images.dog.ceo/breeds/chihuahua/n02085620_10976.jpg'),
(87, 'https://images.dog.ceo/breeds/chihuahua/n02085620_2921.jpg'),
(88, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_5544.jpg'),
(88, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_7744.jpg'),
(88, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_14.jpg'),
(88, 'https://images.dog.ceo/breeds/retriever-golden/n02099601_5764.jpg'),
(89, 'https://images.dog.ceo/breeds/bulldog-french/n02108915_57.jpg'),
(89, 'https://images.dog.ceo/breeds/bulldog-french/n02108915_5306.jpg'),
(89, 'https://images.dog.ceo/breeds/bulldog-boston/n02096585_1572.jpg'),
(89, 'https://images.dog.ceo/breeds/bulldog-french/n02108915_11327.jpg'),
(90, 'https://images.dog.ceo/breeds/dachshund/tina.jpg'),
(90, 'https://images.dog.ceo/breeds/dachshund/Miniature_Daschund.jpg'),
(90, 'https://images.dog.ceo/breeds/dachshund/dachshund-123503_640.jpg'),
(90, 'https://images.dog.ceo/breeds/dachshund/dog-2643027_640.jpg'),
(91, 'https://images.dog.ceo/breeds/chihuahua/n02085620_2507.jpg'),
(91, 'https://images.dog.ceo/breeds/chihuahua/n02085620_588.jpg'),
(91, 'https://images.dog.ceo/breeds/chihuahua/n02085620_3742.jpg'),
(91, 'https://images.dog.ceo/breeds/chihuahua/n02085620_199.jpg'),
(92, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_9481.jpg'),
(92, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_10858.jpg'),
(92, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_2358.jpg'),
(92, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_9226.jpg'),
(93, 'https://images.dog.ceo/breeds/beagle/n02088364_13809.jpg'),
(93, 'https://images.dog.ceo/breeds/beagle/n02088364_13572.jpg'),
(93, 'https://images.dog.ceo/breeds/beagle/n02088364_2000.jpg'),
(93, 'https://images.dog.ceo/breeds/beagle/Joey.jpg'),
(94, 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_3079.jpg'),
(94, 'https://images.dog.ceo/breeds/poodle-standard/n02113799_871.jpg'),
(94, 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_1136.jpg'),
(94, 'https://images.dog.ceo/breeds/poodle-standard/n02113799_1316.jpg'),
(95, 'https://images.dog.ceo/breeds/poodle-toy/n02113624_2242.jpg'),
(95, 'https://images.dog.ceo/breeds/poodle-standard/n02113799_6304.jpg'),
(95, 'https://images.dog.ceo/breeds/poodle-standard/n02113799_311.jpg'),
(95, 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_3155.jpg'),
(96, 'https://images.dog.ceo/breeds/shihtzu/n02086240_8108.jpg'),
(96, 'https://images.dog.ceo/breeds/shihtzu/n02086240_4865.jpg'),
(96, 'https://images.dog.ceo/breeds/shihtzu/n02086240_6871.jpg'),
(96, 'https://images.dog.ceo/breeds/shihtzu/n02086240_646.jpg'),
(97, 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_3303.jpg'),
(97, 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_2405.jpg'),
(97, 'https://images.dog.ceo/breeds/poodle-miniature/n02113712_4233.jpg'),
(97, 'https://images.dog.ceo/breeds/poodle-standard/n02113799_5372.jpg'),
(98, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_3260.jpg'),
(98, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_22854.jpg'),
(98, 'https://images.dog.ceo/breeds/germanshepherd/n02106662_8002.jpg'),
(98, 'https://images.dog.ceo/breeds/germanshepherd/Storm_03.jpg'),
(99, 'https://images.dog.ceo/breeds/labrador/n02099712_4543.jpg'),
(99, 'https://images.dog.ceo/breeds/labrador/Toblerone_1.jpg'),
(99, 'https://images.dog.ceo/breeds/labrador/n02099712_4705.jpg'),
(99, 'https://images.dog.ceo/breeds/labrador/n02099712_7406.jpg'),
(100, 'https://images.dog.ceo/breeds/shihtzu/n02086240_12003.jpg'),
(100, 'https://images.dog.ceo/breeds/shihtzu/n02086240_3489.jpg'),
(100, 'https://images.dog.ceo/breeds/shihtzu/n02086240_1295.jpg'),
(100, 'https://images.dog.ceo/breeds/shihtzu/n02086240_7221.jpg');


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
