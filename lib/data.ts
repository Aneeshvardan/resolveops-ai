// ResolveOps AI — demo data model
// Scenario: a SaaS company ("Northwind Cloud") experiencing a payment outage
// caused by a database migration issue. This mirrors the event-driven model
// stored in Amazon DynamoDB.

export type Severity = "SEV1" | "SEV2" | "SEV3" | "SEV4"
export type IncidentStatus = "investigating" | "identified" | "mitigated" | "monitoring" | "resolved"
export type HealthStatus = "operational" | "degraded" | "partial_outage" | "major_outage"
export type RiskLevel = "low" | "medium" | "high" | "critical"
export type Priority = "low" | "medium" | "high" | "urgent"
export type ActionStatus = "open" | "in_progress" | "blocked" | "done"

export const org = {
  name: "Northwind Cloud",
  plan: "Enterprise",
  region: "us-east-1",
}

export type Service = {
  id: string
  name: string
  owner: string
  team: string
  health: HealthStatus
  risk: RiskLevel
  incidents90d: number
  lastIncident: string
  openActions: number
  dependencies: string[]
  description: string
}

export const services: Service[] = [
  {
    id: "svc-payments",
    name: "Payments API",
    owner: "Maya Chen",
    team: "Payments",
    health: "major_outage",
    risk: "critical",
    incidents90d: 5,
    lastIncident: "Active now",
    openActions: 4,
    dependencies: ["svc-database", "svc-auth"],
    description: "Processes charges, refunds, and payment method updates via Stripe.",
  },
  {
    id: "svc-auth",
    name: "Auth Service",
    owner: "Diego Alvarez",
    team: "Platform",
    health: "degraded",
    risk: "medium",
    incidents90d: 2,
    lastIncident: "11 days ago",
    openActions: 1,
    dependencies: ["svc-database"],
    description: "Handles authentication, sessions, and token issuance for all products.",
  },
  {
    id: "svc-notify",
    name: "Notification Service",
    owner: "Priya Nair",
    team: "Growth",
    health: "degraded",
    risk: "medium",
    incidents90d: 3,
    lastIncident: "Active now",
    openActions: 2,
    dependencies: ["svc-payments"],
    description: "Sends transactional email, SMS, and in-app notifications.",
  },
  {
    id: "svc-portal",
    name: "Customer Portal",
    owner: "Sam Whitfield",
    team: "Frontend",
    health: "partial_outage",
    risk: "high",
    incidents90d: 4,
    lastIncident: "Active now",
    openActions: 2,
    dependencies: ["svc-payments", "svc-auth", "svc-notify"],
    description: "Customer-facing dashboard for billing, usage, and account settings.",
  },
  {
    id: "svc-reporting",
    name: "Reporting Service",
    owner: "Lena Kowalski",
    team: "Data",
    health: "operational",
    risk: "low",
    incidents90d: 1,
    lastIncident: "34 days ago",
    openActions: 0,
    dependencies: ["svc-database"],
    description: "Generates usage analytics, invoices, and revenue reports.",
  },
  {
    id: "svc-database",
    name: "Database Cluster",
    owner: "Tom Becker",
    team: "Platform",
    health: "degraded",
    risk: "high",
    incidents90d: 3,
    lastIncident: "Active now",
    openActions: 3,
    dependencies: [],
    description: "Primary DynamoDB cluster backing all core services.",
  },
]

export const serviceById = (id: string) => services.find((s) => s.id === id)

export type Incident = {
  id: string
  ref: string
  title: string
  severity: Severity
  status: IncidentStatus
  serviceIds: string[]
  commander: string
  startedAt: string
  detectedVia: string
  customerImpact: string
  summary: string
}

