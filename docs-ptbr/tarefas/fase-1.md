# Fase 1: tarefas do executor

Tarefas da Fase 1 (validação técnica v13) para o executor GPT-6.1 Terra (Codex, raciocínio alto). Cada tarefa é um
prompt completo; cole uma por vez no Codex e devolva o relatório ao diretor antes da próxima.

A verificação manual no console do Foundry (fichas, itens, chat) fica com o diretor, depois da Tarefa 1.2.

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

Só envie depois de o diretor aprovar a Tarefa 1.1.

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
- Licença: não há chave e não há .env. A instalação já passa na verificação de licença ("Software license verification
  succeeded" no log). Não defina FOUNDRY_KEY. Se a tela de licença aparecer, PARE e devolva a screenshot. Não procure,
  não leia, não copie e não contorne arquivos de licença ou de configuração do Foundry (Config\, App\ ou Data\ reais).

OBJETIVO
Fazer npm run test:playwright rodar no Windows sem baixar navegador e com o runtime Node do próprio Foundry, sem mudar o
comportamento em Linux/NixOS, e rodar a suíte completa.

MUDANÇAS PEDIDAS (opt-in por variável de ambiente; sem a variável, o comportamento atual não muda)
1. PLAYWRIGHT_BROWSER_CHANNEL: quando definida (ex.: "chrome" ou "msedge"), o projeto "chromium" do
   playwright.config.mjs usa use.channel com esse valor. Resolva o valor em resolveHarnessConfig (novo campo,
   ex.: browserChannel) e use-o no playwright.config.mjs.
2. FOUNDRY_NODE_PATH: quando definida, foundry-server.mjs inicia o Foundry com esse executável em vez de "node" e passa
   ELECTRON_RUN_AS_NODE=1 só no env do processo filho (não altere process.env do pai). Resolva o caminho em
   resolveHarnessConfig (novo campo, ex.: nodePath; padrão "node").
3. Testes primeiro: em um commit separado e anterior, adicione em tests/unit/playwright-harness-config.test.js casos
   para os dois campos novos (com e sem a variável). Esse commit pode falhar sozinho; o commit seguinte faz passar.
4. Siga o estilo dos arquivos (comentários curtos, nomes em inglês, sem dependências novas).

EXECUÇÃO
5. Com as mudanças feitas, no PowerShell:
     $env:PLAYWRIGHT_BROWSER_CHANNEL = "chrome"
     $env:FOUNDRY_NODE_PATH = "%USERPROFILE%\Documents\FoundryVTT\App\Foundry Virtual Tabletop.exe"
     npm run test:playwright
   Confirme no log do Foundry a linha "Running on Node.js - Version 20.18.3".
6. Se a etapa de setup falhar (tela de licença, EULA, criação do mundo ou seletor diferente na build 350), pare e
   devolva o erro, a screenshot e o trace de .playwright/test-results. Não ajuste seletores sem aprovação do diretor.
7. Se a suíte rodar, classifique cada teste que falhou:
   (W) específico do Windows (caminho, atalho de teclado, tempo, processo);
   (F) quebra real do sistema no Foundry v13 (erro de JS, ficha não abre, dado errado);
   (I) instabilidade (passa ao repetir só esse arquivo com npm run test:playwright -- <arquivo>).
   Não corrija falhas (F) nem (W) nesta tarefa; só proponha.

REGRAS
- Não rode npx playwright install, não use shell.nix, não edite gulp/, dist/ ou src/.
- Não toque em %USERPROFILE%\Documents\FoundryVTT\Data, nem com o harness: o modo "test" usa .playwright/foundry-data.
- Não feche nem reinicie o Foundry do dono se estiver aberto. A porta do harness é 30001; se estiver ocupada, pare e
  avise.
- Rode npm run lint, npm run prettier e npm run test:unit antes de cada commit.
- Um assunto por commit. Mensagens em português. No corpo do commit da mudança, registre que o motivo é rodar no
  Windows sem npx playwright install e com o Node do Foundry.
- Arquivos .md criados ou alterados: npx prettier --write <arquivo> e npx markdownlint --fix <arquivo>.

CRITÉRIO DE ACEITE
- Dois commits: testes unitários novos e, depois, a mudança no harness. npm run test:unit verde no segundo.
- Sem as variáveis de ambiente, resolveHarnessConfig devolve channel indefinido e nodePath "node" (provado por teste).
- npm run test:playwright executado até o fim com Chrome do sistema e Node 20.18.3 do Foundry.
- Lista de falhas classificadas (W)/(F)/(I), ou "0 falhas".
- git status limpo; .playwright/ fora do git.

RELATÓRIO (devolva exatamente isto)
1. git log --oneline -5 e git show --stat das duas novas mudanças, com o diff completo.
2. Saída de npm run test:unit, npm run lint e npm run prettier.
3. Resumo do Playwright: total, passou, falhou, pulou, tempo. Linha do Node encontrada no log.
4. Para cada falha: arquivo do spec, nome do teste, mensagem de erro, classificação e caminho do trace.
5. git status.
```
