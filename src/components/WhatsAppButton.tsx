import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const WhatsAppButton = () => {
  const [showLabel, setShowLabel] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLabel(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href="https://wa.me/917695956938?text=Hi%2C%20I%20need%20help%20with%20my%20subscription%20order."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 group"
      aria-label="Chat on WhatsApp"
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
    >
      <span
        className={`px-3 py-1.5 rounded-lg bg-background/90 backdrop-blur-sm border border-border text-xs font-medium text-foreground shadow-lg transition-all duration-300 whitespace-nowrap ${
          showLabel ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        Chat with us
      </span>
      <div className="w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </div>
    </a>
  );
};

export default WhatsAppButton;
