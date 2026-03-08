import { useState, useCallback } from "react";

interface ProductLogoProps {
  name: string;
  logoUrl?: string | null;
  color?: string | null;
  /** Tailwind size classes for the container, e.g. "w-12 h-12" */
  size?: string;
  /** Tailwind text size for fallback initial, e.g. "text-lg" */
  fontSize?: string;
  className?: string;
}

/**
 * Displays a product logo with automatic fallback chain:
 * 1. Custom/uploaded logo (logo_url from DB)
 * 2. Google Favicon API (extracted domain)
 * 3. Styled initial letter with brand color
 */
const ProductLogo = ({
  name,
  logoUrl,
  color,
  size = "w-12 h-12",
  fontSize = "text-lg",
  className = "",
}: ProductLogoProps) => {
  const [stage, setStage] = useState<"primary" | "google" | "initial">("primary");

  const extractDomain = useCallback((url: string): string | null => {
    // Extract domain from clearbit URL pattern: https://logo.clearbit.com/domain.com
    const clearbitMatch = url.match(/logo\.clearbit\.com\/(.+)/);
    if (clearbitMatch) return clearbitMatch[1];
    // Try generic URL
    try {
      return new URL(url).hostname;
    } catch {
      return null;
    }
  }, []);

  const handlePrimaryError = useCallback(() => {
    if (logoUrl) {
      const domain = extractDomain(logoUrl);
      if (domain) {
        setStage("google");
        return;
      }
    }
    setStage("initial");
  }, [logoUrl, extractDomain]);

  const handleGoogleError = useCallback(() => {
    setStage("initial");
  }, []);

  const containerClasses = `${size} rounded-2xl flex items-center justify-center shrink-0 overflow-hidden ${className}`;
  const brandColor = color || "hsl(var(--primary))";

  // Stage: initial letter fallback
  if (!logoUrl || stage === "initial") {
    return (
      <div
        className={`${containerClasses} text-primary-foreground font-display font-bold ${fontSize}`}
        style={{ backgroundColor: brandColor }}
      >
        {name?.[0] || "?"}
      </div>
    );
  }

  // Stage: Google Favicon fallback
  if (stage === "google") {
    const domain = extractDomain(logoUrl);
    const googleUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    return (
      <div className={`${containerClasses} bg-muted/30 p-1.5`}>
        <img
          src={googleUrl}
          alt={name}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={handleGoogleError}
        />
      </div>
    );
  }

  // Stage: primary logo (uploaded or clearbit)
  return (
    <div className={`${containerClasses} bg-muted/30 p-1.5`}>
      <img
        src={logoUrl}
        alt={name}
        className="w-full h-full object-contain"
        loading="lazy"
        onError={handlePrimaryError}
      />
    </div>
  );
};

export default ProductLogo;
