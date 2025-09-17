-- Insert initial system configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('stress_threshold_critical', '0.8', 'Threshold for critical stress level (0-1)'),
('stress_threshold_high', '0.6', 'Threshold for high stress level (0-1)'),
('stress_threshold_moderate', '0.4', 'Threshold for moderate stress level (0-1)'),
('alert_cooldown_hours', '24', 'Hours between critical alerts for same user'),
('weekly_report_day', 'sunday', 'Day of week to generate weekly reports'),
('weekly_report_time', '21:00', 'Time to generate weekly reports'),
('max_session_duration_minutes', '120', 'Maximum chat session duration'),
('emergency_keywords', '["suicide", "kill myself", "end it all", "hurt myself"]', 'Keywords that trigger emergency protocols');

-- Insert default support groups
INSERT INTO support_groups (name, description, category) VALUES
('Exam Stress Support', 'A safe space to discuss exam anxiety and study pressure', 'academic'),
('Loneliness Lounge', 'Connect with others who understand feelings of isolation', 'social'),
('Anxiety Anonymous', 'Share experiences and coping strategies for anxiety', 'mental_health'),
('Depression Support Circle', 'Peer support for those dealing with depression', 'mental_health'),
('Sleep & Wellness', 'Discuss sleep issues and wellness tips', 'wellness'),
('Relationship Troubles', 'Navigate relationship challenges with peer support', 'relationships');

-- Insert sample mental health resources
INSERT INTO resources (title, description, resource_type, content_url, category, tags) VALUES
('5-Minute Breathing Exercise', 'Quick breathing technique for immediate stress relief', 'video', '/resources/breathing-exercise.mp4', 'stress_relief', '["breathing", "quick", "stress"]'),
('Understanding Anxiety', 'Comprehensive guide to recognizing and managing anxiety', 'article', '/resources/anxiety-guide.html', 'education', '["anxiety", "education", "coping"]'),
('Sleep Hygiene Tips', 'Evidence-based strategies for better sleep', 'guide', '/resources/sleep-guide.pdf', 'wellness', '["sleep", "wellness", "tips"]'),
('Mindfulness Meditation', '10-minute guided meditation for beginners', 'audio', '/resources/mindfulness.mp3', 'meditation', '["mindfulness", "meditation", "relaxation"]'),
('Exam Stress Toolkit', 'Complete guide to managing academic pressure', 'guide', '/resources/exam-stress.pdf', 'academic', '["exams", "stress", "study", "academic"]'),
('Crisis Helpline Numbers', 'Emergency contacts and crisis support resources', 'article', '/resources/crisis-help.html', 'emergency', '["crisis", "emergency", "helpline"]');

-- Insert sample admin user (password should be hashed in real implementation)
INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES
('admin@mentalhealth.edu', '$2b$12$example_hash_here', 'admin', 'System', 'Administrator', '+1234567890');

-- Insert sample counselor
INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES
('counselor@mentalhealth.edu', '$2b$12$example_hash_here', 'counselor', 'Dr. Sarah', 'Johnson', '+1234567891');
