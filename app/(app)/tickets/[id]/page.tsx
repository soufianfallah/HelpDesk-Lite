import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Folder, MessageSquare } from "lucide-react";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { initials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommentForm } from "@/components/comment-form";
import { PageHeader } from "@/components/page-header";
import { PriorityBadge, StatusBadge } from "@/components/ticket-badges";
import { TicketActions } from "@/components/ticket-actions";

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession(); const { id } = await params;
  const ticket = await db.ticket.findFirst({ where: { id, userId: session.user.id }, include: { category: true, comments: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "asc" } } } });
  if (!ticket) notFound();
  return <><PageHeader title={ticket.title} description={`Ticket #${ticket.id.slice(-8).toUpperCase()}`} action={<TicketActions id={ticket.id} isClosed={ticket.status === "CLOSED"} />} />
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>Description</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap leading-7 text-muted-foreground">{ticket.description}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" />Discussion <span className="text-sm font-normal text-muted-foreground">({ticket.comments.length})</span></CardTitle></CardHeader><CardContent className="space-y-6">
          {ticket.comments.length ? <div className="space-y-5">{ticket.comments.map((comment) => <div key={comment.id} className="flex gap-3"><Avatar><AvatarFallback>{initials(comment.user.name)}</AvatarFallback></Avatar><div className="min-w-0 flex-1 rounded-lg bg-muted/60 p-4"><div className="mb-2 flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold">{comment.user.name}</p><time className="text-xs text-muted-foreground">{format(comment.createdAt, "MMM d, yyyy 'at' h:mm a")}</time></div><p className="whitespace-pre-wrap text-sm leading-6">{comment.message}</p></div></div>)}</div> : <p className="text-sm text-muted-foreground">No comments yet. Start the discussion below.</p>}
          <CommentForm ticketId={ticket.id} />
        </CardContent></Card>
      </div>
      <Card className="h-fit"><CardHeader><CardTitle>Ticket details</CardTitle></CardHeader><CardContent className="space-y-5"><Detail label="Status"><StatusBadge status={ticket.status} /></Detail><Detail label="Priority"><PriorityBadge priority={ticket.priority} /></Detail><Detail label="Category"><span className="flex items-center gap-2 text-sm"><Folder className="h-4 w-4 text-muted-foreground" />{ticket.category.name}</span></Detail><Detail label="Created"><span className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" />{format(ticket.createdAt, "MMMM d, yyyy")}</span></Detail><Detail label="Last updated"><span className="text-sm">{format(ticket.updatedAt, "MMM d, yyyy 'at' h:mm a")}</span></Detail></CardContent></Card>
    </div>
  </>;
}
function Detail({ label, children }: { label: string; children: React.ReactNode }) { return <div><p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>{children}</div>; }
