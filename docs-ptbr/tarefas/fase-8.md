# Fase 8: release 1.0.1

Pedido do dono (2026-11-04): corrigir no sistema a instalação em braço de carne, junto com as correções e traduções
pendentes, e publicar como 1.0.1 (pedir o ok do dono antes de publicar).

## Escopo

1. **Braço de carne (Tarefa 8.1, código).** Livro, pág. 115: Big Knucks, Rippers, Scratchers, Slice 'N Dice,
   Subdermal Grip, Tool Hand e Wolvers "podem ser instalados como a única peça de cibernética num braço de carne". O
   sistema exige ciberbraço (todos são `type: cyberArm`, não fundacionais). Os demais dados da tabela da pág. 115
   (custo, instalação, HL, espaços) batem com os YAML.
2. **Traduções (Tarefa 8.2).** "Cápsula de Espingarda" (Shotgun Shell) -> "Cartucho de Espingarda" e revisão de
   todos os nomes dos arquivos Babele PT-BR atrás de traduções literais erradas.
3. **Registro.** Teste no mundo real: 13 fichas criadas para o Player2 (Anderson + 10 do Single Shot Pack + 2 do Fast
   and Furriest), sem itens faltando; munição básica, especialidades e sub-habilidades de Medtech completadas;
   corrigido o CORPO base do Fin Diesel (o PDF já incluía o +2 de Grafted Muscle & Bone Lace). Rolagens e cálculos
   conferidos ao vivo.
4. **Fechamento.** Versão 1.0.1, changelogs en e pt-BR, suíte unitária e Playwright completa, pacote (`npm run package:ptbr`), release (com o ok do dono) e conferência do manifesto. Depois, instalar a Mão-Ferramenta do Anderson e do Torch no mundo do dono.

## Decisões do diretor

- Item instalado em braço de carne fica direto no ator (como os fundacionais), no máximo 2 por personagem. Campo novo
  `meatArmCompatible`, editável na ficha do item; migração 050 marca cópias antigas pela origem no compêndio ou pelo
  nome em inglês.
- Exigência de Neural Link do Subdermal Grip: não automatizada (fica com o mestre).
- Shotgun Slug vira "Balote de Espingarda" (termo usado no Brasil), não "Projétil Único". Crossbow fica "Besta" (não
  "Balestra"). Wolvers fica em inglês (nome próprio). Os sufixos "(Autofire)" das tabelas de VD não são traduzidos:
  o código monta o nome da tabela de fogo automático acrescentando " (Autofire)".
- Achado extra: cibernética e melhorias apontavam para "DV Pistola" e "DV Lançador de Granadas", tabelas que não
  existem em PT-BR ("VD ..."). Corrigido.
- Dúvidas deixadas como estão: Flak/Armadura, couro nômade, nomes de drogas e programas (Boost, Smash...).

## Estado

- [x] 8.1 braço de carne (testes provados: falham sem a correção, passam com ela)
- [x] 8.2 traduções
- [x] versão, changelogs, suíte (464/464), pacote
- [x] release 1.0.1 publicado (ok do dono em 2026-11-04)
- [x] Mão-Ferramenta no braço de carne do Anderson e do Torch (perda de Humanidade "Nenhuma": os valores do PDF já
      incluíam a perda). Anderson 45/66 bate com o PDF; Torch ficou 58/64 (o PDF dizia 70, sem o -2 por peça).

## Pendência encontrada

- Mundos criados do zero nunca gravam `dataModelVersion` (fica "newCprWorld"), então migrações novas, como a 050,
  não rodam neles. O 050 não rodou no mundo do dono; a Mão-Ferramenta do Anderson foi marcada à mão.
