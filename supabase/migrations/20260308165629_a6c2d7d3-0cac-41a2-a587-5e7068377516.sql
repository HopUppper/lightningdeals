-- Re-create all missing triggers

-- 1. Auto-provision profile + role on new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Track order status changes
CREATE OR REPLACE TRIGGER trigger_log_order_status_change
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_order_status_change();

-- 3. Log initial order status on insert
CREATE OR REPLACE TRIGGER trigger_log_initial_order_status
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_initial_order_status();

-- 4. Notify admin on new order
CREATE OR REPLACE TRIGGER trigger_notify_admin_new_order
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.notify_admin_on_new_order();

-- 5. Auto-update updated_at on orders
CREATE OR REPLACE TRIGGER trigger_update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Auto-update updated_at on products
CREATE OR REPLACE TRIGGER trigger_update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Auto-update updated_at on profiles
CREATE OR REPLACE TRIGGER trigger_update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Auto-update updated_at on reviews
CREATE OR REPLACE TRIGGER trigger_update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Auto-update updated_at on blog_posts
CREATE OR REPLACE TRIGGER trigger_update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Process referral rewards on order payment
CREATE OR REPLACE TRIGGER trigger_referral_reward
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.process_referral_reward();