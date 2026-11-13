# Arquitetura do ConcursEnf

## Plataforma existente
O projeto utiliza React 19, TypeScript, TanStack Start/Router, Vite e Supabase. A navegação é baseada em rotas de arquivo em `src/routes`. A persistência e autenticação são fornecidas pelo cliente Supabase em `src/integrations/supabase/client.ts`.

## Arquitetura P0
A arquitetura de aprendizagem passa a usar um catálogo curricular compartilhado:
`concurso (exam_slug) → disciplina (learning_subjects) → assunto (learning_topics)`.
Conteúdos, questões e flashcards mantêm os campos textuais legados e recebem referências opcionais `subject_id` e `topic_id`. Essa transição preserva registros e permite migrar cadastros gradualmente.

## Serviços
- `catalog.service.ts`: catálogo curricular e consulta de conteúdos publicados.
- `activity.service.ts`: registro de sessões de estudo e revisões de flashcards.
- `progress.service.ts`: leitura e atualização do progresso por assunto.

Os serviços são a fronteira entre os componentes e a persistência. A interface existente pode ser migrada módulo a módulo, sem reescrita total.

## Segurança
As tabelas com dados individuais usam RLS e políticas vinculadas a `auth.uid()`. O catálogo é somente leitura para usuários públicos; alterações administrativas dependem de `is_catalog_admin()`. A correção de questões permanece no servidor.

## Limitações desta fase
A arquitetura está preparada para integrar as rotas existentes. A integração visual completa, o motor de repetição espaçada e o Radar FGV são fases posteriores.
