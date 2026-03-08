import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,hsl(var(--accent)/0.06),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-md"
      >
        <Link to="/" className="inline-block mb-10">
          <BrandLogo size="sm" showText />
        </Link>

        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-[120px] sm:text-[160px] font-display font-bold leading-none gradient-text-gold"
        >
          404
        </motion.p>

        <h1 className="text-2xl font-display font-semibold text-foreground mt-4">Page not found</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          The page <code className="text-sm bg-secondary px-2 py-0.5 rounded text-foreground">{location.pathname}</code> doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-10 justify-center">
          <Link to="/" className="btn-primary gap-2">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link to="/categories" className="btn-secondary gap-2">
            <Search className="w-4 h-4" /> Browse Products
          </Link>
        </div>

        <button onClick={() => window.history.back()} className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Go back
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
