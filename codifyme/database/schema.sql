CREATE DATABASE IF NOT EXISTS codifyme;
USE codifyme;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    crack_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(512),
    description TEXT,
    difficulty_level ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roadmaps Table
CREATE TABLE IF NOT EXISTS roadmaps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    target_date DATE,
    status ENUM('Active', 'Completed', 'Abandoned') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Daily Tasks Table
CREATE TABLE IF NOT EXISTS daily_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    roadmap_id BIGINT NOT NULL,
    day_number INT NOT NULL,
    content TEXT NOT NULL, -- JSON or structured text for the task
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
);

-- Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type ENUM('Chat', 'Video') NOT NULL,
    transcript TEXT,
    ai_feedback_json JSON,
    score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
