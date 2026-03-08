import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, UserPlus, Zap, Shield, Clock, CheckCircle } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { motion } from "framer-motion";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(searchParams.get("ref") || "");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 w-full max-w-md text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-3">Check Your Email</h1>
          <p className="text-muted-foreground font-body leading-relaxed">
            We've sent a verification link to <strong className="text-foreground">{email}</strong>. Click the link to activate your account.
          </p>
          <Link to="/login" className="btn-primary-gradient inline-flex items-center gap-2 mt-8 px-8 py-3">
            Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  const perks = [
    { icon: Zap, title: "Instant Delivery", desc: "Get your subscriptions within 5 minutes" },
    { icon: Shield, title: "100% Genuine", desc: "Authentic keys & credentials guaranteed" },
    { icon: Clock, title: "24/7 Support", desc: "Dedicated WhatsApp support anytime" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/">
              <BrandLogo size="lg" showText />
            </Link>
          </div>

          <h1 className="text-3xl font-display font-bold text-foreground">Create account</h1>
          <p className="text-muted-foreground mt-2 font-body">Join Lightning Deals and start saving</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="h-12 bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 bg-secondary border-border pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 btn-primary-gradient text-base font-semibold" disabled={loading}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" /> Creating...</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" /> Create Account</>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>

      {/* Right panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,hsl(var(--accent)/0.1),transparent_60%)]" />
        <div className="relative z-10 max-w-md px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <BrandLogo size="lg" showText />
            <h2 className="font-display text-3xl text-foreground mt-8 leading-tight">
              Save up to <span className="text-accent">90%</span> on premium tools
            </h2>
            <p className="text-muted-foreground mt-4 font-body leading-relaxed">
              Get genuine subscriptions for your favorite productivity, design, and development tools at unbeatable prices.
            </p>
            <div className="mt-10 space-y-5">
              {perks.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <p.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
