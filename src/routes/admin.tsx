import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, AudioLines, CheckCircle2, CircleAlert, ExternalLink, FileImage, FileVideo,
  Globe, ImagePlus, LayoutDashboard, LoaderCircle, Palette, Pencil, Plus, Save, Settings2,
  ShieldCheck, Trash2, Upload, Video, X,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

type Tab = "overview" | "appearance" | "sections" | "media";
type PageKey = "home" | "concurso" | "academicos" | "global";
type MediaType = "image" | "audio" | "video" | "youtube";
type Section = {
  id: string; page_key: PageKey; section_key: string; title: string; subtitle: string | null;
  body: string | null; media_url: string | null; media_type: string; button_label: string | null;
  button_url: string | null; sort_order: number; is_active: boolean;
};
type Media = {
  id: string; title: string; description: string | null; media_type: MediaType;
  storage_path: string | null; external_url: string | null; mime_type: string | null;
  file_size: number | null; alt_text: string | null; published: boolean;
};
type Theme = { primary: string; background: string; foreground: string; accent: string };
const DEFAULT_THEME: Theme = { primary: "#0798AE", background: "#F7FAFC", foreground: "#17242B", accent: "#DDF3F5" };
const inputClass = "mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";
const labelClass = "block text-sm font-semibold text-foreground";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administração | ConcursEnf" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminPage,
});

function youtubeEmbed(url: string) {
  try {
    const parsed = new URL(url);
    let id = "";
    if (parsed.hostname.includes("youtu.be")) id = parsed.pathname.slice(1);
    else if (parsed.hostname.includes("youtube.com")) id = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || "";
    return /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : "";
  } catch { return ""; }
}

