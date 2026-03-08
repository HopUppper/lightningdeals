import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000; // 1 minute

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, role, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const attemptsRef = useRef(0);
  const lockoutUntilRef = useRef(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting
    const now = Date.now();
    if (now < lockoutUntilRef.current) {
      const secsLeft = Math.ceil((lockoutUntilRef.current - now) / 1000);
      toast({ title: "Too many attempts", description: `Please wait ${secsLeft} seconds before trying again.`, variant: "destructive" });
      return;
    }

    if (!email.trim() || !password.trim()) {
      toast({ title: "Missing fields", description: "Please enter your email and password.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      attemptsRef.current++;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        lockoutUntilRef.current = Date.now() + LOCKOUT_MS;
        attemptsRef.current = 0;
        toast({ title: "Account locked temporarily", description: "Too many failed attempts. Please wait 1 minute.", variant: "destructive" });
      } else {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      }
    } else {
      attemptsRef.current = 0;
      toast({ title: "Welcome back!" });
    }
  };

  if (user && role) {
    navigate(role === "admin" ? "/admin" : "/dashboard", { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <BrandLogo size="lg" showText={false} />
          </Link>
          <h1 className="text-2xl font-display font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full btn-primary-gradient" disabled={loading}>
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
