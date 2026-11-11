import { useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type ThemeSettings = { primary?: string; background?: string; foreground?: string; accent?: string };

export function SiteRuntime({ children }: { children: ReactNode }) {
  useEffect(() => {
    let active = true;
    async function applyTheme() {
      const { data, error } = await (supabase as any).from("site_settings")
        .select("setting_value").eq("setting_key", "theme").maybeSingle();
      if (!active || error || !data?.setting_value) return;
      const theme = data.setting_value as ThemeSettings;
      const root = document.documentElement;
      const vars: Record<string, string | undefined> = {
        "--primary": theme.primary,
        "--ring": theme.primary,
        "--chart-1": theme.primary,
        "--sidebar-primary": theme.primary,
        "--background": theme.background,
        "--foreground": theme.foreground,
        "--accent": theme.accent,
        "--sidebar-accent": theme.accent,
      };
      Object.entries(vars).forEach(([key, value]) => {
        if (value && /^#[0-9a-fA-F]{6}$/.test(value)) root.style.setProperty(key, value);
      });
    }
    void applyTheme();
    return () => { active = false; };
  }, []);
  return <>{children}</>;
}
