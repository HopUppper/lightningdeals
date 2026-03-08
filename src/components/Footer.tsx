import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import { Shield, Zap } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground/[0.02] border-t border-border/50">
    <div className="container-tight px-5 sm:px-8 lg:px-10 py-16 sm:py-20">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
        <div>
          <div className="mb-5">
            <BrandLogo />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Premium software subscriptions at unbeatable prices. Trusted by 10,000+ customers worldwide.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-medium text-primary">
              <Shield className="w-3 h-3" /> Secure Orders
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-xs font-medium text-accent-foreground">
              <Zap className="w-3 h-3" /> Fast Delivery
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-5 text-xs uppercase tracking-[0.15em]">Quick Links</h4>
          <div className="space-y-3">
            {[
              { to: "/categories", label: "Browse Plans" },
              { to: "/about", label: "About Us" },
              { to: "/faq", label: "FAQ" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-5 text-xs uppercase tracking-[0.15em]">Categories</h4>
          <div className="space-y-3">
            {[
              { to: "/categories/ai-tools", label: "AI Tools" },
              { to: "/categories/design-tools", label: "Design Tools" },
              { to: "/categories/developer-tools", label: "Developer Tools" },
              { to: "/categories/marketing-tools", label: "Marketing Tools" },
            ].map((c) => (
              <Link key={c.to} to={c.to} className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-5 text-xs uppercase tracking-[0.15em]">Legal & Support</h4>
          <div className="space-y-3">
            {[
              { to: "/privacy-policy", label: "Privacy Policy" },
              { to: "/terms", label: "Terms & Conditions" },
              { to: "/refund-policy", label: "Refund Policy" },
              { to: "/delivery-policy", label: "Delivery Policy" },
              { to: "/contact", label: "Contact Us" },
            ].map((l) => (
              <Link key={l.to + l.label} to={l.to} className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="section-divider mb-8" />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">© 2026 Lightning Deals. All rights reserved.</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Trusted Marketplace</span>
          <span>Powered with ⚡</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
