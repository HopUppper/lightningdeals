import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, CheckCircle2, XCircle, RefreshCw, Lock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const RoleVerification = () => {
  const { user, role } = useAuth();
  const [backendRole, setBackendRole] = useState<string | null>(null);
  const [adminGranted, setAdminGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verifyRole = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const [{ data: roleRow, error: roleError }, { data: hasRole, error: accessError }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
        supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }),
      ]);

      if (roleError) throw roleError;
      if (accessError) throw accessError;

      setBackendRole(roleRow?.role ?? null);
      setAdminGranted(Boolean(hasRole));
    } catch (err: any) {
      setError(err?.message || "Could not verify your backend role.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyRole();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20 px-6 sm:px-10 lg:px-16 max-w-4xl mx-auto space-y-8">
        <header className="space-y-3">
          <p className="section-eyebrow">Security</p>
          <h1 className="font-display text-foreground">Admin role verification</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Check your current backend role and whether this account is allowed to open the admin dashboard.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Backend role</p>
                <p className="text-xl font-display text-foreground">
                  {loading ? "Checking..." : backendRole ?? role ?? "No role found"}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="text-foreground font-medium">{user?.email}</span>
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${adminGranted ? "bg-primary/10" : "bg-destructive/10"}`}>
                {adminGranted ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Admin access to /admin</p>
                <p className="text-xl font-display text-foreground">{loading ? "Checking..." : adminGranted ? "Granted" : "Not granted"}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Verifying access rights..."
                : adminGranted
                  ? "This account should be allowed into the admin dashboard."
                  : "This account will be redirected away from /admin until admin rights are assigned."}
            </p>
          </div>
        </section>

        <section className="glass-card p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="font-body font-semibold text-foreground">Verification details</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Auth context role: <span className="text-foreground">{role ?? "Not loaded"}</span></li>
                <li>• Backend role row: <span className="text-foreground">{loading ? "Checking..." : backendRole ?? "Missing"}</span></li>
                <li>• Admin permission result: <span className="text-foreground">{loading ? "Checking..." : adminGranted ? "Allowed" : "Blocked"}</span></li>
              </ul>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={verifyRole} variant="outline" className="gap-2 rounded-full border-border text-muted-foreground hover:text-foreground">
              <RefreshCw className="w-4 h-4" /> Refresh check
            </Button>
            <Link to="/dashboard">
              <Button variant="outline" className="rounded-full border-border text-muted-foreground hover:text-foreground">
                Back to dashboard
              </Button>
            </Link>
            {adminGranted && (
              <Link to="/admin">
                <Button className="gap-2 rounded-full">
                  Open admin <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RoleVerification;