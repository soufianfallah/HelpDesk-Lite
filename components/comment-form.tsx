"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { addComment } from "@/app/actions/comments";
import { commentSchema, type CommentInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CommentForm({ ticketId }: { ticketId: string }) {
  const [serverError, setServerError] = useState("");
  const form = useForm<CommentInput>({ resolver: zodResolver(commentSchema), defaultValues: { message: "" } });
  async function submit(values: CommentInput) {
    const result = await addComment(ticketId, values);
    if (!result.success) return setServerError(result.message);
    form.reset(); setServerError(""); toast.success(result.message);
  }
  return <form onSubmit={form.handleSubmit(submit)} className="space-y-2"><Textarea rows={3} placeholder="Add to the discussion…" {...form.register("message")} />{(form.formState.errors.message?.message || serverError) && <p className="text-sm text-destructive">{form.formState.errors.message?.message || serverError}</p>}<div className="flex justify-end"><Button size="sm" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Add comment</Button></div></form>;
}
