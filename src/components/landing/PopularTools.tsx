import { motion } from "framer-motion";

const tools = [
  { name: "Canva Pro", color: "hsl(267, 60%, 55%)" },
  { name: "Adobe CC", color: "hsl(0, 80%, 50%)" },
  { name: "LinkedIn", color: "hsl(210, 80%, 45%)" },
  { name: "TradingView", color: "hsl(210, 60%, 40%)" },
  { name: "Notion", color: "hsl(0, 0%, 15%)" },
  { name: "ChatGPT", color: "hsl(160, 60%, 40%)" },
  { name: "Grammarly", color: "hsl(152, 60%, 40%)" },
  { name: "Figma", color: "hsl(13, 80%, 55%)" },
];

const PopularTools = () => (
  <section className="section-padding bg-secondary/50">
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

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex flex-col items-center gap-3 cursor-pointer"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-primary-foreground font-display font-bold text-lg"
              style={{ backgroundColor: tool.color }}
            >
              {tool.name[0]}
            </div>
            <span className="text-xs font-medium text-foreground text-center">{tool.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PopularTools;
