/*
  # Technology Intelligence Platform Database Schema

  ## Overview
  Comprehensive database schema for DRDO's Automated Technology Intelligence and Forecasting Platform.
  This migration creates all necessary tables for storing technology data, patents, publications,
  companies, analyses, and forecasts.

  ## New Tables

  ### 1. technologies
  Core table storing technology records with metadata and current status
  - `id` (uuid, primary key)
  - `name` (text) - Technology name
  - `description` (text) - Detailed description
  - `domain` (text) - Technology domain/category
  - `subdomain` (text) - Specific subdomain
  - `current_trl` (integer) - Current Technology Readiness Level (1-9)
  - `keywords` (text[]) - Array of keywords for search
  - `status` (text) - Status: emerging, developing, mature, declining
  - `created_at`, `updated_at` (timestamptz)

  ### 2. patents
  Patent records from multiple countries with detailed metadata
  - `id` (uuid, primary key)
  - `technology_id` (uuid) - Links to technologies table
  - `patent_number` (text) - Official patent number
  - `title` (text) - Patent title
  - `abstract` (text) - Patent abstract
  - `filing_date`, `publication_date`, `grant_date` (date)
  - `country_code` (text) - ISO country code
  - `assignee` (text) - Company/organization holding patent
  - `inventors` (text[]) - Array of inventor names
  - `classification_codes` (text[]) - IPC/CPC classification codes
  - `citation_count` (integer) - Number of times cited
  - `legal_status` (text) - Current legal status
  - `url` (text) - Link to patent database
  - `created_at`, `updated_at` (timestamptz)

  ### 3. publications
  Research publications and academic papers
  - `id` (uuid, primary key)
  - `technology_id` (uuid) - Links to technologies table
  - `title` (text) - Publication title
  - `abstract` (text) - Abstract
  - `authors` (text[]) - Array of author names
  - `publication_date` (date)
  - `source` (text) - Journal, conference, or platform
  - `doi` (text) - Digital Object Identifier
  - `citation_count` (integer) - Number of citations
  - `keywords` (text[]) - Keywords
  - `url` (text) - Link to publication
  - `relevance_score` (numeric) - AI-calculated relevance (0-1)
  - `created_at`, `updated_at` (timestamptz)

  ### 4. companies
  Companies working on specific technologies
  - `id` (uuid, primary key)
  - `name` (text) - Company name
  - `description` (text) - Company description
  - `country` (text) - Headquarters country
  - `founded_year` (integer) - Year founded
  - `employee_count` (integer) - Number of employees
  - `company_type` (text) - startup, sme, large_enterprise, public_sector
  - `website` (text) - Company website
  - `created_at`, `updated_at` (timestamptz)

  ### 5. company_technologies
  Junction table linking companies to technologies with investment data
  - `id` (uuid, primary key)
  - `company_id` (uuid) - Links to companies table
  - `technology_id` (uuid) - Links to technologies table
  - `involvement_type` (text) - developing, researching, commercializing
  - `rd_investment_amount` (numeric) - R&D investment in USD
  - `government_funding_amount` (numeric) - Government funding in USD
  - `private_funding_amount` (numeric) - Private funding in USD
  - `investment_year` (integer) - Year of investment data
  - `created_at`, `updated_at` (timestamptz)

  ### 6. trl_history
  Historical tracking of Technology Readiness Level progression
  - `id` (uuid, primary key)
  - `technology_id` (uuid) - Links to technologies table
  - `trl_level` (integer) - TRL level (1-9)
  - `assessment_date` (date) - Date of assessment
  - `evidence` (text) - Evidence supporting TRL level
  - `assessed_by` (text) - Who performed assessment
  - `confidence_score` (numeric) - Confidence in assessment (0-1)
  - `created_at` (timestamptz)

  ### 7. market_data
  Market size and forecast data for technologies
  - `id` (uuid, primary key)
  - `technology_id` (uuid) - Links to technologies table
  - `year` (integer) - Year of data
  - `market_size_usd` (numeric) - Market size in USD
  - `growth_rate_percent` (numeric) - Year-over-year growth rate
  - `data_source` (text) - Source of market data
  - `is_forecast` (boolean) - Whether this is forecasted data
  - `confidence_level` (text) - high, medium, low
  - `created_at`, `updated_at` (timestamptz)

  ### 8. technology_convergence
  Detected convergence between different technologies
  - `id` (uuid, primary key)
  - `technology_a_id` (uuid) - First technology
  - `technology_b_id` (uuid) - Second technology
  - `convergence_type` (text) - integration, complementary, substitution
  - `strength_score` (numeric) - Strength of convergence (0-1)
  - `evidence` (text) - Evidence of convergence
  - `detection_date` (date) - When convergence was detected
  - `created_at` (timestamptz)

  ### 9. forecasts
  AI-generated forecasts and predictions
  - `id` (uuid, primary key)
  - `technology_id` (uuid) - Links to technologies table
  - `forecast_type` (text) - trl_progression, market_size, adoption_rate, hype_cycle
  - `forecast_data` (jsonb) - Structured forecast data
  - `forecast_date` (date) - Date forecast was generated
  - `time_horizon_years` (integer) - How many years ahead
  - `model_used` (text) - Which model/algorithm generated forecast
  - `confidence_score` (numeric) - Confidence in forecast (0-1)
  - `created_at` (timestamptz)

  ### 10. alerts
  User-configured alerts for technology monitoring
  - `id` (uuid, primary key)
  - `user_id` (uuid) - User who created alert (for future auth integration)
  - `technology_id` (uuid) - Technology being monitored
  - `alert_type` (text) - new_patent, trl_change, market_shift, convergence_detected
  - `conditions` (jsonb) - Alert trigger conditions
  - `is_active` (boolean) - Whether alert is active
  - `last_triggered` (timestamptz) - Last time alert was triggered
  - `created_at`, `updated_at` (timestamptz)

  ### 11. data_sources
  Tracking of external data sources and ingestion status
  - `id` (uuid, primary key)
  - `source_name` (text) - Name of data source
  - `source_type` (text) - patent_db, publication_db, market_research, news
  - `url` (text) - Source URL/API endpoint
  - `last_sync` (timestamptz) - Last successful sync
  - `sync_frequency_hours` (integer) - How often to sync
  - `is_active` (boolean) - Whether source is active
  - `records_ingested` (integer) - Total records from this source
  - `configuration` (jsonb) - Source-specific configuration
  - `created_at`, `updated_at` (timestamptz)

  ### 12. analysis_results
  Cached AI analysis results for performance
  - `id` (uuid, primary key)
  - `technology_id` (uuid) - Technology analyzed
  - `analysis_type` (text) - sentiment, trend, competitive, signal
  - `results` (jsonb) - Analysis results in structured format
  - `analyzed_at` (date) - When analysis was performed
  - `valid_until` (date) - Cache expiration date
  - `created_at` (timestamptz)

  ## Security
  Enable Row Level Security on all tables with restrictive default policies.
  For initial implementation, authenticated users can read all data.
  Future enhancements will add role-based policies for different user types.
*/

