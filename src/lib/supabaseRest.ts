/**
 * Direct REST API helper for public Supabase queries.
 * Bypasses the Supabase JS client which can hang during auth initialization.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

interface QueryOptions {
  table: string;
  select?: string;
  filters?: Record<string, string>;
  order?: string;
  limit?: number;
  range?: [number, number];
  count?: boolean;
}

export async function queryPublic<T = any>(options: QueryOptions): Promise<{ data: T[]; count: number | null; error: any }> {
  const { table, select, filters, order, limit, range, count } = options;

  const params = new URLSearchParams();
  if (select) params.set("select", select);
  if (order) params.set("order", order);
  if (limit) params.set("limit", String(limit));
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      params.set(key, value);
    });
  }

  const reqHeaders: Record<string, string> = { ...headers };
  if (range) {
    reqHeaders["Range"] = `${range[0]}-${range[1]}`;
  }
  if (count) {
    reqHeaders["Prefer"] = "count=exact";
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
      headers: reqHeaders,
    });

    if (!res.ok) {
      const errorBody = await res.text();
      return { data: [], count: null, error: { message: errorBody, status: res.status } };
    }

    const data = await res.json();
    let totalCount: number | null = null;
    if (count) {
      const contentRange = res.headers.get("content-range");
      if (contentRange) {
        const total = contentRange.split("/")[1];
        totalCount = total === "*" ? null : parseInt(total, 10);
      }
    }

    return { data: data as T[], count: totalCount, error: null };
  } catch (e: any) {
    return { data: [], count: null, error: { message: e.message } };
  }
}

export async function queryPublicSingle<T = any>(options: Omit<QueryOptions, "range" | "count" | "limit">): Promise<{ data: T | null; error: any }> {
  const result = await queryPublic<T>({ ...options, limit: 1 });
  return { data: result.data.length > 0 ? result.data[0] : null, error: result.error };
}
