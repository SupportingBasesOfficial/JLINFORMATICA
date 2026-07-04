# CONTRIBUTING.md — Como Contribuir

Obrigado por contribuir com o base-template! Este documento guia o processo.

---

## Pré-requisitos

- Node.js 22+ (veja `.nvmrc`)
- pnpm 9+ (`corepack enable`)
- GitHub Codespaces ou ambiente local equivalente

---

## Setup

```bash
git clone https://github.com/SupportingBasesOfficial/base-template.git
cd base-template
pnpm install
```

---

## Fluxo de trabalho

### 1. Criar branch

```bash
git checkout -b feat/sua-feature
# ou: fix/seu-bug, docs/sua-doc, chore/sua-task
```

### 2. Desenvolver

- **Código em inglês** (variáveis, funções, classes, arquivos)
- **Comentários em português** (explicações de lógica)
- **Erros para usuário em português**
- **Sem `any`** — use tipos do `database.types.ts`
- **Sem console.log** — use `console.warn` ou `console.error`

### 3. Testar

```bash
pnpm lint          # ESLint
pnpm check-types   # TypeScript
pnpm test:run      # Vitest
pnpm build         # Next.js build
pnpm e2e           # Playwright (necessita dev server)
```

### 4. Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona componente Input no @repo/ui
fix: corrige redirect do auth callback
docs: atualiza README com novo fluxo
chore: atualiza dependências
```

O `commitlint` valida a mensagem automaticamente.

### 5. PR

- Preencha o template de PR
- Garanta que todos os checks passam
- Solicite review

---

## Padrões

### Adicionar componente shadcn/ui

```bash
npx shadcn@latest add input
# Adicione o arquivo em packages/ui/src/
# Exporte em packages/ui/src/index.ts
# Adicione export em packages/ui/package.json
# Crie stories em packages/ui/src/component.stories.tsx
```

### Adicionar migration

```bash
npx supabase migration new create_sua_tabela
# Edite o arquivo em supabase/migrations/
# Habilite RLS
# Atualize supabase/SCHEMA.md
# Rode: npx supabase db push && pnpm sync-db
```

### Adicionar rota no apps/web

```bash
pnpm gen:page -- --name users
# Cria apps/web/app/users/page.tsx com template
```

---

## Estrutura do monorepo

```
apps/web/          → Next.js App Router
packages/ui/       → Componentes shadcn/ui
packages/supabase/ → Client factories + tipos
packages/tailwind-config/  → CSS compartilhado
packages/typescript-config/ → tsconfigs
packages/eslint-config/    → ESLint flat config
```

---

## Não fazer

- Não adicione lógica de negócio no template (é DNA universal)
- Não commite sem `pnpm lint && pnpm check-types && pnpm test:run` passando
- Não edite `database.types.ts` manualmente
- Não use `npx supabase start` (use Cloud)
- Não adicione `any` em nenhum lugar
- Não misture idiomas no código (inglês) e comentários (português)
