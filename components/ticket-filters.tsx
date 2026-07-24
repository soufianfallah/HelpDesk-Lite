"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TicketFilters({ categories }: { categories: { id: string; name: string }[] }) {
  const router = useRouter(); const pathname = usePathname(); const params = useSearchParams();
  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key); else next.set(key, value);
    router.replace(`${pathname}?${next.toString()}`);
  }
  return <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_200px]">
    <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search ticket titles…" defaultValue={params.get("q") ?? ""} onChange={(e) => { const value = e.target.value; window.clearTimeout(Number(e.currentTarget.dataset.timer)); const timer = window.setTimeout(() => update("q", value), 300); e.currentTarget.dataset.timer = String(timer); }} /></div>
    <Select value={params.get("status") ?? "all"} onValueChange={(v) => update("status", v)}><SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="OPEN">Open</SelectItem><SelectItem value="IN_PROGRESS">In Progress</SelectItem><SelectItem value="CLOSED">Closed</SelectItem></SelectContent></Select>
    <Select value={params.get("category") ?? "all"} onValueChange={(v) => update("category", v)}><SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem>{categories.map((c) => <SelectItem value={c.id} key={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
  </div>;
}
