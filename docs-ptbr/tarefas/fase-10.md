# Fase 10: release 1.0.5

Pedido do dono (2026-11-04): resolver as três limitações da 1.0.4.

## 10.1 Editar pré-requisitos na ficha do item

Na aba de configurações da cibernética, trocar o resumo somente leitura por controles editáveis (só para quem pode
editar o item; quem não pode continua vendo o resumo):

- tipos de peça-base exigidos: caixas de seleção com os tipos de `CPR.cyberwareTypes`;
- "em par": caixa de seleção;
- itens exigidos: lista com nome em inglês e quantidade, botões de adicionar e remover. Arrastar uma cibernética para a
  lista adiciona o item, guardando o `_id` quando a origem for o compêndio core e o nome em inglês (`originalName` do
  Babele, ou o nome);
- CORPO-base mínimo: número;
- hospedeiro: seleção entre "qualquer" e "Soquete de Chipware".

## 10.2 Ícone ⚠ na ficha de capanga

Mesmo ícone e tooltip da ficha de personagem nas linhas de cibernética da ficha de capanga
(`src/templates/actor/mook/`).

## 10.3 Efeitos dos chips

Conferência dos chips do livro (texto do compêndio):

| Chip                                                           | Efeito                                                  | Automação                                           |
| -------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------- |
| Pain Editor                                                    | remove as penalidades de Gravemente Ferido              | já existe (`bonuses.hasPainSuppression`); só testar |
| Skill Chip                                                     | a perícia escolhida vale 3, a não ser que já seja maior | nova                                                |
| Difficult Skill Chip                                           | igual, para perícia ×2                                  | nova                                                |
| Chemical Analyzer, Memory Chip, Olfactory Boost, Tactile Boost | narrativos (sem número no livro)                        | nada a automatizar                                  |

Desenho dos chips de perícia:

- Campo `system.chippedSkill` (nome em inglês da perícia, que é o identificador estável das perícias no sistema),
  escolhido numa lista das perícias do ator na ficha do chip. O Skill Chip lista só perícias não ×2; o Difficult
  Skill Chip lista só as ×2. Os dois chips são identificados pela origem core ou nome em inglês.
- Nível efetivo = máximo entre o nível da perícia e 3, enquanto o chip estiver instalado e sem pré-requisito pendente
  (no Soquete de Chipware). O nível gravado não muda. Vale para a ficha, as rolagens e `getSkillLevel`.
- Migração 052 só se precisar preencher algo; `chippedSkill` começa vazio. Remover do texto do Skill Chip a nota "Not
  supported, Skill must be modified manually" (YAML em inglês e Babele PT-BR).

## Testes (antes da implementação)

- Vitest: nível efetivo (sem chip, chip com nível menor, chip com nível maior, chip fora do soquete).
- Playwright: editar cada tipo de pré-requisito pela ficha e reabrir; ⚠ na ficha de capanga; Skill Chip no soquete
  eleva a perícia a 3 na ficha e na rolagem e volta ao nível original ao desinstalar; Pain Editor remove a penalidade
  de Gravemente Ferido.

## Estado

- [ ] implementação e testes
- [ ] suíte completa, pacote e release 1.0.5 (ok do dono)
