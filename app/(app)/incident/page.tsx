import Link from "next/link"
import { ArrowRight, ClipboardCheck, Clock, FileText, Server, ShieldAlert, Sparkles, User, Users } from "lucide-react"
import { IncidentTabs } from "@/components/incident-tabs"
import { SeverityBadge, StatusBadge } from "@/components/badges"
import { primaryIncident, responders, serviceById } from "@/lib/data"

function startedLabel(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  })
}

function Stat({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Clock
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium leading-snug">{children}</p>
      </div>
    </div>
  )
}

export default function IncidentPage() {
  const inc = primaryIncident
  const activeResponders = responders.filter((r) => r.status === "active").length

  return (
    <>
      {/* Incident header */}
      <div className="border-b border-border bg-card/40 px-5 py-6 sm:px-8">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            <ShieldAlert className="size-4" />
          </span>
          <span className="font-mono text-xs text-muted-foreground">{inc.ref}</span>
          <SeverityBadge severity={inc.severity} />
          <StatusBadge status={inc.status} />
        </div>
        <h1 className="mt-3 text-balance text-xl font-semibold tracking-tight sm:text-2xl">{inc.title}</h1>
        <p className="mt-1.5 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">{inc.summary}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Server} label="Affected services">
            {inc.serviceIds.map((id) => serviceById(id)?.name).join(", ")}
          </Stat>
          <Stat icon={User} label="Incident commander">{inc.commander}</Stat>
          <Stat icon={Clock} label="Started">{startedLabel(inc.startedAt)}</Stat>
          <Stat icon={Users} label="Responders">{activeResponders} active · {responders.length} engaged</Stat>
        </div>

        <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
          <p className="text-sm">
            <span className="font-medium text-destructive">Customer impact:</span>{" "}
            <span className="text-foreground/90">{inc.customerImpact}</span>
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Recommended incident workflow
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Move from live response to AI analysis, postmortem generation, and recurrence-prevention actions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/ai-analysis"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Sparkles className="size-4" />
              View AI Analysis
            </Link>

            <Link
              href="/postmortem"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              <FileText className="size-4" />
              Generate Postmortem
            </Link>

            <Link
              href="/actions"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              <ClipboardCheck className="size-4" />
              Review Action Items
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <IncidentTabs />
      </div>
    </>
  )
}
