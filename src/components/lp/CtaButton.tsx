import { Button } from "@/components/ui/button";
import { CHECKOUT_URL } from "@/lib/lp-content";
import { cn } from "@/lib/utils";

export function CtaButton({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) {
  const classes = cn("h-auto w-full max-w-xl whitespace-normal px-8 py-5 text-center text-lg font-extrabold uppercase leading-tight sm:text-xl", className);
  if (!CHECKOUT_URL) {
    return <Button disabled className={classes}>Acesso em breve</Button>;
  }
  return <Button asChild className={classes}><a href={CHECKOUT_URL}>{children}</a></Button>;
}
