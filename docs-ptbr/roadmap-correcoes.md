# Roadmap de correções após a auditoria da 1.0.5

Data: 2026-11-05. Base: [relatório de validação final](relatorio-validacao-final.md), achados A1 a A8.

## Objetivo e resultado esperado

Resolver os oito achados originais, as correções R09/R10 descobertas na validação e preparar um pacote candidato à **1.0.6**. A versão é uma proposta de próximo patch, não uma publicação já programada. As correções R01–R10 foram implementadas e os testes direcionados passaram. A validação integrada terminou e o release 1.0.6 foi publicado. A reinspeção do mundo real fica manual por decisão do dono.

O fechamento exige as dez correções concluídas, verificações estáticas aprovadas, suíte completa sem falhas pendentes e evidências dos cenários em PT-BR. A auditoria anterior teve 225 testes unitários e 471 testes Playwright aprovados; os novos testes deverão aumentar essa cobertura.

O dono informou que o mundo real foi atualizado para 1.0.5. A auditoria ao vivo anterior ocorreu na 1.0.4; a reinspeção dessa atualização é uma tarefa de validação própria, sem presumir que os achados foram corrigidos.

## Ordem de execução

| Etapa | Tarefa                                         | Achado | Prioridade                    | Dependência                                   | Entrega                                                  |
| ----- | ---------------------------------------------- | ------ | ----------------------------- | --------------------------------------------- | -------------------------------------------------------- |
| 0     | R08 — normalizar dois YAML                     | A8     | Baixa, execução inicial curta | Nenhuma                                       | Prettier aprovado como base para as demais mudanças      |
| 1     | R01 — mostrar perícia chipada no capanga       | A1     | Média                         | Nenhuma mudança funcional anterior            | Perícia visível e rolável com nível efetivo correto      |
| 2     | R02 — corrigir comprador no registro de venda  | A2     | Média                         | Nenhuma                                       | Registro identifica o comprador sem `undefined`          |
| 3     | R03 — distinguir alvos de dano dos programas   | A3     | Média                         | Nenhuma                                       | Opções, fichas e cartões identificam o tipo de alvo      |
| 4     | R04 — resolver chaves inexistentes             | A4     | Baixa                         | Verificar reutilização de chaves existentes   | Mensagens, rótulos e tooltips válidos                    |
| 5     | R05 — restaurar parâmetros das traduções       | A5     | Baixa                         | Reutilizar os testes de contrato de R02/R03   | Contexto de item, arma, propriedade e rolagem preservado |
| 6     | R06 — traduzir os textos residuais             | A6     | Baixa                         | Coordenar edição do mesmo JSON de R02–R05     | Três caminhos conhecidos inteiramente em PT-BR           |
| 7     | R07 — localizar o seletor de perícia dos chips | A7     | Baixa                         | R01 facilita a verificação completa dos chips | Rótulos traduzidos e identificadores estáveis            |
| 8     | V01 — validação integrada                      | Todos  | Condição de fechamento        | R01–R10                                       | Relatório de resultados e limitações atualizado          |
| 9     | V02 — preparar o candidato de release          | Todos  | Após validação                | V01                                           | Versão, changelogs, manifesto e pacote conferidos        |

R08 vem primeiro para remover a falha conhecida de formatação e facilitar a revisão dos diffs seguintes. A ordem das correções funcionais prioriza os três achados médios. As tarefas que alteram `src/lang/pt-BR.json` devem ser integradas em sequência para evitar sobreposição de alterações.

## R08 — Formatação dos Linear Frames

**Arquivos:** `src/packs/core/cyberware/cyberware.implanted_linear_frame___beta.yaml` e `src/packs/core/cyberware/cyberware.implanted_linear_frame___sigma.yaml`.

- [x] Registrar o resultado atual do Prettier nos dois arquivos.
- [x] Formatar somente esses YAML, principalmente a lista `prerequisites.cyberware` da linha 65.
- [x] Comparar os objetos YAML parseados antes/depois; IDs, números, pré-requisitos e efeitos devem ser idênticos.
- [x] Confirmar `npx prettier --check src tests` aprovado.

