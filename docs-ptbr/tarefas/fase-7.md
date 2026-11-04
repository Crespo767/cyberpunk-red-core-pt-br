# Fase 7: pós-publicação

Trabalho depois da primeira publicação do fork (2026-11-04), a pedido do dono.

## Tarefa 7.1: migração de reparo 049

Reparar, em mundos que já passaram pelas migrações com bug, o que ainda dá para reparar automaticamente. As migrações
037 e 038 perderam dados e não têm reparo.

```text
Você é o executor do projeto Cyberpunk RED Core (Foundry v13, PT-BR), em C:\Users\heito\Documents\Cyberpunk RED - PTBR.
Tarefa 7.1: criar a migração de reparo 049.

LEIA ANTES
- CLAUDE.md (Migrations, Testing, Commit structure) e as instruções no topo de
  src/modules/system/migrate/base-migration-script.js (criar script, exportar em scripts/index.js, subir
  #LATEST_VERSION em src/modules/system/migrate/migration.js, hoje 48).
- As migrações corrigidas e seus specs: 027, 031, 036, 041, 047 (scripts em src/modules/system/migrate/scripts/ e
  specs em tests/playwright/migrate/), e a 043 (uso de flags.babele.originalName).

O QUE A 049 REPARA (mundos que rodaram as versões com bug)
1. 027: itens "skill" com skillType "generic" cujo nome (use flags.babele.originalName ?? name) começa, ignorando
   maiúsculas e espaços, por "localexpert", "martialart" ou "playinstrument" -> localExpert, martialArt,
   playInstrument. Não altere skills com outro skillType.
2. 031: tiles de cenas cujo texture.src ainda aponta para systems/<id>/tiles/netarch com PNG -> mesma troca da 031
   (PNG->WebP, .png->.webp), com await. Use migrateMisc, como a 031.
3. 036: installedItems.allowedTypes com arrays aninhados -> achatar (flat) e remover duplicados, em actors e itens com
   o mixin container (mesmos filtros da 036).
4. 041: flags.cprInstallTree antigas que sobraram nos níveis profundos da árvore em flags[game.system.id].cprInstallTree
   -> remover recursivamente (mesma lógica da 041 corrigida; use BaseMigrationScript.safeDelete).
5. 047: itens "role" com a imagem antiga Default_Role.svg cujo nome original (flags.babele.originalName ?? name) é um
   papel conhecido -> ícone do papel (mesma tabela da 047).
A migração deve ser idempotente e não tocar em dados que não se encaixam nesses casos.

PEDIDO
1. Spec primeiro (o diretor commita antes da migração): tests/playwright/migrate/049-repair-migration.spec.mjs, no
   padrão dos specs de migração (gotoReadyWorld, import do script na página, objetos no formato com bug), com um
   teste por reparo (1 a 5), um teste de idempotência e um de "dados corretos ficam intactos". Para o 031, siga o
   padrão do spec da 031 (semear e apagar o que criar).
2. Migração: src/modules/system/migrate/scripts/049-repair-buggy-migrations.js, export em scripts/index.js e
   #LATEST_VERSION = 49. Siga o estilo dos scripts existentes (comentário de cabeçalho curto, static version/name/
   documentFilters). Reuse helpers existentes (ContainerUtils.getInstallTreeFlag, safeDelete).
3. Não altere as migrações antigas nem outros arquivos.

SANDBOX
- .git é somente leitura (sem git add/commit). Não rode npm run test:playwright nem npm run test:unit (spawn EPERM).
  Rode npx vitest run --pool=threads (as falhas de process.chdir em playwright-harness-config.test.js são do sandbox),
  npm run lint e npx prettier --check nos arquivos novos/alterados.
RELATÓRIO: git status, diff completo (arquivos novos inteiros), saídas das checagens e duas mensagens de commit em
português (spec; migração).
```

## Tarefa 7.2: release 0.93.0-ptbr.2

```text
Você é o executor do projeto Cyberpunk RED Core (Foundry v13, PT-BR), em C:\Users\heito\Documents\Cyberpunk RED - PTBR.
Tarefa 7.2: preparar a versão 0.93.0-ptbr.2.

1. src/system.json: "version": "0.93.0-ptbr.1" -> "0.93.0-ptbr.2". Nada mais.
2. CHANGELOG.md: no topo, antes de "## Version 0.93.0-ptbr.1", a seção "## Version 0.93.0-ptbr.2" (inglês, mesmo
   formato), com o que mudou desde a 0.93.0-ptbr.1 (use git log --oneline 0.93.0-ptbr.1..HEAD):
   - Bug Fixes: Vampyres (Excellent Quality: +1 to attack, concealable); Yacht minimum rooms (4); register Babele
     translations on the babele.init hook instead of the deprecated Babele.get.
   - Action Needed / New Features (escolha a subseção adequada do padrão do arquivo): migration 049 repairs worlds
     already migrated by the buggy 027, 031, 036, 041 and 047 migrations; data lost by 037 and 038 cannot be
     restored.
3. CHANGELOG.pt-BR.md: a mesma seção em PT-BR ("## Versão 0.93.0-ptbr.2"), antes de "## Versão 0.93.0-ptbr.1",
   seguindo docs-ptbr/glossario-ptbr.md.
4. Formate: npx prettier --write e npx markdownlint --fix nos dois changelogs; npx markdownlint com código 0. JSON
   válido no system.json. UTF-8.

SANDBOX: .git é somente leitura (sem git add/commit). Não altere outros arquivos.
RELATÓRIO: git diff e duas mensagens de commit em português (versão; changelogs).
```

