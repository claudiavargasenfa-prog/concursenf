# Área do Aluno com acesso anual liberado pelo Mercado Pago

## O que existe hoje
- **Mercado Pago:** nenhuma integração no site. Nenhuma linha de código cita Mercado Pago, webhook ou preferência de pagamento, e nada foi instalado para isso.
  - `CHECKOUT_URL = null` em `src/lib/lp-content.ts`. O teste `src/lib/commercial-access.test.ts` exige que ele continue vazio.
  - Os únicos segredos guardados são `LOVABLE_API_KEY` e `LOVABLE_CRON_SECRET`. Não há nenhuma credencial do Mercado Pago.
- **Contas e login:** já ligados (e-mail/senha e Google), mas o site não tem tela de entrar, nem área restrita, nem botão "Entrar". `src/start.ts` já envia a identificação de quem está logado.
- **Banco de dados:** só as 6 tabelas da Central de Materiais, com proteção (RLS). A administradora é reconhecida por `is_catalog_admin()`, que olha `app_metadata.role`. Não existem tabelas de alunos, pagamentos ou papéis.
- **Avisos:** nenhum domínio de e-mail, nenhuma tarefa agendada, nenhum WhatsApp ou SMS.

## Como vai funcionar
```text
Aluno logado -> "Assinar 12 meses" -> o servidor cria a cobrança no Mercado Pago
   (a cobrança leva uma referência com o aluno, o plano e o pedido)
-> o aluno paga no Mercado Pago
-> o Mercado Pago avisa o site (webhook)
-> o site confere a assinatura do aviso
-> o site consulta o pagamento direto na API do Mercado Pago
-> se o pagamento estiver aprovado, libera ou renova o acesso (sem repetir)
```

1. **Cadastro e login** (`/auth`, `/reset-password`). O topo passa a mostrar "Entrar" ou "Minha área / Sair". A conta é criada uma vez só. Quem renova usa a mesma conta.
2. **Compra:** o botão "Assinar" leva ao Mercado Pago só se o aluno estiver logado. A cobrança é criada no servidor, com o preço e o plano tirados do banco, nunca do navegador.
3. **Aviso do Mercado Pago (webhook):**
   - confere a assinatura e recusa o aviso se ela não bater;
   - não confia no conteúdo do aviso: sempre consulta o pagamento na API pelo número;
   - só libera com status `approved`. Pagamentos pendentes, em análise, rejeitados, cancelados ou estornados ficam registrados, mas não liberam acesso;
   - se o mesmo pagamento chegar de novo, não faz nada (o número do pagamento é único);
   - confere o valor e a moeda contra o plano antes de liberar.
4. **Regra dos 12 meses:**
   - primeira compra: começa na data e hora da aprovação e vence 12 meses depois;
   - renovação com acesso ainda válido: vence 12 meses depois do vencimento atual;
   - renovação depois de vencido: começa na nova aprovação.
5. **Painel do aluno** (`/minha-area`): situação, data de início, vencimento, dias restantes e histórico de pagamentos. Quando faltar 30 dias ou menos, aparece um aviso em destaque.
6. **Aviso de 30 dias:** uma tarefa diária registra um único aviso por período de acesso, que aparece no painel. O envio por e-mail fica pronto para ligar quando o domínio de envio for configurado.
7. **Painel da administradora** (`/admin/alunos`): alunos, vencimentos, filtro "vence em 30 dias" e pagamentos com status. A administradora só acompanha: não libera acesso na mão.

## O que você vai precisar ter no Mercado Pago
Nada disso é colado no chat. Os segredos vão em Configurações do Projeto → Segredos quando eu pedir.

