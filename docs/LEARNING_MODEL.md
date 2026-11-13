# Modelo de aprendizagem

## Hierarquia curricular
- Concurso: identificado pelo `exam_slug`.
- Disciplina: `learning_subjects`.
- Assunto: `learning_topics`, vinculado a uma disciplina.

## Recursos associados
`exam_content_items`, `exam_questions` e `exam_flashcards` preservam `subject` e `topic` para compatibilidade e passam a receber `subject_id` e `topic_id` opcionais.

## Percurso
Aprender (conteúdo) → praticar (questão) → registrar atividade → revisar (flashcard/revisão) → atualizar progresso → acompanhar evolução.

## Histórico e domínio
`exam_question_attempts` continua sendo a fonte de tentativas de questões; a migração acrescenta a classificação curricular e o resultado correto/incorreto. `learning_progress` mantém o estado consolidado por usuário e assunto. `study_sessions`, `flashcard_reviews` e `review_schedules` guardam eventos de aprendizagem e revisões.

## Serviços compartilhados
O catálogo, as atividades, o progresso, as revisões e os simulados são acessados por serviços em `src/lib/learning`. O cadastro administrativo cria ou reutiliza automaticamente a disciplina e o assunto no catálogo, preservando os rótulos textuais legados.

## Simulados
`exam_simulations` e `exam_simulation_attempts` são estruturas preparatórias. A interface e a execução de simulados não fazem parte da implementação P0.
