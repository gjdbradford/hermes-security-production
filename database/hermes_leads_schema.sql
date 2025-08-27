-- Hermes Security Leads Database Schema
-- This table stores all contact form submissions processed by 8n8

CREATE TABLE hermes_leads (
    id SERIAL PRIMARY KEY,
    lead_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(50) NOT NULL,
    problem_description TEXT NOT NULL,
    company_name VARCHAR(255),
    company_size VARCHAR(50),
    service_urgency VARCHAR(50) NOT NULL DEFAULT 'not-urgent',
    gdpr_consent BOOLEAN NOT NULL DEFAULT FALSE,
    agree_to_terms BOOLEAN NOT NULL DEFAULT FALSE,
    lead_score INTEGER DEFAULT 0,
    priority VARCHAR(20) DEFAULT 'low',
    tags TEXT[],
    ai_analysis JSONB,
    estimated_value DECIMAL(10,2),
    recommended_response_time VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    source VARCHAR(50) NOT NULL DEFAULT 'hermes-website',
    status VARCHAR(50) DEFAULT 'new',
    processed_at TIMESTAMP WITH TIME ZONE,
    assigned_to VARCHAR(100),
    notes TEXT,
    
    -- Indexes for performance
    CONSTRAINT idx_hermes_leads_lead_id UNIQUE (lead_id),
    CONSTRAINT idx_hermes_leads_email (email),
    CONSTRAINT idx_hermes_leads_created_at (timestamp),
    CONSTRAINT idx_hermes_leads_status (status),
    CONSTRAINT idx_hermes_leads_priority (priority),
    CONSTRAINT idx_hermes_leads_score (lead_score)
);

-- Create indexes for better query performance
CREATE INDEX idx_hermes_leads_email ON hermes_leads(email);
CREATE INDEX idx_hermes_leads_created_at ON hermes_leads(timestamp);
CREATE INDEX idx_hermes_leads_status ON hermes_leads(status);
CREATE INDEX idx_hermes_leads_priority ON hermes_leads(priority);
CREATE INDEX idx_hermes_leads_score ON hermes_leads(lead_score);
CREATE INDEX idx_hermes_leads_urgency ON hermes_leads(service_urgency);
CREATE INDEX idx_hermes_leads_country ON hermes_leads(country);

-- Create a view for high-priority leads
CREATE VIEW high_priority_leads AS
SELECT 
    lead_id,
    first_name,
    last_name,
    email,
    country,
    company_name,
    service_urgency,
    lead_score,
    priority,
    problem_description,
    timestamp,
    status
FROM hermes_leads 
WHERE priority IN ('critical', 'high')
AND status = 'new'
ORDER BY lead_score DESC, timestamp ASC;

-- Create a function to update lead status
CREATE OR REPLACE FUNCTION update_lead_status(
    p_lead_id VARCHAR(50),
    p_status VARCHAR(50),
    p_assigned_to VARCHAR(100) DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE hermes_leads 
    SET 
        status = p_status,
        assigned_to = COALESCE(p_assigned_to, assigned_to),
        notes = COALESCE(p_notes, notes),
        processed_at = CASE WHEN p_status != 'new' THEN CURRENT_TIMESTAMP ELSE processed_at END
    WHERE lead_id = p_lead_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get lead statistics
CREATE OR REPLACE FUNCTION get_lead_statistics()
RETURNS TABLE (
    total_leads BIGINT,
    new_leads BIGINT,
    high_priority_leads BIGINT,
    avg_lead_score DECIMAL(5,2),
    total_estimated_value DECIMAL(12,2),
    conversion_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_leads,
        COUNT(*) FILTER (WHERE status = 'new') as new_leads,
        COUNT(*) FILTER (WHERE priority IN ('critical', 'high')) as high_priority_leads,
        AVG(lead_score) as avg_lead_score,
        SUM(estimated_value) as total_estimated_value,
        (COUNT(*) FILTER (WHERE status = 'converted')::DECIMAL / COUNT(*)::DECIMAL * 100) as conversion_rate
    FROM hermes_leads;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing
INSERT INTO hermes_leads (
    lead_id, first_name, last_name, email, country, mobile_number, 
    problem_description, company_name, company_size, service_urgency,
    gdpr_consent, agree_to_terms, lead_score, priority, tags, source
) VALUES 
(
    'HERMES-TEST-001',
    'John',
    'Doe',
    'john.doe@example.com',
    'United Kingdom',
    '+44 7700 900000',
    'We need a comprehensive security audit for our e-commerce platform. We handle sensitive customer data and want to ensure GDPR compliance.',
    'TechCorp Ltd',
    '51-200',
    'urgent',
    TRUE,
    TRUE,
    45,
    'high',
    ARRAY['urgent', 'medium-business', 'gdpr-compliance', 'security-audit'],
    'hermes-website'
),
(
    'HERMES-TEST-002',
    'Jane',
    'Smith',
    'jane.smith@startup.com',
    'Germany',
    '+49 30 12345678',
    'Our startup is growing rapidly and we need to implement proper security measures before our Series A funding round.',
    'StartupXYZ',
    '11-50',
    'super-urgent',
    TRUE,
    TRUE,
    75,
    'critical',
    ARRAY['super-urgent', 'startup', 'security-audit'],
    'hermes-website'
);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON hermes_leads TO hermes_app_user;
GRANT SELECT ON high_priority_leads TO hermes_app_user;
GRANT EXECUTE ON FUNCTION update_lead_status(VARCHAR, VARCHAR, VARCHAR, TEXT) TO hermes_app_user;
GRANT EXECUTE ON FUNCTION get_lead_statistics() TO hermes_app_user;
