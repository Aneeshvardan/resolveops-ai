import Link from "next/link"
import {
  ArrowRight,
  Bell,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  GitMerge,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Server,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Workflow,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const dataSources = [
  { name: "PagerDuty", desc: "On-call alerts & escalations", icon: Siren },
  { name: "Slack", desc: "War room updates & context", icon: MessageSquare },
  { name: "Jira", desc: "Tickets & follow-up actions", icon: ScrollText },
  { name: "CloudWatch", desc: "AWS alarms & metrics", icon: Server },
  { name: "Datadog", desc: "APM, deploys & SLO monitors", icon: LayoutDashboard },
  { name: "Customer impact", desc: "Zendesk support signals", icon: Bell },
]

const howItWorks = [
  {
    step: "01",
    title: "Ingest",
    desc: "Events from PagerDuty, Slack, Jira, CloudWatch, and Datadog stream into one incident record.",
    icon: GitMerge,
  },
  {
    step: "02",
    title: "Structure",
    desc: "Data is normalized into a relational Aurora PostgreSQL model: incidents, timelines, services, responders.",
    icon: Database,
  },
  {
    step: "03",
    title: "Analyze",
    desc: "ResolveOps AI builds the timeline, surfaces likely root causes, and detects recurring reliability patterns.",
    icon: BrainCircuit,
  },
  {
    step: "04",
    title: "Resolve & learn",
    desc: "Generate postmortems and prevention-focused action items that reduce future incident risk.",
    icon: ShieldCheck,
  },
]

const whyTeams = [
  { title: "One incident command center", desc: "Stop stitching together Slack, Jira, and dashboards mid-incident. Everything lives in one timeline.", icon: ShieldAlert },
  { title: "Faster, calmer resolution", desc: "AI-suggested root causes and mitigations help responders act with confidence under pressure.", icon: Clock },
  { title: "Postmortems that write themselves", desc: "Draft structured, executive-ready postmortems from the data you already captured.", icon: FileText },
  { title: "Learn from every incident", desc: "Reliability signals reveal recurring failure patterns before they become the next SEV1.", icon: BrainCircuit },
]

const personas = [
  { role: "SRE & On-call", desc: "Cut time-to-context with a single source of truth during active incidents." },
  { role: "DevOps & Platform", desc: "Trace incidents back to deploys, migrations, and service dependencies." },
  { role: "Engineering Managers", desc: "Track MTTR, services at risk, and overdue prevention work." },
  { role: "Incident Commanders", desc: "Run the room with live timelines, responders, and mitigation status." },
]

function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldAlert className="size-5" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            ResolveOps<span className="text-primary"> AI</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#problem" className="transition-colors hover:text-foreground">Problem</a>
          <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#sources" className="transition-colors hover:text-foreground">Data sources</a>
          <a href="#teams" className="transition-colors hover:text-foreground">For teams</a>
        </nav>
        <Button asChild size="sm">
          <Link href="/dashboard">
            Open Demo Workspace
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="flex size-1.5 rounded-full bg-primary" />
            Incident intelligence for reliability teams
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Resolve faster. Learn from every incident.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            ResolveOps AI turns scattered incident data into timelines, root-cause insights, postmortems, and
            reliability actions.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Open Demo Workspace
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/incident">View a live incident</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Live demo · Payment outage caused by a database migration
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { k: "MTTR", v: "-18%" },
            { k: "Sources unified", v: "6" },
            { k: "Active SEV1", v: "1" },
            { k: "Auto-drafted", v: "Postmortems" },
          ].map((s) => (
            <div key={s.k} className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-lg font-semibold tracking-tight">{s.v}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string
  eyebrow: string
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-primary">{eyebrow}</p>
        <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {description && <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <MarketingNav />
      <Hero />

      {/* Problem */}
      <Section
        id="problem"
        eyebrow="The problem"
        title="When production breaks, the truth is scattered everywhere."
        description="Alerts fire in PagerDuty. Context lives in Slack. Tickets pile up in Jira. Metrics sit in Datadog and CloudWatch. Customer pain shows up in support. Responders waste precious minutes reassembling what happened."
      >
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Fragmented context", d: "Critical details are spread across six tools while the clock is running.", icon: Workflow },
            { t: "Slow root cause", d: "Correlating deploys, migrations, and alerts by hand delays mitigation.", icon: Clock },
            { t: "Lessons get lost", d: "Postmortems are rushed and recurring patterns go unnoticed.", icon: ScrollText },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-card p-6">
              <c.icon className="size-5 text-primary" />
              <h3 className="mt-4 font-medium">{c.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Solution */}
      <section className="border-y border-border bg-card/40">
        <Section
          eyebrow="The solution"
          title="One incident command center, backed by a real data model."
          description="ResolveOps AI brings every signal into a single incident record stored in a relational Aurora PostgreSQL model — then generates summaries, likely root causes, recommended actions, and structured postmortems."
        >
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-6">
              <BrainCircuit className="size-5 text-primary" />
              <h3 className="mt-4 text-lg font-medium">From raw events to reliability insight</h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Unified timeline from detection to resolution",
                  "AI root-cause hypotheses with confidence levels",
                  "Recommended mitigations and prevention actions",
                  "Auto-drafted, executive-ready postmortems",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <Database className="size-5 text-primary" />
              <h3 className="mt-4 text-lg font-medium">Structured, queryable, auditable</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Incidents, services, timeline events, responders, root causes, postmortems, and action items are stored
                as related tables — so reliability analytics and AI run on clean, structured data.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["incidents", "services", "timeline_events", "root_causes", "action_items", "ai_recommendations"].map(
                  (t) => (
                    <code
                      key={t}
                      className="rounded border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {t}
                    </code>
                  ),
                )}
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* How it works */}
      <Section id="how" eyebrow="How it works" title="From scattered signals to resolved incidents.">
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((s) => (
            <div key={s.step} className="relative rounded-xl border border-border bg-card p-6">
              <span className="font-mono text-xs text-muted-foreground">{s.step}</span>
              <s.icon className="mt-3 size-5 text-primary" />
              <h3 className="mt-3 font-medium">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Data sources */}
      <section id="sources" className="border-y border-border bg-card/40">
        <Section
          eyebrow="Data sources"
          title="Connect the tools your incidents already flow through."
          description="ResolveOps AI ingests events from your alerting, collaboration, ticketing, and monitoring stack — and maps them to the right incident automatically."
        >
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dataSources.map((s) => (
              <div key={s.name} className="flex items-start gap-3 rounded-xl border border-border bg-background p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-medium">{s.name}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* Why teams use it */}
      <Section eyebrow="Why teams use it" title="Built to make reliability work measurable.">
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {whyTeams.map((c) => (
            <div key={c.title} className="flex gap-4 rounded-xl border border-border bg-card p-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <c.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-medium">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Built for reliability teams */}
      <section id="teams" className="border-y border-border bg-card/40">
        <Section eyebrow="Built for reliability teams" title="Made for the people who keep production up.">
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {personas.map((p) => (
              <div key={p.role} className="rounded-xl border border-border bg-background p-6">
                <h3 className="font-medium">{p.role}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-border bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            See a live SEV1 incident, end to end.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-primary-foreground/85">
            Explore the demo workspace following a payment outage caused by a database migration — from detection to
            postmortem.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href="/dashboard">
                Open Demo Workspace
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShieldAlert className="size-4" />
            </span>
            <span className="text-sm font-medium">ResolveOps AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Incident intelligence & reliability operations · Demo workspace
          </p>
        </div>
      </footer>
    </div>
  )
}
