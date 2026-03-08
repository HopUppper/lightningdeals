import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  expiresAt: string;
  className?: string;
}

const CountdownTimer = ({ expiresAt, className = "" }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0, expired: false });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) return { h: 0, m: 0, s: 0, expired: true };
      return {
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        expired: false,
      };
    };
    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (timeLeft.expired) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className={`inline-flex items-center gap-2 text-sm ${className}`}>
      <Clock className="w-4 h-4 text-destructive animate-pulse" />
      <span className="text-destructive font-display font-bold">
        Deal ends in {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
      </span>
    </div>
  );
};

export default CountdownTimer;
