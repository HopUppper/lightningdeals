import { useState, useCallback, memo } from "react";

interface ProductLogoProps {
  name: string;
  logoUrl?: string | null;
  color?: string | null;
  size?: string;
  fontSize?: string;
  className?: string;
}

const ProductLogo = memo(({
  name,
  logoUrl,
  color,
  size = "w-12 h-12",
  fontSize = "text-lg",
  className = "",
}: ProductLogoProps) => {
  const [stage, setStage] = useState<"primary" | "google" | "initial">("primary");

  const extractDomain = useCallback((url: string): string | null => {
    const clearbitMatch = url.match(/logo\.clearbit\.com\/(.+)/);
    if (clearbitMatch) return clearbitMatch[1];
    try { return new URL(url).hostname; } catch { return null; }
  }, []);

  const handlePrimaryError = useCallback(() => {
    if (logoUrl) {
      const domain = extractDomain(logoUrl);
      if (domain) { setStage("google"); return; }
    }
    setStage("initial");
  }, [logoUrl, extractDomain]);

  const handleGoogleError = useCallback(() => setStage("initial"), []);

  const containerClasses = `${size} rounded-2xl flex items-center justify-center shrink-0 overflow-hidden ${className}`;
  const brandColor = color || "hsl(var(--primary))";

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

  if (stage === "google") {
    const domain = extractDomain(logoUrl);
    return (
      <div className={`${containerClasses} bg-muted/30 p-1.5`}>
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
          alt={name}
          className="w-full h-full object-contain"
          loading="lazy"
          decoding="async"
          onError={handleGoogleError}
        />
      </div>
    );
  }

  return (
    <div className={`${containerClasses} bg-muted/30 p-1.5`}>
      <img
        src={logoUrl}
        alt={name}
        className="w-full h-full object-contain"
        loading="lazy"
        decoding="async"
        onError={handlePrimaryError}
      />
    </div>
  );
});

ProductLogo.displayName = "ProductLogo";
export default ProductLogo;
