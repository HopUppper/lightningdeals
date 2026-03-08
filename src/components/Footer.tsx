import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";

const Footer = () => (
  <footer className="border-t border-border">
    <div className="container-tight px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <BrandLogo className="mb-5" />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-body">
            Premium software subscriptions at unbeatable prices. Trusted by 10,000+ customers.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-5">Quick Links</h4>
          <div className="space-y-3">
            {[
              { to: "/categories", label: "Browse Deals" },
              { to: "/about", label: "About Us" },
              { to: "/faq", label: "FAQ" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-body">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-5">Categories</h4>
          <div className="space-y-3">
            {[
              { to: "/categories/ai-tools", label: "AI Tools" },
              { to: "/categories/design-tools", label: "Design Tools" },
              { to: "/categories/developer-tools", label: "Developer Tools" },
              { to: "/categories/marketing-tools", label: "Marketing Tools" },
            ].map((c) => (
              <Link key={c.to} to={c.to} className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 font-body">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
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
        <p className="text-xs text-muted-foreground font-body">Powered with ⚡</p>
      </div>
    </div>
  </footer>
);

export default Footer;
