"use client"

import {
  AlertCircle,
  CheckCircle2,
  CircleDot,
  Megaphone,
  ShieldCheck,
  Wrench,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ActionStatusBadge,
  ConfidenceBar,
  HealthBadge,
  PriorityBadge,
} from "@/components/badges"
import { AiAnalysisPanel } from "@/components/ai-analysis-panel"
import { PostmortemPanel } from "@/components/postmortem-panel"
import {
  actionItems,
  primaryIncident,
  responders,
  serviceById,
  timeline,
  type TimelineEvent,
} from "@/lib/data"

const phaseMeta: Record<TimelineEvent["phase"], { label: string; cls: string }> = {
  detection: { label: "Detection", cls: "bg-destructive text-destructive-foreground" },
  triage: { label: "Triage", cls: "bg-[color:var(--chart-3)] text-white" },
  mitigation: { label: "Mitigation", cls: "bg-primary text-primary-foreground" },
  communication: { label: "Comms", cls: "bg-[color:var(--chart-2)] text-white" },
  resolution: { label: "Resolution", cls: "bg-[color:var(--chart-2)] text-white" },
  followup: { label: "Follow-up", cls: "bg-muted-foreground text-background" },
}

function Timeline() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="font-semibold">Incident timeline</h2>
      <p className="text-xs text-muted-foreground">Detection through follow-up · {timeline.length} events</p>
      <ol className="mt-6 space-y-0">
        {timeline.map((t, i) => {
          const meta = phaseMeta[t.phase as keyof typeof phaseMeta] ?? {
            label: String(t.phase ?? "event").replaceAll("_", " "),
            cls: "border border-border bg-muted text-muted-foreground",
          }
          const last = i === timeline.length - 1
          return (
            <li key={t.id} className="relative flex gap-4 pb-6 last:pb-0">
              {!last && <span className="absolute left-[7px] top-5 h-full w-px bg-border" aria-hidden />}
              <span className="relative mt-1.5 size-3.5 shrink-0 rounded-full border-2 border-card bg-primary ring-1 ring-border" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{t.at}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${meta.cls}`}>{meta.label}</span>
                  {t.source && (
                    <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      {t.source}
                    </span>
                  )}
                </div>
                <h3 className="mt-1.5 font-medium leading-snug">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.detail}</p>
                <p className="mt-1 text-xs text-muted-foreground">by {t.actor}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function AffectedServices() {
  const svcs = primaryIncident.serviceIds.map((id) => serviceById(id)!).filter(Boolean)
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {svcs.map((s) => (
        <div key={s.id} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium">{s.name}</h3>
              <p className="text-xs text-muted-foreground">Owner {s.owner} · {s.team}</p>
            </div>
            <HealthBadge health={s.health} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
          {s.dependencies.length > 0 && (
            <div className="mt-3 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                Depends on:{" "}
                {s.dependencies.map((d, i) => (
                  <span key={d} className="font-medium text-foreground">
                    {serviceById(d)?.name}
                    {i < s.dependencies.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function Responders() {
  const statusCls: Record<string, string> = {
    active: "text-[color:var(--chart-2)]",
    standby: "text-[color:var(--chart-3)]",
    resolved: "text-muted-foreground",
  }
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold">Responders</h2>
        <p className="text-xs text-muted-foreground">{responders.length} people engaged</p>
      </div>
      <ul className="divide-y divide-border">
        {responders.map((r) => (
          <li key={r.id} className="flex items-center gap-4 px-5 py-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {r.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-snug">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.role} · {r.team}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusCls[r.status]}`}>
              <CircleDot className="size-3.5" />
              {r.status[0].toUpperCase() + r.status.slice(1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Mitigation() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/25 bg-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Wrench className="size-4 text-primary" />
          <h2 className="font-semibold">Current mitigation</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">
          Created a database view aliasing the renamed <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">amount_cents</code>{" "}
          column so the deployed Payments API resolves charges again. Error rate dropped from 38% to 4% within six
          minutes.
        </p>
        <div className="mt-4">
          <p className="mb-1.5 text-xs text-muted-foreground">Mitigation confidence</p>
          <ConfidenceBar value={0.88} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-[color:var(--chart-3)]" />
            <h3 className="font-medium">Next action</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Redeploy the Payments API against the new column name, then remove the temporary compatibility view to avoid
            schema drift.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-[color:var(--chart-2)]" />
            <h3 className="font-medium">Status</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Mitigated and monitoring. Payment success rate stable at 99.6% for the last 20 minutes. No customer data
            loss.
          </p>
        </div>
      </div>
    </div>
  )
}

function ActionItemsTab() {
  const linked = actionItems.filter((a) => a.incidentRef === primaryIncident.ref)
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold">Action items</h2>
        <p className="text-xs text-muted-foreground">{linked.length} linked to {primaryIncident.ref}</p>
      </div>
      <ul className="divide-y divide-border">
        {linked.map((a) => (
          <li key={a.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium leading-snug">{a.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {a.owner} · due {a.dueDate} · {a.category}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <PriorityBadge priority={a.priority} />
              <ActionStatusBadge status={a.status} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function IncidentTabs() {
  return (
    <Tabs defaultValue="timeline" className="w-full">
      <div className="overflow-x-auto">
        <TabsList className="w-max">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="services">Affected Services</TabsTrigger>
          <TabsTrigger value="responders">Responders</TabsTrigger>
          <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
          <TabsTrigger value="ai">AI Analysis</TabsTrigger>
          <TabsTrigger value="postmortem">Postmortem</TabsTrigger>
          <TabsTrigger value="actions">Action Items</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="timeline" className="mt-5"><Timeline /></TabsContent>
      <TabsContent value="services" className="mt-5"><AffectedServices /></TabsContent>
      <TabsContent value="responders" className="mt-5"><Responders /></TabsContent>
      <TabsContent value="mitigation" className="mt-5"><Mitigation /></TabsContent>
      <TabsContent value="ai" className="mt-5"><AiAnalysisPanel /></TabsContent>
      <TabsContent value="postmortem" className="mt-5"><PostmortemPanel /></TabsContent>
      <TabsContent value="actions" className="mt-5"><ActionItemsTab /></TabsContent>
    </Tabs>
  )
}
