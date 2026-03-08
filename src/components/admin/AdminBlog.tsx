import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const emptyPost = { title: "", slug: "", excerpt: "", content: "", cover_image: "", author: "Lightning Deals", is_published: false };

const AdminBlog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [form, setForm] = useState(emptyPost);
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const openNew = () => {
    setEditingPost(null);
    setForm(emptyPost);
    setDialogOpen(true);
  };

  const openEdit = (post: any) => {
    setEditingPost(post);
    setForm({
      title: post.title, slug: post.slug, excerpt: post.excerpt,
      content: post.content, cover_image: post.cover_image || "",
      author: post.author, is_published: post.is_published,
    });
    setDialogOpen(true);
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);

    const payload = {
      ...form,
      published_at: form.is_published ? (editingPost?.published_at || new Date().toISOString()) : null,
    };

    if (editingPost) {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingPost.id);
      if (error) { toast.error("Failed to update"); setSaving(false); return; }
      toast.success("Post updated");
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Post created");
    }
    setSaving(false);
    setDialogOpen(false);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Post deleted");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-foreground text-lg">Blog Posts</h2>
        <Button onClick={openNew} className="gap-2 btn-primary-gradient" size="sm">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-body">No blog posts yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card p-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-body font-semibold text-foreground text-sm truncate">{post.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${post.is_published ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                    {post.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-body truncate">{post.excerpt}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Not published"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {post.is_published && (
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Eye className="w-4 h-4" />
                  </a>
                )}
                <button onClick={() => openEdit(post)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editingPost ? "Edit Post" : "New Post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    title: e.target.value,
                    slug: editingPost ? f.slug : generateSlug(e.target.value),
                  }));
                }}
                className="bg-secondary border-border"
                placeholder="Article title"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="bg-secondary border-border" placeholder="url-friendly-slug" />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} className="bg-secondary border-border" rows={2} placeholder="Short summary for listing cards" />
            </div>
            <div className="space-y-2">
              <Label>Content (Markdown)</Label>
              <Textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="bg-secondary border-border font-mono text-xs" rows={12} placeholder="## Your article content here..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cover Image URL</Label>
                <Input value={form.cover_image} onChange={(e) => setForm((f) => ({ ...f, cover_image: e.target.value }))} className="bg-secondary border-border" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} className="bg-secondary border-border" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm((f) => ({ ...f, is_published: v }))} />
              <Label>Publish</Label>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full btn-primary-gradient">
              {saving ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
