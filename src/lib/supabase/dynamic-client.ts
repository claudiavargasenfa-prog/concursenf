import { supabase } from "@/integrations/supabase/client";

export type DynamicDatabaseError = { message: string };

export type DynamicDatabaseResult = {
  data: unknown;
  error: DynamicDatabaseError | null;
  count: number | null;
};

export type DynamicQuery = PromiseLike<DynamicDatabaseResult> & {
  select(columns: string, options?: { count?: "exact" | "planned" | "estimated"; head?: boolean }): DynamicQuery;
  eq(column: string, value: unknown): DynamicQuery;
  order(column: string, options?: { ascending?: boolean }): DynamicQuery;
  limit(count: number): DynamicQuery;
  maybeSingle(): Promise<DynamicDatabaseResult>;
  insert(values: Record<string, unknown>): DynamicQuery;
  upsert(values: Record<string, unknown>, options?: { onConflict?: string }): DynamicQuery;
};

export type DynamicSupabaseClient = {
  from(table: string): DynamicQuery;
  rpc(functionName: string, args?: Record<string, unknown>): PromiseLike<DynamicDatabaseResult>;
  storage: {
    from(bucket: string): {
      upload(
        path: string,
        file: File,
        options?: { contentType?: string; upsert?: boolean },
      ): Promise<{ error: DynamicDatabaseError | null }>;
    };
  };
};

export const dynamicSupabase = supabase as unknown as DynamicSupabaseClient;
