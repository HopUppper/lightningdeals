import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { TablesUpdate } from "@/integrations/supabase/types";

type UserRole = "customer" | "admin";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (userId: string): Promise<UserRole> => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) {
        console.error("Failed to fetch role:", error.message);
        return "customer";
      }
      return (data?.role as UserRole) ?? "customer";
    } catch (e) {
      console.error("Role fetch exception:", e);
      return "customer";
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const userRole = await fetchRole(session.user.id);
          if (!mounted) return;
          setRole(userRole);
          // Apply referral code and extra profile data from signup if present
          const storedRef = localStorage.getItem("ld-referral-code");
          const storedPhone = localStorage.getItem("ld-signup-phone");
          const storedLocation = localStorage.getItem("ld-signup-location");
          const profileUpdate: Pick<TablesUpdate<"profiles">, "referred_by" | "phone" | "location"> = {};
          if (storedRef) { profileUpdate.referred_by = storedRef; localStorage.removeItem("ld-referral-code"); }
          if (storedPhone) { profileUpdate.phone = storedPhone; localStorage.removeItem("ld-signup-phone"); }
          if (storedLocation) { profileUpdate.location = storedLocation; localStorage.removeItem("ld-signup-location"); }
          if (Object.keys(profileUpdate).length > 0) {
            await supabase.from("profiles").update(profileUpdate).eq("user_id", session.user.id);
          }
        } else {
          setRole(null);
        }
        setLoading(false);
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const userRole = await fetchRole(session.user.id);
        if (!mounted) return;
        setRole(userRole);
      }
      setLoading(false);
    });

    // Safety timeout - never stay loading forever
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Auth loading timed out after 8s, forcing load complete");
        setLoading(false);
      }
    }, 8000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, role, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
