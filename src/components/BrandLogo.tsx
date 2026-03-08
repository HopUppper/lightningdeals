import { Zap } from "lucide-react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: "w-7 h-7", bolt: "w-4 h-4", text: "text-base" },
  md: { icon: "w-8 h-8", bolt: "w-4.5 h-4.5", text: "text-lg" },
  lg: { icon: "w-10 h-10", bolt: "w-5 h-5", text: "text-xl" },
};

const BrandLogo = ({ size = "md", showText = true, className = "" }: BrandLogoProps) => {
  const s = sizeMap[size];
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`${s.icon} rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shrink-0`}>
        <Zap className={`${s.bolt} text-accent-foreground fill-accent-foreground`} />
      </span>
      {showText && (
        <span className={`font-display font-bold ${s.text} text-foreground`}>
          Lightning Deals
        </span>
      )}
    </span>
  );
};

export default BrandLogo;
