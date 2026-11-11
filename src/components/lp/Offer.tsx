import { BookOpenCheck, Mail, ShieldCheck } from "lucide-react";
import { CtaButton } from "./CtaButton";
import { AUTHOR, BRAND, PRODUCT } from "@/lib/lp-content";
import autoraFoto from "@/assets/claudia-vargas.png.asset.json";
import { useSiteContent } from "@/hooks/useSiteContent";

export function Offer() {
  const content = useSiteContent("lp.offer", { eyebrow: "Conheça o material", title: PRODUCT, description: "Uma proposta de organização de conteúdos para apoiar a preparação de técnicas e enfermeiros em concursos públicos. Consulte as disciplinas, avalie a compatibilidade com seu edital e confirme as condições antes de adquirir.", button: "Interesse no Combo Aprovação", authorTitle: "Experiência dedicada à enfermagem e à educação.", authorName: AUTHOR.name, authorRole: AUTHOR.role, authorEmail: AUTHOR.contactEmail, authorBio: AUTHOR.bio, authorImage: "" });
  const authorBio = Array.isArray(content.authorBio) ? content.authorBio as string[] : AUTHOR.bio;
  return (
    <>
      <section className="bg-background px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl">
          <div className="grid md:grid-cols-[1fr_auto] md:items-center">
            <div className="p-7 sm:p-10"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">{content.eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{content.title}</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{content.description}</p><div className="mt-6 flex items-center gap-3 rounded-2xl bg-primary/5 p-4"><BookOpenCheck className="size-6 shrink-0 text-primary" /><p className="text-sm font-semibold text-foreground">Consulte o catálogo completo antes de escolher seu material.</p></div><div className="mt-6"><CtaButton>{content.button}</CtaButton></div><p className="mt-3 text-xs text-muted-foreground">As informações de compra serão disponibilizadas quando o canal comercial estiver configurado.</p></div>
            <div className="hidden h-full min-h-64 w-56 place-items-center bg-primary/5 p-8 text-primary md:grid"><ShieldCheck className="size-24 stroke-[1.2]" /></div>
          </div>
        </div>
      </section>
      <section className="bg-surface-soft px-4 py-16 text-surface-soft-foreground sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-9 md:grid-cols-[.8fr_1.2fr]">
          <img src={content.authorImage || autoraFoto.url} alt={`${AUTHOR.name}, ${AUTHOR.role}`} loading="lazy" width={1024} height={1024} className="mx-auto aspect-[4/5] w-full max-w-sm rounded-[2rem] object-cover shadow-xl" />
          <div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-primary">Idealização e autoria</p><h2 className="mt-3 text-3xl font-black tracking-tight">{content.authorTitle}</h2><h3 className="mt-4 text-lg font-extrabold text-primary">{content.authorName} — {content.authorRole}</h3><div className="mt-4 space-y-3 text-sm leading-7 text-soft-muted">{authorBio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><a href={`mailto:${content.authorEmail}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"><Mail className="size-4" /> {content.authorEmail}</a><p className="mt-3 text-xs text-soft-muted">{BRAND}</p></div>
        </div>
      </section>
    </>
  );
}
