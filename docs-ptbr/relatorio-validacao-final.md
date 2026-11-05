# Validação final — Cyberpunk RED v13 - PTBR 1.0.5

Data: 2026-11-05, horário de Brasília. Referência: `a9beafb82ddb6124262f9f1f4250e465909ca5c7`, branch `main`. Comparação do fork a partir de `be1dd86`.

**Nota de acompanhamento:** as seções da auditoria original abaixo preservam o resultado anterior às correções. A implementação autorizada posteriormente está registrada na seção [Implementação do roadmap](#implementação-do-roadmap), ao final deste documento.

## Parecer

**Aprovado com ressalvas.** Os 225 testes unitários e os 471 testes Playwright passaram. A auditoria registrou oito achados: três de severidade média e cinco de severidade baixa; nenhum crítico ou alto. A regressão mais relevante é a perícia chipada de nível-base 0 ficar oculta na ficha compacta do capanga. O Prettier também reprova dois YAML. As ressalvas e os limites abaixo devem acompanhar a aprovação.

Foram encontrados problemas de apresentação e localização, incluindo uma regressão da 1.0.5 na lista de perícias do capanga. Nenhuma correção de código ou de tradução foi aplicada. Este relatório é o único arquivo novo destinado ao Git; scripts, logs, downloads e capturas da auditoria ficam em `.playwright/audit-final/`, ignorado pelo repositório. Não houve commit, push, release, atualização da instalação real nem confirmação de migração no mundo real.

## Escopo e segurança da execução

Foram consultados `CLAUDE.md`, `README.md`, os registros de mudanças pertinentes no `CHANGELOG.pt-BR.md`, o plano, glossário, relatórios anteriores e tarefas das fases 1 a 10. Ordens históricas nesses documentos foram tratadas como contexto, sem executar publicações ou correções de fases anteriores.

A suíte principal foi iniciada com `PLAYWRIGHT_BROWSER_CHANNEL=chrome` e `FOUNDRY_DATA_PATH` explicitamente apontando para `.playwright/foundry-data`, na porta 30001. Antes dela, foram inspecionados os processos Node: não havia execução órfã de Foundry/testes a encerrar; os dois processos do servidor MCP Playwright eram infraestrutura, não execuções antigas da suíte.

A suíte oficial usa o idioma inglês; os cenários adicionais de localização e regras foram executados em PT-BR. As verificações adicionais usaram `npm run playwright:serve` em uma segunda pasta isolada, `.playwright/foundry-data/audit-live`, porta 30002 e estado de sessão separado. Babele 2.9.1 foi copiado da instalação **de teste**, e libWrapper 1.13.5.1 foi obtido do release oficial. Não foi usado o `dataPath` real para iniciar servidores ou executar a suíte. A interface foi verificada com Computer Use e, nas verificações adicionais, a biblioteca Playwright local; não havia ferramenta de Playwright MCP exposta nesta conversa.

O mundo real foi acessado pelo servidor já em execução em `localhost:30000`: abertura de fichas, troca de abas, leitura de valores, permissões e compêndios. A leitura complementar dos dados não usou os helpers da suíte, que despausam o jogo. O mundo permaneceu pausado. Não foram executadas operações de criação, edição ou exclusão de documentos nele. Nenhum arquivo de licença do Foundry foi procurado ou lido.

## Tabela de checagens

| Item                          | Comando ou passo                                                                                | Resultado                                                                                   | Evidência                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Estado inicial                | `git status --short --branch`                                                                   | Limpo, em `main`                                                                            | Saída `## main...origin/main`                                                       |
| Sincronização                 | `git rev-list --left-right --count HEAD...origin/main` e `git ls-remote origin refs/heads/main` | `0 0`; remoto em `a9beafb82ddb6124262f9f1f4250e465909ca5c7`                                 | Consulta ao remoto realizada nesta auditoria                                        |
| Arquivos indevidos rastreados | `git ls-files` para `tmp-*`, `.playwright`, `dist`, ZIPs e `CLAUDE.md` da raiz                  | Nenhum                                                                                      | Resultado vazio; `gulp/CLAUDE.md` é a exceção vendorizada prevista                  |
| Releases 1.0.0 a 1.0.5        | API GitHub, listagem de releases e assets                                                       | Seis releases, cada um com ZIP e `system.json`                                              | [Releases públicos](https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases) |
| Manifesto latest              | Download de `releases/latest/download/system.json`                                              | Correto: 1.0.5, mínimo 13.350, verificado/máximo 13, Babele obrigatório e pt-BR recomendado | `latest-system.json`, `compare.json`                                                |
| ZIP publicado                 | Download e SHA-256                                                                              | Confere com o digest informado pelo GitHub                                                  | `54c19930960235572545744d6d8e7362fb9cc21889b4f53a8e7215df391353d5`                  |
| Build                         | Build executado pelo comando da suíte, dirigido à pasta isolada                                 | Código 0                                                                                    | `.playwright/build.log`                                                             |
| Conteúdo do ZIP × build       | Comparação binária de idiomas, Babele, templates e migrações                                    | 575/575 arquivos iguais; nenhuma ausência                                                   | `compare.json`; 1.979 entradas totais no ZIP                                        |
| Manifestos do ZIP e build     | Manifesto local normalizado em memória com `forkManifest`                                       | Iguais ao manifesto público                                                                 | `manifestZipEqual=true`, `manifestLocalEqual=true`; nenhuma edição em `dist/`       |
| Unitários                     | `npx vitest run tests/unit`                                                                     | 225/225; 24 arquivos aprovados                                                              | `vitest.log`, saída 0                                                               |
| ESLint                        | `npx eslint src tests`                                                                          | Aprovado                                                                                    | `eslint.log`, saída 0                                                               |
| Prettier                      | `npx prettier --check src tests`                                                                | Reprovado em dois YAML                                                                      | `prettier.log`, saída 1; achado A8                                                  |
| Markdown existente            | `npx markdownlint README.md CHANGELOG.md CHANGELOG.pt-BR.md "docs-ptbr/**/*.md"`                | Aprovado                                                                                    | `markdownlint.log`, saída 0, antes da criação deste relatório                       |
| JSON e codificação            | Leitura binária, decodificação UTF-8 estrita e `JSON.parse`                                     | 40 arquivos válidos; sem BOM, CRLF ou sinais de corrupção detectados                        | `static.json`, seção `encoding`                                                     |
| Paridade en/PT-BR             | Comparação de todas as chaves                                                                   | 1.447 em cada idioma; nenhuma falta ou sobra                                                | `static.json`                                                                       |
| Chaves usadas no código       | Busca de literais em JS/HBS e conferência nos 13 idiomas                                        | Encontrados literais ausentes; prefixo dinâmico separado                                    | `review.json`; achado A4                                                            |
| Parâmetros de tradução        | Comparação de marcadores `{...}`                                                                | Seis chaves perdem/trocam parâmetros; outra apenas repete `{target}`                        | `review.json`; achados A2, A3 e A5                                                  |
| Babele: nomes                 | Comparação dentro de cada compêndio PT-BR                                                       | Nenhum nome traduzido duplicado                                                             | `static.json`, seção `babele`                                                       |
| Babele: VD                    | Todas as referências `dvTable` PT-BR contra nomes das tabelas                                   | Nenhuma referência órfã; sufixos `(Autofire)` preservados                                   | `static.json`, `last-live.json`                                                     |
| Perícias internas             | Inspeção de `internal_skills.json` PT-BR                                                        | Rótulo traduzido e `entries: {}`; nomes internos preservados em inglês                      | `static.json`                                                                       |
| Migrações                     | Arquivos, `static version`, registro no índice e versão máxima                                  | 025–051 únicas, registradas e coerentes; versão máxima 51                                   | `static.json`; os testes da 050/051 verificam idempotência                          |
| IDs estáveis                  | `CORE_PREREQUISITES`, referências aninhadas e `SKILL_CHIPS` contra YAML                         | Todos os IDs e nomes conferem                                                               | `static.json`, `packs.refs`                                                         |
| Membros de carne              | Campo `meatArmCompatible` nos YAML                                                              | Exatamente os oito itens pedidos                                                            | `static.json`, `packs.meat`                                                         |
| Core dos packs                | Teste unitário de versões e inspeção dos YAML                                                   | Nenhuma marca superior a 13.350                                                             | `vitest.log`, `static.json`                                                         |
| Suíte completa                | `npm run test:playwright`                                                                       | 471/471, saída 0, duração 1.1h                                                              | `playwright.log`, `playwright-exit.txt`                                             |
| Testes adicionais PT-BR       | Instância separada, compêndios reais, UI e leitura dos resultados                               | Resultados detalhados abaixo                                                                | `live-probe.json`, `followup.json`, `editor-probe.json`, `last-live.json`           |
| Mundo real, Gamemaster        | 15 fichas; todas as abas existentes                                                             | Abertura sem erro das fichas                                                                | Observações Computer Use e `real-readonly.json`                                     |
| Mundo real, Player2           | 13 fichas permitidas; todas as abas; compêndios e menu                                          | Permissões coerentes; tradução de índice e documento Flak confirmada                        | Observações Computer Use e `real-readonly.json`                                     |
| Dados do mundo real           | Leitura de configuração e atores                                                                | Versão de dados 51; nenhuma pendência de cibernética                                        | `real-readonly.json`                                                                |

Os oito itens de carne são Big Knucks, Rippers, Scratchers, Slice 'N Dice, Subdermal Grip, Tool Hand, Wolvers e Talon Foot. Há 726 YAML rastreados; a contagem de 728 após o build inclui dois arquivos gerados de changelog, ignorados pelo Git.

A exigência literal de migrações **001 a 051** precisa de ajuste: o próprio commit base já começa na 025. As migrações 001–024 não existem nesta geração do upstream. Não foram criados scripts artificiais para preencher essa lacuna; o runner informa mínimo suportado de dados 34/sistema 0.89.3. Isso não é regressão do fork.

## Verificações de comportamento da 1.0.5

| Cenário                                        | Resultado observado                                                                                                                                                                                                                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mundo novo                                     | Gravou `dataModelVersion` 51. A revisão confirma que somente GM entra no bloco que grava; um mundo com documentos e `newCprWorld` resolve para 49. Os unitários cobrem as duas decisões.                                                                                     |
| Mão-Ferramenta                                 | Instalação do item core ofereceu Braço de carne e concluiu.                                                                                                                                                                                                                  |
| Talon Foot                                     | Instalação do item core ofereceu Perna de carne e concluiu. Uma segunda perna permaneceu disponível mesmo com os dois braços ocupados. A terceira peça de braço foi recusada.                                                                                                |
| Empunhadura Subdermal                          | Sem Neural Link: instalada, aviso de peça-base neural e supressão ativa. Depois de instalar Neural Link: sem pendência e sem supressão.                                                                                                                                      |
| Linear Frame Σ                                 | CORPO-base 5 sem Grafted Muscle: ambas as pendências, CORPO 5, efeito suprimido. Com Grafted Muscle e CORPO-base 6: sem pendência, efeito ativo e CORPO final 12.                                                                                                            |
| Chip no soquete                                | Neural Link → Chipware Socket → Skill Chip: nível gravado 2, efetivo 3. O diálogo real de Atletismo mostrou `skillValue=3` e gerou mensagem de rolagem.                                                                                                                      |
| Remoção do chip                                | Após colocar a perícia em nível-base 0 pela ficha, remover o chip restaurou nível efetivo 0; o nível gravado permaneceu 0.                                                                                                                                                   |
| Chip no Neural Link                            | Instalou com aviso de hospedeiro incorreto, ficou suprimido e manteve nível efetivo 0.                                                                                                                                                                                       |
| Capanga                                        | Aviso de pré-requisito coberto pela suíte. A ficha compacta não mostra a perícia chipada de nível-base 0: regressão A1.                                                                                                                                                      |
| Pain Editor                                    | Gravemente Ferido com modificador −2 antes; instalado no soquete, supressão de dor ativa e modificador 0. Após remover e concluir o preparo dos dados, supressão de dor 0 e modificador −2. A primeira leitura imediatamente após confirmar a remoção ainda era transitória. |
| Editor: tipos, par, CORPO e hospedeiro         | Teste oficial de persistência aprovado.                                                                                                                                                                                                                                      |
| Editor: arrastar core                          | Preservou ID `ju5Rq9rOe2lpDKKl` e nome original `Neural Link`.                                                                                                                                                                                                               |
| Editor: arrastar cópia do mundo                | Reconheceu a origem core da cópia e preservou os mesmos identificadores.                                                                                                                                                                                                     |
| Editor: quantidade, nome, remoção e reabertura | Quantidade 2 persistiu; editar o nome limpou o ID antigo; remover uma linha e reabrir preservou a lista final.                                                                                                                                                               |
| Editor: somente leitura                        | Nenhum controle de alteração; resumo `1x Tool Hand instalado(s)`.                                                                                                                                                                                                            |
| Autofire                                       | Armas core carregadas em PT-BR: `SMG` → `VD SMG`; `Rifle de Assalto` → `VD Rifle de Assalto`. As duas tabelas Autofire carregam com os nomes exatos esperados.                                                                                                               |
| Munição                                        | `Shotgun Shell (Basic)` → `Cartucho de Espingarda (Básico)`; `Shotgun Slug (Basic)` → `Balote de Espingarda (Básico)`.                                                                                                                                                       |
| Programas                                      | Flak e Armor carregam como `Flak` e `Armadura`, respectivamente. Documento Flak aberto por Player2 com descrição traduzida.                                                                                                                                                  |

A supressão usa a árvore de instalação e o CORPO de `_source`, evitando que o próprio Linear Frame cumpra sua exigência. A travessia dos pré-requisitos possui conjunto de visitados e não invoca recursivamente a supressão de efeitos. Não foi encontrada recursão nova nessa avaliação. O getter antigo `isInstalledInActor` continua recursivo; árvores corrompidas não foram artificialmente introduzidas nesta auditoria.

`getSkillLevel` é usado nos caminhos alterados de rolagem de perícia, papel e diálogo. A leitura direta de nível que permanece relevante é o filtro do capanga, descrito em A1. O custo adicional cresce com o número de perícias × cibernéticas × itens, pois a fotografia do ator é refeita: dez passagens por 63 perícias num ator com 77 itens/14 cibernéticas demoraram 24,5 ms nesta máquina. Não houve bloqueio perceptível nesse caso; isso não é um ensaio de carga de inventários extremos.

Os imports novos de pré-requisitos e chip foram revisados; não foi identificado import duplicado ou ciclo novo por essas dependências. O `catch` novo do editor descarta JSON de arraste inválido intencionalmente. A inicialização via hook `babele.init` funcionou com Babele e libWrapper ativos. Nenhum erro de console apareceu nas verificações adicionais concluídas com essas dependências presentes.

## Achados, em ordem de impacto

### A1 — Médio: perícia chipada de nível-base 0 fica oculta no capanga

- **Arquivo:** `src/modules/system/register-helpers.js:617`, especialmente a condição na linha 621; consumido por `src/templates/actor/mook/cpr-mook-skills.hbs:22`.
- **Origem:** regressão funcional da 1.0.5; o filtro antigo não foi adaptado ao novo nível efetivo.
- **Reprodução:** deixar Atletismo em nível-base 0, instalar um Skill Chip para ela num Chipware Socket válido e abrir a ficha compacta. A leitura retornou `{stored: 0, effective: 3, shown: false}` e a linha correspondente na ficha teve contagem 0.
- **Efeito para o jogador:** a perícia concedida pelo chip não aparece na lista e não pode ser rolada por esse atalho, embora o cálculo esteja ativo.
- **Correção sugerida:** fazer o filtro considerar o nível efetivo do ator, preservando o comportamento de modificadores e a apresentação de perícias efetivamente zeradas.
- **Regressão sugerida:** capanga com nível-base 0, chip válido e nível efetivo 3 deve exibir a perícia e rolar com 3; ao remover o chip, deve voltar a ocultá-la. Cobrir também nível-base maior que 3.
- **Evidência:** `live-probe.json`, `followup.json`, captura `mook-chip-zero.png`. Nenhuma correção aplicada.

### A2 — Médio: registro de venda em PT-BR escreve “undefined”

- **Arquivo:** `src/lang/pt-BR.json:301`; chamada em `src/modules/actor/sheet/cpr-container-sheet.js:339`.
- **Origem:** tradução herdada da base `be1dd86`.
- **Reprodução:** formatar `CPR.containerSheet.tradeLog.vendorSold` com os dados reais da chamada, incluindo `purchaser`. O PT-BR usa `{seller}`. Resultado observado: `Vendeu Arma (x1) de undefined por 100 EB.`
- **Efeito para o jogador:** o histórico da loja perde o comprador e registra texto incorreto. Não foi identificada alteração do cálculo financeiro por esse defeito.
- **Correção sugerida:** usar `{purchaser}` e uma frase coerente com a venda ao comprador.
- **Regressão sugerida:** realizar compra em PT-BR, conferir o nome do comprador no registro do vendedor e ausência de `undefined`, mantendo valores e quantidades.
- **Evidência:** `followup.json`, resultado `runtime-translations`.

### A3 — Médio: opções de dano de programa perdem o tipo de alvo

- **Arquivo:** `src/lang/pt-BR.json:1027`; consumo em `src/modules/dialog/cpr-roll-dialog.js:151` e `:159`.
- **Origem:** tradução herdada da base.
- **Reprodução:** formatar `CPR.itemSheet.program.damageTo` com `programType = Black ICE` ou o outro tipo. Ambos retornam apenas `Dano a`, pois a tradução descartou `{programType}`.
- **Efeito para o jogador:** o seletor de dano deixa de identificar a classe de alvo; fórmulas iguais podem gerar opções indistinguíveis. Os cartões que usam a mesma chave também perdem essa informação.
- **Correção sugerida:** preservar `{programType}`; revisar os templates de configurações que hoje concatenam o tipo separadamente, evitando duplicação ou marcador cru após a correção.
- **Regressão sugerida:** conferir opções e cartão de dano em PT-BR para Black ICE e não Black ICE, inclusive com fórmulas iguais e na ficha do programa.
- **Evidência:** `followup.json`, leitura do seletor e chamadas do código.

### A4 — Baixo: chamadas ainda referenciam chaves de localização inexistentes

As referências abaixo não existem em nenhum dos 13 idiomas. Todas já estavam na base. Algumas pertencem a erros raros ou configurações ocultas; isso não equivale a afirmar que todos esses caminhos foram reproduzidos pela interface.

| Arquivo:linha                                                                         | Chave ausente                              | Contexto / sugestão                                                      |
| ------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| `src/modules/actor/sheet/cpr-character-sheet.js:412`                                  | `CPR.amountnotnumber`                      | Munição inválida; usar a chave existente `CPR.messages.amountNotNumber`. |
| `src/modules/chat/cpr-chat.js:266`                                                    | `CPR.actormissingitem`                     | Item de cartão já inexistente; apontar para mensagem válida.             |
| `src/modules/item/types/cpr-cyberdeck.js:322`                                         | `CPR.rezbiwithoutscene`                    | Erro ao obter cena do token Black ICE; definir/usar mensagem válida.     |
| `src/modules/item/types/cpr-role.js:47` e `:82`                                       | `CPR.noskillbythatname`                    | Perícia referenciada pela Função não encontrada; usar mensagem válida.   |
| `src/modules/system/config.js:141`                                                    | `CPR.global.itemType.skill.martialArts`    | Rótulo genérico de Artes Marciais ausente.                               |
| `src/modules/system/config.js:153`                                                    | `CPR.global.itemType.skill.playInstrument` | Rótulo genérico de Tocar Instrumento ausente.                            |
| `src/modules/system/config.js:156`                                                    | `CPR.global.itemType.skill.science`        | Rótulo genérico de Ciência ausente.                                      |
| `src/modules/system/settings.js:421`                                                  | `CPR.settings.dvRollTableCompendium.hint`  | Ajuda de configuração registrada com `config: false`.                    |
| `src/templates/actor/character/right-pane/tabs/gear/cpr-armor-content.hbs:23` e `:29` | `CPR.characterSheet.rightPange.armor.sp`   | Erro de grafia em tooltip de PP; usar uma chave válida.                  |

- **Efeito:** chave crua em lugar de uma mensagem/rótulo traduzido nos caminhos afetados.
- **Regressão sugerida:** validar referências literais completas de localização contra os dicionários e exercitar munição inválida, item de chat ausente e tooltips de armadura. Excluir prefixos montados dinamicamente.
- **Evidência:** `review.json`. A busca também localizou `CPR.netArchitecture.floor.options.root` em `cpr-netarch.js:55`, usado como identificador no dicionário de pisos; não foi demonstrado defeito visual para ele. `CPR.global.blackIce.stats.` é prefixo dinâmico, não chave faltante. A antiga chave problemática de erro de migração foi substituída por `CPR.migration.app.overlay.error`, que existe nos dois idiomas principais.

### A5 — Baixo: outras traduções descartam parâmetros informativos

- **Arquivo:** `src/lang/pt-BR.json:16`, `:406`, `:1089` e `:1300`.
- **Origem:** traduções herdadas da base.
- **Reprodução:** respectivamente, criação de item com `{item}`, seleção de munição com `{name}`, título do registro com `{property}` e verificação de rolagem com `{rollTitle}`. As traduções retornam somente `Novo`, `Selecione a munição compatível com`, `Registro` e `Rolando para`.
- **Efeito:** perde-se o contexto de qual item, arma, propriedade ou rolagem está em exibição. O diálogo de Atletismo mostrou `Rolando para` sem completar a frase, embora o título da janela identificasse a perícia.
- **Correção sugerida:** restaurar os parâmetros na tradução e conferir os contextos consumidores.
- **Regressão sugerida:** comparar o conjunto de nomes dos parâmetros, sem exigir a mesma quantidade de repetições, e verificar sua interpolação com valores distintos.
- **Evidência:** `review.json`, `followup.json`. A chave `selectInstallableItems.noOptions` repete `{target}` no PT-BR, mas não perde parâmetro; seu problema está em A6.

### A6 — Baixo: textos residuais em inglês na interface PT-BR

- **Arquivo:** `src/lang/pt-BR.json:412`, `:955` e `:957`.
- **Origem:** traduções herdadas, divergentes do texto inglês atual; igualdade simples com `en.json` não as detecta.
- **Reprodução:** abrir instalação sem itens compatíveis e as configurações de um item que aceita itens instalados. Foram observados `You have no items of a type that can be installed...`, `System Installable Item Types` e `Other items can be installed into this`.
- **Efeito:** partes da interface permanecem em inglês, contrariando a descrição de interface inteiramente traduzida.
- **Correção sugerida:** traduzir essas mensagens preservando `{target}` e revisar strings antigas que diferem do inglês atual.
- **Regressão sugerida:** conferir esses três caminhos com idioma PT-BR; comparar também marcações e parâmetros.
- **Evidência:** `editor-probe.json`, `followup.json`.

### A7 — Baixo: seletor novo de perícia do chip usa rótulos em inglês

- **Arquivo:** `src/modules/item/sheet/cpr-item-sheet.js:121`, mapeamento de `chippedSkills`.
- **Origem:** introduzido na 1.0.5.
- **Reprodução:** abrir o Chip de Habilidade de um personagem com idioma PT-BR e selecionar a perícia. A lista apresenta `Athletics`, `Basic Tech`, `Melee Weapon` etc., enquanto a ficha apresenta Atletismo e demais nomes localizados.
- **Efeito:** o usuário precisa reconhecer a equivalência em inglês para configurar o chip.
- **Correção sugerida:** manter o valor estável em inglês e localizar somente o rótulo com os mesmos recursos da ficha; preservar o nome de perícias personalizadas. Conferir também a visualização somente leitura do campo.
- **Regressão sugerida:** em PT-BR, a opção deve ter texto Atletismo e valor `Athletics`; o efeito continua funcionando e uma perícia personalizada mantém seu nome.
- **Evidência:** `live-probe.json`, resultado `chip-options`.

### A8 — Baixo: verificação de formatação falha em dois YAML

- **Arquivos:** `src/packs/core/cyberware/cyberware.implanted_linear_frame___beta.yaml:65` e `src/packs/core/cyberware/cyberware.implanted_linear_frame___sigma.yaml:65`.
- **Reprodução:** `npx prettier --check src tests`, saída 1, listando ambos os arquivos.
- **Efeito:** falha da verificação de qualidade; não foi identificado erro de parsing ou comportamento causado pela formatação.
- **Correção sugerida:** formatar somente esses dois YAML e conferir que a mudança é de apresentação.
- **Regressão sugerida:** executar novamente o mesmo Prettier e confirmar que o conteúdo YAML parseado permaneceu equivalente.
- **Evidência:** `prettier.log`. Não foi executado `--write` nos fontes auditados.

## Mundo real: números e permissões

A instalação real informava **1.0.4**, Foundry 13.350, e versão de dados **51** durante a inspeção. Portanto, essa inspeção comprova o estado dos dados e fichas observado na 1.0.4; a validação das novidades da 1.0.5 ocorreu na instância isolada.

**Atualização posterior (2026-11-05):** o dono informou que atualizou o mundo real para **1.0.5**. Essa informação atualiza o registro da versão instalada; não houve nova inspeção ao vivo após a atualização, e os oito achados desta auditoria permanecem registrados.

Os 14 personagens têm EMP igual à parte inteira de Humanidade/10, caminhada igual a MOVE × 2, corrida igual a MOVE × 4 e limiar de Gravemente Ferido igual a teto(PV máximos/2). Os PV máximos estão coerentes com os valores de CORPO/VONT e as fórmulas do sistema. Valores com efeito/penalidade representam o resultado preparado, não necessariamente o atributo-base do PDF.

| Personagem                 | PV atual/máximo | Humanidade atual/máxima | EMP | MOVE | Caminhada/corrida | Gravemente Ferido |
| -------------------------- | --------------- | ----------------------- | --- | ---- | ----------------- | ----------------- |
| 24/7                       | 40/40           | 70/80                   | 7   | 7    | 14/28             | 20                |
| Anderson “Sucata” Andreias | 35/35           | 45/66                   | 4   | 5    | 10/20             | 18                |
| Anne “Lucky” Bonny         | 40/40           | 43/70                   | 4   | 7    | 14/28             | 20                |
| Chanda Mishra              | 40/40           | 58/70                   | 5   | 5    | 10/20             | 20                |
| Fin Diesel                 | 55/55           | 50/80                   | 5   | 2    | 4/8               | 28                |
| Forty                      | 40/40           | 61/70                   | 6   | 7    | 14/28             | 20                |
| Grease                     | 35/35           | 44/60                   | 4   | 5    | 10/20             | 18                |
| Mover                      | 45/45           | 36/50                   | 3   | 7    | 14/28             | 23                |
| Racer                      | 40/40           | 36/50                   | 3   | 5    | 10/20             | 20                |
| Redeye                     | 35/35           | 46/60                   | 4   | 7    | 14/28             | 18                |
| Redtail                    | 35/35           | 48/60                   | 4   | 6    | 12/24             | 18                |
| Suri “Cavalry” Navarro     | 50/50           | 30/40                   | 3   | 6    | 12/24             | 25                |
| Teste                      | 40/40           | 60/60                   | 6   | 6    | 12/24             | 20                |
| Torch                      | 35/35           | 58/64                   | 5   | 6    | 12/24             | 18                |

Todos os 13 personagens jogáveis têm Jaqueta Blindada Leve na cabeça e no corpo, PP 11/11 em cada local e avaria zero. O personagem Teste não tem armadura. Black ICE tem REZ 10/10, os quatro atributos em 0 e não possui as abas da ficha de personagem. Não havia cibernética com pré-requisito pendente em nenhum ator.

A fase 8 documenta especificamente Anderson em Humanidade 45/66 e Torch em 58/64; ambos conferem. Ela não contém uma tabela de todos os números dos demais personagens. Para esses, a auditoria verificou os dados atuais e sua coerência interna, sem afirmar nova conferência integral contra cada PDF. Também foram comparados os 13 arquivos locais de extração em `tmp-fichas/`: PV, Humanidade atual, EMP, MOVE e CORPO conferem; a única diferença é a Humanidade máxima de Torch (70 na extração antiga e 64 no mundo), já explicada pela correção documentada na fase 8. Evidência: `baseline-comparison.json`.

Gamemaster abriu 15 fichas e suas abas existentes. Player2, papel 1 (`isGM=false`), tem propriedade 3 e visibilidade nas 13 fichas jogáveis; Black ICE e Teste têm permissão 0 e ficam invisíveis no diretório. As 13 fichas acessíveis abriram com seus controles de edição habilitados; não foi necessário alterar um valor para verificar isso. Criação de atores e opções administrativas não estavam disponíveis. O compêndio de programas e a descrição aberta de Flak apareceram traduzidos.

As primeiras observações Computer Use registraram aviso do Foundry por janela com altura 720, abaixo do mínimo 768. A área foi ajustada para 1920 × 1080 durante a inspeção e restaurada ao final. Não houve erro JS das fichas; a leitura complementar em área adequada registrou zero erros de console.

## Testes instáveis e problemas de ambiente

Resultado da suíte completa: **471/471 aprovados em 1.1h**, código de saída 0. Taxa de falha observada: **0/471 (0%)** nesta execução; nenhum spec instável detectado. Não houve falha oficial que exigisse nova execução com `--repeat-each=3`. Uma execução sem falhas não demonstra ausência absoluta de instabilidade futura. As migrações 050 e 051, inclusive seus testes de idempotência, passaram nesta suíte.

Na preparação da instância adicional, Babele ativado sem libWrapper produziu erro de inicialização e não aplicou nomes aos documentos. A dependência foi instalada na pasta isolada e o servidor reiniciado; a rodada válida terminou com zero erros de console. Isso foi classificado como configuração do ambiente adicional, não falha da suíte ou defeito do sistema. Os seletores exploratórios foram ajustados ao texto/estrutura efetivos da interface; seus timeouts não entram na taxa de instabilidade dos specs oficiais.

## Limites da conclusão

- A inspeção do mundo real ocorreu na 1.0.4. O dono informou posteriormente a atualização para 1.0.5; o funcionamento após essa atualização ainda não foi reinspecionado ao vivo.
- Os testes adicionais conferiram o carregamento e a correspondência exata das tabelas traduzidas de Autofire; não repetiram uma simulação completa de combate com token para cada distância em PT-BR.
- O editor foi conferido com visualização explicitamente somente leitura e com a separação real de permissões de Player2. Não foi tentado forjar uma gravação contra o servidor sem permissão.
- A automação de Skill Chip foi verificada com o chip comum. Difficult Skill Chip passou por instalação no soquete, seleção de Fogo Automático, nível efetivo 3, rolagem real e remoção com retorno a 0. Não foi repetido esse ciclo para cada uma das demais perícias ×2.
- O ensaio de custo cobre um ator de 77 itens, não inventários arbitrariamente grandes ou árvores de instalação corrompidas.
- As fontes numéricas de referência na fase 8 são parciais; os valores adicionais registrados não substituem uma nova revisão individual de todos os PDFs.
- As migrações 050/051 possuem verificação de idempotência nos specs. Esta auditoria não executou migração no mundo real.

## Evidências e entrega

As evidências locais estão em `.playwright/audit-final/`: logs dos comandos, resultados JSON das inspeções estáticas e ao vivo, manifesto público, ZIP baixado, comparação binária e capturas. Esses arquivos são locais e ignorados pelo Git. O manifesto e o pacote públicos consultados estão no [release 1.0.5](https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases/tag/1.0.5). O libWrapper usado exclusivamente no teste veio de seu [release oficial 1.13.5.1](https://github.com/ruipin/fvtt-lib-wrapper/releases/tag/v1.13.5.1).

Este relatório foi formatado com Prettier e validado com markdownlint. O estado final contém somente este arquivo novo; os fontes rastreados permanecem intactos. Os servidores temporários das portas 30001 e 30002 foram encerrados. A instalação real na porta 30000 foi preservada.

## Implementação do roadmap

Atualização de 2026-11-05, após autorização para implementar o [roadmap](roadmap-correcoes.md). Estado desta seção: **concluído; release 1.0.6 publicado**. O histórico acima continua descrevendo a auditoria anterior, sem reclassificar retroativamente seus resultados.

| Achado          | Implementação aplicada                                                                                                                                   | Evidência direcionada                                                                                                                                                                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A1 / R01        | A lista do capanga usa o nível efetivo de `actor.getSkillLevel`, preservando a ordem e o tratamento de modificadores.                                    | Perícia-base 0 aparece e rola com chip; exibição de nível/base/total, base maior que 3, remoção e valor persistido conferidos. Dois testes de chips passaram três vezes cada em `chips-green.log`.                                                                             |
| A2 / R02        | O texto de venda usa `{purchaser}`. Registros históricos não são reescritos.                                                                             | Contrato de parâmetros e compra real na UI PT-BR, com identificação do comprador, item e saldos 100/400.                                                                                                                                                                       |
| A3 / R03        | Ficha, seletor e cartão recebem o tipo de alvo como parâmetro. A seleção de alvo usa estado transitório próprio e recompila os termos quando necessário. | EN/PT-BR, fórmulas iguais e diferentes, troca nos dois sentidos, contagem dos dados rolados, termo fixo +2 e modificador externo +3 preservado.                                                                                                                                |
| A4 / R04        | As nove referências foram corrigidas, reutilizando chaves adequadas e acrescentando três chaves EN/PT-BR.                                                | Contratos das referências e erros raros de habilidade principal/secundária ausente e Token sem cena. Tooltip PP e cartão com item removido conferidos; quantidade inválida exercitada no handler com entrada transitória, pois os templates atuais não contêm `.weapon-input`. |
| A5 / R05        | Restaurados os quatro parâmetros informativos.                                                                                                           | Nome inicial do item, arma no diálogo de munição, propriedade no título do registro e nome da habilidade no diálogo de rolagem conferidos na UI PT-BR.                                                                                                                         |
| A6 / R06        | Traduzidos os três textos apontados.                                                                                                                     | Instalação sem opções e configurações de contêiner nas visualizações de edição e somente leitura.                                                                                                                                                                              |
| A7 / R07        | Rótulos dos chips traduzidos; valores internos e nomes personalizados preservados.                                                                       | Atletismo/`Athletics`, Fogo Automático/`Autofire`, filtro por dificuldade, seleção persistida e apresentação somente leitura.                                                                                                                                                  |
| A8 / R08        | Formatados os dois YAML de Linear Frames.                                                                                                                | Objetos YAML parseados antes/depois idênticos; Prettier aprovado.                                                                                                                                                                                                              |
| R09 — adicional | Alternar Autofire atualiza a tabela ativa e suas faixas no namespace do sistema, inclusive ao sair para tiro mirado e ao herdar a tabela do token.       | Cena/token reais, SMG/Rifle, oito faixas, fallback e três repetições aprovadas.                                                                                                                                                                                                |
| R10 — adicional | O editor v13 preserva dados expandidos de `dvTable`, aceita o formato plano e não injeta `undefined` em outras edições.                                  | Armas do mundo/possuídas, seleção SMG/Rifle/vazia, reabertura e edição de marca, três repetições aprovadas.                                                                                                                                                                    |

### Detalhe adicional de R03

O teste com duas fórmulas iguais reproduziu um problema além do rótulo traduzido: o cartão inferia o alvo pela igualdade da fórmula, enquanto o seletor tentava gravar no setter de `formula`, que não altera os termos da rolagem. Assim, fórmulas iguais tornavam a identificação ambígua e a troca podia manter os dados anteriores.

O alvo agora é identificado por `standard` ou `blackIce` em `programDamageTarget`, propriedade transitória de `CPRDamageRoll`. A mudança usa o construtor de dano existente e a API nativa `resetFormula()` para substituir os termos; os modificadores da rolagem original são preservados. A regressão falhou antes da correção em `R03-card-red.log` e passou depois, inclusive com danos diferentes. Não foi adicionado campo persistido, alterado o `template.json` nem criada migração 052.

### Achados adicionais encerrados na validação

**R09 — severidade média, `src/modules/actor/sheet/cpr-actor-sheet.js:1114`.** Com um token real usando a tabela de SMG ou Rifle de Assalto, marcar Autofire mantinha a tabela normal; desmarcar mantinha a tabela Autofire até um novo clique em Medir VD. O método escrevia um nome em `flags.cprDvTable`, enquanto o medidor lê o objeto com faixas em `flags.cyberpunk-red-core.cprDvTable`. Isso podia apresentar a VD do modo anterior ao jogador. A correção reutiliza `SystemUtils.SetDvTable`, aceita TokenDocument, compara o nome exato da tabela e restaura o modo normal ao selecionar tiro mirado. A arma sem tabela própria usa a tabela ativa do token. Evidências anteriores à correção: `R09-live-red.json` e `R09-red.log`, com esperado `DV SMG (Autofire)` e recebido `DV SMG`.

**R10 — severidade média, `src/modules/item/cpr-item.js:102`.** A escolha da tabela no editor não era gravada e outras alterações podiam deixar o campo `undefined`. O formulário v13 entrega `system.dvTable` dentro de `system`, mas o override de atualização inseria uma chave plana com valor ausente e encobria a escolha. Agora os formatos plano e expandido são tratados quando o campo existe na atualização, preservando alterações não relacionadas. A regressão anterior à correção esperava `DV SMG` e recebeu `undefined` em `R10-red.log`.

As regressões permanentes são `tests/playwright/actors/autofire-token.spec.mjs` e `tests/playwright/items/weapon-dv-table.spec.mjs`. Os três casos passaram três vezes cada (**9/9**, `R09-R10-green.log`). A preparação dos primeiros ensaios foi ajustada para inicializar canvas antes de configurar performance e usar os itens core. O teste de fallback também expôs R10, que foi registrado antes da correção. Essas falhas comprovadas não foram descartadas como instabilidade.

A rodada completa anterior de 482 casos foi interrompida deliberadamente, com 190 aprovados e zero falhas, para integrar R09/R10 e validar novamente o código final. Seu registro é `playwright-pre-R09.log`; ele não é apresentado como uma suíte completa aprovada. A nova rodada contém 485 casos e compila a versão 1.0.6.

### Verificações já concluídas

As evidências da implementação ficam em `.playwright/roadmap-1.0.6/`, separadas das evidências históricas da auditoria.

| Verificação                                        | Resultado                                                                                                       | Evidência                                                                                            |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Unitários completos                                | 233/233, 25 arquivos, saída 0                                                                                   | `unit-final.log`                                                                                     |
| Regressões de chips                                | 6/6, três repetições por teste                                                                                  | `chips-green.log`                                                                                    |
| Compra e dano de programa                          | Cinco casos aprovados, incluindo EN/PT-BR                                                                       | `ui-targeted.log`; as falhas de preparação de outros testes nessa rodada foram corrigidas em seguida |
| Contextos da UI, contêiner, Observer e erros raros | 4/4, saída 0                                                                                                    | `ui-green.log`                                                                                       |
| Autofire e editor VD                               | 9/9, três repetições por caso                                                                                   | `R09-R10-green.log`, saída 0                                                                         |
| Roteiro adicional PT-BR/Babele                     | Candidato 1.0.6: Autofire com token real, PP, item removido, entrada inválida e ciclos dos dois chips aprovados | `live-validation.json/log`, saída 0                                                                  |
| ESLint                                             | Zero erros; seis avisos TODO preexistentes                                                                      | `eslint-final.log`                                                                                   |
| Prettier em `src tests`                            | Aprovado                                                                                                        | `prettier-final.log`                                                                                 |
| JSON e localização                                 | 40 JSON válidos; 1.450 chaves EN/PT-BR, sem diferenças de chaves ou parâmetros                                  | `static.json`                                                                                        |
| Babele e packs                                     | Sem nomes duplicados ou referências VD inválidas; IDs preservados e oito itens de membros de carne conferidos   | `static.json`                                                                                        |
| Suíte Playwright completa                          | 485/485 aprovados em 1.4h; saída 0, zero casos instáveis                                                        | `playwright-full.log`                                                                                |

Os testes foram demonstrados falhando antes das correções pertinentes. Os primeiros ajustes dos novos testes de navegador corrigiram expectativas e preparação da própria automação: preenchimentos perdidos durante rerender, nome inglês sem hífen, configuração de criação de inventário e estado inicial do contêiner. Essas falhas foram classificadas como problemas dos testes em desenvolvimento, não como instabilidade medida da suíte final.

### Reinspeção da atualização real para 1.0.5

Uma sessão temporária de Player2 confirmou a versão **1.0.5** e `dataModelVersion` **51**. As 13 fichas permitidas abriram em suas sete abas, sem erros de console nem pré-requisitos pendentes. As fontes dos 15 atores carregados permaneceram idênticas antes/depois. O estado de pausa era `false` e permaneceu `false`; a inspeção não o alterou. A sessão temporária foi encerrada pela UI. Evidências: `real-readonly.json` e `real-readonly.log`.

PV, Humanidade/EMP, CORPO, VONTADE, MOVE, deslocamentos, ferimento grave e armaduras das 13 fichas permitidas coincidiram com a fotografia da auditoria anterior, sem diferenças. Evidência: `real-comparison.json`. As limitações originais sobre as fontes numéricas da fase 8 continuam válidas.

**Ressalva:** a nova reinspeção completa como Gamemaster não foi concluída. O usuário já estava conectado na aplicação nativa e sua opção de login estava desabilitada no cliente temporário; a sessão ativa não foi desconectada. Os compêndios traduzidos foram observados na aplicação, mas isso não substitui uma nova abertura das 15 fichas como GM. A inspeção pela janela nativa encontrou o bloqueio de colagem do DevTools e não o contornou; nenhum código dessa tentativa foi executado no mundo real. A evidência histórica de abertura das 15 fichas como GM continua sendo da versão 1.0.4. Evidência do impedimento de login: `real-gm-session-unavailable.json`.

### Escopo residual conhecido

A revisão contextual de R06 encontrou três textos antigos próximos aos achados: `CPR.dialog.selectInstallTarget.noOptions`, `CPR.dialog.selectInstallableItems.text` e `CPR.itemSheet.physical.priceHoverExplanationAmmo` continuam em inglês. Foram registrados como acompanhamento, sem ampliar silenciosamente os três casos originais de A6. Não se declara tradução integral de toda a interface com base nesta rodada.

O literal `CPR.netArchitecture.floor.options.root` continua sendo um identificador de dados, não uma chave de texto exibida; os prefixos dinâmicos foram excluídos da busca de chaves completas. A ausência histórica das migrações 001–024 permanece explicada na auditoria original. A versão de dados continua **51**.

### Release 1.0.6 publicado

[Release 1.0.6](https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases/tag/1.0.6), publicado após **233/233 unitários e 485/485 testes de navegador aprovados**. A suíte final levou 1.4h, sem falhas, casos ignorados ou instáveis. Treze commits de implementação/metadados preservam testes em commits imediatamente anteriores às correções; a tag `1.0.6` aponta para `82593e9`. A documentação de conclusão tem commit próprio posterior.

O ZIP contém 1.979 entradas e 61.817.278 bytes. Foram comparados 58 arquivos-fonte com o pacote, incluindo os 40 arquivos de idiomas/Babele; manifesto, dependências, URLs do fork, mínimo Foundry 13.350 e dados 51 conferem. A extração de uma cópia do compêndio confirmou os textos novos em EN/PT-BR. O cabeçalho PT-BR usa um marcador HTML invisível de versão para ser reconhecido pelo gerador vendorizado, sem editar `gulp/`.

SHA-256: `3e84db7108e5d1ea4383d61cd6a8f1ab8b43853fd41233547dba0e78b50e1964`. Os digests dos dois anexos no GitHub coincidem com os arquivos locais. O manifesto público de `releases/latest/download/system.json` foi baixado e é idêntico ao validado localmente.

Evidências: `playwright-full.json/log/exit.txt`, `package-verification.json`, `commits.json`, `release-published.json` e `published-system.json`, em `.playwright/roadmap-1.0.6/`. O roteiro PT-BR terminou com saída 0; seus dois console.error são os avisos esperados da quantidade deliberadamente inválida.

A reinspeção do mundo real fica **manual por decisão do dono**, sem bloquear esta entrega. Nenhuma instalação real foi atualizada e nenhuma migração real foi confirmada. Arquivos de documentação de outro trabalho foram preservados fora destes commits.
