"use client"

import { useMemo, useState } from "react"
import { ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { ActionStatusBadge, PriorityBadge } from "@/components/badges"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { actionItems, serviceById, services } from "@/lib/data"

type Filter = "all" | "overdue" | "high" | "open"

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All items" },
  { id: "overdue", label: "Overdue" },
  { id: "high", label: "High priority" },
  { id: "open", label: "Open items" },
]

export function ActionItemsView() {
  const [filter, setFilter] = useState<Filter>("all")
  const [serviceFilter, setServiceFilter] = useState<string>("all")

  const rows = useMemo(() => {
    return actionItems.filter((a) => {
      if (serviceFilter !== "all" && a.serviceId !== serviceFilter) return false
      if (filter === "overdue") return a.overdue
      if (filter === "high") return a.priority === "high" || a.priority === "urgent"
      if (filter === "open") return a.status === "open" || a.status === "in_progress" || a.status === "blocked"
      return true
    })
  }, [filter, serviceFilter])

  const preventionCount = rows.filter((a) =>
    ["Migration safety", "Observability", "Capacity"].includes(a.category),
  ).length

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-sm"
          aria-label="Filter by service"
        >
          <option value="all">All services</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Prevention note */}
      <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
        <ShieldCheck className="size-4 shrink-0 text-primary" />
        <span className="text-foreground/90">
          <span className="font-medium text-primary tabular-nums">{preventionCount}</span> of {rows.length} shown
          actions directly reduce future incident risk (migration safety, observability, capacity).
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[280px]">Action item</TableHead>
                <TableHead>Incident</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="min-w-[150px]">Prevention category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium leading-snug">{a.title}</TableCell>
                  <TableCell>
                    <span className="rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">
                      {a.incidentRef}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">{a.owner}</TableCell>
                  <TableCell><PriorityBadge priority={a.priority} /></TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className={cn("text-sm", a.overdue ? "font-medium text-destructive" : "text-muted-foreground")}>
                      {a.dueDate}
                      {a.overdue && " · overdue"}
                    </span>
                  </TableCell>
                  <TableCell><ActionStatusBadge status={a.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.category}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    No action items match these filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
