import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function SignInForm() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setError(error.message);
    } else {
      setLocation("/dashboard");
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  data-testid="input-email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  data-testid="input-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          data-testid="button-sign-in"
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </Form>
  );
}

function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  }

  if (success) {
    return (
      <div
        data-testid="register-success"
        className="flex flex-col items-center gap-3 py-6 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-green-500" />
        <p className="font-semibold text-foreground">Account created!</p>
        <p className="text-sm text-muted-foreground">
          Check your email to confirm your account, then sign in.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  data-testid="input-register-email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  data-testid="input-register-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  data-testid="input-register-confirm"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          data-testid="button-register"
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>
    </Form>
  );
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { devLogin } = useAuth();
  const isLocal = typeof window !== "undefined" && (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.endsWith(".local") ||
    import.meta.env.DEV
  );

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/.13),transparent_45%)]" />
      <div className="absolute right-5 top-5 z-10"><ThemeToggle /></div>
      <Card className="relative w-full max-w-md border-card-border shadow-xl shadow-primary/5">
        <CardHeader className="space-y-1">
          <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">O</span> Orbit CRM
          </Link>
          <CardTitle className="text-2xl font-bold tracking-tight">Your business, in rhythm.</CardTitle>
          <CardDescription>Sign in or create an account to continue to your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLocal && (
            <div className="mb-5 rounded-xl border border-primary/25 bg-primary/5 p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <Zap className="h-3.5 w-3.5 fill-primary" />
                  Local Development Mode
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                  Bypass OAuth
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Google OAuth redirects to production. Use 1-Click Dev Sign In to test locally without leaving localhost.
              </p>
              <Button
                type="button"
                className="w-full flex items-center justify-center gap-2 font-semibold shadow-sm"
                onClick={() => {
                  devLogin("mhonbastasa@gmail.com");
                  setLocation("/dashboard");
                }}
              >
                <ShieldCheck className="h-4 w-4" />
                Sign in as mhonbastasa@gmail.com
              </Button>
            </div>
          )}
          <div className="mb-6 space-y-4">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={async () => {
                await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/login`,
                  },
                });
              }}
            >
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
              Continue with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </div>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger data-testid="tab-signin" value="signin">Sign In</TabsTrigger>
              <TabsTrigger data-testid="tab-register" value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
