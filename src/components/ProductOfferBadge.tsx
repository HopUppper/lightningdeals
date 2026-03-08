import { Badge } from "@/components/ui/badge";

interface ProductOfferBadgeProps {
  product: {
    offer_badge?: string;
    offer_label?: string;
    offer_expires_at?: string | null;
  };
  fallbackDiscount?: number;
}

const ProductOfferBadge = ({ product, fallbackDiscount }: ProductOfferBadgeProps) => {
  const isExpired = product.offer_expires_at && new Date(product.offer_expires_at) < new Date();

  // Don't show badge if offer has expired
  if (isExpired) return null;

  const badgeText = product.offer_badge || (fallbackDiscount && fallbackDiscount > 0 ? `${fallbackDiscount}% OFF` : "");

  if (!badgeText) return null;

  return (
    <div className="absolute top-4 right-4 flex flex-col items-end gap-1 z-10">
      <Badge className="bg-accent text-accent-foreground font-semibold text-xs shadow-sm">
        {badgeText}
      </Badge>
      {product.offer_label && (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
          {product.offer_label}
        </span>
      )}
    </div>
  );
};

export default ProductOfferBadge;