function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pageKey, setPageKey] = useState<PageKey>("home");
  const [sectionKey, setSectionKey] = useState("bloco-personalizado");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [mediaType, setMediaType] = useState("none");
  const [mediaUrl, setMediaUrl] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [active, setActive] = useState(true);
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaDescription, setMediaDescription] = useState("");
  const [mediaKind, setMediaKind] = useState<MediaType>("image");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaExternalUrl, setMediaExternalUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");

  async function loadData() {
    setError("");
    const db = supabase as any;
    const { data: authData, error: authError } = await db.auth.getUser();
    if (authError || !authData?.user) {
      setAuthorized(false); setChecking(false); return;
    }
    const { data: isAdmin, error: roleError } = await db.rpc("is_catalog_admin");
    if (roleError || !isAdmin) {
      setAuthorized(false); setChecking(false); return;
    }
    setAuthorized(true);
    const [settingsResult, sectionsResult, mediaResult] = await Promise.all([
      db.from("site_settings").select("setting_value").eq("setting_key", "theme").maybeSingle(),
      db.from("site_sections").select("*").order("page_key").order("sort_order"),
      db.from("site_media").select("*").order("created_at", { ascending: false }),
    ]);
    if (settingsResult.error || sectionsResult.error || mediaResult.error) {
      setError((settingsResult.error || sectionsResult.error || mediaResult.error).message);
    } else {
      setTheme({ ...DEFAULT_THEME, ...(settingsResult.data?.setting_value ?? {}) });
      setSections((sectionsResult.data ?? []) as Section[]);
      setMedia((mediaResult.data ?? []) as Media[]);
    }
    setChecking(false);
  }

  useEffect(() => { void loadData(); }, []);

  const stats = useMemo(() => ({
    sections: sections.length,
    active: sections.filter((item) => item.is_active).length,
    media: media.length,
    published: media.filter((item) => item.published).length,
  }), [sections, media]);

  function resetSection() {
    setEditingId(null); setPageKey("home"); setSectionKey("bloco-personalizado");
    setTitle(""); setSubtitle(""); setBody(""); setMediaType("none"); setMediaUrl("");
    setButtonLabel(""); setButtonUrl(""); setSortOrder("0"); setActive(true);
  }

  function editSection(item: Section) {
    setEditingId(item.id); setPageKey(item.page_key); setSectionKey(item.section_key);
    setTitle(item.title); setSubtitle(item.subtitle ?? ""); setBody(item.body ?? "");
    setMediaType(item.media_type); setMediaUrl(item.media_url ?? "");
    setButtonLabel(item.button_label ?? ""); setButtonUrl(item.button_url ?? "");
    setSortOrder(String(item.sort_order)); setActive(item.is_active); setTab("sections");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveTheme(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage(""); setError("");
    try {
      const { error: saveError } = await (supabase as any).from("site_settings").upsert({
        setting_key: "theme", setting_value: theme, description: "Cores principais da identidade visual",
        updated_at: new Date().toISOString(),
      }, { onConflict: "setting_key" });
      if (saveError) throw saveError;
      setMessage("Identidade visual salva. As cores serão aplicadas nas páginas conectadas ao tema global.");
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível salvar as cores."); }
    finally { setSaving(false); }
  }

  async function saveSection(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage(""); setError("");
    try {
      const payload = {
        page_key: pageKey, section_key: sectionKey.trim(), title: title.trim(),
        subtitle: subtitle.trim() || null, body: body.trim() || null,
        media_type: mediaType, media_url: mediaUrl.trim() || null,
        button_label: buttonLabel.trim() || null, button_url: buttonUrl.trim() || null,
        sort_order: Number(sortOrder) || 0, is_active: active,
        updated_by: (await (supabase as any).auth.getUser()).data?.user?.id ?? null,
      };
      const query = editingId
        ? (supabase as any).from("site_sections").update(payload).eq("id", editingId)
        : (supabase as any).from("site_sections").insert(payload);
      const { error: saveError } = await query;
      if (saveError) throw saveError;
      setMessage(editingId ? "Seção atualizada." : "Seção criada.");
      resetSection(); await loadData();
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível salvar a seção."); }
    finally { setSaving(false); }
  }

  async function deleteSection(id: string) {
    if (!window.confirm("Excluir esta seção do site? Essa ação não pode ser desfeita.")) return;
    const { error: deleteError } = await (supabase as any).from("site_sections").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else { setMessage("Seção excluída."); await loadData(); }
  }

  async function uploadMedia(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage(""); setError("");
    try {
      let storagePath: string | null = null;
      let externalUrl: string | null = null;
      let mimeType: string | null = null;
      let fileSize: number | null = null;
      if (mediaKind === "youtube") {
        if (!youtubeEmbed(mediaExternalUrl)) throw new Error("Informe um endereço válido de vídeo do YouTube.");
        externalUrl = mediaExternalUrl.trim();
      } else if (mediaExternalUrl.trim()) {
        const parsed = new URL(mediaExternalUrl);
        if (!["https:", "http:"].includes(parsed.protocol)) throw new Error("O endereço do recurso não é válido.");
        externalUrl = parsed.toString();
      } else if (mediaFile) {
        const allowed = mediaKind === "image" ? ["image/jpeg","image/png","image/webp","image/gif"]
          : mediaKind === "audio" ? ["audio/mpeg","audio/mp4","audio/wav","audio/ogg"]
          : ["video/mp4","video/webm"];
        if (!allowed.includes(mediaFile.type)) throw new Error("Formato de arquivo não permitido para esta categoria.");
        if (mediaFile.size > 100 * 1024 * 1024) throw new Error("O arquivo deve ter no máximo 100 MB.");
        const safeName = mediaFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        storagePath = `site-media/${mediaKind}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await (supabase as any).storage.from("concursenf-site").upload(storagePath, mediaFile, { contentType: mediaFile.type, upsert: false });
        if (uploadError) throw uploadError;
        mimeType = mediaFile.type; fileSize = mediaFile.size;
      } else {
        throw new Error("Escolha um arquivo ou informe um endereço externo.");
      }
      const { error: insertError } = await (supabase as any).from("site_media").insert({
        title: mediaTitle.trim(), description: mediaDescription.trim() || null, media_type: mediaKind,
        storage_path: storagePath, external_url: externalUrl, mime_type: mimeType,
        file_size: fileSize, alt_text: mediaAlt.trim() || null, published: true,
      });
      if (insertError) throw insertError;
      setMediaTitle(""); setMediaDescription(""); setMediaFile(null); setMediaExternalUrl(""); setMediaAlt("");
      setMessage("Mídia adicionada à biblioteca.");
      await loadData();
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível adicionar a mídia."); }
    finally { setSaving(false); }
  }

  async function deleteMedia(item: Media) {
    if (!window.confirm("Excluir esta mídia? Se estiver sendo usada em uma seção, o conteúdo incorporado também deixará de aparecer.")) return;
    const db = supabase as any;
    if (item.storage_path) {
      const { error: storageError } = await db.storage.from("concursenf-site").remove([item.storage_path]);
      if (storageError) { setError(storageError.message); return; }
    }
    const { error: deleteError } = await db.from("site_media").delete().eq("id", item.id);
    if (deleteError) setError(deleteError.message);
    else { setMessage("Mídia excluída."); await loadData(); }
  }

  async function toggleMedia(item: Media) {
    const { error: updateError } = await (supabase as any).from("site_media").update({ published: !item.published }).eq("id", item.id);
    if (updateError) setError(updateError.message); else await loadData();
  }

  const tabs = [
    { id: "overview" as Tab, label: "Visão geral", icon: LayoutDashboard },
    { id: "appearance" as Tab, label: "Aparência", icon: Palette },
    { id: "sections" as Tab, label: "Seções e textos", icon: Pencil },
    { id: "media" as Tab, label: "Imagens e mídia", icon: ImagePlus },
  ];

  if (checking) return <div className="grid min-h-screen place-items-center"><LoaderCircle className="size-7 animate-spin text-primary" /></div>;
  if (!authorized) return <>
    <Header /><main className="grid min-h-[70vh] place-items-center px-4 py-16"><div className="max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm"><ShieldCheck className="mx-auto size-12 text-primary" /><h1 className="mt-4 text-2xl font-black">Acesso administrativo restrito</h1><p className="mt-3 text-sm leading-7 text-muted-foreground">Entre com a conta autorizada para administrar o ConcursEnf. Se ainda não recebeu a permissão de administradora, será necessário ativá-la no cadastro seguro do projeto.</p><Link to="/entrar" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground">Entrar na minha conta</Link></div></main><Footer />
  </>;

  return <>
    <Header />
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"><ArrowLeft className="size-4" /> Voltar ao site</Link>
        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-primary"><ShieldCheck className="size-4" /> Painel de controle</span><h1 className="mt-3 text-3xl font-black sm:text-4xl">Administração do ConcursEnf</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Gerencie a identidade visual, os blocos de conteúdo e os arquivos utilizados no site e na plataforma.</p></div>
          <button type="button" onClick={() => void loadData()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-bold hover:bg-muted"><Settings2 className="size-4" /> Atualizar painel</button>
        </div>

        {error && <div role="alert" className="mt-5 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><CircleAlert className="size-5 shrink-0" />{error}</div>}
        {message && <div role="status" className="mt-5 flex gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm"><CheckCircle2 className="size-5 shrink-0 text-primary" />{message}</div>}

        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[{label:"Seções cadastradas",value:stats.sections},{label:"Seções ativas",value:stats.active},{label:"Arquivos e vídeos",value:stats.media},{label:"Mídias publicadas",value:stats.published}].map((item) => <div key={item.label} className="rounded-2xl border border-border bg-card p-4 sm:p-5"><p className="text-xs font-bold text-muted-foreground">{item.label}</p><p className="mt-2 text-3xl font-black">{item.value}</p></div>)}
        </div>

        <div className="mt-7 flex flex-wrap gap-2 border-b border-border pb-3">
          {tabs.map(({id,label,icon:Icon}) => <button key={id} type="button" onClick={() => setTab(id)} className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold ${tab===id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}><Icon className="size-4" />{label}</button>)}
        </div>

        {tab === "overview" && <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-6"><Palette className="size-7 text-primary" /><h2 className="mt-3 text-lg font-black">Identidade visual</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Altere as cores principais do site e da plataforma em um só lugar.</p><button onClick={() => setTab("appearance")} className="mt-4 text-sm font-extrabold text-primary">Configurar cores →</button></article>
          <article className="rounded-2xl border border-border bg-card p-6"><Pencil className="size-7 text-primary" /><h2 className="mt-3 text-lg font-black">Seções e textos</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Crie blocos, títulos, textos, botões e elementos adicionais para cada página.</p><button onClick={() => setTab("sections")} className="mt-4 text-sm font-extrabold text-primary">Gerenciar seções →</button></article>
          <article className="rounded-2xl border border-border bg-card p-6"><ImagePlus className="size-7 text-primary" /><h2 className="mt-3 text-lg font-black">Biblioteca de mídia</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Envie imagens, áudios e vídeos ou cadastre links do YouTube.</p><button onClick={() => setTab("media")} className="mt-4 text-sm font-extrabold text-primary">Gerenciar mídias →</button></article>
          <article className="rounded-2xl border border-border bg-card p-6"><Globe className="size-7 text-primary" /><h2 className="mt-3 text-lg font-black">Áreas já existentes</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Os cadastros especializados continuam disponíveis nos painéis próprios.</p><div className="mt-4 flex flex-wrap gap-3 text-sm font-bold"><Link to="/admin-conteudos" className="text-primary">Conteúdos EBSERH</Link><Link to="/materiais" className="text-primary">Central de materiais</Link><Link to="/questoes" className="text-primary">Questões</Link></div></article>
        </div>}

        {tab === "appearance" && <form onSubmit={saveTheme} className="mt-6 max-w-3xl rounded-2xl border border-border bg-card p-5 sm:p-7">
          <h2 className="text-xl font-black">Cores globais</h2><p className="mt-2 text-sm text-muted-foreground">Escolha as cores da marca. A prévia abaixo mostra a combinação antes de salvar.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {([{key:"primary",label:"Cor principal"},{key:"background",label:"Fundo das páginas"},{key:"foreground",label:"Texto principal"},{key:"accent",label:"Cor de destaque"}] as const).map(({key,label}) => <label key={key} className={labelClass}>{label}<span className="mt-1.5 flex h-12 items-center gap-3 rounded-xl border border-border bg-background p-2"><input type="color" value={theme[key]} onChange={(e) => setTheme((old) => ({...old,[key]:e.target.value}))} className="size-8 cursor-pointer rounded border-0 bg-transparent" /><input className="min-w-0 flex-1 bg-transparent text-sm font-mono uppercase outline-none" value={theme[key]} onChange={(e) => setTheme((old) => ({...old,[key]:e.target.value}))} pattern="^#[0-9A-Fa-f]{6}$" /></span></label>)}
          </div>
          <div className="mt-6 rounded-2xl p-6" style={{backgroundColor:theme.background,color:theme.foreground,border:"1px solid #d1d5db"}}><p className="text-xs font-bold uppercase tracking-widest">Prévia da identidade</p><h3 className="mt-2 text-2xl font-black">ConcursEnf</h3><p className="mt-1 text-sm">Preparação em enfermagem</p><span className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-bold" style={{backgroundColor:theme.primary,color:"#ffffff"}}>Botão principal</span><span className="ml-2 inline-flex rounded-full px-4 py-2 text-sm font-bold" style={{backgroundColor:theme.accent,color:theme.foreground}}>Destaque</span></div>
          <button disabled={saving} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-primary-foreground disabled:opacity-60"><Save className="size-4" />{saving?"Salvando...":"Salvar identidade visual"}</button>
        </form>}

        {tab === "sections" && <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,.85fr)]">
          <form onSubmit={saveSection} className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black">{editingId?"Editar seção":"Nova seção de conteúdo"}</h2>{editingId&&<button type="button" onClick={resetSection} className="text-xs font-bold text-muted-foreground">Cancelar edição</button>}</div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>Página<select className={inputClass} value={pageKey} onChange={(e)=>setPageKey(e.target.value as PageKey)}><option value="home">Página inicial</option><option value="concurso">Landing page / Combo</option><option value="academicos">Área acadêmica</option><option value="global">Todas as páginas</option></select></label>
              <label className={labelClass}>Identificador<input className={inputClass} value={sectionKey} onChange={(e)=>setSectionKey(e.target.value)} required placeholder="Ex.: chamada-principal" /></label>
            </div>
            <label className={labelClass+" mt-4"}>Título<input className={inputClass} value={title} onChange={(e)=>setTitle(e.target.value)} required /></label>
            <label className={labelClass+" mt-4"}>Subtítulo<input className={inputClass} value={subtitle} onChange={(e)=>setSubtitle(e.target.value)} /></label>
            <label className={labelClass+" mt-4"}>Texto<textarea className={inputClass} rows={6} value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Escreva o texto que será exibido na seção." /></label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>Tipo de mídia<select className={inputClass} value={mediaType} onChange={(e)=>setMediaType(e.target.value)}><option value="none">Sem mídia</option><option value="image">Imagem</option><option value="audio">Áudio</option><option value="video">Vídeo</option><option value="youtube">YouTube</option></select></label>
              <label className={labelClass}>Ordem de exibição<input className={inputClass} type="number" value={sortOrder} onChange={(e)=>setSortOrder(e.target.value)} /></label>
            </div>
            {mediaType!=="none"&&<>
              <label className={labelClass+" mt-4"}>Usar arquivo já cadastrado na biblioteca<select className={inputClass} value="" onChange={(e)=>{const chosen=media.find((item)=>item.id===e.target.value);if(chosen){const url=chosen.storage_path?(supabase as any).storage.from("concursenf-site").getPublicUrl(chosen.storage_path).data.publicUrl:chosen.external_url;setMediaUrl(url||"");}}}><option value="">Selecione uma mídia (opcional)</option>{media.filter((item)=>item.published&&(item.media_type===mediaType||(mediaType==="youtube"&&item.media_type==="youtube"))).map((item)=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
              <label className={labelClass+" mt-4"}>URL da mídia<input className={inputClass} type="url" value={mediaUrl} onChange={(e)=>setMediaUrl(e.target.value)} placeholder={mediaType==="youtube"?"https://www.youtube.com/watch?v=...":"URL pública ou arquivo da biblioteca"} required /></label>
            </>}
            <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className={labelClass}>Texto do botão<input className={inputClass} value={buttonLabel} onChange={(e)=>setButtonLabel(e.target.value)} /></label><label className={labelClass}>Destino do botão<input className={inputClass} value={buttonUrl} onChange={(e)=>setButtonUrl(e.target.value)} placeholder="/questoes ou https://..." /></label></div>
            <label className="mt-5 flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={active} onChange={(e)=>setActive(e.target.checked)} className="size-4 accent-primary" /> Seção ativa e visível no site</label>
            <button disabled={saving} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-primary-foreground disabled:opacity-60"><Save className="size-4" />{saving?"Salvando...":"Salvar seção"}</button>
          </form>
          <div className="space-y-3">
            <h2 className="text-xl font-black">Seções cadastradas ({sections.length})</h2>
            {sections.map((item)=><article key={item.id} className="rounded-2xl border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><span className="text-[11px] font-extrabold uppercase tracking-wide text-primary">{item.page_key} · ordem {item.sort_order}</span><h3 className="mt-1 font-bold">{item.title}</h3><p className="mt-1 text-xs text-muted-foreground">{item.section_key} · {item.is_active?"Ativa":"Oculta"}</p></div><div className="flex shrink-0 gap-1"><button onClick={()=>editSection(item)} aria-label="Editar seção" className="grid size-9 place-items-center rounded-lg border border-border hover:bg-muted"><Pencil className="size-4" /></button><button onClick={()=>void deleteSection(item.id)} aria-label="Excluir seção" className="grid size-9 place-items-center rounded-lg border border-border text-destructive hover:bg-destructive/5"><Trash2 className="size-4" /></button></div></div></article>)}
            {sections.length===0&&<p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">Nenhuma seção criada ainda.</p>}
          </div>
        </div>}

        {tab === "media" && <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(320px,.8fr)_minmax(0,1.2fr)]">
          <form onSubmit={uploadMedia} className="rounded-2xl border border-border bg-card p-5 sm:p-7">
            <h2 className="text-xl font-black">Adicionar mídia</h2><p className="mt-2 text-sm text-muted-foreground">Arquivos de até 100 MB ou endereço externo. Vídeos do YouTube são incorporados sem precisar enviar o arquivo.</p>
            <label className={labelClass+" mt-5"}>Nome do arquivo / mídia<input className={inputClass} required value={mediaTitle} onChange={(e)=>setMediaTitle(e.target.value)} /></label>
            <label className={labelClass+" mt-4"}>Categoria<select className={inputClass} value={mediaKind} onChange={(e)=>setMediaKind(e.target.value as MediaType)}><option value="image">Imagem</option><option value="audio">Áudio</option><option value="video">Vídeo</option><option value="youtube">Vídeo do YouTube</option></select></label>
            {mediaKind!=="youtube"&&<label className={labelClass+" mt-4"}>Arquivo<input className={inputClass} type="file" accept={mediaKind==="image"?"image/jpeg,image/png,image/webp,image/gif":mediaKind==="audio"?"audio/mpeg,audio/mp4,audio/wav,audio/ogg":"video/mp4,video/webm"} onChange={(e)=>setMediaFile(e.target.files?.[0]??null)} /></label>}
            <label className={labelClass+" mt-4"}>{mediaKind==="youtube"?"Link do YouTube":"Ou endereço externo"}<input className={inputClass} type="url" value={mediaExternalUrl} onChange={(e)=>setMediaExternalUrl(e.target.value)} placeholder={mediaKind==="youtube"?"https://www.youtube.com/watch?v=...":"https://..."}/></label>
            <label className={labelClass+" mt-4"}>Texto alternativo (imagens)<input className={inputClass} value={mediaAlt} onChange={(e)=>setMediaAlt(e.target.value)} placeholder="Descrição acessível da imagem" /></label>
            <label className={labelClass+" mt-4"}>Descrição<textarea className={inputClass} rows={2} value={mediaDescription} onChange={(e)=>setMediaDescription(e.target.value)} /></label>
            <button disabled={saving} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-primary-foreground disabled:opacity-60"><Upload className="size-4" />{saving?"Enviando...":"Adicionar à biblioteca"}</button>
          </form>
          <div><h2 className="text-xl font-black">Biblioteca de mídia ({media.length})</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">
            {media.map((item)=><article key={item.id} className="min-w-0 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2"><span className="inline-flex items-center gap-2 text-xs font-bold uppercase text-primary">{item.media_type==="image"?<FileImage className="size-4"/>:item.media_type==="audio"?<AudioLines className="size-4"/>:item.media_type==="youtube"?<Video className="size-4"/>:<FileVideo className="size-4"/>}{item.media_type}</span><span className="text-[11px] text-muted-foreground">{item.published?"Publicado":"Oculto"}</span></div>
              <h3 className="mt-3 truncate font-bold">{item.title}</h3><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description||item.external_url||item.storage_path}</p>
              <div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>void toggleMedia(item)} className="rounded-lg border border-border px-3 py-2 text-xs font-bold">{item.published?"Ocultar":"Publicar"}</button><button onClick={()=>void deleteMedia(item)} className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 px-3 py-2 text-xs font-bold text-destructive"><Trash2 className="size-3"/> Excluir</button>{item.external_url&&<a href={item.external_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-bold">Abrir <ExternalLink className="size-3"/></a>}</div>
            </article>)}
            {media.length===0&&<p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground sm:col-span-2">Nenhuma mídia cadastrada.</p>}
          </div></div>
        </div>}
      </div>
    </main>
    <Footer />
  </>;
}
