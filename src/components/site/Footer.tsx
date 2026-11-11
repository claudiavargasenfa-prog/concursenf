import { AUTHOR, BRAND } from "@/lib/site-content";
import { useSiteContent } from "@/hooks/useSiteContent";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-10 text-center text-xs text-muted-foreground">
      <p className="text-sm font-bold text-foreground">{content.brand}</p>
      <p className="mt-2">{content.description}</p>
      <p className="mt-2">Contato: {content.contact}</p>
      <p className="mt-2">© {new Date().getFullYear()} Todos os direitos reservados.</p>
    </footer>
  );
}
