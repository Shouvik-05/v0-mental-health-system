-- Performance indexes for the mental health system

-- User-related indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Chat session indexes
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_start ON chat_sessions(session_start);
CREATE INDEX idx_chat_sessions_stress ON chat_sessions(stress_level);
CREATE INDEX idx_chat_sessions_active ON chat_sessions(is_active);

-- Chat message indexes
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX idx_chat_messages_flagged ON chat_messages(is_flagged);

-- Booking indexes
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_counselor ON bookings(counselor_id);
CREATE INDEX idx_bookings_date ON bookings(appointment_date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Weekly report indexes
CREATE INDEX idx_weekly_reports_user ON weekly_reports(user_id);
CREATE INDEX idx_weekly_reports_week ON weekly_reports(week_start, week_end);
CREATE INDEX idx_weekly_reports_risk ON weekly_reports(risk_assessment);

-- Alert indexes
CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_created ON alerts(created_at);

-- Resource indexes
CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_active ON resources(is_active);
CREATE INDEX idx_resources_language ON resources(language);

-- Support group indexes
CREATE INDEX idx_group_memberships_user ON group_memberships(user_id);
CREATE INDEX idx_group_memberships_group ON group_memberships(group_id);
CREATE INDEX idx_peer_posts_group ON peer_posts(group_id);
CREATE INDEX idx_peer_posts_created ON peer_posts(created_at);
