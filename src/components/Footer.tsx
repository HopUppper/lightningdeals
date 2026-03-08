import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";

const Footer = () => (
  <footer className="bg-foreground/[0.02] border-t border-border/50">
    <div className="container-tight section-padding pb-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="mb-4">
            <BrandLogo />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Premium software subscriptions at unbeatable prices. Trusted by 10,000+ customers worldwide.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <div className="space-y-2.5">
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
          <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Categories</h4>
          <div className="space-y-2.5">
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
          <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Support</h4>
          <div className="space-y-2.5">
            {[
              { to: "/help", label: "Help Center" },
              { to: "/faq", label: "FAQ" },
              { to: "/contact", label: "Contact Us" },
            ].map((l) => (
              <Link key={l.to + l.label} to={l.to} className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="section-divider mb-6" />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs text-muted-foreground">© 2026 Lightning Deals. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">Powered with ⚡</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
