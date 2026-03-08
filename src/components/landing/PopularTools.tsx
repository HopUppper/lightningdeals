import { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import ProductLogo from "@/components/ProductLogo";

const ToolItem = memo(({ tool, i }: { tool: any; i: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ delay: i * 0.02 }}
  >
    <Link
      to={`/product/${tool.slug}`}
      className="glass-card p-4 flex flex-col items-center gap-2.5 cursor-pointer group"
    >
      <div className="group-hover:scale-110 transition-transform duration-200 will-change-transform">
        <ProductLogo name={tool.name} logoUrl={tool.logo_url} color={tool.color} size="w-10 h-10" fontSize="text-sm" />
      </div>
      <span className="text-[11px] font-medium text-foreground text-center leading-tight line-clamp-1">{tool.name}</span>
    </Link>
  </motion.div>
));

ToolItem.displayName = "ToolItem";

const PopularTools = () => {
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("products")
        .select("name, slug, logo_url, color")
        .eq("is_active", true)
        .limit(16);
      setTools(data ?? []);
    };
    fetch();
  }, []);

  if (tools.length === 0) return null;

  return (
    <section className="section-padding bg-secondary/20 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />

      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25 }}
          className="text-center mb-14"
        >
          <span className="section-eyebrow">Premium Tools</span>
          <h2 className="section-title">Popular Subscriptions</h2>
        </motion.div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
          {tools.slice(0, 16).map((tool, i) => (
            <ToolItem key={tool.slug} tool={tool} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTools;
