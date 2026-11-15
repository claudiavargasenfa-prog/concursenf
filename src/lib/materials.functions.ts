import { supabase } from "@/integrations/supabase/client";

// Downloads a published file through the app server, which re-checks
// publication on every request. Returns a local blob URL (no shareable link).
export async function getMaterialFileUrl({ data }: { data: { kind: "document" | "content"; id: string } }) {
  const { data: session } = await supabase.auth.getSession();
  const token = session.session?.access_token;
  if (!token) throw new Error("Entre na sua conta para abrir este arquivo.");
  const res = await fetch(`/api/files/${data.kind}/${data.id}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Arquivo indisponível.");
  return { url: URL.createObjectURL(await res.blob()) };
}