## Resultado da Fase 7 (diretor, 2026-11-04)

- Tarefa 7.1: migração 049 com spec (`2613978` e `988b0e5`). Na revisão: retirada a checagem de tipo que impedia o reparo de `allowedTypes` em atores `container`, e trocado um caso artificial do teste de dados intactos. Specs de migração 52/52.
- Tarefa 7.2: versão `0.93.0-ptbr.2` e changelogs em inglês e PT-BR (`e23129a`, `5ad2b0b`).
- Verificação: `test:unit` 177/177; lint 0; `test:playwright` **460/460 (59 min)**.
- Publicação: release `0.93.0-ptbr.2` marcado como mais recente, com zip e `system.json`. O manifesto `releases/latest/download/system.json` já responde com `0.93.0-ptbr.2` e o zip baixado é idêntico ao local. Pela regra de versões do Foundry, `0.93.0-ptbr.2` é mais nova que `0.93.0-ptbr.1`, então quem instalou a primeira recebe a atualização.

## Tarefa 7.3: compatibilidade a partir do Foundry 13.350

Pedido do dono: o sistema deve funcionar sem erros a partir do 13.350. 260 entradas de `src/packs/` têm
`_stats.coreVersion: "13.351"` (salvas pelo upstream numa build mais nova); no 13.350 o Foundry registra 71 erros "Documents
from a core version newer than the running version cannot be migrated". O formato dos dados não muda entre builds do v13.

```text
Você é o executor do projeto Cyberpunk RED Core (Foundry v13, PT-BR), em %USERPROFILE%\Documents\Cyberpunk RED - PTBR.
Tarefa 7.3: compatibilidade a partir do Foundry 13.350. NUNCA edite gulp/.

1. Teste primeiro (o diretor commita antes do resto): tests/unit/pack-core-version.test.js (Vitest, sem Foundry). Ele lê
   src/system.json (compatibility.minimum) e todos os YAML de src/packs/ (recursivo) e falha se algum
   _stats.coreVersion for mais novo que o minimum. Compare versões como o Foundry (partes separadas por ".", numéricas
   quando possível; "13" não é mais novo que "13.350"). Liste no erro os arquivos culpados. Use dependências já
   existentes (veja package.json; há parser de YAML disponível? se não houver, extraia o campo com regex simples e
   comente isso no teste).
2. Dados: em src/packs/**/*.yaml, troque coreVersion: "13.351" por coreVersion: "13.350". Só esse campo; nada mais.
3. src/system.json: compatibility.minimum de 13 para "13.350". Não altere verified nem maximum.
4. Versão 0.93.0-ptbr.3: src/system.json version; seção "## Version 0.93.0-ptbr.3" no topo do CHANGELOG.md (Bug Fixes:
   compendium documents no longer claim core 13.351, so Foundry 13.350 loads them without migration errors; minimum
   Foundry version is now 13.350) e a mesma em PT-BR ("## Versão 0.93.0-ptbr.3") no CHANGELOG.pt-BR.md. Formate os
   changelogs com prettier e markdownlint (código 0).

SANDBOX: .git é somente leitura (sem git add/commit). Não rode npm run test:unit (spawn EPERM): use
npx vitest run --pool=threads tests/unit/pack-core-version.test.js. Rode npm run lint e npx prettier --check no teste.
RELATÓRIO: git status, diff do system.json e dos changelogs, contagem de YAML alterados, teste inteiro, saídas das
checagens e mensagens de commit em português (teste; marcas dos compêndios; minimum; versão; changelogs).
```

## Resultado da Tarefa 7.3 (diretor, 2026-11-04)

- Commits do teste (`9046f4a`), das marcas (`117591c`), do minimum com a versão (`ac73925`) e dos changelogs (`29210c5`). O teste falha com as marcas 13.351 e passa com 13.350; `test:unit` 184/184; lint 0.
- Foundry 13.350 (Build 350): mundo novo sobe com 0 erros "newer than the running version" (antes, 71) e nenhum outro erro no log.
- `test:playwright` **460/460 (59,4 min)**.
- Release `0.93.0-ptbr.3` publicado (mais recente) com aprovação explícita do dono, depois de o modo Auto bloquear a primeira tentativa. Manifesto latest responde `0.93.0-ptbr.3` com `minimum: "13.350"`; zip baixado idêntico ao local.
