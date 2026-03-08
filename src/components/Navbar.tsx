import { useState, useEffect, memo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import BrandLogo from "@/components/BrandLogo";
import GlobalSearch from "@/components/GlobalSearch";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

const Navbar = memo(() => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role, signOut } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);
  const toggleOpen = useCallback(() => setOpen(prev => !prev), []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-tight flex items-center justify-between h-16 px-6 sm:px-10 lg:px-16">
        <Link to="/" className="flex items-center">
          <BrandLogo size="sm" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-[13px] font-medium px-4 py-2 rounded-full transition-colors duration-300 ${
                location.pathname === l.to
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <GlobalSearch />
          <ThemeToggle />
          <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-secondary transition-colors duration-300 group">
            <ShoppingCart className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link
                to={role === "admin" ? "/admin" : "/dashboard"}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-full transition-colors duration-300"
              >
                {role === "admin" ? "Admin" : "Dashboard"}
              </Link>
              <button
                onClick={signOut}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-full transition-colors duration-300 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[13px] font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-full transition-colors duration-300">
                Login
              </Link>
              <Link to="/categories" className="btn-primary !py-2 !px-5 !text-[13px]">
                Browse Deals
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-1">
          <GlobalSearch />
          <ThemeToggle />
          <Link to="/cart" className="relative p-2">
            <ShoppingCart className="w-4 h-4 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] flex items-center justify-center font-bold">{totalItems}</span>
            )}
          </Link>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors" onClick={toggleOpen}>
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
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`block text-sm font-medium py-3 px-4 rounded-lg transition-colors ${
                    location.pathname === l.to ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-border space-y-1">
                {user ? (
                  <>
                    <Link to={role === "admin" ? "/admin" : "/dashboard"} onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground py-3 px-4 rounded-lg hover:text-foreground">
                      {role === "admin" ? "Admin Panel" : "Dashboard"}
                    </Link>
                    <button onClick={() => { signOut(); setOpen(false); }} className="block w-full text-left text-sm font-medium text-muted-foreground py-3 px-4 rounded-lg hover:text-foreground">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground py-3 px-4 rounded-lg hover:text-foreground">Login</Link>
                    <Link to="/categories" onClick={() => setOpen(false)} className="block text-center btn-primary !py-3 mt-4">Browse Deals</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
