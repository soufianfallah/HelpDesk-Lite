import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { TicketForm } from "@/components/ticket-form";

export const metadata: Metadata = { title: "New ticket" };
export default async function NewTicketPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });
  return <><PageHeader title="Create a ticket" description="Tell us what you need help with." /><Card className="mx-auto max-w-3xl"><CardHeader><CardTitle>Ticket details</CardTitle><CardDescription>Provide clear details so your request is easy to follow.</CardDescription></CardHeader><CardContent><TicketForm categories={categories} /></CardContent></Card></>;
}
