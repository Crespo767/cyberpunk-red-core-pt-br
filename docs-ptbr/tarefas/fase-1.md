# Fase 1: tarefas do executor

Tarefas da Fase 1 (validação técnica v13) para o executor GPT-6.1 Terra (Codex, raciocínio alto). Cada tarefa é um
prompt completo; o diretor envia uma por vez pela CLI e revisa o resultado antes da próxima.

A verificação manual no console do Foundry (fichas, itens, chat) fica com o diretor, depois da Tarefa 1.2.

## Como o executor roda

O diretor chama o Codex assim (Git Bash, na raiz do projeto, prompt num arquivo):

```bash
codex exec -m gpt-6.1-terra -c model_reasoning_effort="high" -c 'windows.sandbox="unelevated"' \
  -s workspace-write -C "%USERPROFILE%/Documents/Cyberpunk RED - PTBR" \
  --add-dir "%USERPROFILE%/Documents/FoundryVTT-test-data" -o relatorio.md "$(cat prompt.txt)" < /dev/null
```

Limites do sandbox verificados em 2026-11-03:

- O modo `elevated` (padrão na config do dono) falha em `codex exec` com
  `helper_unknown_error: setup refresh had errors`. O `unelevated` funciona e bloqueia escrita fora do projeto e da
  pasta de teste (`Acesso negado`).
- `.git` é somente leitura: o executor não faz `git add` nem commit. O diretor revisa e commita.
- Criar processos filhos falha com `spawn EPERM`: `npm run test:unit` (pool de forks do Vitest) e
  `npm run test:playwright` (Foundry e Chrome) não rodam no sandbox. `npx gulp build` roda.
- `npx vitest run --pool=threads` roda, exceto `tests/unit/playwright-harness-config.test.js`, que usa
  `process.chdir()` (não suportado em worker threads). O diretor roda esse arquivo e o Playwright fora do sandbox.
- Resultado da Tarefa 1.1 (verificado pelo diretor fora do sandbox): build 0, lint 0 (6 avisos de TODO do upstream),
  prettier 0, stylelint 0 depois do commit `47deae7`, `test:unit` 164/164.

## Licença do Foundry (antes da Tarefa 1.2)

- Não há chave de licença para colocar no `.env`. A instalação local registra no log
  `Software license verification succeeded` (Logs\debug.2026-11-03.log, 11:03) sem `license.json` em `Config\`. Os testes
  usam o mesmo executável, então a expectativa é que a pasta isolada `.playwright/foundry-data` também passe na
  verificação. O harness só preenche a chave se a tela de licença aparecer.
- Se a tela de licença aparecer na pasta de teste, o executor para e devolve o erro. A decisão volta ao dono. Ninguém
  procura, copia ou contorna arquivos de licença.
- O harness aceita automaticamente o EULA do Foundry na pasta isolada, porque ela começa vazia a cada execução.

## Tarefa 1.1: build, lint, formatação e testes unitários no Windows

```text
Você é o executor do projeto de migração do Cyberpunk RED Core para Foundry VTT v13 com tradução PT-BR. Trabalhe só em
%USERPROFILE%\Documents\Cyberpunk RED - PTBR (repositório git, branch main). Leia antes: CLAUDE.md e
docs-ptbr/plano-migracao-v13-ptbr.md (seções 3, 5 e 8).

Ambiente: Windows 11, Node v24.21.0, npm 11.19.0. O npm roda scripts com cmd.exe. Use PowerShell ou Git Bash.
O foundryconfig.json já existe e aponta dataPath para %USERPROFILE%\Documents\FoundryVTT-test-data.

OBJETIVO
Medir o estado do build e das verificações estáticas no Windows e corrigir só o script stylelint, que está quebrado
no cmd.exe.

PASSOS
1. Rode, nesta ordem, e guarde a saída completa de cada comando (código de saída incluído):
   a. npx gulp build
   b. npm run lint
   c. npm run prettier
   d. npm run stylelint
   e. npm run test:unit
