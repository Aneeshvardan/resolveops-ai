import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HealthBadge, RiskBadge } from "@/components/badges"
import { services, serviceById } from "@/lib/data"
import { Users, GitBranch, AlertTriangle, ListChecks } from "lucide-react"

export const metadata: Metadata = {
  title: "Services — ResolveOps AI",
  description: "Service catalog with health, risk, and dependency mapping.",
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">Service Catalog</h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Health, reliability risk, and dependencies across all tracked services.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((svc) => (
          <Card key={svc.id} className="flex flex-col">
            <CardHeader className="gap-2">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base text-foreground">{svc.name}</CardTitle>
                <HealthBadge health={svc.health} />
              </div>
              <p className="text-sm text-muted-foreground text-pretty">{svc.description}</p>
            </CardHeader>
            <CardContent className="mt-auto flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Users className="size-4" aria-hidden /> {svc.owner}
                </span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {svc.team}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-muted/40 p-3 text-center">
                <div className="flex flex-col gap-0.5">
                  <span className="inline-flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <AlertTriangle className="size-3.5" aria-hidden /> 90d
                  </span>
                  <span className="text-sm font-semibold text-foreground">{svc.incidents90d}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="inline-flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <ListChecks className="size-3.5" aria-hidden /> Actions
                  </span>
                  <span className="text-sm font-semibold text-foreground">{svc.openActions}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Risk</span>
                  <RiskBadge risk={svc.risk} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <GitBranch className="size-3.5" aria-hidden /> Dependencies
                </span>
                {svc.dependencies.length === 0 ? (
                  <span className="text-sm text-muted-foreground">None</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {svc.dependencies.map((dep) => (
                      <span
                        key={dep}
                        className="rounded-md border border-border bg-card px-2 py-0.5 text-xs text-foreground"
                      >
                        {serviceById(dep)?.name ?? dep}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground">Last incident: {svc.lastIncident}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
