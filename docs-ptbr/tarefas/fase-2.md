# Fase 2: tarefas do executor

Tarefas da Fase 2 para o executor GPT-6.1 Terra (Codex, raciocínio alto), enviadas pelo diretor pela CLI. Os limites
do sandbox e o comando de chamada estão em `docs-ptbr/tarefas/fase-1.md`, seção "Como o executor roda".

## Situação verificada (diretor, 2026-11-03)

- Nenhum mundo real em `%USERPROFILE%\Documents\FoundryVTT\Data\worlds` usa o sistema `cyberpunk-red-core`. `teste` e
  `teste-claude` são `dnd5e`; os demais são `shadowdark`, `symbaroum` e `dnd5e`. A Fase 2 do plano (copiar um mundo v12
  do sistema e migrar) não tem mundo de origem. O escopo depende de decisão do dono.
- Cobertura automática de migração na suíte Playwright (verde, Fase 1): specs de 039, 042, 044, 046 e da tela de
  migração (8 testes). As outras migrações entre 025 e 048 não têm spec.

## Tarefa 2.0: trocar o global `DragDrop` depreciado

```text
Você é o executor do projeto de migração do Cyberpunk RED Core para Foundry VTT v13 com tradução PT-BR. Trabalhe só em
%USERPROFILE%\Documents\Cyberpunk RED - PTBR (branch main). Leia antes: CLAUDE.md (seções Commit structure, System
Architecture e Testing), src/modules/actor/sheet/cpr-actor-sheet.js (perto da linha 1480),
tools/playwright/session/console-harness.mjs, tests/playwright/actors/character-sheet-gear.spec.mjs (exemplo de uso de
page.consoleWarnings) e os helpers em tools/playwright/ui/.

PROBLEMA (verificado pelo diretor no Foundry 13.350)
Ao abrir as fichas de character, mook e container, o console avisa 1 vez por ficha:
  You are accessing the global "DragDrop" which is now namespaced under
  foundry.applications.ux.DragDrop.implementation
  Deprecated since Version 13. Backwards-compatible support will be removed in Version 15
Origem: src/modules/actor/sheet/cpr-actor-sheet.js:1480, "return new DragDrop(d);" em #createDragDropHandlers().
O JSDoc logo acima cita "{DragDrop[]}".

PEDIDO
1. Teste de regressão (o diretor commita antes da correção): um spec Playwright novo, por exemplo
   tests/playwright/actors/actor-sheet-drag-drop.spec.mjs, que abre a ficha de um character, de um mook e de um
   container e falha se page.consoleWarnings tiver algum aviso contendo 'global "DragDrop"'. Crie e apague os atores
   pelos helpers de tools/playwright/ui/ (regra do CLAUDE.md: nada de Actor.create direto em spec). Siga o padrão dos
   specs existentes (installConsoleErrorHarness, fixtures, nomes).
2. Correção: use foundry.applications.ux.DragDrop.implementation no lugar do global e ajuste o JSDoc. Não mude mais
   nada no arquivo.
3. Não altere en.json nem outros arquivos de src/.

SANDBOX
- .git é somente leitura: não rode git add nem git commit.
- Não rode npm run test:unit nem npm run test:playwright (spawn EPERM). O diretor roda o spec novo fora do sandbox,
  antes e depois da correção.
- Rode npm run lint, npm run prettier e npx vitest run --pool=threads (as falhas de process.chdir em
  playwright-harness-config.test.js são do sandbox).
- Não crie arquivos de log no projeto nem em node_modules. Não toque em %USERPROFILE%\Documents\FoundryVTT.

CRITÉRIO DE ACEITE
- Diff restrito ao spec novo e a src/modules/actor/sheet/cpr-actor-sheet.js.
- Nenhuma ocorrência de "new DragDrop(" em src/ (confirme com uma busca).
- lint e prettier com código 0.

RELATÓRIO (devolva exatamente isto)
1. git status e git diff completo (inclua o arquivo novo com git diff --no-index ou o conteúdo inteiro).
2. Resultado da busca por "DragDrop" em src/.
3. Saídas resumidas de npm run lint, npm run prettier e npx vitest run --pool=threads.
4. Duas mensagens de commit em português: o spec (primeiro) e a correção.
```

## Decisão do dono (2026-11-03): criar testes extras de migração

Specs Playwright para as 21 migrações sem cobertura, em 4 lotes que só criam arquivos novos e podem rodar em paralelo:

