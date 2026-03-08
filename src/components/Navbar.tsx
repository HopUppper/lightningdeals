import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import BrandLogo from "@/components/BrandLogo";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role, signOut } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-nav shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-tight flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <BrandLogo size="sm" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium px-3.5 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === l.to
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-secondary/60 transition-all duration-200 group">
            <ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          {user ? (
            <>
              <Link
                to={role === "admin" ? "/admin" : "/dashboard"}
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/60 transition-all duration-200"
              >
                {role === "admin" ? "Admin" : "Dashboard"}
              </Link>
              <button
                onClick={signOut}
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/60 transition-all duration-200 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground px-3.5 py-2 rounded-lg hover:bg-secondary/60 transition-all duration-200">
                Login
              </Link>
              <Link to="/categories" className="btn-primary-gradient text-sm py-2 px-5 inline-block">
                Browse Plans
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/cart" className="relative p-2">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="p-2 rounded-lg hover:bg-secondary/60 transition-colors" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-border/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`block text-sm font-medium py-2.5 px-3 rounded-lg transition-colors ${
                      location.pathname === l.to ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 mt-2 border-t border-border/50 space-y-1">
                {user ? (
                  <>
                    <Link to={role === "admin" ? "/admin" : "/dashboard"} onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground py-2.5 px-3 rounded-lg hover:bg-secondary/60">
                      {role === "admin" ? "Admin Panel" : "Dashboard"}
                    </Link>
                    <button onClick={() => { signOut(); setOpen(false); }} className="block w-full text-left text-sm font-medium text-muted-foreground py-2.5 px-3 rounded-lg hover:bg-secondary/60">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground py-2.5 px-3 rounded-lg hover:bg-secondary/60">
                      Login
                    </Link>
                    <Link to="/categories" onClick={() => setOpen(false)} className="block text-center btn-primary-gradient text-sm py-2.5 mt-2">
                      Browse Plans
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
