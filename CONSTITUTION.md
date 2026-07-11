# CONSTITUTION

## Meta

- version: 1
- last_updated: 2026-07-10
- updated_by: zero-error/init
- changelog:
  - v1: Constitution inicial gerada pelo black box

## Invariantes

- Proibido `console.log` em produção (usar logger estruturado)
- Proibido TODO/FIXME/HACK no código

## Direção

- Objetivo: [definido pelo usuário]
- Prioridade: [definida pelo usuário]
- Pronto = 100% do critério de aceitação

## Padrões

- Linguagem: javascript
- Framework: Next.js

## Proibições

- Try/catch vazio ou que silencia erro
- Cast forçado (`as any`, `as unknown as X`)
- Lógica duplicada
- Abstrações usadas apenas uma vez
- Imports não-usados
- Funções > 50 linhas

## Doutrina do 100%

- 100% é o critério de aceitação mínimo
- Workarounds são proibidos
- Estudo pré-execução é obrigatório
- Fluxo: ENTENDER → ESTUDAR → PLANEJAR → EXECUTAR → VERIFICAR

## Configuração de Validação

- requireTests: true
- preCommitTimeout: 30
- prePushTimeout: 120
- ciTimeout: 600
- mutationThreshold: 80
- coverageThreshold: 80