| Lote | Migrações                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------- |
| A    | 025 role abilities, 026 item quality, 027 skill type, 028 ignore armor, 029 armor penalties, 030 isElectronic |
| B    | 031 netarch tiles, 032 ammo installable, 033 UUIDs para ids, 034 cprInstallTree flag, 035 weapon skill        |
| C    | 036 allowed types, 037 invalid upgrades, 038 medtech role, 040 ammo icons, 041 unused install flag            |
| D    | 043 ignored by browser, 045 cyberweapon icons, 047 role icons, 048 icon spelling                              |

São testes de comportamento existente: devem passar contra o código atual. Se um teste mostrar que a migração não faz o
que promete, o executor não corrige `src/`; o diretor registra como achado (F) e decide com o dono.

## Tarefa 2.1: specs de migração (um prompt por lote)

O diretor troca `<LOTE>` e `<MIGRAÇÕES>` pelos valores da tabela.

```text
Você é o executor do projeto de migração do Cyberpunk RED Core para Foundry VTT v13 com tradução PT-BR. Trabalhe só em
%USERPROFILE%\Documents\Cyberpunk RED - PTBR (branch main). Este é o lote <LOTE> de testes de migração.

LEIA ANTES
- CLAUDE.md (seções Migrations e Testing) e tests/playwright/migrate/README.md.
- Specs de referência: tests/playwright/migrate/source-to-sources-migration.spec.mjs e
  tests/playwright/migrate/damage-crit-migration.spec.mjs (padrão: gotoReadyWorld, import do script da migração dentro
  da página via /systems/${game.system.id}/modules/system/migrate/scripts/<arquivo>.js, chamada de
  updateItem/updateActor/etc. em objetos no formato antigo, comentário de cabeçalho explicando a migração).
- A classe base em src/modules/system/migrate/ (para saber quais métodos cada migração implementa) e os scripts deste
  lote em src/modules/system/migrate/scripts/: <MIGRAÇÕES>.

PEDIDO
Para cada migração do lote, crie um spec novo em tests/playwright/migrate/, nome
"<NNN>-<assunto-curto>-migration.spec.mjs" (ex.: 025-role-abilities-migration.spec.mjs), com:
1. Comentário de cabeçalho: o que a migração faz, em 2 a 5 linhas, tirado do código.
2. Um teste por comportamento do script: o formato antigo vira o novo; dados que não se aplicam ficam intactos; a
   segunda execução não muda nada (idempotência), quando o script for idempotente.
3. Se a migração atua em documentos que não passam por updateItem/updateActor (tiles, cenas, flags, pacotes), siga a
   exceção do README: pode semear com as APIs de documento, e apague no fim do teste o que criou.
4. Nomes de teste começando pelo número da migração, como nos specs existentes.
Não altere nenhum arquivo existente. Só crie os specs deste lote.

SE ENCONTRAR UM PROVÁVEL BUG
Se a leitura do código mostrar que a migração não faz o que o nome, o comentário ou o changelog dizem, NÃO altere src/.
Escreva o teste com o comportamento esperado, marque com test.fixme e explique no relatório.

SANDBOX
- .git é somente leitura: não rode git add nem git commit.
- Não rode npm run test:playwright nem npm run test:unit (spawn EPERM). O diretor roda os specs fora do sandbox.
- Rode npm run lint e npx prettier --check nos arquivos novos (esperado: código 0).
- Não crie arquivos de log no projeto nem em node_modules. Não toque em %USERPROFILE%\Documents\FoundryVTT.

CRITÉRIO DE ACEITE
- Um spec novo por migração do lote; nenhum arquivo existente alterado.
- lint e prettier com código 0.

RELATÓRIO (devolva exatamente isto)
1. git status.
2. Para cada spec: arquivo, lista dos testes e o comportamento que cada um prova (1 linha cada).
3. Possíveis bugs encontrados (ou "nenhum"), com o trecho do código.
4. Saídas resumidas de npm run lint e npx prettier --check.
5. Uma mensagem de commit em português para o lote.
```

## Resultado da Fase 2 (diretor, 2026-11-03)

- Tarefa 2.0: spec `db16b2a` (3 falhas sem a correção) e correção `7f6a67c` (`DragDrop` do namespace). Spec novo 3/3;
  specs de atores com arrastar e soltar 118/118.
- Tarefa 2.1: commits `d82a6e8` (lote A), `fdd454c` (B), `208c4e2` (C) e `57b27a1` (D). 20 specs novos: **30 passed,
  7 skipped** (`test.fixme`). Lint e prettier com código 0.
- Na revisão: o spec da 030 tinha nomes não-ASCII perdidos na gravação do sandbox (corrigido com escapes `\u`); o
  `fixme` da 034 foi removido, porque a remoção da flag antiga é da 041 por design.
- Com os specs anteriores (039, 042, 044, 046), todas as 24 migrações de 025 a 048 têm teste.

### Achados (F) nas migrações, confirmados pelo diretor no código e sem correção

