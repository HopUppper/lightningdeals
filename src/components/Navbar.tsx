import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, role, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container-tight flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-primary-gradient flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
            PB
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Paisa Baazi
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/cart" className="relative p-2 rounded-xl hover:bg-secondary transition-colors">
            <ShoppingCart className="w-5 h-5 text-foreground" />
          </Link>
          {user ? (
            <>
              <Link
                to={role === "admin" ? "/admin" : "/dashboard"}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {role === "admin" ? "Admin Panel" : "Dashboard"}
              </Link>
              <button
                onClick={signOut}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link to="/categories" className="btn-primary-gradient text-sm py-2 px-5 inline-block">
                Browse Plans
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <Link to="/cart" onClick={() => setOpen(false)} className="text-sm font-medium text-muted-foreground">
                  Cart
                </Link>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-muted-foreground">
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
