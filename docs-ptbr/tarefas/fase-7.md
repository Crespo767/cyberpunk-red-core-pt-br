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
