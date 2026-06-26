import { cn } from "@/lib/utils"
import type {
  ActionStatus,
  HealthStatus,
  IncidentStatus,
  Priority,
  RiskLevel,
  Severity,
} from "@/lib/data"

function Pill({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        className,
      )}
    >
      {children}
    </span>
  )
}

function Dot({ className }: { className?: string }) {
  return <span className={cn("size-1.5 rounded-full", className)} aria-hidden />
}

const sevStyles: Record<Severity, string> = {
  SEV1: "border-destructive/25 bg-destructive/10 text-destructive",
  SEV2: "border-[color:var(--chart-3)]/30 bg-[color:var(--chart-3)]/12 text-[color:var(--chart-3)]",
  SEV3: "border-[color:var(--chart-2)]/30 bg-[color:var(--chart-2)]/12 text-[color:var(--chart-2)]",
  SEV4: "border-border bg-muted text-muted-foreground",
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <Pill className={sevStyles[severity]}>{severity}</Pill>
}

const statusStyles: Record<IncidentStatus, { label: string; cls: string; dot: string }> = {
  investigating: { label: "Investigating", cls: "border-destructive/25 bg-destructive/10 text-destructive", dot: "bg-destructive" },
  identified: { label: "Identified", cls: "border-[color:var(--chart-3)]/30 bg-[color:var(--chart-3)]/12 text-[color:var(--chart-3)]", dot: "bg-[color:var(--chart-3)]" },
  mitigated: { label: "Mitigated", cls: "border-[color:var(--chart-2)]/30 bg-[color:var(--chart-2)]/12 text-[color:var(--chart-2)]", dot: "bg-[color:var(--chart-2)]" },
  monitoring: { label: "Monitoring", cls: "border-[color:var(--chart-2)]/30 bg-[color:var(--chart-2)]/12 text-[color:var(--chart-2)]", dot: "bg-[color:var(--chart-2)]" },
  resolved: { label: "Resolved", cls: "border-border bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
}

export function StatusBadge({ status }: { status: IncidentStatus }) {
  const s = statusStyles[status]
  return (
    <Pill className={s.cls}>
      <Dot className={s.dot} />
      {s.label}
    </Pill>
  )
}

const healthStyles: Record<HealthStatus, { label: string; cls: string; dot: string }> = {
  operational: { label: "Operational", cls: "border-[color:var(--chart-2)]/30 bg-[color:var(--chart-2)]/12 text-[color:var(--chart-2)]", dot: "bg-[color:var(--chart-2)]" },
  degraded: { label: "Degraded", cls: "border-[color:var(--chart-3)]/30 bg-[color:var(--chart-3)]/12 text-[color:var(--chart-3)]", dot: "bg-[color:var(--chart-3)]" },
  partial_outage: { label: "Partial outage", cls: "border-[color:var(--chart-3)]/30 bg-[color:var(--chart-3)]/12 text-[color:var(--chart-3)]", dot: "bg-[color:var(--chart-3)]" },
  major_outage: { label: "Major outage", cls: "border-destructive/25 bg-destructive/10 text-destructive", dot: "bg-destructive" },
}

export function HealthBadge({ health }: { health: HealthStatus | string }) {
  const h = healthStyles[health as HealthStatus] ?? {
    label: String(health ?? "Unknown").replaceAll("_", " "),
    cls: "border-border bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  }

  return (
    <Pill className={h.cls}>
      <Dot className={h.dot} />
      {h.label}
    </Pill>
  )
}

const riskStyles: Record<RiskLevel, string> = {
  low: "border-[color:var(--chart-2)]/30 bg-[color:var(--chart-2)]/12 text-[color:var(--chart-2)]",
  medium: "border-[color:var(--chart-3)]/30 bg-[color:var(--chart-3)]/12 text-[color:var(--chart-3)]",
  high: "border-[color:var(--chart-3)]/40 bg-[color:var(--chart-3)]/16 text-[color:var(--chart-3)]",
  critical: "border-destructive/25 bg-destructive/10 text-destructive",
}

export function RiskBadge({ risk }: { risk: RiskLevel | string }) {
  const style = riskStyles[risk as RiskLevel] ?? "border-border bg-muted text-muted-foreground"
  const label = String(risk ?? "unknown").replaceAll("_", " ")

  return <Pill className={style}>{label[0]?.toUpperCase() + label.slice(1)} risk</Pill>
}

const priorityStyles: Record<Priority, string> = {
  low: "border-border bg-muted text-muted-foreground",
  medium: "border-[color:var(--chart-2)]/30 bg-[color:var(--chart-2)]/12 text-[color:var(--chart-2)]",
  high: "border-[color:var(--chart-3)]/30 bg-[color:var(--chart-3)]/12 text-[color:var(--chart-3)]",
  urgent: "border-destructive/25 bg-destructive/10 text-destructive",
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Pill className={priorityStyles[priority]}>{priority[0].toUpperCase() + priority.slice(1)}</Pill>
}

const actionStatusStyles: Record<ActionStatus, { label: string; cls: string }> = {
  open: { label: "Open", cls: "border-border bg-muted text-muted-foreground" },
  in_progress: { label: "In progress", cls: "border-primary/25 bg-primary/10 text-primary" },
  blocked: { label: "Blocked", cls: "border-destructive/25 bg-destructive/10 text-destructive" },
  done: { label: "Done", cls: "border-[color:var(--chart-2)]/30 bg-[color:var(--chart-2)]/12 text-[color:var(--chart-2)]" },
}

export function ActionStatusBadge({ status }: { status: ActionStatus }) {
  const s = actionStatusStyles[status]
  return <Pill className={s.cls}>{s.label}</Pill>
}

export function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium tabular-nums text-muted-foreground">{pct}%</span>
    </div>
  )
}