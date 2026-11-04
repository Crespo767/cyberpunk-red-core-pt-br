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
