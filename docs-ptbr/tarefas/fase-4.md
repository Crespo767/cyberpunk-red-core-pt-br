# Fase 4: tarefas do executor

Tradução dos compêndios (arquivos Babele em `src/babele/pt-BR/`) para o executor GPT-6.1 Terra (Codex, raciocínio
alto), enviada pelo diretor pela CLI. Execução autônoma autorizada pelo dono em 2026-11-03.

## Situação verificada (diretor, 2026-11-04)

- Os 25 arquivos Babele PT-BR estão sincronizados com os YAML de `src/packs/` (mesmas entradas nos packs `core` e
  `internal`). `core-branded-weapons` não tem pack correspondente (foi para o DLC, D3) e fica intocado.
- 460 das 1755 strings Babele PT-BR são iguais ao `src/babele/en/`. As maiores: `internal_dv-tables` 98,
  `internal_net-rolltables` 64, `core_ammo` 54, `core_skills-languages` 53, `core_cyberware` 40, `core_upgrades` 40,
  `core_weapons` 40, demais perícias 31.
- Rótulos errados ou em inglês: "Engrenagem" (Gear), "Drugs", "Skills (...)", "Critical Injury Tables",
  "Cyberware (Core)", "DV Rolltables", "NET architecture Rolltables".
- `core_roles` ainda traduz os papéis (Sec, Reparador, Advogado, Multimídia, Trilha Rede, Tecnologia), contra a D8.
- **Bug com Babele:** as tabelas DV de autofire foram traduzidas como "(Auto)". O código
  (`src/modules/actor/sheet/cpr-actor-sheet.js`, troca de modo de tiro) procura a tabela com
  `table.name.includes(dvTableName) && table.name.includes("Autofire")`, e `SystemUtils.SetDvTable` compara o nome
  exato. Em PT-BR, a troca para a tabela de autofire falha. Correção nos dados: as tabelas de autofire mantêm o
  sufixo " (Autofire)", e o `dvTable` traduzido de cada arma tem de ser idêntico ao nome traduzido de uma tabela.
- O código procura a perícia "Autofire" pelo nome, mas ela vem do pack `internal_skills`, que não tem Babele.

## Tarefa 4.1: traduzir os arquivos Babele PT-BR (um prompt por lote)

| Lote | Arquivos (`src/babele/pt-BR/cyberpunk-red-core.<arquivo>.json`)                                                             |
| ---- | --------------------------------------------------------------------------------------------------------------------------- |
| A    | core_ammo, core_armor, core_clothing, core_drugs, core_gear, core_programs, core_roles, core_vehicles                       |
| B    | core_cyberware, core_upgrades, internal_cyberware-core                                                                      |
| C    | core_weapons, internal_dv-tables                                                                                            |
| D    | core_skills-languages, core_skills-local-expert, core_skills-martial-arts, core_skills-play-instrument, core_skills-science |
| E    | internal_net-rolltables, internal_critical-injury-tables, core_critical-injuries-body, core_critical-injuries-head          |

```text
Você é o executor do projeto de migração do Cyberpunk RED Core para Foundry VTT v13 com tradução PT-BR. Trabalhe só em
%USERPROFILE%\Documents\Cyberpunk RED - PTBR (branch main). Lote <LOTE> da tradução dos compêndios (Babele).

LEIA ANTES
- docs-ptbr/glossario-ptbr.md e a decisão D8 em docs-ptbr/plano-migracao-v13-ptbr.md (obrigatórios).
- docs-ptbr/tarefas/fase-4.md, seção "Situação verificada".
- src/lang/pt-BR.json (para usar os mesmos termos da interface, ex.: nomes de perícias em
  CPR.global.itemType.skill.*, tipos de munição em CPR.global.ammo.*).
- Para cada arquivo do lote: src/babele/en/<arquivo> (referência em inglês) e src/babele/pt-BR/<arquivo> (o que você
  vai editar).

ARQUIVOS DESTE LOTE (os únicos que você pode alterar)
<ARQUIVOS>

PEDIDO
1. Traduza para PT-BR todo valor do pt-BR que estiver idêntico ao en, seguindo o glossário. Mantenha iguais apenas
   nomes próprios (marcas, modelos, nomes de Black ICE e demônios), siglas e números. Não altere as CHAVES de
   "entries" (são os nomes originais em inglês usados pelo Babele) nem a estrutura dos objetos.
2. Revise também os valores já traduzidos que contrariem o glossário ou a D8 (ex.: papéis em inglês; Gear =
   Equipamento; Skill = Habilidade) e corrija.
3. Corrija o "label" de cada arquivo para PT-BR, conforme o glossário.
4. Preserve HTML, placeholders, links @UUID[...] e @Compendium[...], quebras de linha e entidades exatamente.
5. Não copie texto do livro. Traduza a partir do texto do próprio arquivo en.
<REGRAS_DO_LOTE>

SANDBOX
- .git é somente leitura: não rode git add nem git commit.
- Valide cada arquivo: JSON válido; mesmo conjunto de chaves e mesma estrutura do arquivo pt-BR original (compare com
  git show HEAD:<caminho>); mesmos links @UUID/@Compendium e tags HTML que o en em cada string. Mostre a saída da
  checagem (escreva-a com node, sem gravar o script no projeto). Grave em UTF-8 e confira que não há "??".
- Não crie arquivos fora dos arquivos do lote. Não toque em %USERPROFILE%\Documents\FoundryVTT.

RELATÓRIO (devolva exatamente isto)
1. Por arquivo: strings iguais ao en antes e depois; label antigo e novo.
2. Valores mantidos iguais ao en, com o motivo (agrupe por motivo).
3. Valores já traduzidos que você corrigiu (chave | antes | depois | motivo).
4. Saída da checagem.
5. Uma mensagem de commit em português.
```

Regras específicas por lote (o diretor insere em `<REGRAS_DO_LOTE>`):

- Lote A: em core_roles, os nomes dos papéis ficam em inglês (D8): Exec, Fixer, Lawman, Media, Medtech, Netrunner,
  Nomad, Rockerboy, Solo, Tech.
- Lote C: os nomes das tabelas DV de autofire terminam com " (Autofire)" (mantenha esse sufixo literal, mesmo
  traduzindo o resto do nome). Para cada arma em core_weapons com campo dvTable, o valor traduzido tem de ser
  IDÊNTICO ao "name" traduzido de uma entrada de internal_dv-tables; mostre essa checagem no relatório. Não traduza os
  valores numéricos nem "N/A" dos resultados.
- Lote D: o nome das perícias segue o padrão do pt-BR.json (ex.: o mesmo termo usado em
  CPR.global.itemType.skill.\*). Ex.: "Language (Arabic)" -> "Idioma (Árabe)" se o pt-BR.json usar "Idioma" para
  Language.
