# Cyberpunk RED Core: migração para Foundry v13 e tradução PT-BR

Documento de handoff. Quem for implementar (diretor Opus 5.5 + executor GPT-6.1 Codex) deve ler este arquivo inteiro antes de qualquer alteração. Tudo que está em "Situação verificada" foi conferido no disco em 2026-11-03. O que está em "Decisões em aberto" ainda depende do dono do projeto.

## 1. Objetivo

1. Deixar o sistema Cyberpunk RED Core funcionando no Foundry VTT **v13** (mínimo, verificado e máximo = 13).
2. Traduzir o sistema para **português (PT-BR)**: interface, compêndios e descrições. Tudo isso acontece durante a migração.
3. Conferir se o sistema cobre o conteúdo dos livros (Core Rules). A hipótese do dono é que o sistema já está completo. Isso precisa ser verificado, não assumido.

Fora de escopo nesta etapa: reescrever o livro, publicar o sistema, ou alterar os mundos reais do Foundry.

## 2. Caminhos

| Item                         | Caminho                                                                              | Observação                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Código-fonte (dev)           | `%USERPROFILE%\Downloads\fvtt-cyberpunk-red-core-dev\fvtt-cyberpunk-red-core-dev`   | Download do GitLab (branch `dev`). **Não é repositório git** (não há `.git`).                                                |
| Sistema instalado no Foundry | `%USERPROFILE%\Documents\FoundryVTT\Data\systems\cyberpunk-red-core`                | Versão **v0.92.4**, compatibilidade **12**. Não sobrescrever antes de o build passar.                                        |
| Foundry VTT (aplicativo)     | `%USERPROFILE%\Documents\FoundryVTT\App`                                            | Versão 13.350.0, Build 350.                                                                                                  |
| Dados do Foundry             | `%USERPROFILE%\Documents\FoundryVTT\Data`                                           | Mundos reais existentes: `teste`, `teste-claude`, `curse-of-strahd`, `cos-shadowdark-testes` e outros. Não usar para testes. |
| Livros                       | `<pasta dos livros>`                                            | Veja a seção 6.                                                                                                              |
| Este documento               | `%USERPROFILE%\Documents\Cyberpunk RED - PTBR\docs-ptbr\plano-migracao-v13-ptbr.md` | Ver D7.                                                                                                                      |
| Projeto de trabalho          | `%USERPROFILE%\Documents\Cyberpunk RED - PTBR\`                                     | Repositório git (branch `main`).                                                                                             |
| Dados de teste do Foundry    | `%USERPROFILE%\Documents\FoundryVTT-test-data`                                      | `dataPath` do `foundryconfig.json`.                                                                                          |

## 3. Situação verificada

### 3.1 Versão do Foundry

- **O código-fonte já declara v13.** Em `src/system.json`: `"minimum": 13, "verified": 13, "maximum": 13`.
- O `CHANGELOG.md` (seção "Version 0.93") já lista **"Add Foundry v13 Support"** e **"Remove Foundry v12 Support"**.
- A instalação no Foundry (`system.json`) é a **v0.92.4, compatibilidade 12**. Ou seja, o que está instalado é a versão antiga.
- Conclusão: a migração de código para v13 **já foi feita upstream**. O trabalho real é **validar** essa versão em um Foundry v13 real, corrigir o que falhar e traduzir. Não é preciso portar a API do zero.
- Foundry instalado: **13.350.0 (Build 350)**. Confirmado em `App\resources\app\package.json` e no log `Logs\debug.2026-08-03.log` ("Foundry Virtual Tabletop - Version 13 Build 350"). Os testes devem usar esta mesma build.

### 3.2 Uso de APIs v13 no código-fonte

Verificado por busca no `src/`:

- Sem sheets v1 (`ActorSheet`, `ItemSheet`, `DocumentSheet`, `FormApplication`) como classes base.
- Sheets de ator e item usam `ActorSheetV2` / `ItemSheetV2` (`src/modules/actor/sheet/*.js`, `src/modules/item/sheet/cpr-item-sheet.js`).
- Usa `foundry.utils.*` e `foundry.applications.*`.
- Sem uso de `new Dialog(` nem de `Dialog.prompt`.
- Única menção a `mergeObject(` sem prefixo está em comentário (`src/modules/rolls/cpr-rolls.js:52`).

Mesmo assim, a validação em runtime (console do Foundry v13, avisos de depreciação, erros de sheet) ainda não foi feita aqui.

### 3.3 Tradução PT-BR já existente

Há um PT-BR parcial no código:

- `src/lang/pt-BR.json`: 1426 chaves. Nenhuma chave de `src/lang/en.json` falta no PT-BR.
- **657 valores são idênticos ao inglês**. Desses, **341 têm 3 palavras ou mais**. São candidatos a tradução pendente. Exemplos:
  - `CPR.actorSheets.commonActions.installIntoItem` → "Install Into other Item"
  - `CPR.browser.cart.add` → "Add to cart"
  - `CPR.browser.cart.empty` → "Your cart is empty."
  - `CPR.blackIceSheet.damage` → "The damage value must come from a linked program."
- `src/babele/pt-BR/`: 25 arquivos. Cobrem `core_*`, `core-branded-weapons`, `internal_*` e `other_*`. **Não há arquivos Babele PT-BR para `dlc_*` nem `black-chrome_*`.**
- O sistema usa o módulo **Babele** para traduzir compêndios (o módulo `babele` já está instalado em `Data\modules`).

### 3.4 Compêndios (packs)

- Fonte da verdade: **726 arquivos YAML** em `src/packs/` com as pastas `core`, `internal` e `other`.
- A pasta `src/packs/` **não tem** `dlc` nem `black-chrome`. O changelog diz que esses compêndios foram "movidos para o módulo `cyberpunk-red-dlc`".
- A instalação atual (`system.json` v0.92.4) **ainda lista** os packs `dlc_*` (22) e `black-chrome_*` (8). Ou seja, uma instalação v13 a partir do dev não terá esses packs, a menos que se decida outra coisa (seção 7).
- `src/packs/` deve ser editado em YAML. Não editar os LevelDB compilados em `dist/`. Ver `CLAUDE.md` do projeto.

### 3.5 Fluxo de localização e Crowdin

- `crowdin.yml` mostra que `src/lang/*.json`, `src/babele/*/` e `CHANGELOG.*.md` são sincronizados com o **Crowdin**. O `CHANGELOG.pt-BR.md` existe por isso.
- `CLAUDE.md` do projeto diz: novas strings de interface vão **só** em `src/lang/en.json`. As outras línguas são traduzidas por pessoas no Crowdin.
- **Conflito:** uma tradução feita localmente pode ser sobrescrita pela próxima sincronização do Crowdin. Ver decisão D4.

### 3.6 Build, testes e ferramentas

- Build: `npx gulp build` (gera `dist/`). Requer `foundryconfig.json`, que **não existe** no download (só `foundryconfig.json.example`). Precisa ser criado apontando `dataPath` para uma pasta de teste, não para o Foundry real.
- Gulp é vendorizado via `git subtree`. **Nunca editar `gulp/`.**
- Testes unitários: `npx vitest run` (`tests/unit/`).
- Testes de navegador: Playwright (`tests/playwright/`). Sobe um Foundry em uma pasta de dados isolada (`.playwright/foundry-data`).
- `shell.nix` e `.claude/skills/playwright/nix` são específicos de NixOS. **O dono usa Windows**, então esse caminho precisa de adaptação.
- Lint: `npm run lint`, `npm run prettier`, `npm run stylelint`.
- Ainda não há `node_modules` no download. Precisa de `npm install` (Node >= 15).

### 3.7 Repositório git

O download não tem `.git`. `CLAUDE.md` exige commits pequenos e `git diff HEAD`. **Primeiro passo recomendado:** criar um repositório git local na pasta de trabalho, com um commit de base idêntico ao download, antes de qualquer mudança.

## 4. Estratégia

1. **Base de referência:** o código-fonte atual (dev, já em v13) é a base. Não partir da instalação v12.
2. **Validar antes de traduzir:** build + lint + unitários + Playwright em um Foundry v13 de teste. Só depois começar a tradução, para não misturar bugs de migração com bugs de tradução.
3. **Trabalho em fatias pequenas**, um assunto por commit (regra do `CLAUDE.md`).
4. **Não tocar no Foundry real** até um build de teste passar em um mundo cópia.

## 5. Plano de execução

Cada fase tem um critério de aceite. O diretor Opus só aprova a fase quando o critério for cumprido e verificado.

### Fase 0: Preparação

- Copiar o conteúdo do código-fonte (download) para a pasta atual do projeto, `%USERPROFILE%\Documents\Cyberpunk RED - PTBR\`, e rodar `git init` ali, com commit base idêntico ao download. Assim o projeto fica nesta pasta e depois vai para o GitHub (D4). A pasta `Downloads` fica intocada.
- Criar `foundryconfig.json` apontando para `%USERPROFILE%\Documents\FoundryVTT-test-data` (pasta de teste; criar), e não para o `Data` real.
- `npm install`.
- **Aceite:** `npm install` sem erro; `git status` limpo no commit base.
- **Status: CONCLUÍDA (2026-11-03).**
  - Commit base `c15bb95`: `git archive HEAD` comparado com o download por `diff -rq`, sem diferença (2669 arquivos).
    `core.autocrlf=false` no repositório, para não converter quebras de linha. `.vscode/extensions.json` e
    `src/icons/compendium/gear/foodstick.svg` foram incluídos com `git add -f`, porque o `.gitignore` do upstream os
    ignora (`.vscode/` e `**/foo*`).
  - Commit `c0878df`: sincroniza `package-lock.json` com `package.json` (`@playwright/test` fixo em `1.61.1`); nenhuma
    versão instalada muda.
  - Node v24.21.0, npm 11.19.0. `npm install` com código 0. O npm não rodou os scripts de instalação de `classic-level` e
    `unrs-resolver`; os dois carregam com os binários pré-compilados (testado gravar/ler LevelDB com `classic-level`
    1.4.1 e 3.0.0).
  - `foundryconfig.json` (ignorado pelo git): `dataPath` = pasta de teste; `appPath` = `App/{VERSION}/..`, porque a
    instalação não tem subpasta de versão. O harness do Playwright resolve para `App\resources\app\main.js`.
  - Hooks do husky: só `post-merge` e `post-rewrite` (aviso de dependências). Não há hook de pré-commit.

### Fase 1: Validação técnica v13

- Rodar `npx gulp build`, `npm run lint`, `npm run prettier`, `npm run stylelint`, `npm run test:unit`.
- Instalar Foundry v13 de teste (ou usar uma instância v13 existente) com a pasta de dados de teste.
- Subir o sistema buildado e abrir um mundo novo de teste. Verificar console (erros e avisos de depreciação) e abertura de ficha de personagem, mook, veículo, item e chat.
- Rodar `npm run test:playwright` adaptado a Windows.
- **Aceite:** build e unitários verdes; nenhum erro no console ao abrir fichas e itens; Playwright verde ou falhas listadas e classificadas.

### Fase 2: Migração de dados existentes

- Copiar um mundo que use o sistema v12 (usar cópia de `teste` ou `teste-claude`) para a pasta de teste.
- Abrir no Foundry v13 com o sistema novo e verificar que as migrações `025` a `048` (em `src/modules/system/migrate/scripts/`) rodam sem erro.
- **Aceite:** mundo migrado abre, personagens e itens mantêm dados, não há erro de migração.

### Fase 3: Tradução da interface (`src/lang/pt-BR.json`)

- Revisar as **341** strings idênticas ao inglês com 3 palavras ou mais. Traduzir, e manter no inglês apenas nomes próprios e termos técnicos decididos no glossário.
- Revisar as 316 strings idênticas com 1 ou 2 palavras caso a caso.
- Criar um **glossário PT-BR** (arquivo em `docs-ptbr/glossario-ptbr.md`) com os termos de Cyberpunk RED. Usar referências de terminologia em PT-BR já usadas pela comunidade como apoio, e pedir aprovação do dono para os termos ambíguos.
- **Aceite:** nenhuma chave com valor igual ao inglês, exceto itens listados no glossário; chaves e JSON válidos (`npm run prettier` passa).

### Fase 4: Compêndios (Babele PT-BR)

- Conferir os 25 arquivos de `src/babele/pt-BR/` contra os YAML de `src/packs/` (nomes e descrições).
- Criar os arquivos Babele PT-BR faltantes para os packs que forem mantidos (`dlc_*`, `black-chrome_*`), se a decisão D3 mantiver esses packs.
- Usar `npm run generateBabele` / `extractPacks` apenas se o fluxo ainda estiver correto. **Verificar antes**, porque `extractPacks` converte compilado em YAML e pode sobrescrever edições manuais.
- **Aceite:** em um mundo de teste com idioma PT-BR, nomes de itens e descrições principais aparecem traduzidos nos compêndios `core`.

### Fase 5: Cobertura dos livros

- Usar o `.txt` dos livros (1,3 MB em EN, 1,5 MB em PT-BR) para busca. **Não ler** os `.md` (70–90 MB) de uma vez.
- Montar uma lista de conferência por seção: armas, munições, armaduras, roupas, cibernética, programas de netrunner, papéis, perícias, lesões críticas, veículos, drogas, equipamento, regras de combate e de netrun.
- Para cada seção, comparar a lista do livro com os YAML de `src/packs/`.
- **Aceite:** relatório `docs-ptbr/relatorio-cobertura-livros.md` com lacunas (conteúdo no livro que não está no sistema), ou a confirmação de que não há lacunas nas seções verificadas.

### Fase 6: Fechamento

- Atualizar `CHANGELOG.md` (en) com as mudanças. O `CHANGELOG.pt-BR.md` fica para o Crowdin, salvo decisão D4 diferente.
- Gerar o pacote do sistema com o build e guardar em `dist/` (nunca em cima da instalação real sem o dono pedir).
- **Aceite:** build final, testes verdes, relatório de cobertura entregue e checklist do `CLAUDE.md` respeitado.

## 6. Livros (referência, não fonte de texto)

| Arquivo                                | Tamanho | Uso recomendado                            |
| -------------------------------------- | ------- | ------------------------------------------ |
| `Cyberpunk RED - Digital Edition.txt`  | 1,3 MB  | Busca de regras e listas (EN)              |
| `Cyberpunk RED - Digital Edition.md`   | 74 MB   | Só se for preciso estrutura; ler em partes |
| `Cyberpunk RED - Digital Edition.pdf`  | 37 MB   | Consulta visual de tabelas                 |
| `Cyberpunk RED - Digital Edition.docx` | 49 MB   | Não usar nesta etapa                       |

Observação: os livros são material da R. Talsorian Games. Usar só como referência de termos e para conferência, não copiar trechos para o sistema. O texto traduzido no sistema deve ser produzido a partir das strings do próprio sistema.

## 7. Decisões em aberto

Respostas do dono (2026-11-03) e o que falta.

- **D1. Versão alvo. RESOLVIDA.** Base: o dev atual (já v13, `minimum/verified/maximum = 13`). Foundry de teste: **13.350.0, Build 350**, a instalação que já existe em `%USERPROFILE%\Documents\FoundryVTT\App`.
- **D2. Escopo da tradução. RESOLVIDA.** Interface, compêndios e descrições do sistema. Os livros **não** entram na tradução; são só referência para a Fase 5.
- **D3. Packs `dlc_*` e `black-chrome_*`. CONFIRMADA: opção (a).** O que é: no dev, esses packs foram retirados do sistema e movidos para outro módulo (`cyberpunk-red-dlc`), que não está no download. A instalação atual ainda os tem. Opções: (a) seguir sem eles agora e tratar o DLC depois; (b) copiar esses packs da instalação atual para a versão nova e fazer a tradução deles. **Recomendação: (a).** Assim a primeira versão fica menor e o DLC vira uma etapa separada.
- **D4. Crowdin. RESOLVIDA com esclarecimento.** Crowdin é um site de tradução colaborativa que o projeto oficial usa. Ele sincroniza os arquivos de tradução com o repositório oficial. Como o seu projeto é uma cópia própria, a regra é: traduzimos nesta pasta e não conectamos nada ao Crowdin. Depois criamos o repositório no GitHub a partir desta pasta.
- **D5. Número da versão do pacote. CONFIRMADA: `0.93.0-ptbr.1`.** É o número que aparece no Foundry ao instalar o sistema (ex.: `0.93.0`). O sufixo `-ptbr.1` serve para diferenciar esta versão traduzida da versão oficial em inglês. `ptbr` indica o idioma e `.1` é a primeira versão traduzida. Confirmado pelo dono.
- **D6. Identificador do modelo Codex. CONFIRMADA pela captura do seletor: `GPT-6.1 Terra`** (descrição no seletor: "GPT-6.1 Terra Codex model"). O nível de raciocínio "no alto" foi pedido pelo dono; a captura não mostra o seletor de esforço, então o nível precisa ser conferido no próprio Codex antes da execução.
- **D7. Pasta dos documentos do projeto. RESOLVIDA (2026-11-03): `docs-ptbr/`.** O `.gitignore` do upstream ignora
  `docs/`, que é a saída do jsdoc (`npm run api-docs`, ver `jsdoc.json`). Os documentos deste projeto (plano, glossário,
  relatório de cobertura) ficam em `docs-ptbr/`, que é versionada e não se mistura com a documentação gerada.

## 8. Divisão de papéis (diretor e executor)

- **Diretor (Opus 5.5):** lê este documento, quebra cada fase em tarefas, escreve o prompt de cada tarefa para o Codex, revisa o diff de cada tarefa contra o critério de aceite e os itens do checklist do `CLAUDE.md`, pede correção quando algo falhar, e decide quando a fase está concluída.
- **Executor (GPT-6.1 Codex, esforço alto):** faz as alterações de código e tradução na pasta de trabalho, roda build/lint/testes, e devolve um diff com o resultado dos comandos. Não decide escopo nem aceita o próprio trabalho.
- **Dono:** responde as decisões D1 a D6, aprova a passagem entre fases e faz o teste final no Foundry com um mundo cópia.

Regras para o executor:

- Um assunto por commit. Testes de regressão em commit separado, antes da mudança de comportamento (regra do `CLAUDE.md`).
- Nenhuma edição em `gulp/`, em `dist/`, nem em LevelDB compilado.
- Nenhuma string nova de interface fora de `en.json`.
- Arquivos `.md` criados ou alterados: formatar com `npx prettier --write` e `npx markdownlint --fix` antes de dar a tarefa por pronta.
- Não tocar em `%USERPROFILE%\Documents\FoundryVTT\Data\` (mundos e sistema reais) sem ordem explícita do dono.

## 9. Riscos

- **Premissa desatualizada:** o dono acredita que o trabalho é "portar para v13". Como o dev já é v13, o risco é gastar tempo refazendo o que já existe. Mitigação: Fase 1 primeiro.
- **Crowdin sobrescreve tradução local** (D4).
- **Perda de conteúdo DLC/Black Chrome** se o dono não quiser mantê-lo e o sistema novo substituir a instalação atual (D3).
- **Migração de mundo:** mundos reais em v12 podem quebrar com a migração. Mitigação: testar só em cópia (Fase 2).
- **Ferramenta de teste específica de NixOS** no projeto. Mitigação: adaptar para Windows na Fase 1.
- **Nível de raciocínio do Codex não conferido** (D6): o "alto" ainda precisa ser visto no Codex.
- **Livros como referência:** risco de cópia indevida de texto. Mitigação: seção 6.

## 10. Próximos passos imediatos

1. D1 a D7 estão resolvidas. Modelo do Codex: `GPT-6.1 Terra`. Falta só conferir o nível de raciocínio "alto" no próprio Codex.
2. Fase 0 concluída (ver status na seção 5).
3. Executor começa a Fase 1 (build e validação v13) e devolve o relatório.