**Aceite:** apenas apresentação alterada. Não adicionar um teste permanente que apenas reproduza a formatação; a comparação semântica e o comando de qualidade são a evidência necessária.

## R01 — Perícia concedida por chip na ficha de capanga

**Arquivos principais:** `src/modules/system/register-helpers.js` e `src/templates/actor/mook/cpr-mook-skills.hbs`. Regressão em `tests/playwright/actors/`, aproveitando os helpers existentes de criação, instalação e rolagem.

- [x] Criar um teste com capanga, perícia de nível-base 0 e chip válido no Soquete de Chipware; demonstrar a falha atual da lista.
- [x] Passar o contexto do ator ao filtro da lista e usar seu nível efetivo, reutilizando `getSkillLevel`.
- [x] Preservar a ordenação e o tratamento existente de perícias com modificadores.
- [x] Conferir exibição e rolagem nos modos de apresentação de nível, base e total.
- [x] Remover o chip pela interface e conferir que a perícia volta ao comportamento correspondente ao nível-base.
- [x] Cobrir nível-base maior que 3 e chip com pré-requisito pendente.

**Aceite:** com base 0 e chip válido, a perícia aparece e rola com nível 3; com base maior que 3, conserva o nível maior; chip inválido não concede o bônus. O valor gravado da perícia permanece intacto. O aviso de cibernética pendente continua funcionando.

## R02 — Comprador correto no registro de venda

**Arquivos principais:** `src/lang/pt-BR.json`, chave `CPR.containerSheet.tradeLog.vendorSold`, e testes do registro de transações. A chamada atual em `src/modules/actor/sheet/cpr-container-sheet.js` já fornece `purchaser`.

- [x] Criar teste de interpolação com nome de comprador distinto do nome do vendedor, reproduzindo o `undefined` atual.
- [x] Trocar `{seller}` por `{purchaser}` e ajustar a frase para indicar venda ao comprador.
- [x] Exercitar uma compra em PT-BR e conferir o registro do vendedor, quantidade, preço e saldo.

**Aceite:** o registro identifica o comprador e não contém `undefined` nem marcador cru. Valores e inventários continuam seguindo o comportamento anterior.

**Limite da correção:** a mudança afeta novos registros. Não reescrever registros históricos automaticamente; a informação ausente pode não ser recuperável com segurança.

## R03 — Tipo de alvo no dano de programas

**Arquivos principais:** `src/lang/pt-BR.json`, chave `CPR.itemSheet.program.damageTo`; `src/modules/dialog/cpr-roll-dialog.js`; `src/templates/item/settings/cpr-program.hbs`; `src/templates/chat/cpr-program-damage-rollcard.hbs`.

- [x] Criar regressão com danos de mesma fórmula para as duas classes de alvo, demonstrando que os rótulos atuais não as distinguem.
- [x] Restaurar `{programType}` na tradução.
- [x] Revisar todas as chamadas dessa chave: fornecer o tipo nos diálogos e cartões e adaptar os templates que hoje concatenam o alvo separadamente.
- [x] Se algum contexto precisar de rótulo sem parâmetro, reutilizar uma chave adequada ou criar uma chave específica em EN/PT-BR.
- [x] Conferir a ficha e o cartão para Black ICE e não Black ICE, em inglês e PT-BR.

**Aceite:** cada opção identifica seu alvo mesmo quando as fórmulas são iguais. Nenhum alvo duplicado e nenhum `{programType}` cru na interface. Fórmulas, dados rolados e aplicação do dano permanecem corretos.

## R04 — Chaves de localização inexistentes

Resolver as nove referências apontadas pela auditoria. A escolha de mensagem deve preservar o significado do erro; não substituir indiscriminadamente por qualquer chave existente.

