import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  trendPositiveIsGood = false,
  hint,
  accent = false,
}: {
  label: string
  value: string | number
  unit?: string
  icon: LucideIcon
  trend?: number
  trendPositiveIsGood?: boolean
  hint?: string
  accent?: boolean
}) {
  const showTrend = typeof trend === "number"
  const isDown = (trend ?? 0) < 0
  const good = trendPositiveIsGood ? !isDown : isDown
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5",
        accent ? "border-destructive/30 bg-destructive/5" : "border-border",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className={cn("size-4", accent ? "text-destructive" : "text-muted-foreground")} />
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {showTrend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              good ? "text-[color:var(--chart-2)]" : "text-destructive",
            )}
          >
            {isDown ? <ArrowDownRight className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
            {Math.abs(trend!)}%
          </span>
        )}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
    </div>
  )
}
