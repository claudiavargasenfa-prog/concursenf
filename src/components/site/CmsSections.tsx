import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type PageKey = "home" | "concurso" | "academicos";
type CmsSection = {
  id: string; page_key: string; title: string; subtitle: string | null; body: string | null;
  media_url: string | null; media_type: string; button_label: string | null; button_url: string | null;
  sort_order: number;
};

function getYoutubeEmbed(url: string) {
  try {
    const parsed = new URL(url);
    let id = "";
    if (parsed.hostname.includes("youtu.be")) id = parsed.pathname.slice(1);
    if (parsed.hostname.includes("youtube.com")) id = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || "";
    return /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : "";
  } catch { return ""; }
}

export function CmsSections({ page }: { page: PageKey }) {
  const [sections, setSections] = useState<CmsSection[]>([]);
  const [resolvedMedia, setResolvedMedia] = useState<Record<string, string>>({});
  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await (supabase as any).from("site_sections")
        .select("id,page_key,title,subtitle,body,media_url,media_type,button_label,button_url,sort_order")
        .in("page_key", [page, "global"]).eq("is_active", true).order("sort_order");
      if (!active || error) return;
      const loaded = (data ?? []) as CmsSection[];
      const resolved = await Promise.all(loaded.map(async (section) => {
        if (!section.media_url?.startsWith("storage:")) return [section.id, section.media_url ?? ""] as const;
        const path = section.media_url.slice("storage:".length);
        const { data: signed, error: signedError } = await (supabase as any).storage.from("concursenf-site").createSignedUrl(path, 3600);
        return [section.id, signedError ? "" : signed?.signedUrl ?? ""] as const;
      }));
      if (!active) return;
      setResolvedMedia(Object.fromEntries(resolved));
      setSections(loaded);
    }
    void load();
    return () => { active = false; };
  }, [page]);

  if (!sections.length) return null;
  return <div className="cms-sections">
    {sections.map((section) => <section key={section.id} className="border-y border-border bg-card px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        {section.subtitle && <p className="text-xs font-extrabold uppercase tracking-[.18em] text-primary">{section.subtitle}</p>}
        <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">{section.title}</h2>
        {section.body && <div className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{section.body}</div>}
        {resolvedMedia[section.id] && section.media_type === "image" && <img src={resolvedMedia[section.id]} alt={section.title} loading="lazy" className="mt-7 max-h-[34rem] w-full rounded-2xl object-contain" />}
        {resolvedMedia[section.id] && section.media_type === "audio" && <audio controls preload="none" src={resolvedMedia[section.id]} className="mt-6 w-full max-w-2xl" />}
        {resolvedMedia[section.id] && section.media_type === "video" && <video controls preload="metadata" src={resolvedMedia[section.id]} className="mt-6 aspect-video w-full max-w-4xl rounded-2xl bg-black" />}
        {section.media_url && section.media_type === "youtube" && getYoutubeEmbed(resolvedMedia[section.id] ?? "") && <div className="mt-7 aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black"><iframe src={getYoutubeEmbed(resolvedMedia[section.id] ?? "")} title={section.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div>}
        {section.button_label && section.button_url && <a href={section.button_url} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground transition hover:opacity-90">{section.button_label}<ExternalLink className="size-4" /></a>}
      </div>
    </section>)}
  </div>;
}