| Referência atual                           | Local principal                                                                   | Tratamento planejado                                                                                          |
| ------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `CPR.amountnotnumber`                      | `actor/sheet/cpr-character-sheet.js:412`                                          | Usar `CPR.messages.amountNotNumber`, já existente.                                                            |
| `CPR.actormissingitem`                     | `chat/cpr-chat.js:266`                                                            | Reutilizar a mensagem de item inexistente com interpolação de ID, se adequada; preservar o contexto do ator.  |
| `CPR.rezbiwithoutscene`                    | `item/types/cpr-cyberdeck.js:322`                                                 | Criar/usar mensagem específica para ausência de cena; não confundir com ausência de token.                    |
| `CPR.noskillbythatname`                    | `item/types/cpr-role.js:47` e `:82`                                               | Criar/usar mensagem de perícia não encontrada, com identificação da perícia.                                  |
| `CPR.global.itemType.skill.martialArts`    | `system/config.js:141`                                                            | Conferir o rótulo de tipo existente e reutilizá-lo se equivalente; caso contrário, definir o rótulo genérico. |
| `CPR.global.itemType.skill.playInstrument` | `system/config.js:153`                                                            | Mesma revisão para Tocar Instrumento.                                                                         |
| `CPR.global.itemType.skill.science`        | `system/config.js:156`                                                            | Mesma revisão para Ciência.                                                                                   |
| `CPR.settings.dvRollTableCompendium.hint`  | `system/settings.js:421`                                                          | Definir ajuda coerente com essa configuração; não alterar sua visibilidade para corrigir o texto.             |
| `CPR.characterSheet.rightPange.armor.sp`   | `templates/actor/character/right-pane/tabs/gear/cpr-armor-content.hbs:23` e `:29` | Usar `CPR.global.itemType.armor.sp`, já existente, nos dois locais.                                           |

Os caminhos JS da tabela são relativos a `src/modules/`; o caminho de template é relativo a `src/`.

- [x] Registrar testes das referências de localização efetivamente usadas e dos seus parâmetros.
- [x] Corrigir as chamadas e adicionar as chaves novas necessárias em `en.json` e `pt-BR.json`.
- [x] Exercitar os caminhos acessíveis pela UI: munição inválida, cartão cujo item já foi removido e tooltips de PP.
- [x] Cobrir os erros raros com teste específico no nível adequado, sem manipular o mundo real.
- [x] Documentar qualquer caminho que continue sem reprodução ao vivo, mesmo com o contrato de localização validado.

**Aceite:** as nove referências estão resolvidas, com textos semanticamente adequados e fallback inglês disponível. Os locais repetidos também foram corrigidos. Prefixos dinâmicos, como `CPR.global.blackIce.stats.`, e identificadores de dados, como a entrada `root` do dicionário de pisos, não devem virar falsos positivos nem motivar mudanças sem evidência.

## R05 — Parâmetros informativos das traduções

**Arquivo principal:** `src/lang/pt-BR.json`.

| Chave                                                  | Parâmetro a restaurar | Verificação de aceite                                    |
| ------------------------------------------------------ | --------------------- | -------------------------------------------------------- |
| `CPR.actorSheets.commonActions.new`                    | `{item}`              | Nome inicial de item identifica o tipo correspondente.   |
| `CPR.dialog.selectCompatibleAmmo.selectCompatibleAmmo` | `{name}`              | Diálogo identifica a arma cuja munição será escolhida.   |
| `CPR.ledger.title`                                     | `{property}`          | Título identifica a propriedade do registro.             |
| `CPR.rolls.rollingFor`                                 | `{rollTitle}`         | Mensagem identifica a rolagem, além do título da janela. |

- [x] Criar testes de interpolação com valores reconhecíveis e distintos.
- [x] Restaurar os quatro parâmetros, respeitando o glossário e a gramática em PT-BR.
- [x] Conferir os consumidores para evitar texto duplicado ou nomes já concatenados manualmente.
- [x] Verificar os quatro caminhos na interface em PT-BR.

**Aceite:** nenhuma informação de contexto perdida e nenhum marcador cru. A conferência automática deve comparar o conjunto de nomes de parâmetros, permitindo que um mesmo parâmetro apareça mais de uma vez na tradução.

