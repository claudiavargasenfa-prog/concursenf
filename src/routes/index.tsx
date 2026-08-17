import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/lp/Hero";
import { Proof } from "@/components/lp/Proof";
import { Contents } from "@/components/lp/Contents";
import { Offer } from "@/components/lp/Offer";

const title = "Combo Aprovação — Resumos para concursos de enfermagem";
const description =
  "Mais de 60 e-books esquematizados, banco de questões e bônus para Enfermeiras e Técnicas de Enfermagem que querem ser aprovadas estudando 30 minutos por dia.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <Hero />
      <Proof />
      <Contents />
      <Offer />
    </main>
  );
}
