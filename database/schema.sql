-- College Resource Usage Dashboard Database Schema
-- PostgreSQL Database Setup

-- Create database (run this separately)
-- CREATE DATABASE college_resource_db;

-- Connect to the database and run the following:

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
    student_id VARCHAR(50) UNIQUE, -- for students
    employee_id VARCHAR(50) UNIQUE, -- for faculty and admin
    department VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resource categories table
CREATE TABLE resource_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resources table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID NOT NULL REFERENCES resource_categories(id) ON DELETE CASCADE,
    location VARCHAR(200),
    capacity INTEGER NOT NULL DEFAULT 1,
    is_bookable BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    operating_hours JSONB, -- Store opening/closing hours for each day
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    purpose TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usage logs table (for tracking actual usage vs bookings)
CREATE TABLE usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    entry_time TIMESTAMP WITH TIME ZONE NOT NULL,
    exit_time TIMESTAMP WITH TIME ZONE,
    actual_count INTEGER DEFAULT 1, -- for resources that track occupancy
    recorded_by UUID REFERENCES users(id), -- admin who recorded this
    recording_method VARCHAR(50) DEFAULT 'manual' CHECK (recording_method IN ('manual', 'csv_upload', 'automated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usage statistics table (for pre-calculated analytics)
CREATE TABLE usage_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hour_of_day INTEGER CHECK (hour_of_day >= 0 AND hour_of_day <= 23),
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
    total_users INTEGER DEFAULT 0,
    total_hours DECIMAL(5,2) DEFAULT 0,
    peak_occupancy INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resource_id, date, hour_of_day)
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_users_employee_id ON users(employee_id);

CREATE INDEX idx_resources_category ON resources(category_id);
CREATE INDEX idx_resources_active ON resources(is_active);
CREATE INDEX idx_resources_bookable ON resources(is_bookable);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_resource ON bookings(resource_id);
CREATE INDEX idx_bookings_time ON bookings(start_time, end_time);
CREATE INDEX idx_bookings_status ON bookings(status);

CREATE INDEX idx_usage_logs_resource ON usage_logs(resource_id);
CREATE INDEX idx_usage_logs_time ON usage_logs(entry_time);
CREATE INDEX idx_usage_logs_user ON usage_logs(user_id);

CREATE INDEX idx_usage_stats_resource_date ON usage_statistics(resource_id, date);
CREATE INDEX idx_usage_stats_date ON usage_statistics(date);

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO resource_categories (name, description) VALUES
('Library', 'Study spaces and reading rooms'),
('Laboratory', 'Computer and science laboratories'),
('Sports Hall', 'Sports and recreational facilities'),
('Classroom', 'Teaching and seminar rooms'),
('Auditorium', 'Large presentation spaces'),
('Meeting Room', 'Small group meeting spaces');

-- Insert sample resources
INSERT INTO resources (name, description, category_id, location, capacity, operating_hours) VALUES
('Main Library Reading Room', 'Quiet study space with individual desks', 
 (SELECT id FROM resource_categories WHERE name = 'Library'), 
 'Building A, Floor 2', 150, 
 '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}, "wednesday": {"open": "06:00", "close": "22:00"}, "thursday": {"open": "06:00", "close": "22:00"}, "friday": {"open": "06:00", "close": "20:00"}, "saturday": {"open": "08:00", "close": "18:00"}, "sunday": {"open": "10:00", "close": "18:00"}}'),

('Computer Lab 1', 'Programming and software development lab', 
 (SELECT id FROM resource_categories WHERE name = 'Laboratory'), 
 'Building B, Floor 1', 30, 
 '{"monday": {"open": "08:00", "close": "20:00"}, "tuesday": {"open": "08:00", "close": "20:00"}, "wednesday": {"open": "08:00", "close": "20:00"}, "thursday": {"open": "08:00", "close": "20:00"}, "friday": {"open": "08:00", "close": "18:00"}}'),

('Basketball Court', 'Indoor basketball and sports activities', 
 (SELECT id FROM resource_categories WHERE name = 'Sports Hall'), 
 'Sports Complex, Ground Floor', 20, 
 '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}, "wednesday": {"open": "06:00", "close": "22:00"}, "thursday": {"open": "06:00", "close": "22:00"}, "friday": {"open": "06:00", "close": "22:00"}, "saturday": {"open": "08:00", "close": "20:00"}, "sunday": {"open": "08:00", "close": "20:00"}}');

-- Create admin user (password should be hashed in real implementation)
-- Default password: admin123 (should be changed immediately)
INSERT INTO users (email, password_hash, first_name, last_name, role, employee_id, department) VALUES
('admin@college.edu', '$2a$10$rBnKwCQ8.Zb5tXpZjWZnm.WVQJ1F8.ZcQzFzJ3K4.cWjQC4Zj8ZJ2', 'System', 'Administrator', 'admin', 'EMP001', 'IT Services');

-- Indexes for performance optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_resource_time ON bookings(resource_id, start_time, end_time);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_logs_resource_entry ON usage_logs(resource_id, entry_time);

-- View for resource availability
CREATE VIEW resource_availability AS
SELECT 
    r.id,
    r.name,
    r.capacity,
    rc.name as category,
    r.location,
    r.is_active,
    r.is_bookable,
    COALESCE(current_usage.count, 0) as current_occupancy,
    (r.capacity - COALESCE(current_usage.count, 0)) as available_spots
FROM resources r
JOIN resource_categories rc ON r.category_id = rc.id
LEFT JOIN (
    SELECT 
        resource_id, 
        COUNT(*) as count
    FROM bookings 
    WHERE status = 'confirmed' 
    AND start_time <= CURRENT_TIMESTAMP 
    AND end_time >= CURRENT_TIMESTAMP
    GROUP BY resource_id
) current_usage ON r.id = current_usage.resource_id
WHERE r.is_active = true;