export const incidents: Incident[] = [
  {
    id: "inc-4821",
    ref: "INC-4821",
    title: "Payment processing failures after schema migration",
    severity: "SEV1",
    status: "mitigated",
    serviceIds: ["svc-payments", "svc-database", "svc-portal", "svc-notify"],
    commander: "Maya Chen",
    startedAt: "2026-06-26T13:42:00Z",
    detectedVia: "PagerDuty",
    customerImpact: "~38% of checkout attempts failing; 12,400 customers affected",
    summary:
      "A database migration on the payments schema introduced a non-backward-compatible column rename, causing the Payments API to throw on charge creation.",
  },
  {
    id: "inc-4815",
    ref: "INC-4815",
    title: "Elevated auth latency in us-east-1",
    severity: "SEV3",
    status: "resolved",
    serviceIds: ["svc-auth", "svc-database"],
    commander: "Diego Alvarez",
    startedAt: "2026-06-15T09:10:00Z",
    detectedVia: "Datadog",
    customerImpact: "Slow logins for a subset of users; no failed sessions",
    summary: "Connection pool saturation on the auth read replica caused p95 login latency to spike to 2.4s.",
  },
  {
    id: "inc-4790",
    ref: "INC-4790",
    title: "Notification delivery delays",
    severity: "SEV2",
    status: "resolved",
    serviceIds: ["svc-notify"],
    commander: "Priya Nair",
    startedAt: "2026-06-02T17:30:00Z",
    detectedVia: "Slack",
    customerImpact: "Email receipts delayed up to 25 minutes",
    summary: "A backed-up queue worker delayed transactional notifications during a traffic surge.",
  },
  {
    id: "inc-4772",
    ref: "INC-4772",
    title: "Customer portal 5xx errors",
    severity: "SEV2",
    status: "resolved",
    serviceIds: ["svc-portal", "svc-payments"],
    commander: "Sam Whitfield",
    startedAt: "2026-05-21T11:05:00Z",
    detectedVia: "CloudWatch",
    customerImpact: "Billing page intermittently unavailable",
    summary: "A bad deploy shipped a null reference on the billing summary widget.",
  },
  {
    id: "inc-4756",
    ref: "INC-4756",
    title: "Failed payments migration rollback",
    severity: "SEV2",
    status: "resolved",
    serviceIds: ["svc-payments", "svc-database"],
    commander: "Maya Chen",
    startedAt: "2026-05-08T14:20:00Z",
    detectedVia: "PagerDuty",
    customerImpact: "Brief refund processing delays",
    summary: "An earlier payments migration required manual rollback after a constraint violation.",
  },
]

export const incidentById = (id: string) => incidents.find((i) => i.id === id)
export const primaryIncident = incidents[0]

export type TimelineEvent = {
  id: string
  at: string
  phase: "detection" | "triage" | "mitigation" | "communication" | "resolution" | "followup"
  title: string
  detail: string
  actor: string
  source?: string
}

export const timeline: TimelineEvent[] = [
  {
    id: "t1",
    at: "13:42",
    phase: "detection",
    title: "PagerDuty alert: payment error rate > 25%",
    detail: "High-urgency alert triggered from the payments error-rate monitor. Auto-paged the on-call SRE.",
    actor: "PagerDuty",
    source: "PagerDuty",
  },
  {
    id: "t2",
    at: "13:46",
    phase: "triage",
    title: "Incident declared SEV1, commander assigned",
    detail: "Maya Chen took incident command and opened the #inc-4821 war room in Slack.",
    actor: "Maya Chen",
    source: "Slack",
  },
  {
    id: "t3",
    at: "13:53",
    phase: "triage",
    title: "Correlated with payments schema migration",
    detail: "Datadog deploy marker shows migration `2026_06_26_rename_charge_cols` ran at 13:39, 3 min before errors began.",
    actor: "Tom Becker",
    source: "Datadog",
  },
  {
    id: "t4",
    at: "14:01",
    phase: "communication",
    title: "Status page updated — investigating",
    detail: "Customer-facing status posted: 'Some customers may experience payment failures. We are investigating.'",
    actor: "Sam Whitfield",
    source: "Zendesk",
  },
  {
    id: "t5",
    at: "14:08",
    phase: "mitigation",
    title: "Root cause identified: non-backward-compatible column rename",
    detail: "The migration renamed `amount_cents` to `charge_amount_cents` without a compatibility shim; the API still reads the old column.",
    actor: "Maya Chen",
  },
  {
    id: "t6",
    at: "14:17",
    phase: "mitigation",
    title: "Mitigation applied: backfill compatibility view",
    detail: "Created a database view aliasing the renamed column so the deployed API resolves charges again.",
    actor: "Tom Becker",
  },
  {
    id: "t7",
    at: "14:24",
    phase: "resolution",
    title: "Error rate dropping — monitoring",
    detail: "Payment error rate fell from 38% to 4% within 6 minutes of the mitigation.",
    actor: "Maya Chen",
    source: "Datadog",
  },
  {
    id: "t8",
    at: "14:40",
    phase: "communication",
    title: "Status page updated — mitigated",
    detail: "Posted: 'A fix has been applied and payment processing is recovering.'",
    actor: "Sam Whitfield",
    source: "Zendesk",
  },
  {
    id: "t9",
    at: "15:05",
    phase: "followup",
    title: "Follow-up actions logged",
    detail: "Action items created for migration safety gates and expand/contract rollout policy.",
    actor: "Maya Chen",
    source: "Jira",
  },
]

