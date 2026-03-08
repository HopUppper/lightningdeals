import { memo, useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform, MotionValue } from "framer-motion";

// CRED-style easing curves
export const credEase = [0.22, 1, 0.36, 1] as const;
export const credSpring = { type: "spring" as const, damping: 30, stiffness: 200 };

// Scroll-triggered fade up (CRED signature)
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: credEase, delay },
  }),
};

// Stagger container
export const staggerContainer = (staggerDelay = 0.08) => ({
  hidden: {},
  visible: { transition: { staggerChildren: staggerDelay, delayChildren: 0.1 } },
});

// Scale reveal for cards
export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: credEase, delay },
  }),
};

// Slide in from side
export const slideIn = (direction: "left" | "right" = "left") => ({
  hidden: { opacity: 0, x: direction === "left" ? -40 : 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: credEase },
  },
});

// Animated counter (CRED-style number reveal)
export const AnimatedCounter = memo(({ value, suffix = "", prefix = "", duration = 2 }: {
  value: number; suffix?: string; prefix?: string; duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const end = start + duration * 1000;
    const step = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / (end - start), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayed(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return <span ref={ref}>{prefix}{displayed.toLocaleString()}{suffix}</span>;
});

AnimatedCounter.displayName = "AnimatedCounter";

// Magnetic hover effect wrapper
export const MagneticHover = memo(({ children, strength = 0.3 }: {
  children: React.ReactNode; strength?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPosition({ x, y });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", damping: 15, stiffness: 150 }}
    >
      {children}
    </motion.div>
  );
});

MagneticHover.displayName = "MagneticHover";

// Reveal on scroll wrapper
export const ScrollReveal = memo(({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) => (
  <motion.div
    variants={fadeUpVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    custom={delay}
    className={className}
  >
    {children}
  </motion.div>
));

ScrollReveal.displayName = "ScrollReveal";
