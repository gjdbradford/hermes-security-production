-- Enhanced Hermes Security Leads Database Schema
-- Migration: 001_create_enhanced_leads_schema.sql
-- Description: Creates the enhanced leads table with backup tracking and 8n8 integration

-- Create the enhanced leads table
CREATE TABLE IF NOT EXISTS hermes_leads (
    -- Primary key and identifiers
    id SERIAL PRIMARY KEY,
    lead_id VARCHAR(50) UNIQUE NOT NULL,
    brevo_contact_id VARCHAR(100),
    
    -- Personal information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    user_role VARCHAR(100),
    
    -- Business information
    problem_description TEXT NOT NULL,
    company_name VARCHAR(255),
    company_size VARCHAR(50),
    service_urgency VARCHAR(50) NOT NULL DEFAULT 'not-urgent',
    
    -- Consent and legal
    agree_to_terms BOOLEAN NOT NULL DEFAULT FALSE,
    privacy_consent BOOLEAN NOT NULL DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    
    -- Security and validation
    captcha_token VARCHAR(500),
    user_agent TEXT,
    ip_address INET,
    source VARCHAR(50) NOT NULL DEFAULT 'hermes-website',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 8n8 integration tracking
    n8n_webhook_sent_at TIMESTAMP WITH TIME ZONE,
    n8n_response_received_at TIMESTAMP WITH TIME ZONE,
    n8n_response_data JSONB,
    n8n_success BOOLEAN DEFAULT FALSE,
    n8n_error_message TEXT,
    n8n_retry_count INTEGER DEFAULT 0,
    n8n_last_retry_at TIMESTAMP WITH TIME ZONE,
    
    -- Status and workflow
    status VARCHAR(50) DEFAULT 'new',
    processed_at TIMESTAMP WITH TIME ZONE,
    assigned_to VARCHAR(100),
    notes TEXT,
    
    -- Lead scoring and analysis
    lead_score INTEGER DEFAULT 0,
    priority VARCHAR(20) DEFAULT 'low',
    tags TEXT[],
    ai_analysis JSONB,
    estimated_value DECIMAL(10,2),
    recommended_response_time VARCHAR(50)
);

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_hermes_leads_lead_id ON hermes_leads(lead_id);
CREATE INDEX IF NOT EXISTS idx_hermes_leads_email ON hermes_leads(email);
CREATE INDEX IF NOT EXISTS idx_hermes_leads_created_at ON hermes_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_hermes_leads_status ON hermes_leads(status);
CREATE INDEX IF NOT EXISTS idx_hermes_leads_n8n_success ON hermes_leads(n8n_success);
CREATE INDEX IF NOT EXISTS idx_hermes_leads_priority ON hermes_leads(priority);
CREATE INDEX IF NOT EXISTS idx_hermes_leads_urgency ON hermes_leads(service_urgency);
CREATE INDEX IF NOT EXISTS idx_hermes_leads_country ON hermes_leads(country);
CREATE INDEX IF NOT EXISTS idx_hermes_leads_score ON hermes_leads(lead_score);
CREATE INDEX IF NOT EXISTS idx_hermes_leads_company ON hermes_leads(company_name);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_name TEXT,
    database_name TEXT,
    command_tag TEXT,
    query TEXT,
    ip_address INET,
    application_name TEXT,
    session_id TEXT
);