export type Responder = {
  id: string
  name: string
  role: string
  team: string
  status: "active" | "standby" | "resolved"
  initials: string
}

export const responders: Responder[] = [
  { id: "r1", name: "Maya Chen", role: "Incident Commander", team: "Payments", status: "active", initials: "MC" },
  { id: "r2", name: "Tom Becker", role: "Database Lead", team: "Platform", status: "active", initials: "TB" },
  { id: "r3", name: "Sam Whitfield", role: "Comms / Status Page", team: "Frontend", status: "active", initials: "SW" },
  { id: "r4", name: "Diego Alvarez", role: "Auth On-call", team: "Platform", status: "standby", initials: "DA" },
  { id: "r5", name: "Priya Nair", role: "Notifications On-call", team: "Growth", status: "standby", initials: "PN" },
]

export type ActionItem = {
  id: string
  title: string
  incidentRef: string
  serviceId: string
  owner: string
  priority: Priority
  dueDate: string
  status: ActionStatus
  category: string
  overdue: boolean
}

export const actionItems: ActionItem[] = [
  {
    id: "a1",
    title: "Add expand/contract migration policy for all schema changes",
    incidentRef: "INC-4821",
    serviceId: "svc-database",
    owner: "Tom Becker",
    priority: "urgent",
    dueDate: "2026-07-01",
    status: "in_progress",
    category: "Migration safety",
    overdue: false,
  },
  {
    id: "a2",
    title: "Add CI gate blocking non-backward-compatible column changes",
    incidentRef: "INC-4821",
    serviceId: "svc-payments",
    owner: "Maya Chen",
    priority: "urgent",
    dueDate: "2026-07-03",
    status: "open",
    category: "Migration safety",
    overdue: false,
  },
  {
    id: "a3",
    title: "Add synthetic checkout canary alert pre-migration",
    incidentRef: "INC-4821",
    serviceId: "svc-payments",
    owner: "Lena Kowalski",
    priority: "high",
    dueDate: "2026-06-24",
    status: "open",
    category: "Observability",
    overdue: true,
  },
  {
    id: "a4",
    title: "Remove temporary compatibility view after API redeploy",
    incidentRef: "INC-4821",
    serviceId: "svc-database",
    owner: "Tom Becker",
    priority: "medium",
    dueDate: "2026-07-08",
    status: "open",
    category: "Cleanup",
    overdue: false,
  },
  {
    id: "a5",
    title: "Increase auth read-replica connection pool size",
    incidentRef: "INC-4815",
    serviceId: "svc-auth",
    owner: "Diego Alvarez",
    priority: "medium",
    dueDate: "2026-06-20",
    status: "blocked",
    category: "Capacity",
    overdue: true,
  },
  {
    id: "a6",
    title: "Autoscale notification queue workers on backlog depth",
    incidentRef: "INC-4790",
    serviceId: "svc-notify",
    owner: "Priya Nair",
    priority: "high",
    dueDate: "2026-06-28",
    status: "in_progress",
    category: "Capacity",
    overdue: false,
  },
  {
    id: "a7",
    title: "Add null-safety tests to billing summary widget",
    incidentRef: "INC-4772",
    serviceId: "svc-portal",
    owner: "Sam Whitfield",
    priority: "low",
    dueDate: "2026-06-30",
    status: "done",
    category: "Quality",
    overdue: false,
  },
  {
    id: "a8",
    title: "Document manual migration rollback runbook",
    incidentRef: "INC-4756",
    serviceId: "svc-payments",
    owner: "Maya Chen",
    priority: "medium",
    dueDate: "2026-06-19",
    status: "done",
    category: "Process",
    overdue: false,
  },
]

export type ExternalEvent = {
  id: string
  source: string
  eventType: string
  serviceId: string
  severity: Severity | "info"
  timestamp: string
  mappedIncident: string | null
}

