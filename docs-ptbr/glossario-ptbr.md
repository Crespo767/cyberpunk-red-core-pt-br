# Glossário PT-BR

Este glossário orienta a tradução de `src/lang/pt-BR.json` e a revisão de termos recorrentes.
As fontes são `en.json`, o `pt-BR.json` existente e o livro em inglês e referências de terminologia em PT-BR.
Prioridade: consistência com o `pt-BR.json` existente > termo do livro > tradução nova.
A coluna do livro registra somente termos isolados; “—” indica termo não identificado.
Chaves ainda idênticas ao inglês não contam como tradução; siglas e nomes próprios mantidos são exceções.

As propostas seguem as decisões D8 e preservam os termos existentes do sistema nas demais divergências.
A comparação ignora diferenças apenas de maiúsculas e flexão de número.

## Atributos

| Termo EN | Tradução atual no pt-BR.json (exemplo de chave) | Termo de referência PT-BR | Proposta | Status           |
| -------- | ----------------------------------------------- | -------------------- | -------- | ---------------- |
| INT      | INT (`CPR.global.stats.int`)                    | INT                  | INT      | manter em inglês |
| REF      | REF (`CPR.global.stats.ref`)                    | REF                  | REF      | manter em inglês |
| DEX      | DES (`CPR.global.stats.dex`)                    | DEX                  | DES      | decidido (D8)    |
| TECH     | TECH (`CPR.global.stats.tech`)                  | TECH                 | TECH     | manter em inglês |
| COOL     | FRIEZA (`CPR.global.stats.cool`)                | LEGAL                | FRIEZA   | decidido (D8)    |
| WILL     | VONT (`CPR.global.stats.will`)                  | VAI                  | VONT     | decidido (D8)    |
| LUCK     | SORTE (`CPR.global.stats.luck`)                 | SORTE                | SORTE    | consistente      |
| MOVE     | MOVE (`CPR.global.stats.move`)                  | MOVER                | MOVE     | decidido (D8)    |
| BODY     | CORPO (`CPR.global.stats.body`)                 | CORPO                | CORPO    | consistente      |
| EMP      | EMP (`CPR.global.stats.emp`)                    | EMP                  | EMP      | manter em inglês |

## Papéis

| Termo EN     | Tradução atual no pt-BR.json (exemplo de chave) | Termo de referência PT-BR | Proposta          | Status           |
| ------------ | ----------------------------------------------- | -------------------- | ----------------- | ---------------- |
| Role         | Funções (`CPR.global.generic.role`)             | Funções              | Função            | consistente      |
| Role Ability | Talento da Função (`CPR.rolls.roleAbility`)     | Habilidade de Papel  | Talento da Função | decidido (D8)    |
| Rockerboy    | Rockerboy (`CPR.global.role.rockerboy.name`)    | Rockerboy            | Rockerboy         | decidido (D8)    |
| Solo         | Solo (`CPR.global.role.solo.name`)              | Solo                 | Solo              | manter em inglês |
| Netrunner    | Netrunner (`CPR.global.role.netrunner.name`)    | Netrunner            | Netrunner         | decidido (D8)    |
| Tech         | Tech (`CPR.global.role.tech.name`)              | Técnico              | Tech              | decidido (D8)    |
| Medtech      | Medtech (`CPR.global.role.medtech.name`)        | Medtech              | Medtech           | decidido (D8)    |
| Media        | Media (`CPR.global.role.media.name`)            | Media                | Media             | decidido (D8)    |
| Exec         | Exec (`CPR.global.role.exec.name`)              | Exec                 | Exec              | manter em inglês |
| Lawman       | Lawman (`CPR.global.role.lawman.name`)          | Lawman               | Lawman            | decidido (D8)    |
| Fixer        | Fixer (`CPR.global.role.fixer.name`)            | Fixer                | Fixer             | decidido (D8)    |
| Nomad        | Nomad (`CPR.global.role.nomad.name`)            | Nômade               | Nomad             | decidido (D8)    |

