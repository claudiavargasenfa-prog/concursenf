import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, GraduationCap, LockKeyhole, Mail, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta | ConcursEnf" },
      { name: "description", content: "Crie sua conta gratuita no ConcursEnf e organize sua preparação para concursos de enfermagem." },
    ],
  }),
  component: CadastroPage,
});

function CadastroPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const normalizedName = fullName.trim().replace(/\s+/g, " ");
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedName.length < 3) {
      setErrorMessage("Informe seu nome completo para continuar.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("As senhas informadas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: { full_name: normalizedName },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        const message = error.message.toLowerCase();
        if (message.includes("password")) {
          setErrorMessage("Não foi possível aceitar essa senha. Escolha outra com pelo menos 8 caracteres.");
        } else if (message.includes("email") && (message.includes("invalid") || message.includes("valid"))) {
          setErrorMessage("Confira o endereço de e-mail informado.");
        } else if (message.includes("rate limit") || message.includes("too many")) {
          setErrorMessage("Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.");
        } else {
          setErrorMessage("Não foi possível concluir o cadastro agora. Confira os dados e tente novamente.");
        }
        return;
      }

      if (data.session) {
        setSuccessMessage("Cadastro realizado! Sua conta já está ativa. Você já pode acessar os conteúdos do ConcursEnf.");
      } else {
        setSuccessMessage("Recebemos seu cadastro. Enviamos uma mensagem para o e-mail informado. Acesse sua caixa de entrada e confirme o endereço para ativar sua conta.");
      }
      setPassword("");
      setConfirmPassword("");
    } catch {
      setErrorMessage("O serviço de cadastro não respondeu. Verifique sua conexão e tente novamente.");
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
              <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <GraduationCap className="size-7" />
              </span>
              <span className="text-xl font-black tracking-tight">Concurs<span className="text-primary">Enf</span></span>
            </Link>
            <p className="mt-16 text-xs font-extrabold uppercase tracking-[.2em] text-primary">Sua preparação começa aqui</p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight">Conhecimento organizado. Mais confiança para conquistar sua vaga.</h1>
            <p className="mt-5 text-sm leading-7 text-soft-muted">Crie seu acesso para acompanhar sua jornada de estudos e conhecer os recursos de preparação para a enfermagem.</p>
          </div>
          <div className="relative flex items-center gap-3 rounded-2xl border border-border/70 bg-card/70 p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><CheckCircle2 className="size-5" /></span>
            <p className="text-xs font-semibold leading-5">Uma conta para acessar as áreas Acadêmicos e Concursos, conforme os recursos disponíveis para você.</p>
          </div>
        </aside>

        <section className="px-6 py-8 sm:px-10 sm:py-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="size-4" /> Voltar ao início
          </Link>

          <div className="mt-8 lg:mt-5">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary lg:hidden"><GraduationCap className="size-6" /></span>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[.18em] text-primary">Cadastro de aluno</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground">Crie sua conta</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Preencha os dados abaixo para começar. O cadastro é individual e vinculado ao seu e-mail.</p>
          </div>

          {successMessage ? (
            <div role="status" aria-live="polite" className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <CheckCircle2 className="size-8 text-primary" />
              <h3 className="mt-3 font-extrabold text-foreground">Cadastro recebido</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{successMessage}</p>
              <Link to="/" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90">Ir para o ConcursEnf</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-bold text-foreground">Nome completo</label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input id="fullName" name="name" type="text" autoComplete="name" required minLength={3} maxLength={120} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Digite seu nome completo" className="min-h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

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
                  <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Crie uma senha com 8 caracteres ou mais" className="min-h-12 w-full rounded-xl border border-input bg-background pl-11 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Use pelo menos 8 caracteres.</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-bold text-foreground">Confirme sua senha</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmation ? "text" : "password"} autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Digite novamente sua senha" className="min-h-12 w-full rounded-xl border border-input bg-background pl-11 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" />
                  <button type="button" onClick={() => setShowConfirmation((visible) => !visible)} aria-label={showConfirmation ? "Ocultar confirmação da senha" : "Mostrar confirmação da senha"} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">{showConfirmation ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
                </div>
              </div>

              {errorMessage && <p role="alert" aria-live="polite" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm leading-5 text-destructive">{errorMessage}</p>}

              <button type="submit" disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Criando sua conta..." : "Criar minha conta"}
              </button>
              <p className="text-center text-sm text-muted-foreground">Já tem cadastro? <Link to="/entrar" className="font-extrabold text-primary hover:underline">Entrar</Link></p>
              <p className="text-center text-xs leading-5 text-muted-foreground">Ao se cadastrar, você confirma que os dados informados são seus e que tem autorização para utilizar este endereço de e-mail.</p>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
