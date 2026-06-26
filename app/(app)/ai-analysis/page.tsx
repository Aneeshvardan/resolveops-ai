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
        <SeverityBadge severity={primaryIncident.severity} />
        <Button variant="outline" size="sm" asChild>
          <Link href="/incident">
            Open in Command Center
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </PageHeader>
      <div className="p-5 sm:p-8">
        <AiAnalysisPanel />
      </div>
    </>
  )
}
