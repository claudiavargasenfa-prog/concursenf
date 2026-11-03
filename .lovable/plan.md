# ConcursEnf: Área do Aluno, Mercado Pago e Avaliação com nota (SCORE)

## 1. Situação atual (conferida no código)
- **Mercado Pago:** não existe nenhuma integração. `CHECKOUT_URL = null` (`src/lib/lp-content.ts`), e o teste `commercial-access.test.ts` exige que continue vazio. Os únicos segredos guardados são `LOVABLE_API_KEY` e `LOVABLE_CRON_SECRET`.
- **Contas e login:** ligados (e-mail/senha e Google), mas o site não tem tela de entrar, nem área restrita, nem botão "Entrar".
- **Banco de dados:** só as 6 tabelas da Central de Materiais. A administradora é reconhecida por `is_catalog_admin()`, que olha `app_metadata.role`.
- **Questões:** são só 8, escritas direto no código em `src/lib/practice-questions.ts`. O histórico fica apenas no navegador.
- **Avisos:** nenhum domínio de e-mail e nenhuma tarefa agendada.

## 2. Planos anuais (já confirmados)
| Plano | Parcelado (cartão) | À vista (Pix ou cartão 1x) |
|---|---|---|
| Enfermeiro | 12x R$ 37,99 (total R$ 455,88) | R$ 357,99 |
| Técnico + Auxiliar (pacote conjunto) | 12x R$ 33,99 (total R$ 407,88) | R$ 317,99 |

- Não existe plano só de Auxiliar.
- O preço à vista é menor que o total parcelado, e o Mercado Pago só aceita um valor por cobrança. Por isso cada plano terá **dois botões**:
  - "À vista": Pix ou cartão em 1x, pelo valor à vista;
  - "Parcelado em 12x": só cartão, pelo total parcelado, em até 12 vezes.
- O webhook confere se o valor pago é exatamente o da opção escolhida.
- Os valores ficam guardados no banco, nunca no navegador.

## 3. Área do Aluno e liberação pelo Mercado Pago
```text
Aluno logado -> escolhe plano e forma de pagar -> o servidor cria a cobrança
   (com uma referência ligada ao pedido) -> o aluno paga no Mercado Pago
-> o Mercado Pago avisa o site (webhook) -> o site confere a assinatura
-> o site consulta o pagamento na API do Mercado Pago
-> se aprovado, e se valor e moeda batem, libera ou renova (sem repetir)
```
- **Cadastro e login:** `/auth` e `/reset-password`. O topo mostra "Entrar" ou "Minha área / Sair". Cada aluno tem uma conta só, e a renovação usa a mesma conta.
- **Aviso do Mercado Pago:**
  - a assinatura é conferida e o aviso é recusado se não bater;
  - o pagamento é sempre consultado na API pelo número, sem confiar no conteúdo do aviso;
  - só `approved` libera. Pendente, em análise, rejeitado, cancelado ou estornado fica registrado, mas não libera;
  - se o mesmo pagamento chegar de novo, nada acontece (o número do pagamento é único).
- **Regra dos 12 meses:**
  - primeira compra: começa na aprovação e vence 12 meses depois;
  - renovação com acesso ainda válido: vence 12 meses depois do vencimento atual;
  - renovação depois de vencido: começa na nova aprovação.
- **Cada acesso fica ligado ao público do plano** (Enfermeiro ou Técnico + Auxiliar). Isso define quais avaliações aparecem para o aluno.
- **Aviso de 30 dias:** uma tarefa diária registra um único aviso por período de acesso e mostra no painel. O envio por e-mail fica pronto para ligar quando houver domínio de envio.
- **Administradora:** `enfa.contato@gmail.com` recebe o papel de administradora quando criar a conta. Ela acompanha alunos, vencimentos e pagamentos. Não libera acesso na mão.

