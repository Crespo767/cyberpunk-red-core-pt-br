# Fase 6: fechamento

Execução autônoma autorizada pelo dono em 2026-11-03.

## Situação verificada (diretor, 2026-11-04)

- A versão vem de `src/system.json` (`"version": "DUMMY_VALUE"`; o CI do upstream a substitui pela tag). Para o fork,
  aplicar a D5 (`0.93.0-ptbr.1`) direto no manifesto.
- O gulp não tem tarefa de zip (o CI do upstream empacota). O diretor gera o zip a partir do build com `adm-zip`.
- Risco para o dono decidir: `manifest` aponta para o pacote "latest" do GitLab oficial. `0.93.0-ptbr.1` é pré-versão,
  menor que `0.93.0` em semver, então o Foundry pode oferecer "atualizar" para a versão oficial em inglês e sobrescrever
  a tradução. Antes de instalar ou distribuir, apontar `manifest`, `download` e `url` para o repositório do fork (ou
  removê-los), e reconsiderar o número de versão.

## Tarefa 6.1: versão e changelog

```text
Você é o executor do projeto Cyberpunk RED Core (Foundry v13, PT-BR), em %USERPROFILE%\Documents\Cyberpunk RED - PTBR.
Tarefa 6.1 (fechamento). Leia CLAUDE.md, o topo de CHANGELOG.md e docs-ptbr/plano-migracao-v13-ptbr.md (D5).

1. src/system.json: troque "version": "DUMMY_VALUE" por "version": "0.93.0-ptbr.1". Não altere outros campos.
2. CHANGELOG.md (em inglês, no mesmo estilo e formato das seções existentes): acrescente no topo, antes de
   "## Version 0.93", uma seção "## Version 0.93.0-ptbr.1" com subseções no padrão do arquivo, descrevendo o que este
   fork mudou em relação ao 0.93 do upstream. Use o git log (git log --oneline c15bb95..HEAD) e os documentos em
   docs-ptbr/ como fonte. Itens esperados:
   - Brazilian Portuguese: interface translation completed (src/lang/pt-BR.json), terminology decisions (role names
     kept in English, REZ, Mook = Capanga), Babele compendium translations completed and corrected;
   - Fix: autofire DV table lookup with translated (Babele) table names;
   - Fix: deprecated global DragDrop in actor sheets;
   - Fix: seven historical migrations (027, 031, 036, 037, 038, 041, 047), one line each;
   - Tests: Playwright specs for all migrations 025-048; Windows support for the Playwright harness
     (PLAYWRIGHT_BROWSER_CHANNEL, FOUNDRY_NODE_PATH); stylelint glob fix for cmd.exe.
   Seja conciso: uma linha por item, como no resto do arquivo.
3. Valide: JSON válido em src/system.json; npx prettier --write CHANGELOG.md e npx markdownlint --fix CHANGELOG.md, e
   npx markdownlint CHANGELOG.md com código 0. UTF-8.

SANDBOX: .git é somente leitura (sem git add/commit). Não crie arquivos.
RELATÓRIO: git diff dos dois arquivos, códigos de saída e duas mensagens de commit em português (versão; changelog).
```

## Resultado da Fase 6 (diretor, 2026-11-04)

- Commits `1f686eb` (versão `0.93.0-ptbr.1` no `src/system.json`) e `d6bb4bd` (seção 0.93.0-ptbr.1 no `CHANGELOG.md`).
- Build: `npx gulp build` 0; manifesto gerado com versão `0.93.0-ptbr.1` e compatibilidade 13/13/13.
- Pacote: `dist/cyberpunk-red-core-0.93.0-ptbr.1.zip` (62 MB, 1969 entradas, inclui `lang/pt-BR.json` e os arquivos
  Babele PT-BR). `dist/` fica fora do git. Não instalado no Foundry real.
- Verificação final: lint 0, prettier 0, markdownlint 0, `test:unit` 172/172, `test:playwright` **453/453 (1,1 h)**
  no Windows.
