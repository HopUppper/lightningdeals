
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image text DEFAULT '',
  author text NOT NULL DEFAULT 'Lightning Deals',
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Everyone can read published posts
CREATE POLICY "Published posts are viewable by everyone"
ON public.blog_posts FOR SELECT
USING (is_published = true OR has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all posts
CREATE POLICY "Admins can manage blog posts"
ON public.blog_posts FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Auto-update updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed initial articles
INSERT INTO public.blog_posts (title, slug, excerpt, content, author, is_published, published_at) VALUES
(
  'Why Shared Subscriptions Save You Up to 90%',
  'why-shared-subscriptions-save-money',
  'Discover how shared digital subscriptions work and why they cost a fraction of the retail price without compromising on features.',
  E'## How Shared Subscriptions Work\n\nShared subscriptions allow multiple users to access premium software through legitimate group licensing. Instead of paying full retail price, you share the cost with others — getting the same features at a fraction of the price.\n\n### Key Benefits\n\n- **Massive Savings**: Save 70-90% compared to individual plans\n- **Full Features**: Access every feature the platform offers\n- **Instant Delivery**: Get your credentials within minutes via WhatsApp\n- **Genuine Licenses**: All subscriptions are authentic and verified\n\n### How It Works at Lightning Deals\n\n1. **Browse** our catalog of 50+ premium tools\n2. **Purchase** your subscription at the discounted price\n3. **Receive** your credentials instantly via WhatsApp\n4. **Enjoy** full access to the premium tool\n\n### Is It Legal?\n\nYes! Shared subscriptions operate under the platforms'' group or family licensing terms. We ensure all subscriptions comply with the respective service''s terms of use.\n\n### Popular Shared Subscriptions\n\n- **Canva Pro** — ₹149/year instead of ₹3,999/year\n- **ChatGPT Plus** — ₹499/year instead of ₹16,800/year\n- **Grammarly Premium** — ₹199/year instead of ₹12,000/year\n\nStart saving today by exploring our [deals catalog](/categories).',
  'Lightning Deals',
  true,
  now()
),
(
  'Top 10 Productivity Tools Every Student Needs in 2026',
  'top-10-productivity-tools-students-2026',
  'From note-taking to design, these 10 affordable tools will supercharge your academic performance without breaking the bank.',
  E'## Essential Tools for Modern Students\n\nBeing a student in 2026 means juggling assignments, projects, and deadlines. The right tools can make all the difference — and they don''t have to cost a fortune.\n\n### 1. Notion\nThe all-in-one workspace for notes, databases, and project management.\n\n### 2. Canva Pro\nCreate stunning presentations, posters, and social media graphics with ease.\n\n### 3. Grammarly Premium\nNever submit an assignment with grammatical errors again.\n\n### 4. ChatGPT Plus\nYour AI study buddy for research, brainstorming, and explanations.\n\n### 5. Adobe Creative Cloud\nIndustry-standard design tools for creative projects.\n\n### 6. Microsoft 365\nWord, Excel, PowerPoint — the essentials for every student.\n\n### 7. Spotify Premium\nFocus music and podcasts to power through study sessions.\n\n### 8. YouTube Premium\nAd-free learning videos and background play for lectures.\n\n### 9. Coursera Plus\nAccess thousands of courses from top universities.\n\n### 10. LinkedIn Premium\nBuild your professional network before graduation.\n\n### Save on All These Tools\n\nAt Lightning Deals, you can get shared subscriptions for most of these tools at **70-90% off** retail prices. [Browse our catalog](/categories) to start saving.',
  'Lightning Deals',
  true,
  now()
),
(
  'How to Spot Fake Subscription Sellers Online',
  'how-to-spot-fake-subscription-sellers',
  'Learn the red flags to watch for when buying digital subscriptions online and how Lightning Deals ensures authenticity.',
  E'## Protecting Yourself from Scams\n\nThe digital subscription market is booming, but so are the scams. Here''s how to identify legitimate sellers and avoid getting ripped off.\n\n### Red Flags to Watch For\n\n1. **Too Good to Be True Pricing** — If a lifetime Netflix subscription costs ₹50, it''s probably stolen credentials\n2. **No Customer Support** — Legitimate sellers offer responsive support\n3. **No Refund Policy** — Trustworthy businesses stand behind their products\n4. **Anonymous Sellers** — No business name, address, or contact information\n5. **Payment via Crypto Only** — Scammers avoid traceable payments\n\n### Why Lightning Deals is Different\n\n- **Transparent Pricing** — We explain exactly how shared subscriptions work\n- **24/7 WhatsApp Support** — Real humans available anytime\n- **Clear Refund Policy** — Full refund if we can''t deliver\n- **Verified Business** — Registered business with real contact details\n- **Secure Payments** — Razorpay-powered transactions with buyer protection\n\n### Our Guarantee\n\nEvery subscription sold on Lightning Deals is genuine and verified. If any issue arises, our support team resolves it within 24 hours — usually much faster.\n\n[Shop with confidence](/categories) at Lightning Deals.',
  'Lightning Deals',
  true,
  now()
);
