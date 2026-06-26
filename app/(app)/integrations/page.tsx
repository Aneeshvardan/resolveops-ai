import { CheckCircle2, Copy, Plug, Radio, Webhook } from "lucide-react"
import { PageHeader } from "@/components/app-shell"
import { IntakeEvents } from "@/components/intake-events"
import { dataSources } from "@/lib/data"

export default function IntegrationsPage() {
  const connected = dataSources.filter((d) => d.status === "connected")
  const simulated = dataSources.filter((d) => d.status === "simulated")

  return (
    <>
      <PageHeader
        title="Data Intake & Integrations"
        description="Connect alerting, collaboration, ticketing, and monitoring sources into one incident pipeline"
      />

      <div className="space-y-6 p-5 sm:p-8">
        {/* Summary strip */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Connected sources</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{connected.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Simulated sources</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{simulated.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Events today</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {dataSources.reduce((s, d) => s + d.eventsToday, 0).toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Pipeline status</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--chart-2)]">
              <Radio className="size-4" />
              Ingesting
            </p>
          </div>
        </div>

        {/* Data sources grid */}
        <div>
          <h2 className="mb-3 font-semibold">Data sources</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dataSources.map((d) => (
              <div key={d.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Plug className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-medium">{d.name}</h3>
                      <p className="text-xs text-muted-foreground">{d.category}</p>
                    </div>
                  </div>
                  {d.status === "connected" ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--chart-2)]/30 bg-[color:var(--chart-2)]/12 px-2 py-0.5 text-xs font-medium text-[color:var(--chart-2)]">
                      <CheckCircle2 className="size-3" />
                      Connected
                    </span>
                  ) : (
                    <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      Simulated
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{d.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>
                    <span className="font-medium text-foreground tabular-nums">{d.eventsToday.toLocaleString()}</span> events today
                  </span>
                  <span>Last event {d.lastEvent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Webhook / API intake */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Webhook className="size-4 text-primary" />
            <h2 className="font-semibold">Webhook & API intake</h2>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Any external system can POST events into ResolveOps AI. Events are normalized and mapped to the right
            incident automatically.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/60 p-3">
            <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground">
              POST https://api.resolveops.ai/v1/ingest/events
            </code>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground">
              <Copy className="size-3" />
              Copy
            </span>
          </div>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
{`{
  "source": "pagerduty",
  "event_type": "alert.triggered",
  "service": "payments-api",
  "severity": "SEV1",
  "occurred_at": "2026-06-26T13:42:11Z",
  "payload": { "error_rate": 0.38 }
}`}
          </pre>
          <p className="mt-3 text-xs text-muted-foreground">
            Authenticated with a per-organization API key stored in Vercel environment variables. Events persist to the
            <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono">external_events</code>
            table in Aurora PostgreSQL.
          </p>
        </div>

        {/* Incoming events table (interactive) */}
        <IntakeEvents />
      </div>
    </>
  )
}