-- Technologies table
CREATE TABLE IF NOT EXISTS technologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  domain text NOT NULL,
  subdomain text,
  current_trl integer CHECK (current_trl >= 1 AND current_trl <= 9),
  keywords text[] DEFAULT '{}',
  status text DEFAULT 'emerging' CHECK (status IN ('emerging', 'developing', 'mature', 'declining')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_technologies_domain ON technologies(domain);
CREATE INDEX IF NOT EXISTS idx_technologies_status ON technologies(status);
CREATE INDEX IF NOT EXISTS idx_technologies_trl ON technologies(current_trl);
CREATE INDEX IF NOT EXISTS idx_technologies_keywords ON technologies USING gin(keywords);

-- Patents table
CREATE TABLE IF NOT EXISTS patents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  technology_id uuid REFERENCES technologies(id) ON DELETE CASCADE,
  patent_number text UNIQUE NOT NULL,
  title text NOT NULL,
  abstract text,
  filing_date date,
  publication_date date,
  grant_date date,
  country_code text NOT NULL,
  assignee text,
  inventors text[] DEFAULT '{}',
  classification_codes text[] DEFAULT '{}',
  citation_count integer DEFAULT 0,
  legal_status text DEFAULT 'pending',
  url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patents_technology ON patents(technology_id);
CREATE INDEX IF NOT EXISTS idx_patents_country ON patents(country_code);
CREATE INDEX IF NOT EXISTS idx_patents_filing_date ON patents(filing_date);
CREATE INDEX IF NOT EXISTS idx_patents_assignee ON patents(assignee);

-- Publications table
CREATE TABLE IF NOT EXISTS publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  technology_id uuid REFERENCES technologies(id) ON DELETE CASCADE,
  title text NOT NULL,
  abstract text,
  authors text[] DEFAULT '{}',
  publication_date date,
  source text,
  doi text UNIQUE,
  citation_count integer DEFAULT 0,
  keywords text[] DEFAULT '{}',
  url text,
  relevance_score numeric CHECK (relevance_score >= 0 AND relevance_score <= 1),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_publications_technology ON publications(technology_id);
CREATE INDEX IF NOT EXISTS idx_publications_date ON publications(publication_date);
CREATE INDEX IF NOT EXISTS idx_publications_keywords ON publications USING gin(keywords);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  country text,
  founded_year integer,
  employee_count integer,
  company_type text DEFAULT 'startup' CHECK (company_type IN ('startup', 'sme', 'large_enterprise', 'public_sector')),
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country);
CREATE INDEX IF NOT EXISTS idx_companies_type ON companies(company_type);

