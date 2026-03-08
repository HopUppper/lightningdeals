import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, ChevronRight } from "lucide-react";

/** Simple markdown-to-HTML: headings, bold, links, lists, paragraphs */
const renderMarkdown = (md: string) => {
  const lines = md.split("\n");
  const html: string[] = [];
  let inList = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) { html.push("</ul>"); inList = false; }
      return;
    }
    // Headings
    if (trimmed.startsWith("### ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h3 class="text-lg font-display font-bold text-foreground mt-8 mb-3">${inline(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("## ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h2 class="text-xl font-display font-bold text-foreground mt-10 mb-4">${inline(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("- ")) {
      if (!inList) { html.push('<ul class="list-disc pl-6 space-y-2 my-4">'); inList = true; }
      html.push(`<li class="text-muted-foreground font-body text-[15px] leading-relaxed">${inline(trimmed.slice(2))}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { html.push('<ol class="list-decimal pl-6 space-y-2 my-4">'); inList = true; }
      html.push(`<li class="text-muted-foreground font-body text-[15px] leading-relaxed">${inline(trimmed.replace(/^\d+\.\s/, ''))}</li>`);
    } else {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<p class="text-muted-foreground font-body text-[15px] leading-relaxed mb-4">${inline(trimmed)}</p>`);
    }
  });
  if (inList) html.push("</ul>");
  return html.join("\n");
};

const inline = (text: string) =>
  text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-accent hover:underline">$1</a>');

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug || "")
        .eq("is_published", true)
        .maybeSingle();
      setPost(data);

      // Fetch related posts
      if (data) {
        const { data: related } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, published_at")
          .eq("is_published", true)
          .neq("id", data.id)
          .order("published_at", { ascending: false })
          .limit(3);
        setRelatedPosts(related ?? []);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-20 px-6 max-w-3xl mx-auto text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Article not found</h1>
          <Link to="/blog" className="btn-primary">Back to Blog</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    publisher: {
      "@type": "Organization",
      name: "Lightning Deals",
      url: "https://lightningdeals.lovable.app",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`${post.title} — Lightning Deals Blog`} description={post.excerpt} />
      <JsonLd data={articleSchema} />
      <Navbar />
      <main className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-secondary">
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-body mb-6">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                : "Draft"}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-8">
            {post.title}
          </h1>

          {/* Content */}
          <article
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          {/* Back */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-accent font-semibold hover:gap-3 transition-all font-body">
              <ArrowLeft className="w-4 h-4" /> Back to all articles
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display font-bold text-foreground text-xl mb-6">More articles</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} to={`/blog/${rp.slug}`} className="glass-card p-5 group">
                    <p className="text-xs text-muted-foreground font-body mb-2">
                      {rp.published_at ? new Date(rp.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
                    </p>
                    <h3 className="font-display font-bold text-foreground text-sm leading-snug group-hover:text-accent transition-colors">
                      {rp.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BlogPost;
