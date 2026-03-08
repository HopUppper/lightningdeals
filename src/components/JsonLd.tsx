interface JsonLdProps {
  data: Record<string, any>;
}

const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export default JsonLd;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lightning Deals",
  url: "https://lightningdeals.lovable.app",
  logo: "https://lightningdeals.lovable.app/favicon.png",
  description: "Premium digital subscriptions at unbeatable prices with instant WhatsApp delivery.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: [],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Lightning Deals",
  url: "https://lightningdeals.lovable.app",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://lightningdeals.lovable.app/categories?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const productSchema = (product: any) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.logo_url,
  brand: { "@type": "Brand", name: "Lightning Deals" },
  offers: {
    "@type": "Offer",
    price: product.price_discounted,
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    seller: { "@type": "Organization", name: "Lightning Deals" },
  },
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});
