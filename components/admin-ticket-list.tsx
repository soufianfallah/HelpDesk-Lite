import Link from "next/link";
import type { Category, Ticket } from "@prisma/client";
import { format } from "date-fns";
import { ChevronRight, Inbox } from "lucide-react";
import { PriorityBadge, StatusBadge } from "@/components/ticket-badges";

type AdminTicket = Ticket & {
  category: Category;
  user: { name: string; email: string };
};

export function AdminTicketList({ tickets }: { tickets: AdminTicket[] }) {
  if (!tickets.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <span className="mb-4 rounded-full bg-muted p-3"><Inbox className="h-6 w-6 text-muted-foreground" /></span>
        <h3 className="font-semibold">No client tickets found</h3>
        <p className="mt-1 text-sm text-muted-foreground">New client requests will appear here.</p>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="hidden grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_0.8fr_0.7fr_auto] gap-4 border-b bg-muted/40 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:grid">
        <span>Ticket</span><span>Client</span><span>Status</span><span>Priority</span><span />
      </div>
      <div className="divide-y">
        {tickets.map((ticket) => (
          <Link key={ticket.id} href={`/tickets/${ticket.id}`} className="grid gap-3 px-5 py-4 transition-colors hover:bg-muted/40 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_0.8fr_0.7fr_auto] lg:items-center lg:gap-4">
            <div className="min-w-0"><p className="truncate font-medium">{ticket.title}</p><p className="mt-1 truncate text-sm text-muted-foreground">{ticket.category.name} · {format(ticket.createdAt, "MMM d, yyyy")}</p></div>
            <div className="min-w-0"><p className="truncate text-sm font-medium">{ticket.user.name}</p><p className="truncate text-xs text-muted-foreground">{ticket.user.email}</p></div>
            <div><StatusBadge status={ticket.status} /></div><div><PriorityBadge priority={ticket.priority} /></div>
            <ChevronRight className="hidden h-4 w-4 text-muted-foreground lg:block" />
          </Link>
        ))}
      </div>
    </div>
  );
}
