import { useEffect, useState } from "react";
import { CHECKOUT_URL, CTA_DELAY_SECONDS } from "@/lib/lp-content";
import { cn } from "@/lib/utils";

/** Repassa os parâmetros de campanha (utm_*, src, fbclid...) da URL atual para o checkout. */
function buildCheckoutUrl(): string {
  if (typeof window === "undefined") return CHECKOUT_URL;
  try {
    const url = new URL(CHECKOUT_URL);
    new URLSearchParams(window.location.search).forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    return CHECKOUT_URL;
  }
}

export function CtaButton({
  children,
  className,
  respectDelay = false,
}: {
  children: React.ReactNode;
  className?: string;
  respectDelay?: boolean;
}) {
  const [href, setHref] = useState(CHECKOUT_URL);
  const [visible, setVisible] = useState(!respectDelay || CTA_DELAY_SECONDS === 0);

  useEffect(() => {
    setHref(buildCheckoutUrl());
  }, []);

  useEffect(() => {
    if (visible) return;
    const t = setTimeout(() => setVisible(true), CTA_DELAY_SECONDS * 1000);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <a
      href={href}
      className={cn(
        "inline-flex w-full max-w-xl animate-pulse-slow items-center justify-center rounded-full bg-primary px-8 py-5 text-center text-lg font-extrabold uppercase leading-tight tracking-wide text-primary-foreground shadow-[0_10px_30px_-10px_var(--primary)] transition hover:brightness-110 sm:text-xl",
        className,
      )}
    >
      {children}
    </a>
  );
}
