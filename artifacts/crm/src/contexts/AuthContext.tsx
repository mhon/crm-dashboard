import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const DEV_STORAGE_KEY = "orbit_dev_session";

function createDevSession(email: string): Session {
  const user: User = {
    id: "00000000-0000-0000-0000-000000000001",
    app_metadata: { provider: "dev", providers: ["dev"] },
    user_metadata: { full_name: "Developer Admin", name: "Developer Admin" },
    aud: "authenticated",
    confirmation_sent_at: new Date().toISOString(),
    confirmed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    email: email,
    email_confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    phone: "",
    role: "authenticated",
    updated_at: new Date().toISOString(),
  };

  return {
    access_token: "dev-token",
    token_type: "bearer",
    expires_in: 31536000,
    expires_at: Math.floor(Date.now() / 1000) + 31536000,
    refresh_token: "dev-refresh-token",
    user,
  };
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  devLogin: (email?: string) => void;
  isDev: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(DEV_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Session;
        setSession(parsed);
        setUser(parsed.user);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem(DEV_STORAGE_KEY);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!localStorage.getItem(DEV_STORAGE_KEY)) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (localStorage.getItem(DEV_STORAGE_KEY)) {
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const devLogin = (email = "mhonbastasa@gmail.com") => {
    const newDevSession = createDevSession(email);
    try {
      localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(newDevSession));
    } catch (e) {
      console.warn("Could not save dev session to localStorage", e);
    }
    setSession(newDevSession);
    setUser(newDevSession.user);
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(DEV_STORAGE_KEY);
    } catch {}
    setSession(null);
    setUser(null);
    await supabase.auth.signOut().catch(() => {});
  };

  const isDev = Boolean(session?.access_token === "dev-token");

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, devLogin, isDev }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

