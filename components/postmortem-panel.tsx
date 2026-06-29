"use client"

import { useState } from "react"
import {
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  ThumbsUp,
  TriangleAlert,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ActionStatusBadge, PriorityBadge } from "@/components/badges"
import {
  actionItems,
  aiAnalysis,
  postmortem,
  primaryIncident,
  timeline,
} from "@/lib/data"

function SectionBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-border py-5 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="mt-3 text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  )
}

export function PostmortemPanel() {
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const linkedActions = actionItems.filter((a) => a.incidentRef === postmortem.ref)

  function handleGenerate() {
    if (loading) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setGenerated(true)
    }, 1400)
  }

  return (
    <div className="space-y-4">
      {/* Generate bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">{postmortem.title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {postmortem.ref} · Author {postmortem.author} · Reviewers {postmortem.reviewers.join(", ")} ·{" "}
            <span className="font-medium text-foreground">{generated ? "AI Draft Ready" : postmortem.status}</span>
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {loading ? "Generating…" : generated ? "Regenerate Draft" : "Generate Postmortem Draft"}
        </Button>
      </div>

      {/* AI executive summary */}
      {generated && (
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h3 className="font-semibold">AI-generated executive summary</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">{aiAnalysis.summary}</p>
        </div>
      )}

      {/* Structured postmortem */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 pb-2">
          <FileText className="size-4 text-primary" />
          <h2 className="font-semibold">Postmortem</h2>
        </div>

        <SectionBlock title="Summary">
          {primaryIncident.summary} Customer-facing checkout was impacted for roughly 35 minutes before mitigation.
        </SectionBlock>

        <SectionBlock title="What happened">{postmortem.whatHappened}</SectionBlock>

        <SectionBlock title="Timeline">
          <ol className="space-y-2">
            {timeline.map((t) => (
              <li key={t.id} className="flex gap-3">
                <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">{t.at}</span>
                <span>{t.title}</span>
              </li>
            ))}
          </ol>
        </SectionBlock>

        <SectionBlock title="Root cause">
          {aiAnalysis.rootCause.statement}{" "}
          <span className="text-muted-foreground">
            (AI confidence {Math.round(aiAnalysis.rootCause.confidence * 100)}%)
          </span>
        </SectionBlock>

        <SectionBlock title="Contributing factors">
          <ul className="space-y-1.5">
            {aiAnalysis.contributingFactors.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
                {f}
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title="Customer impact">{postmortem.customerImpact}</SectionBlock>

        <SectionBlock title="What went well">
          <ul className="space-y-1.5">
            {postmortem.wentWell.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <ThumbsUp className="mt-0.5 size-4 shrink-0 text-[color:var(--chart-2)]" />
                {f}
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title="What needs improvement">
          <ul className="space-y-1.5">
            {postmortem.needsImprovement.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-[color:var(--chart-3)]" />
                {f}
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title="Follow-up actions">
          <div className="space-y-2">
            {linkedActions.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium leading-snug text-foreground">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <Users className="mr-1 inline size-3" />
                    {a.owner} · due {a.dueDate} · {a.category}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <PriorityBadge priority={a.priority} />
                  <ActionStatusBadge status={a.status} />
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>
      </div>

      {!generated && (
        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-[color:var(--chart-2)]" />
          Structured sections are populated from DynamoDB. Generate a draft to add the AI executive summary.
        </p>
      )}
    </div>
  )
}
