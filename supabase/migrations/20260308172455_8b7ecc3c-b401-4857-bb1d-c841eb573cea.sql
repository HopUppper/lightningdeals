
-- Fix categories: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix products: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Active products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

CREATE POLICY "Active products are viewable by everyone"
  ON public.products FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- Fix coupons
DROP POLICY IF EXISTS "Anyone can read active coupons by code" ON public.coupons;
CREATE POLICY "Anyone can read active coupons by code"
  ON public.coupons FOR SELECT
  USING (is_active = true);

-- Fix error_logs insert
DROP POLICY IF EXISTS "Anyone can insert error logs" ON public.error_logs;
CREATE POLICY "Anyone can insert error logs"
  ON public.error_logs FOR INSERT
  WITH CHECK (true);

-- Fix blog_posts
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON public.blog_posts;
CREATE POLICY "Published posts are viewable by everyone"
  ON public.blog_posts FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'::app_role));
