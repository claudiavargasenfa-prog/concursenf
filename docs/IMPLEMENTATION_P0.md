# Implementação P0 — Núcleo único de aprendizagem

## Entregas desta etapa
- Catálogo curricular compartilhado por concurso, disciplina e assunto.
- Referências opcionais de disciplina e assunto em conteúdos, questões e flashcards.
- Backfill baseado nos dados existentes, sem exclusão de registros.
- Estruturas de progresso, sessões, revisões e simulados.
- Serviços compartilhados para catálogo, atividades e progresso.
- Políticas RLS para dados individuais e administração do catálogo.
- Documentação técnica da arquitetura e dos fluxos.

## Não concluído nesta etapa
- Integração de todas as telas existentes com os novos serviços.
- Interface de flashcards e repetição espaçada.
- Execução de simulados.
- Dashboard consolidado por assunto.
- Classificação efetiva de armadilhas FGV.
- Teste de isolamento com contas reais.

## Validação
A migration precisa ser aplicada em ambiente Supabase antes de validar consultas e RLS em execução. O build e a análise estática devem ser executados pelo GitHub Actions. Nenhuma funcionalidade é considerada operacional apenas pela existência de tabela ou interface.

## Auditoria e integração P0.2 — 13/11/2026

### Alterações realizadas no repositório
- A rota de questões registra uma sessão em study_sessions após a RPC de correção, quando a questão possui subject_id e topic_id. A falha secundária de registro não invalida a resposta já corrigida.
- A consulta de revisões pendentes usa IS NULL para completed_at, evitando comparar a coluna com igualdade a NULL.
- Nova migration aditiva endurece get_published_exam_questions: somente id e text das alternativas são serializados na resposta; campos extras do JSON de origem não são enviados ao cliente.
- A mesma migration remove escrita direta dos alunos em learning_progress; a leitura permanece limitada ao próprio usuário e a atualização dos contadores de questões ocorre na RPC SECURITY DEFINER.

### Resultado da auditoria funcional
- Questões: PARCIAL. RPC protegida e histórico legado/local existentes; sessão curricular agora é registrada quando há IDs. Não há duração capturada nem teste E2E conectado ao banco.
- Conteúdos: PENDENTE. Existe serviço de catálogo, mas não foi localizada uma tela de estudo do conteúdo integrada a recordStudySession.
- Flashcards: PENDENTE. Há tabela e serviço de avaliação, mas não foi localizada rota operacional de estudo/revisão de flashcards.
- Revisões: PARCIAL. Serviço de consulta/conclusão existe; consulta de pendentes corrigida. Não há regra de repetição espaçada e não foram criados intervalos artificiais.
- Simulados: PENDENTE. Estrutura e serviço de início existem; não há fluxo seguro de questões, submissão, conclusão e cálculo de resultado.
- Dashboard: PENDENTE. Não foi identificada rota própria de dashboard do aluno consumindo o núcleo. Não foram criados indicadores fictícios.
- Plano de estudos: PARCIAL. Persiste plano individual em exam_study_plans, mas usa catálogo estático e não registra eventos reais de estudo no núcleo.
- Radar FGV: PENDENTE. A arquitetura atual guarda tentativas e assunto, mas ainda não possui taxonomia de distratores/armadilhas nem classificação validada de erros.

### Segurança e banco
- A migration P0 e a migration 20261113180000_endurecer_nucleo_aprendizagem.sql não foram aplicadas ao banco remoto.
- Não há confirmação verificável de staging, backup recente, histórico remoto de migrations ou mecanismo de recuperação. A aplicação em produção permanece BLOQUEADA.
- As migrations existentes criam funções SECURITY DEFINER com search_path fixado. A listagem de questões foi endurecida para não confiar no conteúdo integral do JSON de alternativas.
- A integridade da política RLS, ownership das funções e comportamento real do PostgreSQL/Supabase ainda exigem validação em ambiente controlado.

