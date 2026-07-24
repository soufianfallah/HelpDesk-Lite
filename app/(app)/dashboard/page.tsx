import Link from "next/link";
import { CircleDot, Clock3, Plus, TicketCheck, Tickets } from "lucide-react";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { TicketList } from "@/components/ticket-list";

export default async function DashboardPage() {
  const session = await requireSession();
  const userId = session.user.id;
  const [total, open, inProgress, closed, recent] = await Promise.all([
    db.ticket.count({ where: { userId } }),
    db.ticket.count({ where: { userId, status: "OPEN" } }),
    db.ticket.count({ where: { userId, status: "IN_PROGRESS" } }),
    db.ticket.count({ where: { userId, status: "CLOSED" } }),
    db.ticket.findMany({ where: { userId }, include: { category: true }, orderBy: { updatedAt: "desc" }, take: 5 }),
  ]);
  const cards = [
    { label: "Total tickets", value: total, icon: Tickets, color: "text-violet-600 bg-violet-100 dark:bg-violet-950" },
    { label: "Open tickets", value: open, icon: CircleDot, color: "text-blue-600 bg-blue-100 dark:bg-blue-950" },
    { label: "In progress", value: inProgress, icon: Clock3, color: "text-amber-600 bg-amber-100 dark:bg-amber-950" },
    { label: "Closed tickets", value: closed, icon: TicketCheck, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950" },
  ];
  return <>
    <PageHeader title={`Welcome back, ${session.user.name.split(" ")[0]}`} description="Here’s what’s happening with your support requests." action={<Button asChild><Link href="/tickets/new"><Plus className="h-4 w-4" />New ticket</Link></Button>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon, color }) => <Card key={label}><CardContent className="flex items-center justify-between p-6"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div><span className={`rounded-xl p-3 ${color}`}><Icon className="h-5 w-5" /></span></CardContent></Card>)}</div>
    <Card className="mt-6"><CardHeader className="flex-row items-center justify-between"><CardTitle>Recent tickets</CardTitle><Button asChild variant="ghost" size="sm"><Link href="/tickets">View all</Link></Button></CardHeader><CardContent><TicketList tickets={recent} /></CardContent></Card>
  </>;
}
