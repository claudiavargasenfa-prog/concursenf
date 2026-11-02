import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/lp/Hero";
import { Proof } from "@/components/lp/Proof";
import { Contents } from "@/components/lp/Contents";
import { Offer } from "@/components/lp/Offer";

const title = "Combo Aprovação | Conteúdos para concursos de enfermagem";
const description =
  "Conheça a organização dos conteúdos do Combo Aprovação para técnicos e enfermeiros: disciplinas, tópicos de revisão e materiais complementares.";

export const Route = createFileRoute("/concurso")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConcursoPage,
});

function ConcursoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background font-sans">
        <Hero />
        <Proof />
        <Contents />
        <Offer />
      </main>
      <Footer />
    </>
  );
}
