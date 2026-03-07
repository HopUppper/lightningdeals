import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import TrustSection from "@/components/landing/TrustSection";
import PopularTools from "@/components/landing/PopularTools";
import Testimonials from "@/components/landing/Testimonials";
import LimitedOffer from "@/components/landing/LimitedOffer";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <TrustSection />
    <HowItWorks />
    <PopularTools />
    <Testimonials />
    <LimitedOffer />
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Index;
