import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <div className="flex min-h-[60vh] flex-col items-center justify-center text-center"><p className="text-sm font-medium text-primary">404</p><h1 className="mt-2 text-3xl font-bold">Ticket not found</h1><p className="mt-2 text-muted-foreground">It may have been deleted, or you do not have access to it.</p><Button asChild className="mt-6"><Link href="/tickets">Back to tickets</Link></Button></div>; }
