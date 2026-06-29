import Link from "next/link"
import {
  AlertOctagon,
  ArrowRight,
  BrainCircuit,
  CheckSquare,
  Clock,
  Plus,
  ServerCrash,
  Siren,
} from "lucide-react"
import { PageHeader } from "@/components/app-shell"
import { MetricCard } from "@/components/metric-card"
import { HealthBadge, SeverityBadge, StatusBadge } from "@/components/badges"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  dashboardMetrics,
  incidents,
  incidentsBySeverity,
  reliabilitySignals,
  serviceById,
  services,
  actionItems,
} from "@/lib/data"

function startedLabel(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

const maxSev = Math.max(...incidentsBySeverity.map((s) => s.count))

export default function DashboardPage() {
  const repeatServices = [...services].filter((s) => s.incidents90d >= 3).sort((a, b) => b.incidents90d - a.incidents90d)
  const overdue = actionItems.filter((a) => a.overdue)

  return (
    <>
      <PageHeader
  title="Reliability Dashboard"
  description="Northwind Cloud · Live operational view across all services and incidents"
>
  <div className="flex flex-wrap items-center gap-2">
    <Link
      href="/integrations"
      className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
    >
      <Plus className="size-4" />
      Import incident data
    </Link>

    <Link
      href="/incident"
      className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
    >
      View active SEV1
      <ArrowRight className="size-4" />
    </Link>
  </div>
</PageHeader>

      <div className="space-y-6 p-5 sm:p-8">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Demo scenario
              </p>
              <h2 className="mt-1 text-lg font-semibold">
                SEV1 payment outage caused by a database migration
              </h2>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                Follow the workflow from external alerts and customer impact signals into the incident command center,
                AI root-cause analysis, generated postmortem, and prevention action items.
              </p>
            </div>
            <Link
  href="/incident"
  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
>
  Open incident flow
  <ArrowRight className="size-4" />
</Link>
          </div>
        </div>
        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <MetricCard label="Active Incidents" value={dashboardMetrics.activeIncidents} icon={AlertOctagon} hint="1 critical" accent />
          <MetricCard
            label="Mean Time To Resolve"
            value={dashboardMetrics.mttrHours}
            unit="hrs"
            icon={Clock}
            trend={dashboardMetrics.mttrTrend}
            hint="vs last 30d"
          />
          <MetricCard label="Open Action Items" value={dashboardMetrics.openActionItems} icon={CheckSquare} hint={`${dashboardMetrics.overdueActions} overdue`} />
          <MetricCard label="Services at Risk" value={dashboardMetrics.servicesAtRisk} icon={ServerCrash} hint="of 6 services" />
          <MetricCard label="Critical Incidents" value={dashboardMetrics.criticalIncidents} icon={Siren} hint="last 7 days" accent />
        </div>

        {/* Incident table */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Recent Incidents</h2>
            <span className="text-xs text-muted-foreground">{incidents.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[260px]">Incident</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-[180px]">Affected services</TableHead>
                  <TableHead>Commander</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead className="min-w-[200px]">Customer impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((inc) => (
                  <TableRow key={inc.id} className="group">
                    <TableCell>
                      <Link href={inc.id === "inc-4821" ? "/incident" : "/incident"} className="block">
                        <span className="font-mono text-xs text-muted-foreground">{inc.ref}</span>
                        <span className="mt-0.5 block font-medium leading-snug text-foreground group-hover:text-primary">
                          {inc.title}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell><SeverityBadge severity={inc.severity} /></TableCell>
                    <TableCell><StatusBadge status={inc.status} /></TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {inc.serviceIds.slice(0, 2).map((sid) => (
                          <span key={sid} className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            {serviceById(sid)?.name}
                          </span>
                        ))}
                        {inc.serviceIds.length > 2 && (
                          <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            +{inc.serviceIds.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{inc.commander}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{startedLabel(inc.startedAt)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{inc.customerImpact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Widgets row */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Incidents by severity */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Incidents by severity</h3>
            <p className="text-xs text-muted-foreground">Last 90 days</p>
            <div className="mt-5 space-y-3">
              {incidentsBySeverity.map((s) => (
                <div key={s.severity} className="flex items-center gap-3">
                  <span className="w-12 font-mono text-xs text-muted-foreground">{s.severity}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(s.count / maxSev) * 100}%`, backgroundColor: s.color }}
                    />
                  </div>
                  <span className="w-5 text-right text-sm font-medium tabular-nums">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Services with repeat incidents */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">Services with repeat incidents</h3>
            <p className="text-xs text-muted-foreground">3+ incidents in 90 days</p>
            <div className="mt-4 space-y-3">
              {repeatServices.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <Link href="/services" className="block truncate text-sm font-medium hover:text-primary">
                      {s.name}
                    </Link>
                    <HealthBadge health={s.health} />
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">{s.incidents90d}×</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue action items */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Overdue action items</h3>
              <Link href="/action-items" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">{overdue.length} need attention</p>
            <div className="mt-4 space-y-3">
              {overdue.map((a) => (
                <div key={a.id} className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                  <p className="text-sm font-medium leading-snug">{a.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.owner} · {a.incidentRef} · due {a.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reliability signals */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <BrainCircuit className="size-4 text-primary" />
            <h2 className="font-semibold">Reliability Signals</h2>
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              AI-detected patterns
            </span>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-3">
            {reliabilitySignals.map((sig) => (
              <div key={sig.id} className="bg-card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {serviceById(sig.relatedServiceId)?.name}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                    {Math.round(sig.confidence * 100)}% conf.
                  </span>
                </div>
                <h3 className="mt-2 font-medium leading-snug">{sig.pattern}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{sig.detail}</p>
                <p className="mt-3 text-xs font-medium text-primary">Detected {sig.occurrences}× this quarter</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
