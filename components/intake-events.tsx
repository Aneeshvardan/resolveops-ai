"use client"

import { useState } from "react"
import { Download, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SeverityBadge } from "@/components/badges"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { externalEvents, serviceById, type ExternalEvent } from "@/lib/data"

const extra: ExternalEvent[] = [
  { id: "x1", source: "Datadog", eventType: "monitor.recovered", serviceId: "svc-payments", severity: "info", timestamp: "14:42:55", mappedIncident: "INC-4821" },
  { id: "x2", source: "Slack", eventType: "message.resolved", serviceId: "svc-payments", severity: "info", timestamp: "14:45:10", mappedIncident: "INC-4821" },
  { id: "x3", source: "Jira", eventType: "ticket.updated", serviceId: "svc-database", severity: "SEV2", timestamp: "15:12:33", mappedIncident: "INC-4821" },
]

function SourceTag({ source }: { source: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium">
      <span className="size-1.5 rounded-full bg-primary" aria-hidden />
      {source}
    </span>
  )
}

export function IntakeEvents() {
  const [rows, setRows] = useState<ExternalEvent[]>(externalEvents)
  const [importing, setImporting] = useState(false)
  const [importedCount, setImportedCount] = useState(0)

  function handleImport() {
    if (importing) return
    setImporting(true)
    setTimeout(() => {
      setRows((prev) => [...extra.filter((e) => !prev.some((p) => p.id === e.id)), ...prev])
      setImportedCount((c) => c + extra.length)
      setImporting(false)
    }, 1100)
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Incoming Incident Events</h2>
          <p className="text-xs text-muted-foreground">
            {rows.length} events ingested
            {importedCount > 0 && ` · ${importedCount} imported this session`}
          </p>
        </div>
        <Button size="sm" onClick={handleImport} disabled={importing}>
          {importing ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          {importing ? "Importing…" : "Import Incident Data"}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Event type</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Mapped incident</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((e) => (
              <TableRow key={e.id}>
                <TableCell><SourceTag source={e.source} /></TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                    {e.eventType}
                  </code>
                </TableCell>
                <TableCell className="text-sm">{serviceById(e.serviceId)?.name ?? "—"}</TableCell>
                <TableCell>
                  {e.severity === "info" ? (
                    <span className="text-xs text-muted-foreground">info</span>
                  ) : (
                    <SeverityBadge severity={e.severity} />
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">{e.timestamp}</TableCell>
                <TableCell>
                  {e.mappedIncident ? (
                    <span className="rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">
                      {e.mappedIncident}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <RefreshCw className="size-3" />
                      unmapped
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
