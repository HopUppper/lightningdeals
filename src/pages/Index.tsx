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

const Index = () => (
  <div className="min-h-screen bg-background">
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
