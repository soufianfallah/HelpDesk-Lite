import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
});

export const ticketSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(120),
  description: z.string().trim().min(10, "Description must be at least 10 characters.").max(5000),
  categoryId: z.string().min(1, "Select a category."),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
});

export const commentSchema = z.object({
  message: z.string().trim().min(1, "Write a comment.").max(2000, "Comment is too long."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type TicketInput = z.infer<typeof ticketSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
