import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/app-shell"
import { AiAnalysisPanel } from "@/components/ai-analysis-panel"
import { SeverityBadge } from "@/components/badges"
import { Button } from "@/components/ui/button"
import { primaryIncident } from "@/lib/data"

export default function AiAnalysisPage() {
  return (
    <>
    <PageHeader
  title="AI Analysis"
  description={`Automated analysis for ${primaryIncident.ref} — ${primaryIncident.title}`}
>
  <div className="flex flex-wrap items-center gap-2">
    <SeverityBadge severity={primaryIncident.severity} />

    <Link
      href="/incident"
      className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
    >
      Open in Command Center
      <ArrowRight className="size-4" />
    </Link>
  </div>
</PageHeader>
      <div className="p-5 sm:p-8">
        <AiAnalysisPanel />
      </div>
    </>
  )
}
