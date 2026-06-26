import { PageHeader } from "@/components/app-shell"
import { PostmortemPanel } from "@/components/postmortem-panel"
import { SeverityBadge } from "@/components/badges"
import { primaryIncident } from "@/lib/data"

export default function PostmortemPage() {
  return (
    <>
      <PageHeader
        title="Postmortem"
        description={`Structured postmortem for ${primaryIncident.ref} — ${primaryIncident.title}`}
      >
        <SeverityBadge severity={primaryIncident.severity} />
      </PageHeader>
      <div className="p-5 sm:p-8">
        <PostmortemPanel />
      </div>
    </>
  )
}
