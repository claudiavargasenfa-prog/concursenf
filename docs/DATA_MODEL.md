# Modelo de dados P0

| Entidade | Finalidade | Relacionamento principal |
|---|---|---|
| `learning_subjects` | Disciplinas por concurso | Uma disciplina possui assuntos |
| `learning_topics` | Assuntos curriculares | Pertence a uma disciplina |
| `exam_content_items` | Conteúdo didático | Referências opcionais a disciplina e assunto |
| `exam_questions` | Questões | Referências opcionais a disciplina e assunto |
| `exam_flashcards` | Cartões de memória | Referências opcionais a disciplina e assunto |
| `exam_question_attempts` | Resposta individual | Usuário, questão, disciplina e assunto |
| `learning_progress` | Domínio por assunto | Usuário e assunto |
| `study_sessions` | Sessões de aprendizagem | Usuário, atividade e assunto |
| `flashcard_reviews` | Histórico de revisão | Usuário e flashcard |
| `review_schedules` | Revisões futuras | Usuário, assunto e origem |
| `exam_simulations` | Definição de simulados | Concurso e conjunto de questões |
| `exam_simulation_attempts` | Tentativas de simulado | Usuário e simulado |

## Integridade e compatibilidade
As novas referências nos recursos existentes são opcionais para preservar linhas legadas. A migração cria o catálogo a partir dos pares de disciplina/assunto já existentes. Registros sem correspondência exata permanecem preservados e sem vínculo até curadoria.

## Isolamento
Dados de progresso, sessões, revisões, tentativas e simulados são protegidos por RLS e vinculados a `auth.uid()`. O catálogo curricular ativo pode ser lido publicamente; somente administradores podem alterá-lo.
