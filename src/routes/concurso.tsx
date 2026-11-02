import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/lp/Hero";
import { Proof } from "@/components/lp/Proof";
import { Contents } from "@/components/lp/Contents";
import { Offer } from "@/components/lp/Offer";

const title = "Combo Aprovação — Academia da Enfermagem";
const description =
  "Conheça a proposta de estudos em enfermagem, SUS e português da Academia da Enfermagem, idealizada pela enfermeira Cláudia Vargas.";

export const Route = createFileRoute("/concurso")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConcursoPage,
});

function ConcursoPage() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <Hero />
      <Proof />
      <Contents />
      <Offer />
    </main>
  );
}
