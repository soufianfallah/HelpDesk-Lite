"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { ticketSchema } from "@/lib/validations";

export type ActionResult = { success: boolean; message: string; id?: string };

export async function createTicket(input: unknown): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = ticketSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid ticket." };
  const category = await db.category.findUnique({ where: { id: parsed.data.categoryId }, select: { id: true } });
  if (!category) return { success: false, message: "The selected category no longer exists." };
  try {
    const ticket = await db.ticket.create({ data: { ...parsed.data, userId: session.user.id } });
    revalidatePath("/dashboard");
    revalidatePath("/tickets");
    return { success: true, message: "Ticket created.", id: ticket.id };
  } catch {
    return { success: false, message: "Could not create the ticket. Please try again." };
  }
}

export async function updateTicket(id: string, input: unknown): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = ticketSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid ticket." };
  const result = await db.ticket.updateMany({ where: { id, userId: session.user.id }, data: parsed.data });
  if (!result.count) return { success: false, message: "Ticket not found." };
  revalidatePath("/dashboard");
  revalidatePath("/tickets");
  revalidatePath(`/tickets/${id}`);
  return { success: true, message: "Ticket updated." };
}

export async function setTicketClosed(id: string, closed: boolean): Promise<ActionResult> {
  const session = await requireSession();
  const result = await db.ticket.updateMany({ where: { id, userId: session.user.id }, data: { status: closed ? "CLOSED" : "OPEN" } });
  if (!result.count) return { success: false, message: "Ticket not found." };
  revalidatePath("/dashboard");
  revalidatePath("/tickets");
  revalidatePath(`/tickets/${id}`);
  return { success: true, message: closed ? "Ticket closed." : "Ticket reopened." };
}

export async function deleteTicket(id: string) {
  const session = await requireSession();
  const result = await db.ticket.deleteMany({ where: { id, userId: session.user.id } });
  if (!result.count) return { success: false, message: "Ticket not found." };
  revalidatePath("/dashboard");
  revalidatePath("/tickets");
  redirect("/tickets");
}
