# Auditoria do ConcursEnf (nenhum arquivo foi alterado)

## 1. O que está pronto e funcionando
- **Página inicial (`/`)** em `src/routes/index.tsx`, com textos vindos de `src/lib/site-content.ts`. Os links para `/materiais`, `/plano-de-estudos`, `/questoes` e `/concurso` funcionam (linhas 84–93 e 170). A lista de disciplinas da Biblioteca já está alinhada.
- **Landing (`/concurso`)** em `src/routes/concurso.tsx`. Ela usa os blocos `Hero`, `Proof`, `Contents` e `Offer` de `src/components/lp/`, e os textos vêm de `src/lib/lp-content.ts`.
- **Questões (`/questoes`)** em `src/routes/questoes.tsx`. Já funcionam: filtro por disciplina e dificuldade, responder, ver o gabarito comentado e um histórico guardado só no navegador (`concursenf-question-history-v1`).
- **Plano de estudos (`/plano-de-estudos`)**: escolher assuntos (da lista `CONTENT_GROUPS`), dias e minutos por dia, gerar as tarefas e marcar como feitas. Tudo fica guardado só no navegador.
- **Materiais (`/materiais`)**: busca de verdade no banco de dados (áreas, cargos, bancas, concursos e documentos), com filtros, tela de erro com "Tentar novamente" e abertura de PDF por link temporário. A estrutura vem de `supabase/migrations/20261102000000_central_materiais.sql`.
- **Menu do topo** (`src/components/site/Header.tsx`) com acesso a todas as páginas.

## 2. Incompleto
- **Banco de questões pequeno:** são só 8 questões, escritas direto no código em `src/lib/practice-questions.ts`. Não existe tabela de questões no banco, nem filtro por banca, ano ou cargo (Técnico/Auxiliar).
- **Materiais sem conteúdo:** o banco já vem com áreas, cargos e bancas, mas nenhum concurso e nenhum documento. A página vai aparecer vazia, e não há tela para você enviar os PDFs.
- **Cores diferentes em `/materiais`:** essa página usa verde e dourado escritos à mão (`#174D3B`, `#D9C18B`, `#D7B56D`). Isso foge da paleta azul que você escolheu e da identidade definida para o site.
- **Progresso preso a um aparelho:** o histórico de questões e o plano de estudos ficam só no navegador. Se a pessoa trocar de celular ou limpar os dados, perde tudo.
- **Nenhum login:** o login está ligado no servidor, mas nenhuma página tem tela de entrar ou cadastrar. Quem acessa não consegue criar conta.

## 3. Só aparência, sem ação real
- **Botões de compra** (`CtaButton.tsx`): ficam desativados de propósito, porque o link de pagamento está vazio (`CHECKOUT_URL = null`). Os preços e bônus mostrados em `/concurso` são só texto, não existe venda funcionando.
- **E-mail de contato** `contato@academiadaenfermagem.com.br` (`lp-content.ts`, linha 19): ainda não confirmei se esse e-mail existe de verdade.
- **"Trilhas", "Biblioteca" e "Guias"** no menu: só rolam a página inicial até a seção. Cada pacote e guia é um cartão informativo, não abre conteúdo nenhum.
- **"16 áreas profissionais"** em `/materiais`: é um número escrito fixo, não vem da contagem real do banco.

## 4. Os 3 próximos passos mais importantes
1. **Contas e progresso salvo na nuvem.** Criar telas de entrar e cadastrar (e-mail e Google) e uma área só para alunos. Depois, guardar o histórico de questões e o plano de estudos no banco, ligados à conta de cada pessoa. Isso é a base para liberar acesso depois da compra.
2. **Banco de questões de verdade para Técnico e Auxiliar.** Levar as questões para o banco, com cargo, banca, ano, disciplina, assunto, dificuldade e comentário. Incluir uma tela simples para você cadastrar questões e um simulado cronometrado por cargo. As 8 questões atuais entram como ponto de partida.
3. **Encher a Central de Materiais e acertar o visual.** Criar uma tela para você enviar editais e provas, ligados a cada concurso. Trocar as cores verde e dourado de `/materiais` pela paleta azul do site. Mostrar a contagem real de áreas.

Depois disso: colocar seu link de pagamento e liberar o acesso aos alunos que compraram.

## Detalhes técnicos
- Passo 1: rota `/auth` e layout `_authenticated`; tabelas `profiles`, `question_attempts` e `study_plans` com RLS; migrar os dados do localStorage no primeiro login.
- Passo 2: tabela `questions` (com `role` técnico/auxiliar, `board_id`, `year`), e `user_roles` com papel admin protegendo o cadastro.
- Passo 3: envio para o bucket `concursenf-materiais`, que já existe. Usar os tokens do `src/styles.css` no lugar das cores hex.
- `/materiais` hoje lê o banco com `useEffect` e `supabase as any`. Vale migrar para loader com `ensureQueryData` e usar os tipos gerados.

Diga qual passo você quer começar e eu faço.
