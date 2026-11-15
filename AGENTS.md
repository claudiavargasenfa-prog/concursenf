<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Commercial links
- Keep commercial destinations in `src/lib/lp-content.ts`; a null checkout disables purchase controls so unfinished setup never sends visitors to third-party accounts.
- Never forward incoming query parameters automatically to commercial destinations; campaign URLs must not transfer inherited identifiers.

- Student answer data (attempts, question sessions, topic progress) is written only by the submit_exam_question_answer RPC; clients get read-only access so scores cannot be forged.
- Superseded SQL lives in docs/migrations-substituidas/; schema changes go through drizzle/migrations only.
