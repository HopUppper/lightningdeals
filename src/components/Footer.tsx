import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);

  useEffect(() => {
    supabase.from("categories").select("slug, name").order("name").limit(6).then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  return (
    <footer className="border-t border-border">
      <div className="container-tight px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <BrandLogo className="mb-5" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-body">
              Premium software subscriptions at unbeatable prices. Trusted by 10,000+ customers across India.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">⚡ Instant Delivery</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-secondary text-muted-foreground font-medium">24/7 Support</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-5">Quick Links</h4>
            <div className="space-y-3">
              {[
                { to: "/categories", label: "Browse Deals" },
                { to: "/about", label: "About Us" },
                { to: "/faq", label: "FAQ" },
                { to: "/contact", label: "Contact" },
                { to: "/help", label: "Help & Support" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-body">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Dynamic Categories */}
          <div>
            <h4 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-5">Categories</h4>
            <div className="space-y-3">
              {categories.length > 0 ? categories.map((c) => (
                <Link key={c.slug} to={`/categories/${c.slug}`} className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-body">
                  {c.name}
                </Link>
              )) : (
                <>
                  {["AI Tools", "Design Tools", "Developer Tools", "Marketing Tools"].map((name) => (
                    <span key={name} className="block text-sm text-muted-foreground/50 font-body">{name}</span>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-5">Legal</h4>
            <div className="space-y-3">
              {[
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms & Conditions" },
                { to: "/refund-policy", label: "Refund Policy" },
                { to: "/delivery-policy", label: "Delivery Policy" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-body">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="section-divider mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-body">© 2026 Lightning Deals. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/917695956938" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
              WhatsApp
            </a>
            <a href="mailto:sidhjain9002@gmail.com" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
              Email
            </a>
            <span className="text-xs text-muted-foreground font-body">Powered with ⚡</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
