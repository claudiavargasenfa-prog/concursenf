import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BUCKET = "concursenf-materiais";

// Issues a short-lived link for a published file. Direct storage reads are admin-only,
// so every download goes through this check.
export const getMaterialFileUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ kind: z.enum(["document", "content"]), id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const table = data.kind === "document" ? "material_documents" : "exam_content_items";
    const { data: row, error } = await (context.supabase as any)
      .from(table).select("storage_path,published").eq("id", data.id).maybeSingle();
    if (error || !row?.storage_path || row.published !== true) throw new Error("Arquivo indisponível.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error: signError } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(row.storage_path, 120);
    if (signError || !signed?.signedUrl) throw new Error("Arquivo indisponível.");
    return { url: signed.signedUrl };
  });
