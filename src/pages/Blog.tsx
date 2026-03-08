import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, author, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      setPosts(data ?? []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog — Lightning Deals | Tips, Guides & Deals"
        description="Read our latest articles about digital subscriptions, productivity tools, and how to save money on premium software."
      />
      <Navbar />
      <main className="pt-28 pb-20 px-6 sm:px-10 lg:px-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="section-eyebrow mb-3">Blog</p>
          <h1 className="font-display text-foreground mb-3">insights & guides</h1>
          <p className="text-muted-foreground font-body max-w-xl mb-12">
            Tips on saving money, getting the most from your subscriptions, and staying productive.
          </p>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-body">No articles published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link to={`/blog/${post.slug}`} className="glass-card p-0 overflow-hidden group flex flex-col h-full">
                    {post.cover_image ? (
                      <div className="aspect-video bg-secondary overflow-hidden">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-3">
                        <Calendar className="w-3 h-3" />
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "Draft"}
                        <span className="mx-1">·</span>
                        <span>{post.author}</span>
                      </div>
                      <h2 className="font-display font-bold text-foreground text-lg leading-snug group-hover:text-accent transition-colors mb-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground font-body line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-xs text-accent font-semibold font-body group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Blog;