## Perícias

| Termo EN         | Tradução atual no pt-BR.json (exemplo de chave)                                        | Termo de referência PT-BR | Proposta           | Status         |
| ---------------- | -------------------------------------------------------------------------------------- | -------------------- | ------------------ | -------------- |
| Base             | Base (`CPR.characterSheet.rightPanke.skills.base`)                                     | —                    | Base               | igual em PT-BR |
| Total            | Total (`CPR.mookSheet.skills.total`)                                                   | —                    | Total              | igual em PT-BR |
| Mod / MOD        | Mod (`CPR.mookSheet.skills.mod`); MOD (`CPR.characterSheet.rightPane.skills.skillMod`) | —                    | Mod / MOD          | igual em PT-BR |
| Skill            | Habilidade (`CPR.global.generic.skill`)                                                | Habilidade           | Habilidade         | consistente    |
| Accounting       | Contabilidade (`CPR.global.itemType.skill.accounting`)                                 | Contabilidade        | Contabilidade      | consistente    |
| Acting           | Atuação (`CPR.global.itemType.skill.acting`)                                           | Atuação              | Atuação            | consistente    |
| Athletics        | Atletismo (`CPR.global.itemType.skill.athletics`)                                      | Atletismo            | Atletismo          | consistente    |
| Brawling         | Briga (`CPR.global.itemType.skill.brawling`)                                           | Briga                | Briga              | consistente    |
| Concentration    | Concentração (`CPR.global.itemType.skill.concentration`)                               | Concentração         | Concentração       | consistente    |
| Conversation     | Conversa (`CPR.global.itemType.skill.conversation`)                                    | Conversa             | Conversa           | consistente    |
| Criminology      | Criminologia (`CPR.global.itemType.skill.criminology`)                                 | Criminologia         | Criminologia       | consistente    |
| Cryptography     | Criptografia (`CPR.global.itemType.skill.cryptography`)                                | Criptografia         | Criptografia       | consistente    |
| Dance            | Dança (`CPR.global.itemType.skill.dance`)                                              | Dança                | Dança              | consistente    |
| Deduction        | Dedução (`CPR.global.itemType.skill.deduction`)                                        | Dedução              | Dedução            | consistente    |
| Demolitions      | Demolições (`CPR.global.itemType.skill.demolitions`)                                   | Demolições           | Demolições         | consistente    |
| Evasion          | Evasão (`CPR.global.itemType.skill.evasion`)                                           | Evasão               | Evasão             | consistente    |
| First Aid        | Primeiros Socorros (`CPR.global.itemType.skill.firstAid`)                              | Primeiros Socorros   | Primeiros Socorros | consistente    |
| Heavy Weapons    | Armas Pesadas (`CPR.global.itemType.skill.heavyWeapons`)                               | Armas Pesadas        | Armas Pesadas      | consistente    |
| Human Perception | Percepção Humana (`CPR.global.itemType.skill.humanPerception`)                         | Percepção Humana     | Percepção Humana   | consistente    |
| Perception       | Percepção (`CPR.global.itemType.skill.perception`)                                     | Percepção            | Percepção          | consistente    |
| Persuasion       | Persuasão (`CPR.global.itemType.skill.persuasion`)                                     | Persuasão            | Persuasão          | consistente    |
| Stealth          | Furtividade (`CPR.global.itemType.skill.stealth`)                                      | Furtividade          | Furtividade        | consistente    |
| Trading          | Trocas (`CPR.global.itemType.skill.trading`)                                           | Negociação           | Trocas             | decidido (D8)  |
| Weaponstech      | Armeiro (`CPR.global.itemType.skill.weaponstech`)                                      | Armeiro              | Armeiro            | consistente    |

## Combate

