"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { commentSchema } from "@/lib/validations";
import type { ActionResult } from "@/app/actions/tickets";

export async function addComment(ticketId: string, input: unknown): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid comment." };
  const ticket = await db.ticket.findFirst({ where: { id: ticketId, ...(session.user.role === "ADMIN" ? {} : { userId: session.user.id }) }, select: { id: true } });
  if (!ticket) return { success: false, message: "Ticket not found." };
  await db.comment.create({ data: { message: parsed.data.message, ticketId, userId: session.user.id } });
  revalidatePath(`/tickets/${ticketId}`);
  return { success: true, message: "Comment added." };
}
