import { Zap } from "lucide-react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: "w-5 h-5", text: "text-sm" },
  md: { icon: "w-5 h-5", text: "text-base" },
  lg: { icon: "w-6 h-6", text: "text-lg" },
};

const BrandLogo = ({ size = "md", showText = true, className = "" }: BrandLogoProps) => {
  const s = sizeMap[size];
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Zap className={`${s.icon} text-accent fill-accent`} />
      {showText && (
        <span className={`font-body font-semibold ${s.text} text-foreground tracking-tight`}>
          Lightning Deals
        </span>
      )}
    </span>
  );
};

export default BrandLogo;