2. O passo 1d falha com: NoFilesFoundError: No files matching the pattern "'src/**/*.css'". Causa: o cmd.exe não trata
   aspas simples como aspas. Corrija os scripts "stylelint" e "stylelint:fix" do package.json trocando as aspas
   simples por aspas duplas escapadas (\"src/**/*.css\"), que funcionam no cmd.exe e no sh. Não use .npmrc nem
   script-shell. Rode de novo npm run stylelint e mostre que passa.
   Commit próprio, só com o package.json. Mensagem sugerida: "Corrige o glob do stylelint no cmd.exe do Windows".
   No corpo do commit, explique a causa e diga que não há teste automatizado porque é script de ferramenta, e que a
   verificação foi rodar npm run stylelint no Windows.
3. Para o build (1a), informe para onde o gulp gravou a saída. Espera-se
   %USERPROFILE%\Documents\FoundryVTT-test-data\Data\systems\cyberpunk-red-core. Liste o conteúdo de primeiro nível
   dessa pasta, a pasta packs/ e os campos "version" e "compatibility" do system.json gerado.
4. Para qualquer outra falha (lint, prettier, testes unitários, build), NÃO corrija. Classifique cada uma como:
   (W) só acontece no Windows (caminho com "\", aspas, fim de linha, nome de arquivo); ou
   (U) falha do upstream, que também aconteceria em Linux.
   Para cada (W), proponha o diff da correção no relatório, sem aplicar e sem commitar.

REGRAS
- Não edite nada em gulp/, dist/, LevelDB compilado, nem src/ (exceto o que esta tarefa pede, que é só package.json).
- Não toque em %USERPROFILE%\Documents\FoundryVTT\Data nem em %USERPROFILE%\Downloads.
- Não rode npx playwright install, não use shell.nix, não rode npm audit fix.
- Não altere package-lock.json. Se algum comando o alterar, reverta com git checkout -- package-lock.json e informe.
- Um assunto por commit. Mensagens de commit em português.

CRITÉRIO DE ACEITE
- npx gulp build com código 0 e system.json gerado com compatibility minimum/verified/maximum = 13.
- npm run stylelint com código 0 depois da correção, em um commit só com o package.json.
- Saídas completas de lint, prettier e test:unit, com cada falha classificada em (W) ou (U).
- git status limpo no fim.

RELATÓRIO (devolva exatamente isto)
1. Tabela: comando | código de saída | resumo (ex.: "212 testes, 0 falhas").
2. Saída completa de cada comando que falhou (antes da correção, se houver).
3. Resultado do passo 3 (pasta de saída do build).
4. Lista de falhas classificadas (W)/(U), com diffs propostos para as (W).
5. git log --oneline -5, git show --stat HEAD e git status.
```

## Tarefa 1.2: Playwright no Windows

Enviada depois de o diretor aceitar a Tarefa 1.1. O executor só altera código e testes; o diretor roda o Playwright.

```text
Você é o executor do projeto de migração do Cyberpunk RED Core para Foundry VTT v13 com tradução PT-BR. Trabalhe só em
%USERPROFILE%\Documents\Cyberpunk RED - PTBR (branch main). Leia antes: CLAUDE.md (seções Testing e Environment notes)
e os arquivos tools/playwright/config/harness-config.mjs, tools/playwright/config/playwright.config.mjs,
tools/playwright/server/foundry-server.mjs, tools/playwright/bin/run-tests.mjs e
tests/unit/playwright-harness-config.test.js.

CONTEXTO (verificado pelo diretor)
- O harness foi feito para NixOS: o navegador vem do shell.nix e o Foundry é iniciado com o "node" do PATH.
- Neste Windows não se pode rodar npx playwright install. Há navegadores instalados:
  C:\Program Files\Google\Chrome\Application\chrome.exe e
  C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe.
- O Foundry 13.350 (%USERPROFILE%\Documents\FoundryVTT\App) declara engines.node ">=20.18.0 <23.0.0". O Node do
  sistema é v24.21.0, fora dessa faixa. O executável do Foundry roda como Node com ELECTRON_RUN_AS_NODE=1 e traz o
  Node 20.18.3 (Electron 34.4.0):
  %USERPROFILE%\Documents\FoundryVTT\App\Foundry Virtual Tabletop.exe
- foundryconfig.json: appPath = "%USERPROFILE%/Documents/FoundryVTT/App/{VERSION}/..", que o harness resolve para
  App\resources\app\main.js.

SEU SANDBOX (verificado pelo diretor)
- .git é somente leitura: não rode git add nem git commit. O diretor commita depois de revisar.
- Criar processos filhos falha (spawn EPERM). Por isso NÃO rode npm run test:unit nem npm run test:playwright.
- Para testes unitários use: npx vitest run --pool=threads
  Nesse modo, tests/unit/playwright-harness-config.test.js falha com "process.chdir() is not supported in workers".
  Isso é limitação do sandbox, não do seu código. O diretor roda esse arquivo fora do sandbox.
- npm run lint e npm run prettier funcionam.

OBJETIVO
Permitir que npm run test:playwright rode no Windows sem baixar navegador e com o runtime Node do próprio Foundry, sem
mudar o comportamento em Linux/NixOS.

MUDANÇAS PEDIDAS (opt-in por variável de ambiente; sem a variável, o comportamento atual não muda)
1. PLAYWRIGHT_BROWSER_CHANNEL: quando definida (ex.: "chrome" ou "msedge"), o projeto "chromium" do
   playwright.config.mjs usa use.channel com esse valor. Resolva o valor em resolveHarnessConfig (novo campo
   browserChannel; undefined quando a variável não existe ou está vazia) e use-o no playwright.config.mjs.
2. FOUNDRY_NODE_PATH: quando definida, foundry-server.mjs inicia o Foundry com esse executável em vez de "node" e passa
   ELECTRON_RUN_AS_NODE=1 só no env do processo filho (env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" }; não altere
   process.env do pai). Sem a variável, o spawn fica como hoje (sem opção env nova). Resolva o caminho em
   resolveHarnessConfig (novo campo nodePath; padrão "node").
3. Testes: adicione em tests/unit/playwright-harness-config.test.js casos para os dois campos novos, com e sem a
   variável, seguindo o padrão dos testes existentes no arquivo (inclusive como eles salvam e restauram process.env).
   O diretor vai commitar os testes antes da mudança, então os testes precisam falhar sem a mudança e passar com ela.
4. Siga o estilo dos arquivos (comentários curtos, nomes em inglês, sem dependências novas). Não mexa em outros
   arquivos além destes quatro: harness-config.mjs, playwright.config.mjs, foundry-server.mjs e o teste.

VERIFICAÇÃO NO SANDBOX
5. Rode npm run lint, npm run prettier e npx vitest run --pool=threads. Esperado: lint e prettier com código 0; no
   vitest, só as falhas de process.chdir no arquivo playwright-harness-config.test.js. Qualquer outra falha deve ser
   corrigida ou relatada.

REGRAS
- Não rode npx playwright install, não use shell.nix, não edite gulp/, dist/, src/ nem package.json.
- Não toque em %USERPROFILE%\Documents\FoundryVTT (App, Config, Data). Não procure arquivos de licença.
- Não crie arquivos de log dentro do projeto nem em node_modules. Se precisar salvar saídas, use $env:TEMP.

CRITÉRIO DE ACEITE
- Diff restrito aos quatro arquivos citados.
- Sem as variáveis, resolveHarnessConfig devolve browserChannel undefined e nodePath "node" (coberto por teste).
- Com as variáveis, devolve os valores definidos (coberto por teste).
- lint e prettier com código 0.

RELATÓRIO (devolva exatamente isto)
1. git status e git diff completo.
2. Saídas resumidas de npm run lint, npm run prettier e npx vitest run --pool=threads (totais e lista de falhas).
3. Duas mensagens de commit em português: uma para os testes (vai primeiro) e uma para a mudança no harness. No corpo
   da segunda, registre o motivo: rodar no Windows sem npx playwright install e com o Node do Foundry.
```
