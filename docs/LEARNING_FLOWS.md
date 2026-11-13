# Fluxos de aprendizagem

1. O aluno autentica-se.
2. Consulta disciplinas e assuntos ativos do concurso.
3. Abre conteúdo publicado associado ao assunto.
4. Resolve questão vinculada ao mesmo assunto.
5. A tentativa é registrada no servidor, sem expor o gabarito antecipadamente.
6. A atividade pode ser registrada em `study_sessions`.
7. O aluno revisa flashcards e o serviço registra a avaliação em `flashcard_reviews`.
8. O progresso é consolidado em `learning_progress`.
9. Revisões futuras podem ser consultadas em `review_schedules`.

O cadastro administrativo cria ou reutiliza a disciplina e o assunto no catálogo central e grava os IDs junto aos conteúdos, questões e flashcards.

Nesta fase os serviços e as tabelas são a fundação de integração. As telas existentes ainda precisam ser conectadas a esses serviços nos próximos incrementos.
