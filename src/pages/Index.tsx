import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import TrustSection from "@/components/landing/TrustSection";
import PopularTools from "@/components/landing/PopularTools";
import TrendingDeals from "@/components/landing/TrendingDeals";
import Testimonials from "@/components/landing/Testimonials";
import LimitedOffer from "@/components/landing/LimitedOffer";
import CategoriesPreview from "@/components/landing/CategoriesPreview";
import WhatsAppCTA from "@/components/landing/WhatsAppCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <LimitedOffer />
    <HowItWorks />
    <TrendingDeals />
    <CategoriesPreview />
    <PopularTools />
    <Testimonials />
    <TrustSection />
    <WhatsAppCTA />
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Index;
