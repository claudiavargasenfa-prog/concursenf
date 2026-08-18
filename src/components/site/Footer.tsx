import { AUTHOR, BRAND } from "@/lib/site-content";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-10 text-center text-xs text-muted-foreground">
      <p className="text-sm font-bold text-foreground">{BRAND}</p>
      <p className="mt-2">Materiais esquematizados de enfermagem para a faculdade, o plantão e o concurso.</p>
      <p className="mt-2">Contato: {AUTHOR.contactEmail}</p>
      <p className="mt-2">© {new Date().getFullYear()} Todos os direitos reservados.</p>
    </footer>
  );
}
