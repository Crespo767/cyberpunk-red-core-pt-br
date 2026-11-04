# Glossário PT-BR — rascunho

Este glossário orienta a tradução de `src/lang/pt-BR.json` e a revisão de termos recorrentes.
As fontes são `en.json`, o `pt-BR.json` existente e o livro em inglês e referências de terminologia em PT-BR.
Prioridade: consistência com o `pt-BR.json` existente > termo do livro > tradução nova.
A coluna do livro registra somente termos isolados; “—” indica termo não identificado.
Chaves ainda idênticas ao inglês não contam como tradução; siglas e nomes próprios mantidos são exceções.

As propostas preservam o sistema por padrão; divergências e casos duvidosos aguardam decisão.
A comparação ignora diferenças apenas de maiúsculas e flexão de número.

## Atributos

| Termo EN | Tradução atual no pt-BR.json (exemplo de chave) | Termo de referência PT-BR | Proposta | Status           |
| -------- | ----------------------------------------------- | -------------------- | -------- | ---------------- |
| INT      | INT (`CPR.global.stats.int`)                    | INT                  | INT      | manter em inglês |
| REF      | REF (`CPR.global.stats.ref`)                    | REF                  | REF      | manter em inglês |
| DEX      | DES (`CPR.global.stats.dex`)                    | DEX                  | DES      | divergente       |
| TECH     | TECH (`CPR.global.stats.tech`)                  | TECH                 | TECH     | manter em inglês |
| COOL     | FRIEZA (`CPR.global.stats.cool`)                | LEGAL                | FRIEZA   | divergente       |
| WILL     | VONT (`CPR.global.stats.will`)                  | VAI                  | VONT     | divergente       |
| LUCK     | SORTE (`CPR.global.stats.luck`)                 | SORTE                | SORTE    | consistente      |
| MOVE     | MOVE (`CPR.global.stats.move`)                  | MOVER                | MOVE     | divergente       |
| BODY     | CORPO (`CPR.global.stats.body`)                 | CORPO                | CORPO    | consistente      |
| EMP      | EMP (`CPR.global.stats.emp`)                    | EMP                  | EMP      | manter em inglês |

## Papéis

| Termo EN     | Tradução atual no pt-BR.json (exemplo de chave) | Termo de referência PT-BR | Proposta          | Status           |
| ------------ | ----------------------------------------------- | -------------------- | ----------------- | ---------------- |
| Role         | Funções (`CPR.global.generic.role`)             | Funções              | Função            | consistente      |
| Role Ability | Talento da Função (`CPR.rolls.roleAbility`)     | Habilidade de Papel  | Talento da Função | divergente       |
| Rockerboy    | Roqueiro (`CPR.global.role.rockerboy.name`)     | Rockerboy            | Roqueiro          | divergente       |
| Solo         | Solo (`CPR.global.role.solo.name`)              | Solo                 | Solo              | manter em inglês |
| Netrunner    | Trilha Rede (`CPR.global.role.netrunner.name`)  | Netrunner            | Trilha Rede       | divergente       |
| Tech         | Tecnologia (`CPR.global.role.tech.name`)        | Técnico              | Tecnologia        | divergente       |
| Medtech      | Técnico Médico (`CPR.global.role.medtech.name`) | Medtech              | Técnico Médico    | divergente       |
| Media        | Influencer (`CPR.global.role.media.name`)       | Media                | Influencer        | divergente       |
| Exec         | Exec (`CPR.global.role.exec.name`)              | Exec                 | Exec              | manter em inglês |
| Lawman       | Advogado (`CPR.global.role.lawman.name`)        | Lawman               | Advogado          | divergente       |
| Fixer        | Canal (`CPR.global.role.fixer.name`)            | Fixer                | Canal             | divergente       |
| Nomad        | Nômade (`CPR.global.role.nomad.name`)           | Nômade               | Nômade            | consistente      |

## Perícias