- O `CHANGELOG.pt-BR.md` não foi alterado (era do Crowdin; sem Crowdin pela D4). Pendente para o dono decidir se o
  fork mantém um changelog em PT-BR.

## Correção do diagnóstico do manifesto (diretor, 2026-11-04)

O `gulp/config.mjs` (vendorizado) sempre sobrescreve `url`, `manifest` e `download` no build com URLs do GitLab
montadas a partir de variáveis do CI. Sem CI, o pacote sai com `example.com`, então não há risco de o Foundry trocar a
tradução pela versão oficial, mas também não há atualização do fork. Pela regra de versões do Foundry
(`foundry.utils.isNewerVersion`, comparação por partes separadas por "."), `0.93.0` não é mais nova que
`0.93.0-ptbr.1`, mas `0.93.1` seria. Decisão D9: GitHub Releases em `Crespo767/cyberpunk-red-core-pt-br`.

## Tarefa 6.2: script de empacotamento do fork

```text
Você é o executor do projeto Cyberpunk RED Core (Foundry v13, PT-BR), em %USERPROFILE%\Documents\Cyberpunk RED - PTBR.
Tarefa 6.2. Leia CLAUDE.md, a decisão D9 em docs-ptbr/plano-migracao-v13-ptbr.md e a seção "Correção do diagnóstico
do manifesto" em docs-ptbr/tarefas/fase-6.md. NUNCA edite gulp/ (vendorizado).

OBJETIVO
Um comando (npm run package:ptbr) que gera em dist/ o pacote de release do fork com as URLs do GitHub.

PEDIDO
1. tools/ptbr/manifest.mjs: função pura e exportada, ex.: forkManifest(manifest, { owner, repo }), que devolve uma
   cópia do manifesto com:
     url      = https://github.com/<owner>/<repo>
     manifest = https://github.com/<owner>/<repo>/releases/latest/download/system.json
     download = https://github.com/<owner>/<repo>/releases/download/<manifest.version>/<manifest.id>-<manifest.version>.zip
   e sem alterar nenhum outro campo. Lança erro se version ou id estiverem vazios ou forem "DUMMY_VALUE".
   Constantes do fork no mesmo arquivo: owner "Crespo767", repo "cyberpunk-red-core-pt-br".
2. tools/ptbr/package.mjs (Node ESM, sem dependências novas; adm-zip já é devDependency):
   a. roda "npx gulp build" com FOUNDRY_DATA_PATH apontando para dist/stage (o build vai para
      dist/stage/Data/systems/<id>), sem tocar no foundryconfig.json;
   b. lê o system.json gerado, aplica forkManifest e grava de volta;
   c. grava dist/system.json (cópia do manifesto final, para anexar ao release);
   d. gera dist/<id>-<version>.zip com o CONTEÚDO da pasta do sistema na raiz do zip (system.json na raiz, sem pasta
      intermediária);
   e. imprime caminho do zip, versão, url, manifest e download.
3. package.json: script "package:ptbr": "node tools/ptbr/package.mjs"; inclua tools/ptbr no script "lint" (ao lado de
   tools/playwright). Não altere mais nada no package.json nem no package-lock.json.
4. Testes primeiro: tests/unit/ptbr-manifest.test.js cobrindo forkManifest (URLs certas; outros campos intactos; não
   muta a entrada; erro com version "DUMMY_VALUE" ou vazia). O diretor commita o teste antes do código.

SANDBOX
- .git é somente leitura (sem git add/commit). Não rode npm run package:ptbr nem npm run test:unit (spawn EPERM): use
  npx vitest run --pool=threads tests/unit/ptbr-manifest.test.js. Rode npm run lint e npx prettier --check nos
  arquivos novos.
- Não crie arquivos fora de tools/ptbr/, tests/unit/ptbr-manifest.test.js e package.json.

RELATÓRIO: git status, diff completo (arquivos novos inteiros), saídas de vitest/lint/prettier e três mensagens de
commit em português (teste; código; package.json) — ou duas, se o package.json fizer sentido junto com o código.
```