## R06 — Textos residuais em inglês

**Arquivo principal:** `src/lang/pt-BR.json`.

- [x] Traduzir `CPR.dialog.selectInstallableItems.noOptions`, preservando `{target}` e a orientação sobre configurações.
- [x] Traduzir `CPR.itemSheet.common.installedItemTypesAllowed`.
- [x] Traduzir `CPR.itemSheet.common.installedItemsAllowed`.
- [x] Conferir uma instalação sem opções e as configurações de um item que aceita outros itens instalados, inclusive a visualização somente leitura.
- [x] Fazer uma revisão contextual dos textos antigos próximos a essas chaves; qualquer achado adicional deve ser registrado antes de ampliar o escopo.

**Aceite:** os três caminhos conhecidos aparecem em PT-BR, com significado e parâmetros preservados. A detecção não depende apenas de igualdade com o inglês atual, pois esses textos antigos diferem dele.

## R07 — Rótulos traduzidos para os chips de perícia

**Arquivos principais:** `src/modules/item/sheet/cpr-item-sheet.js` e `src/templates/item/settings/cpr-cyberware.hbs`, se necessário para a apresentação somente leitura.

- [x] Criar regressão em PT-BR: opção com texto Atletismo e valor interno `Athletics`.
- [x] Reutilizar o mecanismo de nomes localizados já usado pelas fichas; traduzir somente o rótulo.
- [x] Preservar o nome e a identidade de perícias personalizadas.
- [x] Conferir o chip comum e o Difficult Skill Chip, mantendo a seleção por dificuldade.
- [x] Reabrir a ficha, verificar a seleção persistida e a apresentação somente leitura.
- [x] Repetir uma rolagem com cada tipo de chip e a restauração após removê-lo.

**Aceite:** rótulos em PT-BR e funcionamento correto com os mesmos identificadores em inglês. Os nomes de `internal_skills` continuam estáveis e o JSON do Babele desse pack continua sem tradução das entradas.

## Organização dos testes e das alterações

Para cada correção de comportamento, criar primeiro o teste que demonstra a falha, confirmar a falha e então aplicar a correção. Se forem solicitados commits, cada teste deve ficar em um commit imediatamente anterior ao da correção correspondente, como determina `CLAUDE.md`. Evitar um lote único de todos os testes seguido de um lote único de todas as correções.

Os testes de contrato de localização podem compartilhar um arquivo em `tests/unit/`, com casos adicionados na tarefa correspondente. Eles devem cobrir interpolação e integridade dos parâmetros, sem fixar frases inteiras desnecessariamente. Testes de navegador devem provar o resultado para o usuário: capanga com chip, compra, seletor/cartão de dano e rótulos dos chips. Reutilizar os helpers de UI para criar e remover documentos.

As correções planejadas não exigem mudança de formato de dados persistidos: a expectativa é manter `dataModelVersion` **51**, sem migração 052. Se surgir necessidade real de alterar dados, reavaliar essa premissa antes de implementar a mudança.

As traduções locais seguem a decisão D4 do projeto, sem sincronização com Crowdin. Chaves novas precisam de definição em inglês e tradução PT-BR; outros idiomas podem usar o fallback inglês. Preservar placeholders, HTML, links, UTF-8 sem BOM e quebras LF.

## V01 — Validação integrada e encerramento das lacunas

### R09 — Tabela ativa ao alternar Autofire (achado da validação)

Registrado em 2026-11-05, durante V01. A verificação com token real, Babele e PT-BR reproduziu o problema para SMG e Rifle de Assalto: marcar/desmarcar Autofire mantém a tabela de VD anterior no token até que o jogador clique novamente em **Medir VD**. As oito faixas de alcance dos dois modos estão corretas quando a medição é acionada explicitamente. Evidência anterior à correção: `.playwright/roadmap-1.0.6/live-validation.json`, registros `autofire-token` com `autoSwitch: false`.

