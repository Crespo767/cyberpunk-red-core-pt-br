# Fase 5: tarefas do executor

Cobertura dos livros: conferir se o conteúdo do livro básico (Core Rules) está nos compêndios do sistema. Execução
autônoma autorizada pelo dono em 2026-11-03.

## Regras

- Fonte de busca: `<pasta dos livros>\Cyberpunk RED - Digital Edition.txt` (inglês, 1,3 MB).
  Não ler os `.md` de 70 a 90 MB. Busca com `rg`/`Select-String`, por trechos.
- Direitos autorais: o relatório lista só nomes de itens, números de página e estatísticas resumidas (ex.: "dano 3d6").
  Nenhuma frase do livro.
- Comparação contra `src/packs/` (YAML). D3: sem DLC nem Black Chrome; só o livro básico.

## Tarefa 5.1: relatório de cobertura por seção (um prompt por lote)

| Lote | Seções                                                                                              |
| ---- | --------------------------------------------------------------------------------------------------- |
| A    | armas (inclui exóticas e branded do livro básico), munições, armaduras                              |
| B    | cibernética (todas as categorias) e opções                                                          |
| C    | netrunning: programas, Black ICE, demônios, arquitetura (tabelas de andares), cyberdecks e hardware |
| D    | papéis e habilidades de papel, perícias, lesões críticas (corpo e cabeça), tabelas de VD            |
| E    | equipamento geral, drogas, roupas e moda, veículos e upgrades de armas/veículos                     |

```text
Você é o executor do projeto de migração do Cyberpunk RED Core para Foundry VTT v13 com tradução PT-BR. Trabalhe só em
%USERPROFILE%\Documents\Cyberpunk RED - PTBR (branch main). Lote <LOTE> da Fase 5 (cobertura dos livros).

LEIA docs-ptbr/tarefas/fase-5.md (seção Regras).

SEÇÕES DESTE LOTE: <SECOES>

PEDIDO
1. No livro em inglês (<pasta dos livros>\Cyberpunk RED - Digital Edition.txt), localize as
   listas/tabelas das seções acima e extraia os NOMES dos itens (com página, se o texto permitir).
2. Para cada nome, procure o item correspondente nos YAML de src/packs/ (campo name; considere variações de grafia,
   plural, maiúsculas e as variantes Poor/Excellent).
3. Grave tmp-cobertura/lote-<LOTE>.md (Markdown) com, para cada seção:
   - totais: itens no livro, encontrados, faltando;
   - tabela "Faltando no sistema": nome | página | observação;
   - tabela "No sistema mas não achado no livro" (só se houver), para checar grafias;
   - divergências evidentes de estatística entre livro e YAML (ex.: dano, custo, ROF), no máximo 15 por seção, com o
     valor do livro resumido em números e o arquivo YAML.
   Sem frases do livro.
4. Não altere nenhum outro arquivo.

SANDBOX: .git é somente leitura. Não crie arquivos fora de tmp-cobertura/. Grave em UTF-8.

RELATÓRIO: totais por seção e os itens faltando (resumido).
```
