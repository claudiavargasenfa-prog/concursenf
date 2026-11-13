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

