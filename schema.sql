-- ResolveOps AI - Aurora PostgreSQL Schema
-- Primary backend database for H0 Hackathon submission

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan TEXT DEFAULT 'demo',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES users(id),
  health_status TEXT NOT NULL CHECK (
    health_status IN ('operational', 'degraded', 'partial_outage', 'major_outage')
  ),
  risk_level TEXT NOT NULL CHECK (
    risk_level IN ('low', 'medium', 'high', 'critical')
  ),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  incident_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('SEV1', 'SEV2', 'SEV3', 'SEV4')),
  status TEXT NOT NULL CHECK (
    status IN ('investigating', 'identified', 'mitigated', 'monitoring', 'resolved')
  ),
  incident_commander_id UUID REFERENCES users(id),
  customer_impact TEXT,
  started_at TIMESTAMP NOT NULL,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE incident_services (
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  impact_summary TEXT,
  PRIMARY KEY (incident_id, service_id)
);

CREATE TABLE incident_timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  occurred_at TIMESTAMP NOT NULL,
  phase TEXT NOT NULL,
  source TEXT,
  title TEXT NOT NULL,
  description TEXT,
  actor_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE incident_responders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  responder_role TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE postmortems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  summary TEXT,
  what_happened TEXT,
  root_cause TEXT,
  contributing_factors TEXT,
  customer_impact TEXT,
  what_went_well TEXT,
  what_needs_improvement TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE root_causes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  cause TEXT NOT NULL,
  confidence NUMERIC(5,2),
  evidence TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  owner_id UUID REFERENCES users(id),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'blocked', 'done')),
  prevention_category TEXT,
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE external_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL,
  source TEXT NOT NULL,
  event_type TEXT NOT NULL,
  service_name TEXT,
  severity TEXT,
  occurred_at TIMESTAMP,
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  summary TEXT,
  confidence NUMERIC(5,2),
  evidence JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES users(id),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_incidents_org_status ON incidents (organization_id, status);
CREATE INDEX idx_incidents_severity ON incidents (severity);
CREATE INDEX idx_timeline_incident_time ON incident_timeline_events (incident_id, occurred_at);
CREATE INDEX idx_action_items_status_due ON action_items (status, due_date);
CREATE INDEX idx_external_events_source_time ON external_events (source, occurred_at);
CREATE INDEX idx_ai_recommendations_incident ON ai_recommendations (incident_id);