import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Create account" };
export default function RegisterPage() {
  return <Card><CardHeader className="text-center"><CardTitle className="text-2xl">Create your account</CardTitle><CardDescription>Start tracking support requests in minutes.</CardDescription></CardHeader><CardContent><AuthForm mode="register" /></CardContent></Card>;
}
