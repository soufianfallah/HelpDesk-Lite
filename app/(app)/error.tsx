"use client";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="flex min-h-[60vh] flex-col items-center justify-center text-center"><h1 className="text-2xl font-bold">Something went wrong</h1><p className="mt-2 max-w-md text-muted-foreground">We couldn’t load this page. Check your connection and try again.</p><Button className="mt-6" onClick={reset}>Try again</Button></div>;
}
