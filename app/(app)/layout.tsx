import { requireSession } from "@/lib/session";
import { AppShell } from "@/components/app-shell";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  return <AppShell user={{ name: session.user.name, email: session.user.email }}>{children}</AppShell>;
}
