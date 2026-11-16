# Auditoria do mecanismo de migrations — Central de Administração

Data da auditoria: 16/11/2026  
Repositório: `claudiavargasenfa-prog/concursenf`  
Branch examinada: `main`

## 1. Objetivo

Identificar, a partir dos arquivos versionados e do histórico de automação do GitHub, qual mecanismo aplica migrations ao banco Supabase. Esta auditoria é somente documental e estática.

## 2. Evidências encontradas

### 2.1 Supabase

- Existe `supabase/config.toml`.
- O arquivo identifica o projeto Supabase pelo project_id `auobczbkqfbfkbbdwzjp`.
- Existem migrations SQL em `supabase/migrations/`, incluindo:
  - `20261111020000_central_administracao_site.sql`
  - `20261112200000_restringir_leitura_publica_site_settings.sql`
- O código da aplicação conecta ao Supabase pelo cliente em `src/integrations/supabase/client.ts`.

### 2.2 Drizzle

- Existe `drizzle.config.ts`, com dialect PostgreSQL, schema `./drizzle/schema.ts` e diretório de saída `./drizzle/migrations`.
- A conexão de migração é configurada pela variável `LOVABLE_DB_MIGRATION_URL`.
- `drizzle/schema.ts` está intencionalmente vazio.
- Existe um journal Drizzle com entradas 0000 a 0004 e migrations SQL correspondentes.
- O `package.json` não define scripts de migração e não há evidência, nos arquivos inspecionados, de um comando de execução Drizzle.

### 2.3 GitHub Actions

- O workflow encontrado é `.github/workflows/validate.yml`.
- Ele executa instalação de dependências, build, verificação TypeScript, Prettier e ESLint.
- O workflow não executa `supabase db push`, `supabase migration up`, `drizzle-kit migrate` nem outro comando de aplicação de SQL.
- Portanto, o workflow de validação não comprova nem realiza a aplicação das migrations.

### 2.4 Estado das execuções de CI

- Execuções recentes do workflow falharam na etapa de ESLint.
- Na execução examinada de 15/11/2026, build e TypeScript passaram; ESLint falhou com 12 ocorrências de `@typescript-eslint/no-explicit-any` em arquivos da aplicação.
- Essa falha é independente da aplicação de migrations e não demonstra falha do banco.
- Não foi feita correção de código nesta auditoria.

## 3. Conclusão técnica

**Não há evidência suficiente no repositório ou no workflow examinado para afirmar qual ferramenta efetivamente aplicou as migrations ao banco remoto.**

A presença de arquivos em `supabase/migrations/` e em `drizzle/migrations/` prova apenas que ambos os conjuntos estão versionados. A configuração Drizzle e a variável `LOVABLE_DB_MIGRATION_URL` não provam que Drizzle tenha sido executado. Da mesma forma, `supabase/config.toml` não prova que alguém tenha executado Supabase CLI ou aplicado SQL pelo SQL Editor.

A fonte oficial de aplicação deve ser confirmada no histórico de migrations do projeto Supabase e nos registros operacionais da equipe/proprietária do projeto. O repositório, sozinho, não permite concluir isso.

## 4. Procedimento seguro proposto

### Etapa A — somente leitura (pode ser realizada antes de qualquer autorização de escrita)

1. Abrir o projeto Supabase identificado no `supabase/config.toml`.
2. Consultar o histórico de migrations do projeto, sem inserir, excluir ou editar registros.
3. Verificar se as migrations `20261111020000` e `20261112200000` constam como aplicadas.
4. Executar o arquivo `docs/central-administracao-site-pre-validacao.sql` e guardar os resultados.
5. Conferir se já existem tabelas, políticas ou bucket com definições diferentes das esperadas.

### Etapa B — decisão do mecanismo

- Se o histórico do Supabase confirmar que as migrations Supabase são o padrão usado no projeto, manter Supabase CLI/SQL Editor como fonte única para esta funcionalidade.
- Não executar a cópia Drizzle `0004` depois de a migration Supabase equivalente já ter sido aplicada.
- Se houver evidência operacional documentada de que Drizzle é o executor oficial, interromper antes de qualquer aplicação e revisar o journal, a tabela de controle de migrations e a conexão usada.
- Não executar os dois mecanismos para o mesmo conjunto de alterações.

### Etapa C — aplicação (exige autorização expressa e confirmação do estado remoto)

1. Revisar as diferenças entre o SQL Supabase original e a cópia Drizzle.
2. Definir um único arquivo e um único executor, conforme a evidência obtida na Etapa B.
3. Fazer backup/ponto de restauração conforme os recursos disponíveis no projeto.
4. Aplicar somente as migrations ainda não aplicadas, pelo mecanismo confirmado.
5. Não editar manualmente o histórico de migrations para forçar sincronização.
6. Executar `docs/central-administracao-site-validacao.sql`.
7. Testar o acesso real à rota `/admin` com a conta administrativa autorizada.
8. Registrar resultado, data e commit correspondente.

## 5. Limites desta auditoria

- Nenhum acesso de escrita ao banco remoto foi realizado.
- Nenhuma migration foi executada.
- Nenhum deploy foi realizado.
- Nenhuma configuração de RLS ou Storage foi alterada.
- Nenhum crédito Lovable foi utilizado.
- A existência/ausência real das tabelas no banco remoto não foi consultada nesta auditoria.

## 6. Próxima ação necessária

A próxima ação segura é obter a leitura do histórico de migrations e os resultados da pré-validação no painel Supabase. Sem esses dados, não é tecnicamente seguro escolher ou executar um mecanismo de migração.
