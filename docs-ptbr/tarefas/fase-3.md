# Fase 3: tarefas do executor

Tradução da interface (`src/lang/pt-BR.json`) para o executor GPT-6.1 Terra (Codex, raciocínio alto), enviada pelo
diretor pela CLI. Limites do sandbox e comando de chamada: `docs-ptbr/tarefas/fase-1.md`, seção "Como o executor roda".

## Situação verificada (diretor, 2026-11-03)

- `en.json` e `pt-BR.json` têm 1426 chaves cada; nenhuma falta, nenhuma sobra.
- 769 valores já estão traduzidos. 657 são idênticos ao inglês: 341 com 3 palavras ou mais e 316 com 1 ou 2.
- Grupos com mais valores idênticos: `CPR.global` (160), `CPR.browser` (96), `CPR.effectSheet` (64),
  `CPR.settings` (63), `CPR.itemSheet` (61), `CPR.migration` (38), `CPR.rolls` (33).
- Referência de termos: uma referência de terminologia em PT-BR (local)
  e `Cyberpunk RED - Digital Edition.txt` (inglês). Só termos; nenhum trecho do livro entra no sistema.

## Tarefa 3.1: rascunho do glossário PT-BR

```text
Você é o executor do projeto de migração do Cyberpunk RED Core para Foundry VTT v13 com tradução PT-BR. Trabalhe só em
%USERPROFILE%\Documents\Cyberpunk RED - PTBR (branch main). Tarefa: rascunhar o glossário PT-BR que vai guiar a
tradução de src/lang/pt-BR.json.

FONTES
1. src/lang/en.json e src/lang/pt-BR.json: as 769 chaves já traduzidas são a fonte principal. A tradução nova deve
   ficar consistente com elas.
2. uma referência de terminologia em PT-BR (local) e
   <pasta dos livros>\Cyberpunk RED - Digital Edition.txt (inglês, 1,3 MB). Use só para
   descobrir o termo usado no livro (busque com rg/Select-String; não leia os arquivos inteiros de uma vez).
   DIREITOS AUTORAIS: copie apenas termos isolados (palavras ou expressões curtas). Nenhuma frase do livro no
   glossário.

PEDIDO
Crie docs-ptbr/glossario-ptbr.md com:
1. Introdução curta (3 a 5 linhas): para que serve, as fontes e a regra de prioridade (consistência com o pt-BR.json
   existente > termo do livro > tradução nova).
2. Tabelas por categoria: atributos (INT, REF, DEX, TECH, COOL, WILL, LUCK, MOVE, BODY, EMP), papéis (roles),
   perícias, combate (ROF, SP, HP, DV, Autofire, Suppressive Fire, Ablation, Critical Injury...), netrunning (NET,
   Program, Black ICE, Demon, REZ, PER, SPD, ATK, DEF, Interface...), equipamento e cibernética (Cyberware, Humanity,
   Cyberdeck, Ammo, Upgrade, Hardening...), e termos de interface (Cart, Install, Ledger, Mook, Container...).
   Colunas: Termo EN | Tradução atual no pt-BR.json (com um exemplo de chave, ou "—") | Termo de referência PT-BR (ou
   "—") | Proposta | Status.
   Status: "consistente" (sistema e livro concordam), "divergente" (sistema e livro discordam), "novo" (sem tradução
   no sistema), "manter em inglês" (siglas e jargão que o livro também deixa em inglês).
3. Seção "Termos para o dono decidir": todos os "divergente" e qualquer caso duvidoso, cada um com as opções e uma
   recomendação de uma linha.
4. Seção "Regras de estilo" observadas no pt-BR.json existente (ex.: maiúsculas em títulos, tratamento "você",
   placeholders {value} intactos, siglas).
Limite: até 150 termos. Priorize os que aparecem nas 657 chaves ainda idênticas ao inglês.

NÃO FAÇA
- Não altere src/lang/pt-BR.json nem nenhum outro arquivo além do glossário.
- Não crie arquivos de log no projeto nem em node_modules.

SANDBOX
- .git é somente leitura: não rode git add nem git commit.
- Formate o glossário: npx prettier --write docs-ptbr/glossario-ptbr.md e npx markdownlint --fix
  docs-ptbr/glossario-ptbr.md; depois npx markdownlint docs-ptbr/glossario-ptbr.md deve sair com código 0.
- Grave em UTF-8 (o glossário tem acentos; confira que não virou "?").

RELATÓRIO (devolva exatamente isto)
1. Número de termos por categoria e por status.
2. A lista "Termos para o dono decidir" completa.
3. Códigos de saída de prettier e markdownlint e o resultado de uma busca por "??" no glossário.
4. Uma mensagem de commit em português.
```