| Termo EN         | Tradução atual no pt-BR.json (exemplo de chave)                | Termo de referência PT-BR | Proposta           | Status      |
| ---------------- | -------------------------------------------------------------- | -------------------- | ------------------ | ----------- |
| Skill            | Habilidade (`CPR.global.generic.skill`)                        | Habilidade           | Habilidade         | consistente |
| Accounting       | Contabilidade (`CPR.global.itemType.skill.accounting`)         | Contabilidade        | Contabilidade      | consistente |
| Acting           | Atuação (`CPR.global.itemType.skill.acting`)                   | Atuação              | Atuação            | consistente |
| Athletics        | Atletismo (`CPR.global.itemType.skill.athletics`)              | Atletismo            | Atletismo          | consistente |
| Brawling         | Briga (`CPR.global.itemType.skill.brawling`)                   | Briga                | Briga              | consistente |
| Concentration    | Concentração (`CPR.global.itemType.skill.concentration`)       | Concentração         | Concentração       | consistente |
| Conversation     | Conversa (`CPR.global.itemType.skill.conversation`)            | Conversa             | Conversa           | consistente |
| Criminology      | Criminologia (`CPR.global.itemType.skill.criminology`)         | Criminologia         | Criminologia       | consistente |
| Cryptography     | Criptografia (`CPR.global.itemType.skill.cryptography`)        | Criptografia         | Criptografia       | consistente |
| Dance            | Dança (`CPR.global.itemType.skill.dance`)                      | Dança                | Dança              | consistente |
| Deduction        | Dedução (`CPR.global.itemType.skill.deduction`)                | Dedução              | Dedução            | consistente |
| Demolitions      | Demolições (`CPR.global.itemType.skill.demolitions`)           | Demolições           | Demolições         | consistente |
| Evasion          | Evasão (`CPR.global.itemType.skill.evasion`)                   | Evasão               | Evasão             | consistente |
| First Aid        | Primeiros Socorros (`CPR.global.itemType.skill.firstAid`)      | Primeiros Socorros   | Primeiros Socorros | consistente |
| Heavy Weapons    | Armas Pesadas (`CPR.global.itemType.skill.heavyWeapons`)       | Armas Pesadas        | Armas Pesadas      | consistente |
| Human Perception | Percepção Humana (`CPR.global.itemType.skill.humanPerception`) | Percepção Humana     | Percepção Humana   | consistente |
| Perception       | Percepção (`CPR.global.itemType.skill.perception`)             | Percepção            | Percepção          | consistente |
| Persuasion       | Persuasão (`CPR.global.itemType.skill.persuasion`)             | Persuasão            | Persuasão          | consistente |
| Stealth          | Furtividade (`CPR.global.itemType.skill.stealth`)              | Furtividade          | Furtividade        | consistente |
| Trading          | Trocas (`CPR.global.itemType.skill.trading`)                   | Negociação           | Trocas             | divergente  |
| Weaponstech      | Armeiro (`CPR.global.itemType.skill.weaponstech`)              | Armeiro              | Armeiro            | consistente |

## Combate

| Termo EN         | Tradução atual no pt-BR.json (exemplo de chave)           | Termo de referência PT-BR | Proposta          | Status      |
| ---------------- | --------------------------------------------------------- | -------------------- | ----------------- | ----------- |
| ROF              | Cadência de tiro (`CPR.itemSheet.weapon.rof`)             | ROF                  | Cadência de tiro  | divergente  |
| SP               | PP (`CPR.global.itemType.armor.sp`)                       | SP                   | PP                | divergente  |
| HP               | PV (`CPR.global.generic.hitpointsShort`)                  | Pontos de Vida       | PV                | consistente |
| DV               | VD (`CPR.itemSheet.criticalInjury.dv`)                    | DV                   | VD                | divergente  |
| Autofire         | Fogo Automático (`CPR.effectSheet.combat.stats.autofire`) | Fogo automático      | Fogo Automático   | consistente |
| Suppressive Fire | Fogo Supressivo (`CPR.rolls.suppressiveFire`)             | Fogo Supressivo      | Fogo Supressivo   | consistente |
| Ablation         | Avariar (`CPR.global.generic.ablation`)                   | Ablação              | Avariar           | divergente  |
| Critical Injury  | Ferimento Crítico (`TYPES.Item.criticalInjury`)           | Ferimento Crítico    | Ferimento Crítico | consistente |
| Damage           | Dano (`CPR.global.generic.damage`)                        | Dano                 | Dano              | consistente |
| Armor            | Armadura (`TYPES.Item.armor`)                             | Armadura             | Armadura          | consistente |

