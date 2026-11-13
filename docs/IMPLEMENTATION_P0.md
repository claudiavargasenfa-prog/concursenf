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