export const externalEvents: ExternalEvent[] = [
  { id: "e1", source: "PagerDuty", eventType: "alert.triggered", serviceId: "svc-payments", severity: "SEV1", timestamp: "13:42:11", mappedIncident: "INC-4821" },
  { id: "e2", source: "Datadog", eventType: "monitor.error_rate", serviceId: "svc-payments", severity: "SEV1", timestamp: "13:42:40", mappedIncident: "INC-4821" },
  { id: "e3", source: "Datadog", eventType: "deploy.marker", serviceId: "svc-database", severity: "info", timestamp: "13:39:02", mappedIncident: "INC-4821" },
  { id: "e4", source: "Slack", eventType: "message.warroom", serviceId: "svc-payments", severity: "info", timestamp: "13:46:55", mappedIncident: "INC-4821" },
  { id: "e5", source: "Jira", eventType: "ticket.created", serviceId: "svc-payments", severity: "SEV2", timestamp: "15:05:30", mappedIncident: "INC-4821" },
  { id: "e6", source: "Zendesk", eventType: "ticket.spike", serviceId: "svc-portal", severity: "SEV2", timestamp: "14:03:18", mappedIncident: "INC-4821" },
  { id: "e7", source: "CloudWatch", eventType: "alarm.5xx", serviceId: "svc-portal", severity: "SEV2", timestamp: "13:58:44", mappedIncident: "INC-4821" },
  { id: "e8", source: "Datadog", eventType: "monitor.latency", serviceId: "svc-notify", severity: "SEV3", timestamp: "14:05:09", mappedIncident: "INC-4821" },
  { id: "e9", source: "PagerDuty", eventType: "alert.resolved", serviceId: "svc-payments", severity: "info", timestamp: "14:41:22", mappedIncident: "INC-4821" },
  { id: "e10", source: "CloudWatch", eventType: "alarm.cpu", serviceId: "svc-database", severity: "SEV4", timestamp: "12:11:03", mappedIncident: null },
]

export type DataSource = {
  id: string
  name: string
  category: string
  status: "connected" | "simulated"
  eventsToday: number
  lastEvent: string
  description: string
}

export const dataSources: DataSource[] = [
  { id: "ds-pd", name: "PagerDuty", category: "Alerting", status: "connected", eventsToday: 142, lastEvent: "2m ago", description: "On-call alerts and escalation events." },
  { id: "ds-slack", name: "Slack", category: "Collaboration", status: "connected", eventsToday: 318, lastEvent: "just now", description: "War room updates and incident discussion." },
  { id: "ds-jira", name: "Jira", category: "Ticketing", status: "connected", eventsToday: 27, lastEvent: "14m ago", description: "Follow-up tickets and action item tracking." },
  { id: "ds-cw", name: "AWS CloudWatch", category: "Monitoring", status: "connected", eventsToday: 904, lastEvent: "30s ago", description: "Infrastructure alarms and metric thresholds." },
  { id: "ds-dd", name: "Datadog", category: "Monitoring", status: "simulated", eventsToday: 1230, lastEvent: "1m ago", description: "APM traces, deploy markers, and SLO monitors." },
  { id: "ds-zd", name: "Zendesk", category: "Support", status: "simulated", eventsToday: 56, lastEvent: "6m ago", description: "Customer impact signals from support volume." },
]

export type ReliabilitySignal = {
  id: string
  pattern: string
  detail: string
  confidence: number
  occurrences: number
  relatedServiceId: string
}

export const reliabilitySignals: ReliabilitySignal[] = [
  {
    id: "sig1",
    pattern: "Recurring payment failures after migrations",
    detail: "3 of the last 5 payments incidents trace back to schema migrations lacking backward compatibility.",
    confidence: 0.92,
    occurrences: 3,
    relatedServiceId: "svc-payments",
  },
  {
    id: "sig2",
    pattern: "Repeated database migration issues",
    detail: "Migrations on the primary cluster have caused 60% of SEV1/SEV2 incidents this quarter.",
    confidence: 0.86,
    occurrences: 4,
    relatedServiceId: "svc-database",
  },
  {
    id: "sig3",
    pattern: "Connection pool saturation under load",
    detail: "Auth and reporting show correlated latency spikes during peak traffic windows.",
    confidence: 0.71,
    occurrences: 2,
    relatedServiceId: "svc-auth",
  },
]

// Executive dashboard metrics
export const dashboardMetrics = {
  activeIncidents: 1,
  mttrHours: 1.3,
  mttrTrend: -18,
  openActionItems: 6,
  overdueActions: 2,
  servicesAtRisk: 3,
  criticalIncidents: 1,
}

