"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Headphones, LayoutDashboard, LogOut, Menu, Plus, ShieldCheck, Ticket, X } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { cn, initials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/tickets/new", label: "New ticket", icon: Plus },
];

export function AppShell({ user, children }: { user: { name: string; email: string; role: "CLIENT" | "ADMIN" }; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  async function logout() {
    await signOut();
    router.push("/login");
    router.refresh();
  }
  return (
    <div className="min-h-screen">
      {open && <button className="fixed inset-0 z-40 bg-black/50 lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-64 -translate-x-full flex-col border-r bg-card transition-transform lg:translate-x-0", open && "translate-x-0")}>
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Headphones className="h-5 w-5" /></span>HelpDesk Lite</Link>
          <Button className="lg:hidden" variant="ghost" size="icon" onClick={() => setOpen(false)}><X className="h-5 w-5" /></Button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {user.role === "ADMIN" && <Link href="/admin" onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground", pathname.startsWith("/admin") && "bg-accent text-accent-foreground")}><ShieldCheck className="h-4 w-4" />Admin queue</Link>}
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/tickets" ? pathname === href || /^\/tickets\/[^/]+$/.test(pathname) : pathname === href;
            return <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground", active && "bg-accent text-accent-foreground")}><Icon className="h-4 w-4" />{label}</Link>;
          })}
        </nav>
        <div className="border-t p-4">
          <div className="mb-3 flex items-center gap-3"><Avatar><AvatarFallback>{initials(user.name)}</AvatarFallback></Avatar><div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate text-sm font-medium">{user.name}</p>{user.role === "ADMIN" && <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">ADMIN</span>}</div><p className="truncate text-xs text-muted-foreground">{user.email}</p></div></div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={logout}><LogOut className="h-4 w-4" />Sign out</Button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:px-8">
          <Button className="lg:hidden" variant="ghost" size="icon" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></Button>
          <div className="hidden lg:block"><p className="text-sm text-muted-foreground">Support made simple.</p></div>
          <ThemeToggle />
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
