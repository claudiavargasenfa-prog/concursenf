# Área do Aluno com acesso anual (12 meses)

## O que existe hoje
**Contas e login**
- O sistema de contas já está ligado: e-mail/senha e Google. Isso foi feito no momento em que o Lovable Cloud foi conectado.
- Mas o site não tem nenhuma tela de entrar ou cadastrar, nenhuma área restrita (não existe `src/routes/_authenticated/`) e nenhum botão "Entrar" no topo (`Header.tsx`).
- `src/start.ts` já envia a identificação da pessoa logada em cada pedido ao servidor (`attachSupabaseAuth`). Hoje nenhuma função usa isso.

**Banco de dados**
- Só existem as 6 tabelas da Central de Materiais. Todas estão protegidas (RLS): o público só lê o que está publicado, e alterações exigem administradora.
- Não existe tabela de alunos, de assinatura nem de papéis (cargos).
- A única função é `is_catalog_admin()`. Ela confere se a pessoa é administradora olhando um campo da própria conta (`app_metadata.role = catalog_admin`). Ninguém tem esse papel ainda.

**Avisos**
- **E-mail:** nenhum domínio de envio configurado. Só saem os e-mails padrão do login (confirmação de conta, troca de senha), não avisos do site.
- **WhatsApp e SMS:** nenhuma integração. O WhatsApp só aparece citado em textos.
- **Tarefas agendadas:** nenhuma.
- **Pagamento:** desligado (`CHECKOUT_URL = null`).

## O que será construído
1. **Cadastro e login** (`/auth`): e-mail/senha e Google, com "esqueci a senha" e a página `/reset-password`. O topo mostra "Entrar" ou "Minha área / Sair" conforme a pessoa estiver logada. Tudo no visual azul-petróleo atual.
2. **Ficha do aluno:** cada conta ganha um perfil com nome e telefone opcional, mais um registro de acesso com:
   - data de início;
   - vencimento, sempre calculado pelo banco como início + 12 meses (não dá para alterar pelo navegador);
   - situação: ativo, vence em breve, vencido ou aguardando liberação.
   O aluno só vê e lê os próprios dados. Ele não consegue mudar as datas.
3. **Painel do aluno** (`/minha-area`): situação, data de vencimento, dias restantes e atalhos para Questões, Plano e Materiais. Quando faltar 30 dias ou menos, aparece um aviso em destaque dentro do site.
4. **Painel da administradora** (`/admin/alunos`): lista de alunos com início, vencimento e situação, filtro "vencem em 30 dias", e botões para liberar e renovar o acesso por mais 12 meses. Só quem tiver o papel de administradora entra.
5. **Aviso fora do site, por e-mail.** Precisa de um domínio de envio verificado. Com isso, uma tarefa diária manda ao aluno um e-mail único "faltam 30 dias" e outro resumo para a administradora. Cada aviso fica registrado para nunca ser enviado duas vezes.
   - Se o domínio não for configurado, as etapas 1 a 4 funcionam normalmente e o aviso fica apenas dentro do site.
   - O WhatsApp exigiria uma conta comercial (WhatsApp Business ou Twilio) e não está no plano.

## Ordem de entrega
Etapas 1 e 2 → etapa 3 → etapa 4 → etapa 5. Cada etapa pode ser testada antes da próxima.

## A decisão que preciso de você
**Quando começa a contar os 12 meses**, já que ainda não existe pagamento?
- **A) A administradora libera manualmente** (recomendado). A pessoa se cadastra, fica "aguardando liberação", e a contagem começa no dia em que você libera. Quando o pagamento existir, ele poderá liberar automaticamente.
- **B) No dia do cadastro.** Qualquer pessoa que criar conta ganha 12 meses na hora, de graça.

Também vou precisar do **e-mail da administradora** para dar esse acesso a ela. Para o aviso por e-mail, será preciso configurar o domínio de envio (por exemplo, `academiadaenfermagem.com.br`) em um passo guiado.

## Detalhes técnicos
- Tabelas:
  - `profiles` e `user_roles` (com o enum `app_role`), ligadas a `auth.users` e apagadas junto com a conta;
  - `student_access` com `user_id`, `starts_at`, `expires_at` (preenchido por trigger: starts_at + 12 meses), `status` e `granted_by`;
  - `access_notifications`, com chave única por acesso e tipo de aviso, para não repetir envios.
- Cada tabela recebe GRANT e RLS próprios: o dono só lê o que é dele; `has_role(auth.uid(),'admin')` dá leitura e escrita à administradora. A situação é calculada pela data na hora da consulta, sem tarefa agendada só para isso.
- Um trigger em `auth.users` cria o perfil (e, na opção B, o acesso).
- Liberar e renovar passam por `createServerFn` com `requireSupabaseAuth` e conferência de `has_role`.
- Rotas: `/auth` e `/reset-password` são públicas; `_authenticated/minha-area` e `_authenticated/admin/alunos` são protegidas. Um único `onAuthStateChange` fica em `__root.tsx`.
- E-mail: estrutura de modelos do Lovable, mais a rota `/api/public/jobs/avisos-vencimento` protegida por `authenticateCronRequest`, chamada uma vez por dia por uma tarefa agendada.
- `is_catalog_admin()` continua como está para a Central de Materiais. Pode ser unificado com `has_role` depois.
- Nada será publicado.
