import { AlertTriangle, BrainCircuit, Database, FileSearch, Lightbulb, ListChecks } from "lucide-react"
import { ConfidenceBar, RiskBadge } from "@/components/badges"
import { aiAnalysis } from "@/lib/data"

export function AiAnalysisPanel() {
  return (
    <div className="space-y-4">
      {/* AI summary */}
      <div className="rounded-xl border border-primary/25 bg-primary/5 p-5">
        <div className="flex items-center gap-2">
          <BrainCircuit className="size-4 text-primary" />
          <h3 className="font-semibold">AI-generated incident summary</h3>
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Generated from structured data
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">{aiAnalysis.summary}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Root cause */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <FileSearch className="size-4 text-primary" />
            <h3 className="font-semibold">Likely root cause</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">{aiAnalysis.rootCause.statement}</p>
          <div className="mt-4">
            <p className="mb-1.5 text-xs text-muted-foreground">Confidence</p>
            <ConfidenceBar value={aiAnalysis.rootCause.confidence} />
          </div>
        </div>

        {/* Recurrence risk */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-destructive" />
            <h3 className="font-semibold">Risk of recurrence</h3>
          </div>
          <div className="mt-3">
            <RiskBadge risk={aiAnalysis.recurrenceRisk.level} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{aiAnalysis.recurrenceRisk.detail}</p>
        </div>
      </div>

      {/* Contributing factors */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-[color:var(--chart-3)]" />
          <h3 className="font-semibold">Contributing factors</h3>
        </div>
        <ul className="mt-3 space-y-2">
          {aiAnalysis.contributingFactors.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/90">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color:var(--chart-3)]" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended actions */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <ListChecks className="size-4 text-primary" />
          <h3 className="font-semibold">Recommended next actions</h3>
        </div>
        <ol className="mt-3 space-y-3">
          {aiAnalysis.recommendedActions.map((a, i) => (
            <li key={a} className="flex items-start gap-3 text-sm text-foreground/90">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {i + 1}
              </span>
              {a}
            </li>
          ))}
        </ol>
      </div>

      {/* Evidence used */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Database className="size-4 text-primary" />
          <h3 className="font-semibold">Evidence used</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          The analysis draws on structured incident data stored in Amazon Aurora PostgreSQL.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {aiAnalysis.evidence.map((e) => (
            <div key={e.ref} className="flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-3">
              <span className="rounded bg-card px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {e.type}
              </span>
              <span className="text-sm text-foreground/90">{e.ref}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