O método `_fireCheckboxToggle` de `src/modules/actor/sheet/cpr-actor-sheet.js` grava um nome isolado em `flags.cprDvTable`, enquanto o medidor lê o objeto com nome e faixas em `flags.cyberpunk-red-core.cprDvTable`. A correção deve reutilizar `SystemUtils.SetDvTable`, preservar os nomes traduzidos e o sufixo `(Autofire)` e atualizar também os valores de alcance, sem criar migração nem alterar tabelas-fonte.

- [x] Reproduzir a falha com token real para SMG e Rifle de Assalto em PT-BR.
- [x] Adicionar regressão com cena/token criados pela UI e comprovar a falha antes da alteração.
- [x] Usar a operação compartilhada de definição da tabela ativa, cobrindo arma com tabela própria e fallback da tabela atual do token.
- [x] Conferir ativação/desativação, nome e faixas de VD sem exigir novo clique em Medir VD.
- [x] Repetir o cenário corrigido e registrar o resultado junto à validação integrada.

**Aceite:** a tabela e os valores aplicáveis mudam imediatamente com o modo Autofire. Esta correção é adicionada ao roadmap porque a própria etapa V01 encontrou o defeito; as oito correções originais continuam com seu escopo e histórico próprios.

### R10 — Persistência da tabela de VD no editor de arma

Registrado durante a regressão de R09. O Foundry v13 entrega os dados do formulário como `system.dvTable` dentro do objeto `system`; o override `CPRItem.update` lê somente a chave plana e acrescenta uma chave plana com valor `undefined`. Isso impede salvar a escolha do editor e pode remover o valor durante outras edições da arma. A preparação do teste reproduziu os dois efeitos: a seleção ficou em `DV SMG` ao escolher outra opção, e uma arma sem tabela própria passou a expor `undefined` depois de configurar outros campos.

- [x] Criar regressão na UI para arma do mundo e arma possuída, demonstrando a falha antes da correção.
- [x] Preservar atualizações planas e tratar o formato expandido do formulário v13, sem acrescentar `undefined` quando o campo não está na atualização.
- [x] Conferir seleção de SMG/Rifle, opção vazia, reabertura e preservação da tabela ao editar outro campo.
- [x] Repetir R09 com a arma sem tabela própria e incluir os novos casos na suíte completa final. (485/485 aprovados na suíte final.)

**Aceite:** a escolha da tabela é gravada e reaberta corretamente; alterações não relacionadas preservam seu valor. É uma correção do comportamento de atualização de um campo existente, sem nova versão de dados ou migração.

### Execução das checagens

- [x] Executar os testes direcionados após cada correção e registrar comando, resultado e evidência.
- [x] Rodar uma vez a suíte unitária e a suíte Playwright completas após integrar R01–R10; repetir testes adicionais apenas se alterações ou falhas justificarem.
- [x] Executar `npx eslint src tests`, `npx prettier --check src tests` e markdownlint nos documentos afetados.
- [x] Revalidar JSON, paridade EN/PT-BR e contratos de localização alterados.
- [x] Confirmar nomes únicos dos compêndios, referências de VD válidas, sufixos de Autofire, IDs estáveis e os oito itens de membros de carne.
- [x] Na instância isolada PT-BR, testar Autofire com token para SMG e Rifle de Assalto, conferindo a troca entre tabela normal e Autofire e as VD aplicáveis às faixas de alcance.
- [x] Conferir permissões do editor com um usuário sem permissão de edição e ausência dos controles novos nesse contexto.
- [ ] Reinspecionar o mundo real atualizado para 1.0.5, somente leitura, como Gamemaster e Player2: fichas, abas, console, dados 51, pendências e compêndios. Player2 foi revalidado na 1.0.5; a nova inspeção completa como GM permanece limitada pela sessão já conectada, preservada sem desconexão.
- [x] Atualizar o relatório com o estado individual de A1–A8, as evidências finais e eventuais limites remanescentes. Preservar o histórico dos resultados da auditoria da 1.0.5.