## Netrunning

| Termo EN         | Tradução atual no pt-BR.json (exemplo de chave)              | Termo de referência PT-BR | Proposta            | Status           |
| ---------------- | ------------------------------------------------------------ | -------------------- | ------------------- | ---------------- |
| NET              | —                                                            | NET                  | NET                 | manter em inglês |
| NET Architecture | Arquitetura de Rede (`CPR.global.itemTypes.netArchitecture`) | Arquitetura NET      | Arquitetura de Rede | divergente       |
| Program          | Programa (`TYPES.Item.program`)                              | Programa             | Programa            | consistente      |
| Black ICE        | Black ICE (`TYPES.Actor.blackIce`)                           | Black ICE            | Black ICE           | manter em inglês |
| Demon            | Demônio (`TYPES.Actor.demon`)                                | Demônio              | Demônio             | consistente      |
| REZ              | RAM (`CPR.global.generic.rez`)                               | REZ                  | RAM                 | divergente       |
| PER              | PER (`CPR.global.blackIce.stats.per`)                        | PER                  | PER                 | manter em inglês |
| SPD              | VEL (`CPR.global.blackIce.stats.spd`)                        | SPD                  | VEL                 | divergente       |
| ATK              | ATQ (`CPR.global.blackIce.stats.atk`)                        | ATK                  | ATQ                 | divergente       |
| DEF              | DEF (`CPR.global.blackIce.stats.def`)                        | DEF                  | DEF                 | manter em inglês |
| Interface        | Interface (`CPR.global.role.netrunner.ability.interface`)    | Interface            | Interface           | consistente      |

## Equipamento e cibernética

| Termo EN  | Tradução atual no pt-BR.json (exemplo de chave)     | Termo de referência PT-BR | Proposta      | Status      |
| --------- | --------------------------------------------------- | -------------------- | ------------- | ----------- |
| Cyberware | Cibernética (`TYPES.Item.cyberware`)                | Cibernética          | Cibernética   | consistente |
| Humanity  | Humanidade (`CPR.characterSheet.leftPane.humanity`) | Humanidade           | Humanidade    | consistente |
| Cyberdeck | Console (`TYPES.Item.cyberdeck`)                    | Cyberdeck            | Console       | divergente  |
| Ammo      | Munição (`TYPES.Item.ammo`)                         | Munição              | Munição       | consistente |
| Upgrade   | Melhorias (`CPR.itemSheet.common.upgrades`)         | Melhorias            | Melhoria      | consistente |
| Hardening | —                                                   | Endurecido           | Endurecimento | novo        |
| Gear      | Equipamento (`CPR.global.itemTypes.gear`)           | Equipamento          | Equipamento   | consistente |
| Weapon    | Arma (`TYPES.Item.weapon`)                          | Arma                 | Arma          | consistente |

## Interface

| Termo EN  | Tradução atual no pt-BR.json (exemplo de chave) | Termo de referência PT-BR | Proposta  | Status      |
| --------- | ----------------------------------------------- | -------------------- | --------- | ----------- |
| Cart      | —                                               | Carrinho             | Carrinho  | novo        |
| Install   | Instalar (`CPR.global.generic.install`)         | Instalar             | Instalar  | consistente |
| Ledger    | Abrir Registro (`CPR.ledger.ledgerOpen`)        | Registro             | Registro  | consistente |
| Mook      | NPC (`TYPES.Actor.mook`)                        | NPC                  | NPC       | consistente |
| Container | Contêiner (`TYPES.Actor.container`)             | Contêiner            | Contêiner | consistente |

## Termos para o dono decidir

