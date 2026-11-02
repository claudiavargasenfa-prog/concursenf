import { Button } from "@/components/ui/button";
import { CHECKOUT_URL } from "@/lib/lp-content";
import { cn } from "@/lib/utils";

export function CtaButton({ children, className }: {
  children: React.ReactNode;
  className?: string;
  respectDelay?: boolean;
}) {
  const classes = cn("h-auto w-full max-w-xl animate-pulse-slow whitespace-normal rounded-full px-8 py-5 text-center text-lg font-extrabold uppercase leading-tight tracking-wide shadow-[0_10px_30px_-10px_var(--primary)] transition hover:brightness-110 disabled:opacity-100 sm:text-xl", className);
  if (!CHECKOUT_URL) {
    return <Button disabled title="Pagamento ainda não configurado" className={classes}>{children}</Button>;
  }
  return <Button asChild className={classes}><a href={CHECKOUT_URL}>{children}</a></Button>;
}