Usar Chrome do sistema e dados isolados em `.playwright/foundry-data`. Antes de uma nova suíte, identificar e encerrar apenas execuções órfãs anteriores, preservando ferramentas e serviços ativos. Não editar `gulp/`, artefatos compilados ou documentos do mundo real. Nenhum cenário de criação, alteração, exclusão ou migração deve ser automatizado no mundo real.

**Aceite integrado:** zero falhas pendentes, Prettier aprovado, oito achados originais e R09/R10 encerrados com evidência, nenhuma regressão nos fluxos de instalação e perícias e nenhuma alteração de estatísticas persistidas causada por estas correções.

## V02 — Preparação do candidato 1.0.6

- [x] Atualizar a versão em `src/system.json` e registrar as correções nos changelogs EN/PT-BR.
- [x] Gerar o pacote pelo fluxo próprio `npm run package:ptbr`, sem editar manualmente `dist/` ou os packs compilados.
- [x] Conferir o manifesto do pacote: versão proposta, URLs do fork, mínimo Foundry 13.350, Babele obrigatório e pt-BR recomendado.
- [x] Conferir que os arquivos corrigidos e as traduções estão no ZIP e que a versão de dados continua 51.
- [x] Revisar o diff final e guardar resumo dos testes e limitações junto ao candidato.

**Entrega desta etapa:** pacote local revisável e documentação do candidato. A publicação e a atualização da instalação real ficam para uma solicitação específica; a implementação e o pacote local não executam essas ações.

## Acompanhamento

| Tarefa | Estado atual                     | Evidência / fechamento                                                                                                |
| ------ | -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| R01    | Concluído                        | Capanga mostra/rola perícia chipada e restaura comportamento ao remover chip                                          |
| R02    | Concluído                        | Compra PT-BR registra comprador, quantidade e preço corretamente                                                      |
| R03    | Concluído                        | Alvos distintos no seletor, na ficha e no cartão de dano                                                              |
| R04    | Concluído                        | Nove referências resolvidas e contratos/caminhos verificados                                                          |
| R05    | Concluído                        | Quatro parâmetros restaurados e interpolados na UI                                                                    |
| R06    | Concluído                        | Três mensagens conhecidas traduzidas em seus contextos                                                                |
| R07    | Concluído                        | Rótulos traduzidos, valores estáveis e seleção persistida                                                             |
| R08    | Concluído                        | Prettier aprovado e equivalência semântica dos dois YAML                                                              |
| R09    | Concluído                        | Autofire, tiro mirado e fallback do token: tabelas e oito faixas conferidas                                           |
| R10    | Concluído                        | Editor VD do mundo/possuída grava opções e preserva a tabela em outras edições                                        |
| V01    | Concluído no escopo automatizado | 233 unitários e 485 testes de navegador aprovados; reinspeção real manual                                             |
| V02    | Publicado                        | [Release 1.0.6](https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases/tag/1.0.6), ZIP e manifesto conferidos |

R09 e R10 foram acrescentados durante V01: os três casos de Autofire/editor de VD passaram três vezes cada (**9/9**), incluindo arma sem tabela própria e transição para tiro mirado. Evidências: `.playwright/roadmap-1.0.6/R09-R10-green.log` e `live-validation.json`. O roteiro completo PT-BR também repetiu instalação, rolagem e remoção dos dois chips, com retorno ao nível-base, e confirmou supressão do chip em hospedeiro inválido. A execução completa final aprovou **485/485 testes** na 1.0.6, sem falhas ou casos instáveis.

**Decisão do dono durante a implementação:** a reinspeção do mundo real fica manual. A conferência GM restante não bloqueia a entrega do candidato e não será automatizada nesta tarefa. A leitura já concluída como Player2 é preservada como evidência histórica.

Entrega concluída: [release 1.0.6](https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases/tag/1.0.6), commits enviados e anexos verificados. SHA-256 do ZIP: `3e84db7108e5d1ea4383d61cd6a8f1ab8b43853fd41233547dba0e78b50e1964`.