| Termo EN         | Tradução atual no pt-BR.json (exemplo de chave)            | Termo de referência PT-BR | Proposta          | Status        |
| ---------------- | ---------------------------------------------------------- | -------------------- | ----------------- | ------------- |
| ROF              | Cadência de tiro (`CPR.itemSheet.weapon.rof`)              | ROF                  | Cadência de tiro  | decidido (D8) |
| SP               | PP (`CPR.global.itemType.armor.sp`)                        | SP                   | PP                | decidido (D8) |
| SDP              | PV Estrutural (`CPR.characterSheet.rightPane.vehicle.sdp`) | —                    | PV Estrutural     | consistente   |
| HP               | PV (`CPR.global.generic.hitpointsShort`)                   | Pontos de Vida       | PV                | consistente   |
| DV               | VD (`CPR.itemSheet.criticalInjury.dv`)                     | DV                   | VD                | decidido (D8) |
| Autofire         | Fogo Automático (`CPR.effectSheet.combat.stats.autofire`)  | Fogo automático      | Fogo Automático   | consistente   |
| Suppressive Fire | Fogo Supressivo (`CPR.rolls.suppressiveFire`)              | Fogo Supressivo      | Fogo Supressivo   | consistente   |
| Ablation         | Avariar (`CPR.global.generic.ablation`)                    | Ablação              | Avariar           | decidido (D8) |
| Critical Injury  | Ferimento Crítico (`TYPES.Item.criticalInjury`)            | Ferimento Crítico    | Ferimento Crítico | consistente   |
| Damage           | Dano (`CPR.global.generic.damage`)                         | Dano                 | Dano              | consistente   |
| Armor            | Armadura (`TYPES.Item.armor`)                              | Armadura             | Armadura          | consistente   |

## Netrunning

| Termo EN         | Tradução atual no pt-BR.json (exemplo de chave)              | Termo de referência PT-BR | Proposta            | Status           |
| ---------------- | ------------------------------------------------------------ | -------------------- | ------------------- | ---------------- |
| NET              | —                                                            | NET                  | NET                 | manter em inglês |
| NET Architecture | Arquitetura de Rede (`CPR.global.itemTypes.netArchitecture`) | Arquitetura NET      | Arquitetura de Rede | decidido (D8)    |
| Program          | Programa (`TYPES.Item.program`)                              | Programa             | Programa            | consistente      |
| Black ICE        | Black ICE (`TYPES.Actor.blackIce`)                           | Black ICE            | Black ICE           | manter em inglês |
| Kraken           | Kraken (`CPR.netArchitecture.floor.options.blackIce.kraken`) | —                    | Kraken              | manter em inglês |
| Liche            | Liche (`CPR.netArchitecture.floor.options.blackIce.liche`)   | —                    | Liche               | manter em inglês |
| Balron           | Balron (`CPR.netArchitecture.floor.options.demon.balron`)    | —                    | Balron              | manter em inglês |
| Efreet           | Efreet (`CPR.netArchitecture.floor.options.demon.efreet`)    | —                    | Efreet              | manter em inglês |
| Demon            | Demônio (`TYPES.Actor.demon`)                                | Demônio              | Demônio             | consistente      |
| REZ              | REZ (`CPR.global.generic.rez`)                               | REZ                  | REZ                 | decidido (D8)    |
| PER              | PER (`CPR.global.blackIce.stats.per`)                        | PER                  | PER                 | manter em inglês |
| SPD              | VEL (`CPR.global.blackIce.stats.spd`)                        | SPD                  | VEL                 | decidido (D8)    |
| ATK              | ATQ (`CPR.global.blackIce.stats.atk`)                        | ATK                  | ATQ                 | decidido (D8)    |
| DEF              | DEF (`CPR.global.blackIce.stats.def`)                        | DEF                  | DEF                 | manter em inglês |
| Interface        | Interface (`CPR.global.role.netrunner.ability.interface`)    | Interface            | Interface           | consistente      |

