import { redirect } from "next/navigation";
import { Headphones } from "lucide-react";
import { getSession } from "@/lib/session";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session) redirect("/dashboard");
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_40%)]" />
      <div className="absolute right-5 top-5"><ThemeToggle /></div>
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2 text-xl font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Headphones className="h-5 w-5" /></span>
          HelpDesk Lite
        </div>
        {children}
      </div>
    </main>
  );
}
