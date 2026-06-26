import type { Metadata } from "next"
import { ActionItemsView } from "@/components/action-items-view"
import { actionItems } from "@/lib/data"

export const metadata: Metadata = {
  title: "Action Items — ResolveOps AI",
  description: "Track follow-up and prevention actions from incidents and postmortems.",
}

export default function ActionsPage() {
  const open = actionItems.filter((a) => a.status !== "done").length
  const overdue = actionItems.filter((a) => a.overdue).length
  const done = actionItems.filter((a) => a.status === "done").length

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">Action Items</h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Prevention and follow-up work generated from incidents and postmortems, tracked to closure.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Open actions</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{open}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Overdue</p>
          <p className="mt-1 text-2xl font-semibold text-destructive">{overdue}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{done}</p>
        </div>
      </div>

      <ActionItemsView />
    </div>
  )
}
