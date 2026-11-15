import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

// Streams stored files after re-checking publication on every request, so
// unpublishing takes effect immediately (no long-lived signed links).
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const deny = () => new Response("Arquivo indisponível.", { status: 404, headers: { "Cache-Control": "no-store" } });

export const Route = createFileRoute("/api/files/$kind/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { kind, id } = params;
        if (!UUID.test(id) || !["document", "content", "site"].includes(kind)) return deny();
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const admin = supabaseAdmin as any;
        let bucket: string;
        let path: string | null = null;

        if (kind === "site") {
          const { data } = await admin.from("site_sections").select("media_url,is_active").eq("id", id).maybeSingle();
          if (!data?.is_active || !data.media_url?.startsWith("storage:")) return deny();
          bucket = "concursenf-site";
          path = data.media_url.slice("storage:".length);
        } else {
          const token = request.headers.get("authorization")?.replace(/^Bearer /, "");
          if (!token || token.split(".").length !== 3) return new Response("Unauthorized", { status: 401 });
          const client = createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
            auth: { persistSession: false, autoRefreshToken: false },
          });
          const { data: claims, error } = await client.auth.getClaims(token);
          if (error || !claims?.claims?.sub) return new Response("Unauthorized", { status: 401 });
          const table = kind === "document" ? "material_documents" : "exam_content_items";
          const { data } = await admin.from(table).select("storage_path,published").eq("id", id).maybeSingle();
          if (data?.published !== true || !data.storage_path) return deny();
          bucket = "concursenf-materiais";
          path = data.storage_path;
        }

        const { data: file, error } = await admin.storage.from(bucket).download(path);
        if (error || !file) return deny();
        return new Response(file.stream(), {
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "Cache-Control": "private, no-store",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
