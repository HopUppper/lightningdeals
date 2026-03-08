import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
const Footer = () => (
  <footer className="bg-foreground/[0.03] border-t border-border">
    <div className="container-tight section-padding pb-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg btn-primary-gradient flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
              PB
            </div>
            <span className="font-display font-bold text-lg text-foreground">Paisa Baazi</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Premium software subscriptions at unbeatable prices. Trusted by 10,000+ customers.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
          <div className="space-y-2">
            {[
              { to: "/categories", label: "Browse Plans" },
              { to: "/about", label: "About Us" },
              { to: "/faq", label: "FAQ" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-4">Categories</h4>
          <div className="space-y-2">
            {["Business Tools", "Design Tools", "AI Tools", "Trading Tools"].map((c) => (
              <span key={c} className="block text-sm text-muted-foreground">{c}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-4">Support</h4>
          <div className="space-y-2">
            {[
              { to: "/help", label: "Help Center" },
              { to: "/faq", label: "FAQ" },
              { to: "/contact", label: "Contact Us" },
            ].map((l) => (
              <Link key={l.to + l.label} to={l.to} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border pt-6 text-center">
        <p className="text-xs text-muted-foreground">© 2026 Paisa Baazi. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
