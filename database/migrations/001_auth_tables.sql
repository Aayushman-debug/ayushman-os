-- AYushMan Authentication & Authorization Schema Migration
-- Migration: 001_auth_tables.sql
-- Adds email verification, password reset, and google OAuth fields

USE ayushman_os;

-- 1. Ensure users table has email verification, google_id, and correct role
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE AFTER email,
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) NULL AFTER avatar_url,
MODIFY COLUMN role ENUM('admin', 'visitor') DEFAULT 'visitor';

-- 2. Email Verifications Table
CREATE TABLE IF NOT EXISTS email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token_hash),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Password Resets Table
CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reset_token (token_hash),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Audit & enforce sole administrator policy in MySQL
-- Any account not matching 'pathakaayushman57@gmail.com' must be a visitor
UPDATE users SET role = 'visitor' WHERE email != 'pathakaayushman57@gmail.com';
UPDATE users SET role = 'admin', email_verified = TRUE WHERE email = 'pathakaayushman57@gmail.com';