| Item | Onde obter | Como guardar |
|---|---|---|
| **Access Token de produção** (`APP_USR-...`) | Mercado Pago Developers → Suas integrações → sua aplicação → Credenciais de produção | Segredo `MERCADOPAGO_ACCESS_TOKEN` |
| **Access Token de teste** (para testar antes) | Mesma tela → Credenciais de teste | Segredo `MERCADOPAGO_TEST_ACCESS_TOKEN` (opcional) |
| **Assinatura secreta do webhook** | Sua aplicação → Webhooks → Configurar notificações → "Assinatura secreta", gerada pelo próprio Mercado Pago | Segredo `MERCADOPAGO_WEBHOOK_SECRET` |
| **URL de notificação** | Eu entrego pronta: `https://concursenf.lovable.app/api/public/mercadopago/webhook`. Ela entra no painel do Mercado Pago com o evento **Pagamentos** marcado. | Não é segredo |
| **Plano anual: nome e valor (R$)** | Você define | Fica salvo no banco, não é segredo |
| **Public Key** | Não é necessária: a compra acontece na página do próprio Mercado Pago | — |

## Decisões que preciso de você
1. **Nome e valor do plano anual** (por exemplo, "ConcursEnf Anual — R$ 297,00") e as **formas de pagamento** aceitas (Pix, cartão, parcelamento).
2. **E-mail da administradora**, para dar a ela o acesso ao painel.
3. (Opcional) **Domínio de envio de e-mail** para o aviso de 30 dias chegar fora do site. Sem ele, o aviso aparece só no painel.

## Detalhes técnicos
- **Tabelas, cada uma com GRANT e RLS:**
  - `profiles` e `user_roles` com o enum `app_role`, mais a função `has_role()`;
  - `plans` com `price_cents`, `currency`, `duration_months = 12` e `active`;
  - `checkout_orders` com `id`, `user_id`, `plan_id` e `external_reference` único;
  - `payments` com `mp_payment_id` único, `status`, `status_detail`, `amount`, `currency`, `date_created`, `date_approved`, `external_reference`, `raw` (jsonb), `order_id` e `processed_at`;
  - `student_access` com uma linha por usuário, `starts_at`, `expires_at` e `last_payment_id`;
  - `access_notifications`, com chave única por acesso, vencimento e tipo de aviso;
  - `payment_audit_log` com todo aviso recebido, o resultado da conferência da assinatura e a ação tomada.
- **Proteção:** o aluno só lê o que é dele. A administradora lê tudo por `has_role`. Ninguém escreve em `payments` ou `student_access` pelo navegador: só o servidor.
- **Liberação em uma única função do banco** (security definer, chamada só pelo servidor): `grant_access_from_payment(mp_payment_id)` trava a linha, sai sem fazer nada se o pagamento já foi processado e aplica a regra de extensão. Isso evita duplicar ou estender duas vezes quando chegam avisos ao mesmo tempo.
- **Rotas no servidor:**
  - a criação da cobrança usa `createServerFn` com `requireSupabaseAuth` e `POST /checkout/preferences`, com `external_reference = order.id` e `notification_url`;
  - o webhook fica em `src/routes/api/public/mercadopago/webhook.ts`. Ele confere o cabeçalho `x-signature` (`ts` e `v1`) com HMAC-SHA256 do manifesto `id:<data.id>;request-id:<x-request-id>;ts:<ts>;` e comparação em tempo constante, recusa avisos com `ts` antigo, e depois consulta `GET /v1/payments/{id}`;
  - o acesso ao banco com privilégio total (`supabaseAdmin`) só é carregado dentro do código que roda após a verificação.
- **Tarefa agendada:** `/api/public/jobs/avisos-vencimento`, uma vez por dia, protegida por `authenticateCronRequest`.
- **Ajustes no que já existe:**
  - `CHECKOUT_URL` continua `null`. O botão de compra passa a chamar a função do servidor, e `commercial-access.test.ts` ganha testes das regras de extensão dos 12 meses e de não repetir liberação;
  - `is_catalog_admin()` continua como está;
  - o layout azul-petróleo é mantido e nada será publicado.
- **Ordem de entrega:** login e tabelas → painel do aluno → compra e webhook, testados com credenciais de teste → painel da administradora → aviso de 30 dias.