## 4. Avaliação de aprendizagem e SCORE
### Critérios e fórmulas
- **Questão válida:** questão publicada, com gabarito definido e sem anulação. Questões anuladas depois saem do cálculo e a nota é refeita.
- **Nota de uma tentativa:** acertos ÷ questões válidas respondidas × 10, arredondada a 1 casa. Questão em branco conta como erro.
- **Nota de assunto (subtópico):** usa a tentativa mais recente que tenha pelo menos o mínimo de questões daquele assunto. Assim a nota mostra o domínio atual, não o passado.
- **Nota de matéria:** média das notas de assunto da matéria, com peso pelo número de questões válidas de cada assunto. Se faltar nota em algum assunto, aparece "parcial", e nunca 0 inventado.
- **Faixas:**
  - 0 a 6,9 = **Baixo**: reforço prioritário;
  - 7,0 a 8,9 = **Médio**: revisão direcionada;
  - 9,0 a 10 = **Ótimo**: domínio demonstrado.
- **Quantidade mínima configurável** por avaliação: padrão de 10 questões por matéria e 3 por assunto. Se o banco não tiver o mínimo, a avaliação aparece como **"Em preparação"** e não gera nota. Com as 8 questões atuais, nenhuma avaliação oficial abre. Elas continuam no modo prática, que não conta nota.
- **Sorteio:** tira questões do assunto sem repetir as da última tentativa, quando houver questões suficientes. A ordem das alternativas é embaralhada.

### Fluxo de reforço (não bloqueia o aluno)
```text
Estuda a matéria -> marca como concluída -> faz a avaliação
-> nota por assunto -> Baixo: reforço prioritário (material + prática do assunto)
                    -> Médio: revisão direcionada
                    -> Ótimo: segue a trilha
-> depois de nova prática, sugere reavaliar o assunto -> a evolução aparece no histórico
```
- As recomendações são calculadas a partir das notas. O aluno pode continuar em qualquer matéria.

### Telas
- **`/minha-area`:** situação e vencimento do acesso, aviso de 30 dias, e o **mapa de desempenho**: matérias com a faixa por cor e os assuntos abertos em cada uma. Também mostra pontos fortes (9 ou mais), pontos fracos (abaixo de 7) e a lista "Próximos passos".
- **`/avaliacoes`:** avaliações disponíveis para o público do aluno, com o status "Disponível" ou "Em preparação".
- **`/avaliacoes/$id`:** a prova, com o resultado ao final: nota por assunto e comentários.
- **`/minha-area/evolucao`:** gráfico da nota de cada matéria e assunto ao longo do tempo.
- **`/admin/alunos`:** vencimentos e pagamentos.
- **`/admin/desempenho`:** médias e distribuição por faixa em cada matéria e assunto, e quais assuntos mais aparecem como fracos. São só números agregados, sem nomes ou e-mails. Grupos com menos de 5 alunos ficam ocultos.
- **`/admin/questoes`:** cadastro e publicação de questões, para aumentar o banco sem inventar conteúdo.

## 5. Decisão que ainda preciso de você
- **Mínimo de questões por avaliação.** Proponho 10 por matéria e 3 por assunto, ajustável depois pelo painel da administradora. Se não disser nada, uso esse padrão.

## Credenciais do Mercado Pago necessárias
Nenhuma é colada no chat: vão em Configurações do Projeto → Segredos quando eu pedir.
- **Access Token de produção** (`MERCADOPAGO_ACCESS_TOKEN`), e o de teste, opcional, para testar antes.
- **Assinatura secreta do webhook** (`MERCADOPAGO_WEBHOOK_SECRET`), gerada no painel do Mercado Pago, em Webhooks.
- **URL de notificação** para cadastrar lá, com o evento Pagamentos marcado. Eu entrego pronta: `https://concursenf.lovable.app/api/public/mercadopago/webhook`.
- **Public Key:** não é necessária, porque o pagamento acontece na página do próprio Mercado Pago.

