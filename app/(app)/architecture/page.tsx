import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { schemaTables, dataSources } from "@/lib/data"
import { Database, Workflow, Brain, FileText, Table2, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Architecture — ResolveOps AI",
  description: "System architecture and the relational data model backing ResolveOps AI.",
}

const pipeline = [
  {
    icon: Workflow,
    title: "Ingest",
    detail: "Normalize events from PagerDuty, Datadog, CloudWatch, Slack, Jira, and Zendesk into a unified schema.",
  },
  {
    icon: Database,
    title: "Correlate",
    detail: "Join external events to services and incidents in Aurora PostgreSQL using time and dependency context.",
  },
  {
    icon: Brain,
    title: "Analyze",
    detail: "AI ranks root-cause hypotheses, scores recurrence risk, and cites evidence from the timeline.",
  },
  {
    icon: FileText,
    title: "Resolve",
    detail: "Generate postmortems and prevention action items, tracked to closure across owners and services.",
  },
]

export default function ArchitecturePage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">Architecture</h1>
        <p className="text-sm text-muted-foreground text-pretty">
          How ResolveOps AI ingests operational signals and models them as connected, relational data.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Processing pipeline</CardTitle>
          <CardDescription>From raw operational events to resolved incidents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {pipeline.map((step, i) => (
              <div key={step.title} className="relative flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-4">
                <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <step.icon className="size-5" aria-hidden />
                </span>
                <h3 className="text-sm font-semibold text-foreground">
                  {i + 1}. {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
                {i < pipeline.length - 1 ? (
                  <ArrowRight
                    className="absolute -right-2.5 top-1/2 hidden size-5 -translate-y-1/2 text-muted-foreground md:block"
                    aria-hidden
                  />
                ) : null}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="size-4 text-primary" aria-hidden />
              <CardTitle className="text-base text-foreground">Relational data model</CardTitle>
            </div>
            <CardDescription>
              Core tables stored in Amazon Aurora PostgreSQL. Incidents connect services, timelines, responders,
              root causes, postmortems, and action items.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Table</th>
                    <th className="px-3 py-2 font-medium">Purpose</th>
                    <th className="px-3 py-2 text-right font-medium">Columns</th>
                  </tr>
                </thead>
                <tbody>
                  {schemaTables.map((t) => (
                    <tr key={t.name} className="border-b border-border last:border-0">
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground">
                          <Table2 className="size-3.5 text-muted-foreground" aria-hidden />
                          {t.name}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{t.purpose}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-foreground">{t.columns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">Connected data sources</CardTitle>
            <CardDescription>Signals feeding the external_events table.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {dataSources.map((ds) => (
              <div key={ds.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{ds.name}</span>
                  <span className="text-xs text-muted-foreground">{ds.category}</span>
                </div>
                <Badge
                  variant="outline"
                  className={
                    ds.status === "connected"
                      ? "border-chart-2/30 bg-chart-2/10 text-chart-2"
                      : "border-border bg-muted text-muted-foreground"
                  }
                >
                  {ds.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Tech stack</CardTitle>
          <CardDescription>The foundation ResolveOps AI is built on.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            "Next.js App Router",
            "Amazon Aurora PostgreSQL",
            "Server Components",
            "AI root-cause analysis",
            "Event correlation engine",
            "Role-based incident command",
          ].map((item) => (
            <Badge key={item} variant="secondary" className="text-secondary-foreground">
              {item}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
