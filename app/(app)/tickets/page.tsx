import Link from "next/link";
import { Plus } from "lucide-react";
import type { TicketStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { TicketFilters } from "@/components/ticket-filters";
import { TicketList } from "@/components/ticket-list";

export default async function TicketsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; category?: string }> }) {
  const session = await requireSession();
  const query = await searchParams;
  const validStatuses = ["OPEN", "IN_PROGRESS", "CLOSED"];
  const [tickets, categories] = await Promise.all([
    db.ticket.findMany({
      where: { userId: session.user.id, title: query.q ? { contains: query.q, mode: "insensitive" } : undefined, status: validStatuses.includes(query.status ?? "") ? query.status as TicketStatus : undefined, categoryId: query.category || undefined },
      include: { category: true }, orderBy: { updatedAt: "desc" },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return <><PageHeader title="Tickets" description="Search, filter, and manage your support requests." action={<Button asChild><Link href="/tickets/new"><Plus className="h-4 w-4" />New ticket</Link></Button>} /><TicketFilters categories={categories} /><TicketList tickets={tickets} /></>;
}
