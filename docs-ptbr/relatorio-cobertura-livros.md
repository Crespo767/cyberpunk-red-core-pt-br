# Relatório de cobertura do livro básico

Comparação entre o livro básico (Cyberpunk RED, edição digital em inglês, `.txt`) e os compêndios do sistema
(`src/packs/`, YAML). Feito na Fase 5 em 2026-11-04 pelo executor (GPT-6.1 Terra, Codex) em 5 lotes, revisado e
consolidado pelo diretor. Só nomes, páginas e números; nenhum trecho do livro. Fora do escopo: DLC e Black Chrome (D3).

## Resumo

O sistema cobre todo o conteúdo listado do livro básico nas seções verificadas, com uma exceção: **os 12 Black ICE e
os 3 demônios** não existem como itens ou atores prontos nos compêndios.

| Seção                                              |  Livro | No sistema | Faltando |
| -------------------------------------------------- | -----: | ---------: | -------: |
| Armas (corpo a corpo, à distância, exóticas)       |     42 |         42 |        0 |
| Munições (tipos)                                   |     13 |         13 |        0 |
| Munições (combinações tipo × variedade permitidas) |     52 |         52 |        0 |
| Armaduras                                          |      9 |          9 |        0 |
| Cibernética (todas as categorias e opções)         |     96 |         96 |        0 |
| Programas comuns                                   |     15 |         15 |        0 |
| **Black ICE**                                      | **12** |      **0** |   **12** |
| **Demônios**                                       |  **3** |      **0** |    **3** |
| Tabelas de andares da arquitetura NET              |      5 |          5 |        0 |
| Cyberdecks e hardware                              |      9 |          9 |        0 |
| Upgrades diversos de cyberdeck                     |      2 |          2 |        0 |
| Papéis e habilidades de papel                      |     20 |         20 |        0 |
| Perícias (categorias)                              |     66 |         66 |        0 |
| Lesões críticas (corpo e cabeça)                   |     22 |         22 |        0 |
| Equipamento geral                                  |     55 |         55 |        0 |
| Drogas e medicamentos                              |     10 |         10 |        0 |
| Roupas e moda (estilo × peça)                      |     90 |         90 |        0 |
| Veículos                                           |     14 |         14 |        0 |
| Acessórios de armas e upgrades de veículos         |     27 |         27 |        0 |

## Lacuna: Black ICE e demônios

- Black ICE do livro (págs. 206–207): Asp, Giant, Hellhound, Kraken, Liche, Raven, Scorpion, Skunk, Wisp, Dragon,
  Killer, Sabertooth. Demônios (pág. 212): Imp, Efreet, Balron.
- No sistema, eles só aparecem como resultados das tabelas de andares (`src/packs/internal/net-rolltables/`). Um
  Black ICE é montado como ator a partir de um programa de classe Black ICE, mas `core_programs` só tem os 15
  programas comuns. A instalação antiga (0.92.4) também não tinha esses itens no sistema.
- Para completar: criar 12 programas de classe Black ICE e 3 atores de demônio (ou programas, conforme o modelo do
  sistema), com as estatísticas do livro e descrições escritas por nós. **Depende de decisão do dono** (amplia o
  escopo da etapa).

## Divergências para conferir

Não foram alteradas: podem ser erratas oficiais já aplicadas pelo upstream ou leitura ambígua do livro.

| Item                                         | Livro                              | Sistema             | Arquivo                                                             |
| -------------------------------------------- | ---------------------------------- | ------------------- | ------------------------------------------------------------------- |
| Tabela VD SMG (Autofire), pág. 173           | 15, 13, 15, 20, 25                 | 20, 17, 20, 25, 30  | `src/packs/internal/dv-tables/table.dv_smg_autofire.yaml`           |
| Tabela VD Assault Rifle (Autofire), pág. 173 | 17, 16, 15, 13, 15                 | 22, 20, 17, 20, 25  | `src/packs/internal/dv-tables/table.dv_assault_rifle_autofire.yaml` |
| Vampyres (qualidade Excellent)               | +1 no ataque                       | `attackmod: 0`      | `src/packs/core/cyberware/cyberware.vampyres.yaml`                  |
| Linear Frame ∑ (Sigma), pág. 354             | o texto cita 2 e 1 Interface Plugs | 1                   | `src/packs/core/gear/gear.linear_frame___sigma.yaml`                |
| High Fashion Jewelry, pág. 356               | leitura do executor: 50.000 eb     | 5.000 eb            | `src/packs/core/clothing/clothing.high_fashion_jewelry.yaml`        |
| Yacht, pág. 190                              | mínimo de 4 quartos                | mínimo de 2 quartos | `src/packs/core/vehicles/vehicle.yacht.yaml`                        |

As tabelas VD de autofire podem refletir uma errata oficial adotada pelo upstream; confirmar com a errata antes de
mexer. O preço de joias de alta moda parece leitura errada do executor (a categoria de preço
"Luxury" do jogo é 5.000 eb).

## Método

- Busca nos `.txt` do livro por trechos (`rg`/`Select-String`), sem ler os `.md` grandes.
- Equivalência de nomes por grafia, plural, maiúsculas e variantes Poor/Excellent.
- Saídas brutas dos lotes ficaram em `tmp-cobertura/` (fora do git); três delas perderam acentos na gravação, sem
  afetar nomes e números.