-- Company Technologies junction table
CREATE TABLE IF NOT EXISTS company_technologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  technology_id uuid REFERENCES technologies(id) ON DELETE CASCADE,
  involvement_type text DEFAULT 'developing' CHECK (involvement_type IN ('developing', 'researching', 'commercializing')),
  rd_investment_amount numeric DEFAULT 0,
  government_funding_amount numeric DEFAULT 0,
  private_funding_amount numeric DEFAULT 0,
  investment_year integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, technology_id, investment_year)
);

CREATE INDEX IF NOT EXISTS idx_company_tech_company ON company_technologies(company_id);
CREATE INDEX IF NOT EXISTS idx_company_tech_technology ON company_technologies(technology_id);
CREATE INDEX IF NOT EXISTS idx_company_tech_year ON company_technologies(investment_year);

-- TRL History table
CREATE TABLE IF NOT EXISTS trl_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  technology_id uuid REFERENCES technologies(id) ON DELETE CASCADE,
  trl_level integer NOT NULL CHECK (trl_level >= 1 AND trl_level <= 9),
  assessment_date date NOT NULL,
  evidence text,
  assessed_by text,
  confidence_score numeric CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trl_history_technology ON trl_history(technology_id);
CREATE INDEX IF NOT EXISTS idx_trl_history_date ON trl_history(assessment_date);

-- Market Data table
CREATE TABLE IF NOT EXISTS market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  technology_id uuid REFERENCES technologies(id) ON DELETE CASCADE,
  year integer NOT NULL,
  market_size_usd numeric DEFAULT 0,
  growth_rate_percent numeric,
  data_source text,
  is_forecast boolean DEFAULT false,
  confidence_level text DEFAULT 'medium' CHECK (confidence_level IN ('high', 'medium', 'low')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(technology_id, year, data_source)
);

CREATE INDEX IF NOT EXISTS idx_market_data_technology ON market_data(technology_id);
CREATE INDEX IF NOT EXISTS idx_market_data_year ON market_data(year);
CREATE INDEX IF NOT EXISTS idx_market_data_forecast ON market_data(is_forecast);

-- Technology Convergence table
CREATE TABLE IF NOT EXISTS technology_convergence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  technology_a_id uuid REFERENCES technologies(id) ON DELETE CASCADE,
  technology_b_id uuid REFERENCES technologies(id) ON DELETE CASCADE,
  convergence_type text DEFAULT 'integration' CHECK (convergence_type IN ('integration', 'complementary', 'substitution')),
  strength_score numeric CHECK (strength_score >= 0 AND strength_score <= 1),
  evidence text,
  detection_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  CHECK (technology_a_id != technology_b_id)
);