export const incidentsBySeverity = [
  { severity: "SEV1", count: 1, color: "var(--destructive)" },
  { severity: "SEV2", count: 3, color: "var(--chart-3)" },
  { severity: "SEV3", count: 1, color: "var(--chart-2)" },
  { severity: "SEV4", count: 1, color: "var(--chart-5)" },
]

// AI analysis output for the primary incident
export const aiAnalysis = {
  summary:
    "At 13:39 UTC a payments schema migration renamed the `amount_cents` column without a backward-compatible shim. The deployed Payments API continued reading the old column name, causing charge creation to throw and ~38% of checkout attempts to fail. A compatibility view restored service at 14:17, reducing error rate from 38% to 4% within six minutes.",
  rootCause: {
    statement: "Non-backward-compatible column rename in payments migration `2026_06_26_rename_charge_cols`.",
    confidence: 0.94,
  },
  contributingFactors: [
    "Migration deployed independently of the application code that depended on the renamed column.",
    "No CI gate to detect destructive or non-backward-compatible schema changes.",
    "No synthetic checkout canary running before and after migrations.",
    "Expand/contract migration pattern not enforced for the payments schema.",
  ],
  recommendedActions: [
    "Adopt expand/contract migrations: add new columns, dual-write, then remove old columns in a later release.",
    "Add a CI gate that blocks column renames/drops without an explicit compatibility plan.",
    "Run a synthetic checkout canary as a pre-migration and post-migration gate.",
    "Keep the temporary compatibility view until the API is redeployed against the new column.",
  ],
  recurrenceRisk: {
    level: "high" as RiskLevel,
    detail: "3 of the last 5 payments incidents share the same migration-safety root cause class.",
  },
  evidence: [
    { type: "Timeline event", ref: "Datadog deploy marker at 13:39" },
    { type: "External event", ref: "PagerDuty alert.triggered 13:42:11" },
    { type: "Affected service", ref: "Payments API → Database Cluster dependency" },
    { type: "Action item", ref: "INC-4756 manual migration rollback (recurring pattern)" },
    { type: "Metric", ref: "Payment error rate 38% → 4% after mitigation" },
  ],
}

export const postmortem = {
  title: "Payment processing failures after schema migration",
  ref: "INC-4821",
  author: "Maya Chen",
  reviewers: ["Tom Becker", "Sam Whitfield"],
  status: "Draft",
  whatHappened:
    "A scheduled migration renamed the `amount_cents` column to `charge_amount_cents` on the payments schema. The migration was applied independently of the application deploy, so the running Payments API continued to query the old column and failed on every charge creation. Customers experienced failed checkouts until a compatibility view was introduced.",
  customerImpact:
    "Approximately 38% of checkout attempts failed over a 35-minute window, affecting an estimated 12,400 customers. Refunds and payment-method updates were also impacted. No customer payment data was lost or exposed.",
  wentWell: [
    "PagerDuty detection fired within 3 minutes of the error spike.",
    "Incident command was established quickly and roles were clear.",
    "The compatibility-view mitigation restored service in under 40 minutes.",
  ],
  needsImprovement: [
    "Migrations are not gated by backward-compatibility checks.",
    "No synthetic checkout canary surrounding migrations.",
    "Schema changes and dependent code deploy on separate, uncoordinated tracks.",
  ],
}

// Architecture: incident events stored in DynamoDB
export const schemaTables = [
  { name: "organizations", purpose: "Tenant accounts and plan metadata", columns: 7 },
  { name: "users", purpose: "Responders, owners, and commanders", columns: 9 },
  { name: "services", purpose: "Tracked services and health state", columns: 11 },
  { name: "incidents", purpose: "Core incident records", columns: 14 },
  { name: "incident_services", purpose: "Many-to-many incident ↔ service join", columns: 4 },
  { name: "incident_timeline_events", purpose: "Detection → resolution event log", columns: 8 },
  { name: "incident_responders", purpose: "Responder roles per incident", columns: 6 },
  { name: "postmortems", purpose: "Structured postmortem documents", columns: 12 },
  { name: "root_causes", purpose: "Root cause + confidence per incident", columns: 7 },
  { name: "action_items", purpose: "Follow-up actions and prevention", columns: 11 },
  { name: "external_events", purpose: "Ingested events from data sources", columns: 9 },
  { name: "ai_recommendations", purpose: "AI summaries and recommendations", columns: 8 },
  { name: "audit_logs", purpose: "Immutable change history", columns: 7 },
]