| Migração | Problema                                                                                             | Efeito em mundos antigos                        |
| -------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 027      | Prefixos `localexpert`, `martialart`, `playinstrument` sem espaço; "Local Expert (…)" vira `generic` | Tipo de perícia errado                          |
| 031      | `tile.update(...)` sem `await`                                                                       | A migração pode terminar antes das atualizações |
| 036      | `["program", allowedTypes.filter(...)]` cria array aninhado                                          | `allowedTypes` malformado                       |
| 037      | `actorData ? actorDataItem : gameItem` ignora o item do mundo                                        | Remove upgrades válidos do mundo                |
| 038      | Habilidade de Medtech com nome desconhecido perde o nome                                             | Habilidade personalizada sem nome               |
| 041      | Recursão lê `flags.cprInstallTree`, não a árvore no escopo do sistema                                | Sobra flag antiga em níveis profundos           |
| 047      | Compara só `doc.name`; nomes traduzidos (Babele) não casam                                           | Papel traduzido mantém o ícone antigo           |

Todas afetam só mundos que ainda vão migrar de versões antigas do sistema. O dono não tem mundos do sistema.

## Decisão do dono (2026-11-03): corrigir os 7 achados antes da Fase 3

Uma tarefa por migração, em paralelo (cada uma mexe só no próprio script e no próprio spec). Para cada uma, o diretor
faz dois commits: primeiro o spec com o `test.fixme` trocado por `test` (o teste falha), depois a correção (o teste
passa). As correções ficam no próprio script, sem migração nova: só valem para mundos que ainda vão passar por aquela
versão. O dono não tem mundos do sistema.

## Tarefa 2.2: corrigir uma migração (um prompt por migração)

O diretor troca `<NNN>`, `<SCRIPT>`, `<SPEC>`, `<TESTE>` e `<PROBLEMA>`.

```text
Você é o executor do projeto de migração do Cyberpunk RED Core para Foundry VTT v13 com tradução PT-BR. Trabalhe só em
%USERPROFILE%\Documents\Cyberpunk RED - PTBR (branch main). Tarefa: corrigir a migração <NNN>.

ARQUIVOS (os únicos que você pode alterar)
- Script: src/modules/system/migrate/scripts/<SCRIPT>
- Spec:   tests/playwright/migrate/<SPEC>

PROBLEMA (confirmado pelo diretor no código)
<PROBLEMA>
O spec já tem o teste test.fixme("<TESTE>", ...), que descreve o comportamento esperado.

PEDIDO
1. No spec, troque test.fixme por test nesse teste. Não mude a expectativa dele, salvo se ela estiver errada em
   relação ao comentário do script; nesse caso, explique no relatório.
2. Corrija o script com a menor mudança possível, no estilo do arquivo. Não crie migração nova nem mude o número da
   versão. Não altere os outros testes do spec: eles têm de continuar passando.
3. Leia CLAUDE.md (seção Migrations) e a classe base em src/modules/system/migrate/base-migration-script.js antes de
   mexer.

SANDBOX
- .git é somente leitura: não rode git add nem git commit.
- Não rode npm run test:playwright nem npm run test:unit (spawn EPERM). O diretor roda o spec fora do sandbox, antes e
  depois da correção.
- Rode npm run lint e npx prettier --check nos dois arquivos (esperado: código 0). Grave em UTF-8.
- Não crie arquivos de log no projeto nem em node_modules. Não toque em %USERPROFILE%\Documents\FoundryVTT.

RELATÓRIO (devolva exatamente isto)
1. git diff dos dois arquivos.
2. Por que a correção resolve o problema, em até 3 linhas.
3. Se mundos que já passaram por esta migração com o bug precisariam de uma migração de reparo (sim/não e por quê,
   em até 2 linhas). Não crie a migração.
4. Códigos de saída de lint e prettier.
5. Duas mensagens de commit em português: spec (primeiro) e correção.
```

## Resultado da Tarefa 2.2 (diretor, 2026-11-03)

- 14 commits, de `6301cd0` a `fb34720`: para cada migração (027, 031, 036, 037, 038, 041, 047), o spec com o teste
  ativado e depois a correção no script.
- Prova: com só os specs, 7 failed e 10 passed (exatamente os testes ativados); com as correções, 17 passed.
- Regressão: lint e prettier com código 0; `test:unit` 172/172; `npm run test:playwright` completo **453 passed
  (57,7 min)** no Windows.
- Pendência para quem distribuir o sistema: as correções valem só para mundos que ainda vão passar por essas versões.
  Mundos que já migraram com o bug mantêm os dados afetados e precisariam de uma migração de reparo nova. Nas
  migrações 037 e 038 os dados perdidos não podem ser recuperados automaticamente.
