"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  AlertOctagon,
  Boxes,
  BrainCircuit,
  CheckSquare,
  Database,
  FileText,
  LayoutDashboard,
  Menu,
  Plug,
  ShieldAlert,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { org } from "@/lib/data"
import { Button } from "@/components/ui/button"

const nav = [
  { href: "/dashboard", label: "Reliability Dashboard", icon: LayoutDashboard },
  { href: "/incident", label: "Command Center", icon: AlertOctagon },
  { href: "/ai-analysis", label: "AI Analysis", icon: BrainCircuit },
  { href: "/postmortem", label: "Postmortem", icon: FileText },
  { href: "/actions", label: "Action Items", icon: CheckSquare },
  { href: "/services", label: "Services", icon: Boxes },
  { href: "/integrations", label: "Data Intake", icon: Plug },
  { href: "/architecture", label: "Architecture", icon: Database },
]

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <ShieldAlert className="size-5" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-sidebar-foreground">
        ResolveOps<span className="text-sidebar-primary"> AI</span>
      </span>
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/")
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary/15 text-sidebar-foreground"
                : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            <Icon className={cn("size-4 shrink-0", active && "text-sidebar-primary")} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarFooter() {
  return (
    <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground">
        <Activity className="size-3.5 text-sidebar-primary" />
        {org.name}
      </div>
      <p className="mt-1 text-[11px] text-sidebar-foreground/55">
        {org.plan} · {org.region} · DynamoDB
      </p>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-svh bg-background lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh flex-col gap-6 border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Brand />
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <SidebarFooter />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 lg:hidden">
        <Brand />
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </Button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col gap-6 bg-sidebar p-4">
            <div className="flex items-center justify-between">
              <Brand />
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
              >
                <X className="size-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
            <SidebarFooter />
          </div>
        </div>
      )}

      <main className="min-w-0">{children}</main>
    </div>
  )
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border bg-card/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="min-w-0">
        <h1 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-pretty text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}
