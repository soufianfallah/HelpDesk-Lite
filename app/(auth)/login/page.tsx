import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Sign in" };
export default function LoginPage() {
  return <Card><CardHeader className="text-center"><CardTitle className="text-2xl">Welcome back</CardTitle><CardDescription>Sign in to manage your support tickets.</CardDescription></CardHeader><CardContent><AuthForm mode="login" /></CardContent></Card>;
}
