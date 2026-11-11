import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSiteContent<T extends Record<string, unknown>>(blockKey: string, fallback: T): T {
  const [content, setContent] = useState<T>(fallback);
  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await (supabase as any).from("site_content_blocks")
        .select("content").eq("block_key", blockKey).maybeSingle();
      if (active && !error && data?.content && typeof data.content === "object") {
        setContent({ ...fallback, ...data.content } as T);
      }
    }
    void load();
    return () => { active = false; };
  }, [blockKey]);
  return content;
}
