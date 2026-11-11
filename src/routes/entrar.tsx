import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, GraduationCap, LockKeyhole, LogIn, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar | ConcursEnf" },
      { name: "description", content: "Acesse sua conta do ConcursEnf." },
    ],
  }),
  component: EntrarPage,
});

function EntrarPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setErrorMessage("Informe seu e-mail e sua senha.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        const message = error.message.toLowerCase();
        if (message.includes("email not confirmed")) {
          setErrorMessage("Seu e-mail ainda não foi confirmado. Acesse a mensagem enviada pelo ConcursEnf e confirme seu endereço antes de entrar.");
        } else if (message.includes("invalid login credentials")) {
          setErrorMessage("E-mail ou senha incorretos. Confira os dados e tente novamente.");
        } else if (message.includes("too many") || message.includes("rate limit")) {
          setErrorMessage("Muitas tentativas em pouco tempo. Aguarde alguns minutos antes de tentar novamente.");
        } else {
          setErrorMessage("Não foi possível entrar agora. Verifique sua conexão e tente novamente.");
        }
        return;
      }

      await navigate({ to: "/" });
    } catch {
      setErrorMessage("O serviço de autenticação não respondeu. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 sm:py-14">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 size-[28rem] rounded-full bg-accent/50 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_30px_90px_-35px_rgba(10,50,65,.35)] lg:grid-cols-[.9fr_1.1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-surface-soft p-10 text-surface-soft-foreground lg:flex">
          <div className="absolute -right-20 -top-16 size-72 rounded-full border-[38px] border-primary/10" />
          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Voltar ao início do ConcursEnf">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg"><GraduationCap className="size-7" /></span>
              <span className="text-xl font-black tracking-tight">Concurs<span className="text-primary">Enf</span></span>
            </Link>
            <p className="mt-16 text-xs font-extrabold uppercase tracking-[.2em] text-primary">Bem-vindo de volta</p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight">Continue sua preparação com foco e direção.</h1>
            <p className="mt-5 text-sm leading-7 text-soft-muted">Entre com o e-mail e a senha utilizados no seu cadastro para acessar o ConcursEnf.</p>
          </div>
          <div className="relative rounded-2xl border border-border/70 bg-card/70 p-4">
            <p className="text-xs font-semibold leading-5">Uma conta para acessar Acadêmicos e Concursos. Os recursos disponíveis serão vinculados às permissões da sua conta nas próximas etapas.</p>
          </div>
        </aside>

        <section className="px-6 py-8 sm:px-10 sm:py-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="size-4" /> Voltar ao início
          </Link>

          <div className="mt-8 lg:mt-5">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary lg:hidden"><GraduationCap className="size-6" /></span>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[.18em] text-primary">Área do aluno</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground">Acesse sua conta</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Informe seus dados de acesso para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-foreground">E-mail</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seuemail@exemplo.com" className="min-h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-foreground">Senha</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" className="min-h-12 w-full rounded-xl border border-input bg-background pl-11 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
              </div>
            </div>

            {errorMessage && <p role="alert" aria-live="polite" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm leading-5 text-destructive">{errorMessage}</p>}

            <button type="submit" disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60">
              <LogIn className="size-4" /> {loading ? "Verificando acesso..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center text-sm">
            <p className="text-muted-foreground">Ainda não tem conta? <Link to="/cadastro" className="font-extrabold text-primary hover:underline">Criar cadastro</Link></p>
            <p><Link to="/" className="font-semibold text-muted-foreground hover:text-primary">Voltar para o ConcursEnf</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}
