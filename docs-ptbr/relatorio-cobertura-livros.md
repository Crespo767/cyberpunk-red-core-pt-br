# Relatório de cobertura do livro básico

Comparação entre o livro básico (Cyberpunk RED, edição digital em inglês, `.txt`) e os compêndios do sistema
(`src/packs/`, YAML). Feito na Fase 5 em 2026-11-04 pelo executor (GPT-6.1 Terra, Codex) em 5 lotes, revisado e
consolidado pelo diretor. Só nomes, páginas e números; nenhum trecho do livro. Fora do escopo: DLC e Black Chrome (D3).

## Resumo

O sistema cobre todo o conteúdo listado do livro básico nas seções verificadas. A única ausência, **os 12 Black ICE e
os 3 demônios**, é intencional (ver abaixo).

| Seção                                              | Livro | No sistema | Faltando |
| -------------------------------------------------- | ----: | ---------: | -------: |
| Armas (corpo a corpo, à distância, exóticas)       |    42 |         42 |        0 |
| Munições (tipos)                                   |    13 |         13 |        0 |
| Munições (combinações tipo × variedade permitidas) |    52 |         52 |        0 |
| Armaduras                                          |     9 |          9 |        0 |
| Cibernética (todas as categorias e opções)         |    96 |         96 |        0 |
| Programas comuns                                   |    15 |         15 |        0 |
| Black ICE (não distribuível, ver abaixo)           |    12 |          0 |        — |
| Demônios (não distribuível, ver abaixo)            |     3 |          0 |        — |
| Tabelas de andares da arquitetura NET              |     5 |          5 |        0 |
| Cyberdecks e hardware                              |     9 |          9 |        0 |
| Upgrades diversos de cyberdeck                     |     2 |          2 |        0 |
| Papéis e habilidades de papel                      |    20 |         20 |        0 |
| Perícias (categorias)                              |    66 |         66 |        0 |
| Lesões críticas (corpo e cabeça)                   |    22 |         22 |        0 |
| Equipamento geral                                  |    55 |         55 |        0 |
| Drogas e medicamentos                              |    10 |         10 |        0 |
| Roupas e moda (estilo × peça)                      |    90 |         90 |        0 |
| Veículos                                           |    14 |         14 |        0 |
| Acessórios de armas e upgrades de veículos         |    27 |         27 |        0 |

## Ausência intencional: Black ICE e demônios

- Black ICE do livro (págs. 206–207): Asp, Giant, Hellhound, Kraken, Liche, Raven, Scorpion, Skunk, Wisp, Dragon,
  Killer, Sabertooth. Demônios (pág. 212): Imp, Efreet, Balron.
- O upstream não os distribui de propósito. O `CHANGELOG.md` registra que os compêndios seguem a "Homebrew Content
  Policy" da R. Talsorian, pela qual atores e programas de Black ICE contam como NPCs e não podem ser distribuídos.
  Por isso o sistema traz só os ícones (`icons/compendium/blackice/`, `icons/compendium/programs/`) e os nomes nas
  tabelas de andares.
- Decisão do diretor (2026-11-04): não adicionar esses itens ao fork público. Quem tem o livro pode criá-los no
  próprio mundo: um programa de classe Black ICE configura um ator de Black ICE pela ficha.

## Divergências conferidas (2026-11-04)

| Item                                         | Conferência                                                                       | Decisão                                                          |
| -------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Tabela VD SMG (Autofire), pág. 173           | Livro impresso: valores menores; errata oficial: 20, 17, 20, 25, 30               | Mantido: o sistema segue a errata                                |
| Tabela VD Assault Rifle (Autofire), pág. 173 | Errata oficial: 22, 20, 17, 20, 25                                                | Mantido: o sistema segue a errata                                |
| Vampyres                                     | Livro: qualidade Excelente (+1 no ataque), ocultável                              | Corrigido: `attackmod` 1, `concealable` true, descrição en/pt-BR |
| Yacht, pág. 190                              | Livro: mínimo de 4 quartos                                                        | Corrigido na descrição (YAML, Babele en e pt-BR)                 |
| Linear Frame ∑ (Sigma), pág. 354             | O próprio livro cita 2 e 1 Interface Plugs                                        | Mantido (1): texto ambíguo                                       |
| High Fashion Jewelry, pág. 356               | Tabela imprime 50.000 eb com a categoria Luxury, que o livro define como 5.000 eb | Mantido (5.000 eb), coerente com a categoria                     |

Fonte da errata das tabelas de autofire: errata oficial do Cyberpunk RED e a issue #486 do upstream.

## Método

- Busca nos `.txt` do livro por trechos (`rg`/`Select-String`), sem ler os `.md` grandes.
- Equivalência de nomes por grafia, plural, maiúsculas e variantes Poor/Excellent.
- Saídas brutas dos lotes ficaram em `tmp-cobertura/` (fora do git); três delas perderam acentos na gravação, sem
  afetar nomes e números.
