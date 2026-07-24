import type { TicketStatus } from "@prisma/client";
import { CircleDot, Clock3, TicketCheck, Tickets, Users } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { AdminTicketList } from "@/components/admin-ticket-list";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { TicketFilters } from "@/components/ticket-filters";

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; category?: string }> }) {
  await requireAdmin();
  const query = await searchParams;
  const statuses = ["OPEN", "IN_PROGRESS", "CLOSED"];
  const where = {
    title: query.q ? { contains: query.q, mode: "insensitive" as const } : undefined,
    status: statuses.includes(query.status ?? "") ? query.status as TicketStatus : undefined,
    categoryId: query.category || undefined,
  };
  const [total, open, inProgress, closed, clients, tickets, categories] = await Promise.all([
    db.ticket.count(),
    db.ticket.count({ where: { status: "OPEN" } }),
    db.ticket.count({ where: { status: "IN_PROGRESS" } }),
    db.ticket.count({ where: { status: "CLOSED" } }),
    db.user.count({ where: { role: "CLIENT" } }),
    db.ticket.findMany({ where, include: { category: true, user: { select: { name: true, email: true } } }, orderBy: { updatedAt: "desc" } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  const cards = [
    { label: "All tickets", value: total, icon: Tickets, color: "text-violet-600 bg-violet-100 dark:bg-violet-950" },
    { label: "Open", value: open, icon: CircleDot, color: "text-blue-600 bg-blue-100 dark:bg-blue-950" },
    { label: "In progress", value: inProgress, icon: Clock3, color: "text-amber-600 bg-amber-100 dark:bg-amber-950" },
    { label: "Closed", value: closed, icon: TicketCheck, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950" },
    { label: "Clients", value: clients, icon: Users, color: "text-fuchsia-600 bg-fuchsia-100 dark:bg-fuchsia-950" },
  ];
  return (
    <>
      <PageHeader title="Admin queue" description="Review and manage support requests from every client." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, color }) => <Card key={label}><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div><span className={`rounded-xl p-3 ${color}`}><Icon className="h-5 w-5" /></span></CardContent></Card>)}
      </div>
      <TicketFilters categories={categories} />
      <AdminTicketList tickets={tickets} />
    </>
  );
}