## Equipamento e cibernética

| Termo EN  | Tradução atual no pt-BR.json (exemplo de chave)     | Termo de referência PT-BR | Proposta    | Status        |
| --------- | --------------------------------------------------- | -------------------- | ----------- | ------------- |
| Cyberware | Cibernética (`TYPES.Item.cyberware`)                | Cibernética          | Cibernética | consistente   |
| Humanity  | Humanidade (`CPR.characterSheet.leftPane.humanity`) | Humanidade           | Humanidade  | consistente   |
| Cyberdeck | Console (`TYPES.Item.cyberdeck`)                    | Cyberdeck            | Console     | decidido (D8) |
| Ammo      | Munição (`TYPES.Item.ammo`)                         | Munição              | Munição     | consistente   |
| Upgrade   | Melhorias (`CPR.itemSheet.common.upgrades`)         | Melhorias            | Melhoria    | consistente   |
| Gear      | Equipamento (`CPR.global.itemTypes.gear`)           | Equipamento          | Equipamento | consistente   |
| Weapon    | Arma (`TYPES.Item.weapon`)                          | Arma                 | Arma        | consistente   |

## Interface

| Termo EN      | Tradução atual no pt-BR.json (exemplo de chave) | Termo de referência PT-BR | Proposta      | Status           |
| ------------- | ----------------------------------------------- | -------------------- | ------------- | ---------------- |
| Tokens        | Tokens (`CPR.migration.docType.tokens`)         | —                    | Tokens        | igual em PT-BR   |
| Cyberpunk RED | Cyberpunk RED (`CPR.module.dsn.groupName`)      | —                    | Cyberpunk RED | manter em inglês |
| Install       | Instalar (`CPR.global.generic.install`)         | Instalar             | Instalar      | consistente      |
| Ledger        | Abrir Registro (`CPR.ledger.ledgerOpen`)        | Registro             | Registro      | consistente      |
| Mook          | Capanga (`TYPES.Actor.mook`)                    | NPC                  | Capanga       | decidido (D8)    |
| Container     | Contêiner (`TYPES.Actor.container`)             | Contêiner            | Contêiner     | consistente      |

## Decisões do dono (D8)

- **Papéis:** manter em inglês: Exec, Fixer, Lawman, Media, Medtech, Netrunner, Nomad, Rockerboy, Solo e Tech.
- **Atributos:** INT, REF, DES, TECH, FRIEZA, VONT, SORTE, MOVE, CORPO e EMP. Os valores máximos são SORTE (Máx.) e EMP (Máx.).
- **Siglas de regras:** manter as do sistema, incluindo PP, PV, VD, ATQ, VEL e Cadência de Tiro. REZ permanece REZ; não é RAM.
- **Mook:** Capanga; plural Capangas.
- **Demais divergências:** manter o termo do sistema, salvo erro claro de sentido; relatar esses erros com justificativa.
- **Termos ainda sem tradução no sistema:** Hardening e Cart serão tratados na Tarefa 3.3; D8 não escolheu uma tradução para eles.

## Regras de estilo

- Use os nomes e as siglas já adotados no sistema; diferencie siglas iguais em contextos distintos, como EMP atributo e munição.
- Preserve exatamente os marcadores, por exemplo `{value}`, `{name}` e `{price}`, inclusive chaves e grafia.
- Use tratamento direto por “você” em mensagens e instruções, como nas traduções existentes.
- Mantenha maiúsculas em siglas e nomes próprios; títulos e rótulos existentes alternam maiúsculas e minúsculas, portanto padronize conforme o contexto.
- Use verbos no infinitivo em ações de interface, como “Instalar” e “Adicionar”.
- Preserve o jargão já usado, como “Choomba” e “Black ICE”; confira concordância e acentuação.
- Confira o contexto antes de reutilizar termos: o arquivo existente contém variantes e traduções incompletas.