### Testes
- Build, TypeScript, lint e testes E2E não foram executados neste ambiente após as alterações. O GitHub Actions deverá confirmar as verificações automatizadas do novo commit.
- Não foram simuladas duas contas para comprovar isolamento entre alunos.
- A migration de backfill associa registros somente por correspondência exata de exam_slug, subject e topic; vínculos sem correspondência permanecem nulos. Ainda falta relatório executável de registros sem classificação no banco.


## Missão P0.3 — integração de jornada do aluno (13/11/2026)

### Verificação da P0.2
- Os quatro commits da P0.2 estão presentes na branch main.
- GitHub Actions dos commits e2a4416, da6b95e, 55cacfa e 361ae78 concluíram com sucesso.
- Isso comprova as verificações configuradas no workflow, não valida a migration no Supabase nem substitui testes E2E.

### Entrega de interface
- Criada a rota /aprendizagem, reutilizando catalog.service.ts, activity.service.ts e review.service.ts.
- O painel exige autenticação e consulta sessões, flashcard_reviews e revisões do usuário autenticado.
- Conteúdos publicados podem ser acessados, abertos no painel e marcados como concluídos em ações distintas. Cada ação gera study_sessions com metadados explícitos; conclusão é autodeclarada e não significa domínio.
- Flashcards publicados podem ser selecionados, ter resposta revelada e receber uma das quatro avaliações de lembrança. A avaliação só aparece no histórico após persistência confirmada.
- Indicadores mostram acessos a conteúdos, conteúdos marcados concluídos, sessões de questões registradas no núcleo, aproveitamento calculado a partir das sessões com metadado isCorrect, flashcards avaliados e revisões pendentes.
- O cabeçalho inclui acesso à nova área do aluno.

### Definições dos indicadores
- Conteúdos acessados: quantidade de IDs distintos de conteúdo com sessão activity_type=content.
- Conteúdos concluídos: quantidade de IDs distintos com sessão content e completed=true; representa declaração do aluno, não domínio.
- Questões registradas: quantidade de sessões activity_type=question recuperadas no histórico limitado a 200 eventos.
- Aproveitamento: acertos divididos por sessões de questão com resultado isCorrect=true, considerando o conjunto de sessões retornado; não representa domínio global e pode ser nulo sem dados.
- Flashcards revisados: quantidade de avaliações recuperadas no histórico limitado a 200.
- Revisões pendentes: agendas vencidas e não concluídas retornadas pelo serviço existente; não inclui revisões futuras nem gera intervalos automáticos.

### Limitações e segurança
- A rota depende da existência das tabelas e migrations P0/P0.2 no Supabase. Como elas não foram aplicadas/confirmadas no ambiente remoto, a operação real ainda não pode ser certificada.
- Não foi criado algoritmo de repetição espaçada nem intervalo automático.
- A avaliação do flashcard é persistida em flashcard_reviews; a agenda de revisão só é exibida quando existe registro em review_schedules.
- O fluxo de questões permanece na rota /questoes e grava sessões quando a RPC corrige a resposta e a questão possui IDs curriculares.
- O plano de estudos legado ainda não sincroniza a conclusão de tarefas com study_sessions; permanece pendente.
- Simulados continuam sem fluxo completo de resposta/correção/conclusão.
- Não foi possível executar jornada E2E autenticada, validar persistência após novo login ou isolamento de duas contas sem staging e credenciais de teste autorizadas.
- Nenhum registro foi criado em contas reais. Nenhuma migration foi aplicada remotamente.

### Próximas validações
- Executar GitHub Actions para a rota /aprendizagem e corrigir falhas de build/TypeScript/lint.
- Em staging isolado, criar usuário e conteúdo/questões/flashcards de teste e executar jornada completa; verificar os mesmos IDs em study_sessions, exam_question_attempts, flashcard_reviews e dashboard após novo login.
- Executar teste de autorização com dois usuários e confirmar que RLS impede leitura cruzada.