- **DEX:** DES (sistema) ou DEX (livro); recomendo DES, conforme a prioridade do sistema.
- **COOL:** FRIEZA (sistema) ou LEGAL (livro); recomendo FRIEZA, conforme a prioridade do sistema.
- **WILL:** VONT (sistema) ou VAI (livro); recomendo VONT, conforme a prioridade do sistema.
- **MOVE:** MOVE (sistema) ou MOVER (livro); recomendo MOVE, conforme a prioridade do sistema.
- **Role:** Funções ou Função; recomendo Função no singular.
- **Role Ability:** Talento da Função (sistema) ou Habilidade de Papel (livro); recomendo Talento da Função, conforme a prioridade do sistema.
- **Rockerboy:** Roqueiro (sistema) ou Rockerboy (livro); recomendo Roqueiro, conforme a prioridade do sistema.
- **Netrunner:** Trilha Rede (sistema) ou Netrunner (livro); recomendo Trilha Rede, conforme a prioridade do sistema.
- **Tech:** Tecnologia (sistema) ou Técnico (livro); recomendo Tecnologia, conforme a prioridade do sistema.
- **Medtech:** Técnico Médico (sistema) ou Medtech (livro); recomendo Técnico Médico, conforme a prioridade do sistema.
- **Media:** Influencer (sistema) ou Media (livro); recomendo Influencer, conforme a prioridade do sistema.
- **Lawman:** Advogado (sistema) ou Lawman (livro); recomendo Advogado, conforme a prioridade do sistema.
- **Fixer:** Canal (sistema) ou Fixer (livro); recomendo Canal, conforme a prioridade do sistema.
- **Skill:** Habilidade ou perícia; recomendo Habilidade, padrão do sistema e predominante no livro.
- **Trading:** Trocas (sistema) ou Negociação (livro); recomendo Trocas, conforme a prioridade do sistema.
- **ROF:** Cadência de tiro (sistema) ou ROF (livro); recomendo Cadência de tiro, conforme a prioridade do sistema.
- **SP:** PP (sistema) ou SP (livro); recomendo PP, conforme a prioridade do sistema.
- **HP:** PV ou HP; recomendo PV, abreviação de Pontos de Vida já usada no sistema.
- **DV:** VD (sistema) ou DV (livro); recomendo VD, conforme a prioridade do sistema.
- **Ablation:** Avariar (sistema) ou Ablação (livro); recomendo Avariar, conforme a prioridade do sistema.
- **NET:** NET ou Rede; recomendo NET isoladamente e Rede nas expressões já traduzidas.
- **NET Architecture:** Arquitetura de Rede (sistema) ou Arquitetura NET (livro); recomendo Arquitetura de Rede, conforme a prioridade do sistema.
- **REZ:** RAM (sistema) ou REZ (livro); recomendo RAM, conforme a prioridade do sistema.
- **SPD:** VEL (sistema) ou SPD (livro); recomendo VEL, conforme a prioridade do sistema.
- **ATK:** ATQ (sistema) ou ATK (livro); recomendo ATQ, conforme a prioridade do sistema.
- **Cyberdeck:** Console (sistema) ou Cyberdeck (livro); recomendo Console, conforme a prioridade do sistema.
- **Upgrade:** Melhoria ou Upgrade; recomendo Melhoria, já usada em outras chaves do sistema.
- **Hardening:** Endurecimento ou reforço; recomendo Endurecimento, sujeito ao contexto da regra.
- **Gear:** Equipamento ou Engrenagem; recomendo Equipamento, apesar da divergência entre chaves do sistema.
- **Mook:** NPC ou capanga; recomendo NPC, já adotado na ficha do sistema.

## Regras de estilo

- Use os nomes e as siglas já adotados no sistema; diferencie siglas iguais em contextos distintos, como EMP atributo e munição.
- Preserve exatamente os marcadores, por exemplo `{value}`, `{name}` e `{price}`, inclusive chaves e grafia.
- Use tratamento direto por “você” em mensagens e instruções, como nas traduções existentes.
- Mantenha maiúsculas em siglas e nomes próprios; títulos e rótulos existentes alternam maiúsculas e minúsculas, portanto padronize conforme o contexto.
- Use verbos no infinitivo em ações de interface, como “Instalar” e “Adicionar”.
- Preserve o jargão já usado, como “Choomba” e “Black ICE”; confira concordância e acentuação.
- Confira o contexto antes de reutilizar termos: o arquivo existente contém variantes e traduções incompletas.
