import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import ProductLogo from "@/components/ProductLogo";

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
    <section className="section-padding bg-secondary/30">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Premium Tools</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mt-3">
            Popular Subscriptions
          </h2>
        </motion.div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
          {tools.slice(0, 16).map((tool, i) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/product/${tool.slug}`}
                className="glass-card p-3 flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="group-hover:scale-110 transition-transform duration-200">
                  <ProductLogo name={tool.name} logoUrl={tool.logo_url} color={tool.color} size="w-10 h-10" fontSize="text-sm" />
                </div>
                <span className="text-[10px] font-medium text-foreground text-center leading-tight line-clamp-1">
                  {tool.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTools;
