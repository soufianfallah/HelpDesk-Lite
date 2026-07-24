"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Link from "next/link";
import { useTransition } from "react";
import { CheckCircle2, Loader2, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteTicket, setTicketClosed } from "@/app/actions/tickets";
import { Button } from "@/components/ui/button";

export function TicketActions({ id, isClosed }: { id: string; isClosed: boolean }) {
  const [pending, startTransition] = useTransition();
  function toggle() { startTransition(async () => { const result = await setTicketClosed(id, !isClosed); result.success ? toast.success(result.message) : toast.error(result.message); }); }
  return <div className="flex flex-wrap gap-2">
    <Button variant="outline" size="sm" onClick={toggle} disabled={pending}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : isClosed ? <RotateCcw className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}{isClosed ? "Reopen" : "Close"}</Button>
    <Button asChild variant="outline" size="sm"><Link href={`/tickets/${id}/edit`}><Pencil className="h-4 w-4" />Edit</Link></Button>
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild><Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" />Delete</Button></AlertDialog.Trigger>
      <AlertDialog.Portal><AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/60" /><AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-6 shadow-xl"><AlertDialog.Title className="text-lg font-semibold">Delete this ticket?</AlertDialog.Title><AlertDialog.Description className="mt-2 text-sm text-muted-foreground">This permanently deletes the ticket and its discussion. This action cannot be undone.</AlertDialog.Description><div className="mt-6 flex justify-end gap-3"><AlertDialog.Cancel asChild><Button variant="outline">Cancel</Button></AlertDialog.Cancel><AlertDialog.Action asChild><Button variant="destructive" onClick={() => startTransition(async () => { await deleteTicket(id); })}>Delete ticket</Button></AlertDialog.Action></div></AlertDialog.Content></AlertDialog.Portal>
    </AlertDialog.Root>
  </div>;
}
