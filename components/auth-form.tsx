"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signIn, signUp } from "@/lib/auth-client";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const schema = mode === "login" ? loginSchema : registerSchema;
  type AuthFields = LoginInput & { name?: string };
  const form = useForm<AuthFields>({
    resolver: zodResolver(schema),
    defaultValues: mode === "register" ? { name: "", email: "", password: "" } : { email: "", password: "" },
  });

  async function onSubmit(values: AuthFields) {
    setServerError("");
    const result =
      mode === "login"
        ? await signIn.email({ email: values.email, password: values.password })
        : await signUp.email({ name: values.name as RegisterInput["name"], email: values.email, password: values.password });
    if (result.error) {
      const message = result.error.message || "Something went wrong. Please try again.";
      setServerError(message);
      return;
    }
    toast.success(mode === "login" ? "Welcome back!" : "Your account is ready.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {mode === "register" && (
        <Field label="Full name" error={form.formState.errors.name?.message}>
          <Input autoComplete="name" placeholder="Alex Morgan" {...form.register("name")} />
        </Field>
      )}
      <Field label="Email" error={form.formState.errors.email?.message}>
        <Input type="email" autoComplete="email" placeholder="alex@example.com" {...form.register("email")} />
      </Field>
      <Field label="Password" error={form.formState.errors.password?.message}>
        <Input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="At least 8 characters" {...form.register("password")} />
      </Field>
      {serverError && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>}
      <Button className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {mode === "login" ? "Sign in" : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? "New to HelpDesk Lite? " : "Already have an account? "}
        <Link className="font-medium text-primary hover:underline" href={mode === "login" ? "/register" : "/login"}>
          {mode === "login" ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}{error && <p className="text-sm text-destructive">{error}</p>}</div>;
}