CREATE INDEX IF NOT EXISTS idx_convergence_tech_a ON technology_convergence(technology_a_id);
CREATE INDEX IF NOT EXISTS idx_convergence_tech_b ON technology_convergence(technology_b_id);
CREATE INDEX IF NOT EXISTS idx_convergence_date ON technology_convergence(detection_date);

-- Forecasts table
CREATE TABLE IF NOT EXISTS forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  technology_id uuid REFERENCES technologies(id) ON DELETE CASCADE,
  forecast_type text NOT NULL CHECK (forecast_type IN ('trl_progression', 'market_size', 'adoption_rate', 'hype_cycle')),
  forecast_data jsonb NOT NULL,
  forecast_date date DEFAULT CURRENT_DATE,
  time_horizon_years integer DEFAULT 5,
  model_used text,
  confidence_score numeric CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_forecasts_technology ON forecasts(technology_id);
CREATE INDEX IF NOT EXISTS idx_forecasts_type ON forecasts(forecast_type);
CREATE INDEX IF NOT EXISTS idx_forecasts_date ON forecasts(forecast_date);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  technology_id uuid REFERENCES technologies(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('new_patent', 'trl_change', 'market_shift', 'convergence_detected', 'publication_spike')),
  conditions jsonb,
  is_active boolean DEFAULT true,
  last_triggered timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_technology ON alerts(technology_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id);

-- Data Sources table
CREATE TABLE IF NOT EXISTS data_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name text UNIQUE NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('patent_db', 'publication_db', 'market_research', 'news', 'company_db')),
  url text,
  last_sync timestamptz,
  sync_frequency_hours integer DEFAULT 24,
  is_active boolean DEFAULT true,
  records_ingested integer DEFAULT 0,
  configuration jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_data_sources_type ON data_sources(source_type);
CREATE INDEX IF NOT EXISTS idx_data_sources_active ON data_sources(is_active);

-- Analysis Results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  technology_id uuid REFERENCES technologies(id) ON DELETE CASCADE,
  analysis_type text NOT NULL CHECK (analysis_type IN ('sentiment', 'trend', 'competitive', 'signal', 'summary')),
  results jsonb NOT NULL,
  analyzed_at date DEFAULT CURRENT_DATE,
  valid_until date,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analysis_technology ON analysis_results(technology_id);
CREATE INDEX IF NOT EXISTS idx_analysis_type ON analysis_results(analysis_type);
CREATE INDEX IF NOT EXISTS idx_analysis_valid ON analysis_results(valid_until);

-- Enable Row Level Security on all tables
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE patents ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE trl_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE technology_convergence ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (full access for initial implementation)
-- Note: In production, these should be more restrictive based on user roles

CREATE POLICY "Allow read access to technologies"
  ON technologies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to patents"
  ON patents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to publications"
  ON publications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to companies"
  ON companies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to company_technologies"
  ON company_technologies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to trl_history"
  ON trl_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to market_data"
  ON market_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to technology_convergence"
  ON technology_convergence FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to forecasts"
  ON forecasts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to data_sources"
  ON data_sources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to analysis_results"
  ON analysis_results FOR SELECT
  TO authenticated
  USING (true);

-- Allow public read access for demo/development purposes
-- Remove these in production and require authentication

CREATE POLICY "Allow anonymous read access to technologies"
  ON technologies FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access to patents"
  ON patents FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access to publications"
  ON publications FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access to companies"
  ON companies FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access to company_technologies"
  ON company_technologies FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access to trl_history"
  ON trl_history FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access to market_data"
  ON market_data FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access to technology_convergence"
  ON technology_convergence FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access to forecasts"
  ON forecasts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access to data_sources"
  ON data_sources FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access to analysis_results"
  ON analysis_results FOR SELECT
  TO anon
  USING (true);