## Detalhes técnicos
**Tabelas** (todas com GRANT, RLS e `service_role`):
- **Contas e pagamento:**
  - `profiles`, `user_roles` com o enum `app_role` e a função `has_role()`;
  - `plans`: `slug` ('enfermeiro', 'tecnico_auxiliar'), `audience`, `duration_months = 12`, `active`;
  - `plan_prices`: `plan_id`, `mode` ('avista' ou 'parcelado'), `amount_cents`, `max_installments`, `allowed_methods`;
  - `checkout_orders`: `user_id`, `plan_price_id`, `external_reference` único, `status`;
  - `payments`: `mp_payment_id` único, `status`, `status_detail`, `amount`, `currency`, `payment_method`, `installments`, `date_created`, `date_approved`, `external_reference`, `raw` (jsonb), `processed_at`;
  - `student_access`: uma linha por usuário, `plan_id`, `audience`, `starts_at`, `expires_at`, `last_payment_id`;
  - `access_notifications`: chave única por acesso, vencimento e tipo de aviso;
  - `payment_audit_log`.
- **Questões e avaliações:**
  - `subjects`, `topics` (por matéria), `questions` (`topic_id`, `audience[]`, `difficulty`, `statement`, `explanation`, `reference`, `status` com os valores draft, published ou annulled);
  - `question_options`, com `is_correct` visível só no servidor;
  - `assessment_settings`, com o mínimo por matéria e por assunto;
  - `assessments`, `assessment_attempts` (`user_id`, `subject_id`, `started_at`, `submitted_at`, `score`, `valid_count`, `correct_count`), `attempt_answers` e `attempt_topic_scores`;
  - a view `topic_mastery`, com a nota atual por usuário e assunto;
  - a view `admin_performance_agg`, só com números agregados e corte de 5 alunos;
  - `study_progress`, com o que o aluno marcou como concluído.

**Proteção:**
- O aluno lê só o que é dele.
- O gabarito (`is_correct`) nunca chega ao navegador. A correção é feita no servidor por `createServerFn` com `requireSupabaseAuth`, que grava a tentativa e as notas.
- Gravar em `payments`, `student_access` e notas é permitido só ao servidor.
- A administradora lê os números agregados por `has_role`. A leitura dos dados de cada aluno fica restrita a `/admin/alunos`, só com nome, e-mail e vencimento.
- Fazer avaliação exige `student_access` válido e o mesmo público da questão.

**Mercado Pago:**
- Criação da cobrança: `POST /checkout/preferences`, com `external_reference` igual ao id do pedido e `payment_methods` ajustado por opção (o parcelado exclui Pix e permite até 12 parcelas).
- Webhook em `src/routes/api/public/mercadopago/webhook.ts`:
  - confere o HMAC-SHA256 de `x-signature` sobre `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`, com comparação em tempo constante e recusa de `ts` antigo;
  - consulta `GET /v1/payments/{id}`;
  - chama `grant_access_from_payment()`, uma função security definer que trava a linha e não processa duas vezes.

**Tarefas e testes:**
- Tarefa diária `/api/public/jobs/avisos-vencimento` com `authenticateCronRequest`.
- Testes de: fórmula da nota, limites das faixas (6,9 / 7,0 / 8,9 / 9,0), mínimo de questões, regra de extensão dos 12 meses, não liberar duas vezes e valores dos planos.

**Migração do que já existe:**
- As 8 questões atuais passam para o banco como rascunho ou prática, e só viram oficiais quando a administradora revisar.
- `is_catalog_admin()` é mantida. O layout azul-petróleo é preservado e nada é publicado.

**Ordem de entrega:**
1. login, papéis e tabelas;
2. painel do aluno;
3. Mercado Pago com credenciais de teste;
4. cadastro de questões e avaliação com nota;
5. mapa de desempenho e reforço;
6. painéis da administradora;
7. aviso de 30 dias.
