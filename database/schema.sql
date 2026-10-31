-- AYUSHMAN OS Relational Database Schema
-- Primary RDBMS: MySQL 8.0+
-- Database: ayushman_os

CREATE DATABASE IF NOT EXISTS ayushman_os CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ayushman_os;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    father_name VARCHAR(100),
    college_name VARCHAR(200) DEFAULT 'Arya College of Engineering & Information Technology, Jaipur',
    branch VARCHAR(100) DEFAULT 'Computer Science and Engineering',
    university VARCHAR(100) DEFAULT 'Rajasthan Technical University, Kota',
    roll_no VARCHAR(50) DEFAULT '24EARCS003',
    email_verified BOOLEAN DEFAULT FALSE,
    enrollment_no VARCHAR(50) DEFAULT '24E1ARCSM40P003',
    avatar_url TEXT,
    google_id VARCHAR(255) NULL,
    bio TEXT,
    role ENUM('admin', 'visitor') DEFAULT 'visitor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 1b. Email Verifications Table
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

-- 1c. Password Resets Table
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

-- 2. Academic Records (Schooling: 10th & 12th)
CREATE TABLE IF NOT EXISTS academic_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    education_level VARCHAR(50) NOT NULL, -- 'Class 10', 'Class 12'
    institution_name VARCHAR(200) NOT NULL,
    board VARCHAR(100) NOT NULL,
    passing_year INT NOT NULL,
    percentage DECIMAL(5,2),
    marksheet_file_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. B.Tech Semesters
CREATE TABLE IF NOT EXISTS semesters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    semester_number INT NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    status ENUM('completed', 'active', 'upcoming') DEFAULT 'completed',
    sgpa DECIMAL(4,2),
    total_credits INT DEFAULT 0,
    remarks VARCHAR(100) DEFAULT 'PASS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_sem (user_id, semester_number),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    semester_id INT NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    course_title VARCHAR(150) NOT NULL,
    course_type ENUM('theory', 'lab', 'sports', 'training', 'elective') DEFAULT 'theory',
    credits INT DEFAULT 2,
    max_internal INT DEFAULT 20,
    max_endterm INT DEFAULT 80,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Grades and Marks
CREATE TABLE IF NOT EXISTS marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL UNIQUE,
    midterm_marks INT,
    endterm_marks INT,
    grade VARCHAR(10) NOT NULL,
    passed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Syllabus Units and Topics
CREATE TABLE IF NOT EXISTS syllabus_topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    unit_number INT NOT NULL,
    unit_title VARCHAR(150) NOT NULL,
    content_details TEXT,
    teaching_hours INT DEFAULT 5,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Daily Check-ins
CREATE TABLE IF NOT EXISTS daily_checkins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    checkin_date DATE NOT NULL,
    study_hours DECIMAL(4,2) DEFAULT 0,
    topics_completed TEXT,
    questions_solved INT DEFAULT 0,
    tasks_completed INT DEFAULT 0,
    mood VARCHAR(50) DEFAULT 'Focused',
    energy_level INT DEFAULT 8,
    sleep_hours DECIMAL(4,2) DEFAULT 7,
    journal_entry TEXT,
    tomorrow_priorities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_date (user_id, checkin_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Habits & Streaks
CREATE TABLE IF NOT EXISTS habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'Engineering',
    streak INT DEFAULT 0,
    target_frequency VARCHAR(50) DEFAULT 'Daily',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Tasks & Kanban Board
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('backlog', 'todo', 'in_progress', 'completed', 'cancelled') DEFAULT 'todo',
    due_date DATE,
    tag VARCHAR(50) DEFAULT 'General',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Goals & Objectives
CREATE TABLE IF NOT EXISTS goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    time_horizon ENUM('daily', 'weekly', 'monthly', 'semester', 'yearly') DEFAULT 'monthly',
    progress_pct INT DEFAULT 0,
    target_date DATE,
    status ENUM('active', 'achieved', 'paused') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Anime Archive
CREATE TABLE IF NOT EXISTS anime_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    anilist_id INT,
    poster_url TEXT,
    format VARCHAR(50) DEFAULT 'TV',
    total_episodes INT DEFAULT 12,
    episodes_watched INT DEFAULT 0,
    status ENUM('watching', 'completed', 'plan_to_watch', 'paused', 'dropped') DEFAULT 'watching',
    score DECIMAL(3,1) DEFAULT 9.0,
    favorite_character VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. Cinema Universe (Movies & TV Series)
CREATE TABLE IF NOT EXISTS movie_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    tmdb_id INT,
    media_type ENUM('movie', 'tv') DEFAULT 'movie',
    poster_url TEXT,
    backdrop_url TEXT,
    release_year INT DEFAULT 2024,
    status ENUM('watched', 'watching', 'plan_to_watch') DEFAULT 'watched',
    rating DECIMAL(3,1) DEFAULT 8.5,
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. Music Collections (Spotify & YouTube Music)
CREATE TABLE IF NOT EXISTS music_collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    provider ENUM('spotify', 'youtube', 'custom') DEFAULT 'spotify',
    external_url TEXT,
    embed_id VARCHAR(100),
    cover_url TEXT,
    mood VARCHAR(50) DEFAULT 'Deep Focus',
    track_count INT DEFAULT 25,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. Gaming Archive
CREATE TABLE IF NOT EXISTS gaming_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_name VARCHAR(100) NOT NULL,
    in_game_id VARCHAR(100) NOT NULL,
    uid VARCHAR(100),
    server_region VARCHAR(50) DEFAULT 'Asia / India',
    current_rank VARCHAR(50),
    peak_rank VARCHAR(50),
    clan_team VARCHAR(100),
    role VARCHAR(50),
    stats_summary JSON,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 15. Developer HQ: Skills & Projects
CREATE TABLE IF NOT EXISTS developer_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    category ENUM('language', 'core_cs', 'web', 'tools', 'database') DEFAULT 'language',
    proficiency INT DEFAULT 85,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS developer_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    tag VARCHAR(100) DEFAULT 'Full-Stack Web App',
    description TEXT,
    technologies JSON,
    github_url TEXT,
    live_url TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 16. Personal Memories & Digital Vault
CREATE TABLE IF NOT EXISTS personal_vault (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    category ENUM('milestone', 'memory', 'certificate', 'document', 'note') DEFAULT 'milestone',
    content TEXT,
    date_occurred DATE,
    file_url TEXT,
    tags JSON,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
