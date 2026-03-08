import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import TrustSection from "@/components/landing/TrustSection";
import TrendingDeals from "@/components/landing/TrendingDeals";
import Testimonials from "@/components/landing/Testimonials";
import CategoriesPreview from "@/components/landing/CategoriesPreview";
import WhatsAppCTA from "@/components/landing/WhatsAppCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import JsonLd, { organizationSchema, websiteSchema } from "@/components/JsonLd";

const Index = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Lightning Deals — Premium Subscriptions at Unbeatable Prices"
      description="Get premium digital subscriptions at unbeatable prices. Instant delivery via WhatsApp. 100% authentic. Trusted by 10,000+ customers."
      keywords="digital subscriptions, premium software, cheap subscriptions, instant delivery, WhatsApp delivery"
      url="https://lightningdeals.lovable.app"
    />
    <JsonLd data={organizationSchema} />
    <JsonLd data={websiteSchema} />
    <Navbar />
    <HeroSection />
    <HowItWorks />
    <TrendingDeals />
    <CategoriesPreview />
    <Testimonials />
    <TrustSection />
    <WhatsAppCTA />
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Index;
