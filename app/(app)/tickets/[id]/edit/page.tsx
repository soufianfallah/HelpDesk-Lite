import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { TicketForm } from "@/components/ticket-form";

export default async function EditTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession(); const { id } = await params;
  const [ticket, categories] = await Promise.all([db.ticket.findFirst({ where: { id, ...(session.user.role === "ADMIN" ? {} : { userId: session.user.id }) } }), db.category.findMany({ orderBy: { name: "asc" } })]);
  if (!ticket) notFound();
  return <><PageHeader title="Edit ticket" description="Update the request details or status." /><Card className="mx-auto max-w-3xl"><CardHeader><CardTitle>Ticket details</CardTitle></CardHeader><CardContent><TicketForm categories={categories} ticket={ticket} /></CardContent></Card></>;
}
