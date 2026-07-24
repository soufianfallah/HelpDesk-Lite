"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category, Ticket } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createTicket, updateTicket } from "@/app/actions/tickets";
import { ticketSchema, type TicketInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function TicketForm({ categories, ticket }: { categories: Category[]; ticket?: Ticket }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const form = useForm<TicketInput>({
    resolver: zodResolver(ticketSchema),
    defaultValues: ticket ? { title: ticket.title, description: ticket.description, categoryId: ticket.categoryId, priority: ticket.priority, status: ticket.status } : { title: "", description: "", categoryId: "", priority: "MEDIUM", status: "OPEN" },
  });
  async function submit(values: TicketInput) {
    setServerError("");
    const result = ticket ? await updateTicket(ticket.id, values) : await createTicket(values);
    if (!result.success) return setServerError(result.message);
    toast.success(result.message);
    router.push(`/tickets/${ticket?.id ?? result.id}`);
    router.refresh();
  }
  return <form className="space-y-6" onSubmit={form.handleSubmit(submit)} noValidate>
    <Field label="Title" error={form.formState.errors.title?.message}><Input placeholder="Briefly describe the issue" {...form.register("title")} /></Field>
    <Field label="Description" error={form.formState.errors.description?.message}><Textarea rows={7} placeholder="Share the details needed to understand and resolve your request…" {...form.register("description")} /></Field>
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Category" error={form.formState.errors.categoryId?.message}><Controller control={form.control} name="categoryId" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger><SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select>} /></Field>
      <Field label="Priority" error={form.formState.errors.priority?.message}><Controller control={form.control} name="priority" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="LOW">Low</SelectItem><SelectItem value="MEDIUM">Medium</SelectItem><SelectItem value="HIGH">High</SelectItem></SelectContent></Select>} /></Field>
    </div>
    {ticket && <Field label="Status" error={form.formState.errors.status?.message}><Controller control={form.control} name="status" render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="OPEN">Open</SelectItem><SelectItem value="IN_PROGRESS">In Progress</SelectItem><SelectItem value="CLOSED">Closed</SelectItem></SelectContent></Select>} /></Field>}
    {serverError && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>}
    <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button><Button disabled={form.formState.isSubmitting}>{form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}{ticket ? "Save changes" : "Create ticket"}</Button></div>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}{error && <p className="text-sm text-destructive">{error}</p>}</div>;
}
