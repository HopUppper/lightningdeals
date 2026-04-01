export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          order_id: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          order_id?: string | null
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          order_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          min_order_amount: number | null
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount?: number | null
          used_count?: number
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          created_at: string
          details: string | null
          error_type: string
          id: string
          message: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: string | null
          error_type?: string
          id?: string
          message?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: string | null
          error_type?: string
          id?: string
          message?: string
          user_id?: string | null
        }
        Relationships: []
      }
      order_status_history: {
        Row: {
          created_at: string
          id: string
          note: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_code: string | null
          coupon_discount: number | null
          created_at: string
          customer_country: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          fulfillment_notes: string | null
          id: string
          invoice_url: string | null
          notes: string | null
          order_status: Database["public"]["Enums"]["order_status"]
          payment_amount: number
          payment_id: string | null
          payment_status: string
          product_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          coupon_code?: string | null
          coupon_discount?: number | null
          created_at?: string
          customer_country?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          fulfillment_notes?: string | null
          id?: string
          invoice_url?: string | null
          notes?: string | null
          order_status?: Database["public"]["Enums"]["order_status"]
          payment_amount?: number
          payment_id?: string | null
          payment_status?: string
          product_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          coupon_code?: string | null
          coupon_discount?: number | null
          created_at?: string
          customer_country?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          fulfillment_notes?: string | null
          id?: string
          invoice_url?: string | null
          notes?: string | null
          order_status?: Database["public"]["Enums"]["order_status"]
          payment_amount?: number
          payment_id?: string | null
          payment_status?: string
          product_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          buying_price: number
          category_id: string | null
          color: string | null
          created_at: string
          delivery: string | null
          description: string | null
          duration: string | null
          features: string[] | null
          id: string
          is_active: boolean
          logo_url: string | null
          long_description: string | null
          name: string
          offer_badge: string | null
          offer_expires_at: string | null
          offer_label: string | null
          price_discounted: number
          price_original: number
          slug: string
          updated_at: string
        }
        Insert: {
          buying_price?: number
          category_id?: string | null
          color?: string | null
          created_at?: string
          delivery?: string | null
          description?: string | null
          duration?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          long_description?: string | null
          name: string
          offer_badge?: string | null
          offer_expires_at?: string | null
          offer_label?: string | null
          price_discounted?: number
          price_original?: number
          slug: string
          updated_at?: string
        }
        Update: {
          buying_price?: number
          category_id?: string | null
          color?: string | null
          created_at?: string
          delivery?: string | null
          description?: string | null
          duration?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          long_description?: string | null
          name?: string
          offer_badge?: string | null
          offer_expires_at?: string | null
          offer_label?: string | null
          price_discounted?: number
          price_original?: number
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          location: string | null
          name: string
          phone: string | null
          referred_by: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          referred_by?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          referred_by?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          total_earned: number
          total_referrals: number
          user_id: string
          wallet_balance: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          total_earned?: number
          total_referrals?: number
          user_id: string
          wallet_balance?: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          total_earned?: number
          total_referrals?: number
          user_id?: string
          wallet_balance?: number
        }
        Relationships: []
      }
      referral_transactions: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          referred_id: string
          referrer_id: string
          reward_amount: number
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          referred_id: string
          referrer_id: string
          reward_amount?: number
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          referred_id?: string
          referrer_id?: string
          reward_amount?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "admin"
      order_status:
        | "pending"
        | "processing"
        | "delivered"
        | "cancelled"
        | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "admin"],
      order_status: [
        "pending",
        "processing",
        "delivered",
        "cancelled",
        "refunded",
      ],
    },
  },
} as const
