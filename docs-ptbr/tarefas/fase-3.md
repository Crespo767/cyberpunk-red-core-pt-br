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

## Decisão do dono (D8, 2026-11-03)

Papéis em inglês; siglas de atributos do sistema; siglas de regras do sistema, exceto REZ, que fica REZ; Mook =
Capanga. Nas demais divergências vale o termo do sistema, salvo erro claro de sentido. Texto completo no plano, D8.

## Tarefa 3.2: glossário final e correção das traduções que contrariam a D8

```text
Você é o executor do projeto de migração do Cyberpunk RED Core para Foundry VTT v13 com tradução PT-BR. Trabalhe só em
%USERPROFILE%\Documents\Cyberpunk RED - PTBR (branch main). Leia docs-ptbr/plano-migracao-v13-ptbr.md (decisão D8) e
docs-ptbr/glossario-ptbr.md (rascunho que você fez).

DECISÕES DO DONO (D8)
- Papéis em inglês, como o livro: Exec, Fixer, Lawman, Media, Medtech, Netrunner, Nomad, Rockerboy, Solo, Tech.
- Atributos: siglas atuais do sistema (INT, REF, DES, TECH, FRIEZA, VONT, SORTE, MOVE, CORPO, EMP). "LUCK (Max)" e
  "EMP (Max)" viram "SORTE (Máx.)" e "EMP (Máx.)".
- Siglas de regras: as do sistema (PP, PV, VD, ATQ, VEL, Cadência de Tiro...), exceto REZ, que fica "REZ" (hoje
  aparece como "RAM", outro conceito).
- Mook = Capanga (plural Capangas).
- Demais divergências: fica o termo do sistema, salvo erro claro de sentido. Se achar um erro claro, liste no
  relatório com a justificativa; não decida sozinho termos que não sejam erro claro.

PEDIDO
1. docs-ptbr/glossario-ptbr.md: aplique as decisões. Troque a seção "Termos para o dono decidir" por "Decisões do dono
   (D8)", com o que foi decidido. Status final de cada termo: "consistente", "manter em inglês" ou "decidido (D8)".
2. src/lang/pt-BR.json: corrija os valores JÁ TRADUZIDOS que contrariam a D8. Exemplos conhecidos:
   CPR.global.role.lawman.name = "Advogado" -> "Lawman"; CPR.global.role.netrunner.name = "Trilha Rede" ->
   "Netrunner"; CPR.global.generic.rez = "RAM" -> "REZ". Procure todas as ocorrências (nomes de papéis dentro de
   frases, títulos, tooltips; "RAM" no sentido de REZ; "NPC" quando o inglês diz "Mook"), comparando cada valor do
   pt-BR.json com o do en.json da mesma chave.
3. Não traduza agora os valores que ainda estão idênticos ao inglês (isso é a Tarefa 3.3), exceto os que a D8 manda
   corrigir.
4. Preserve a estrutura e a ordem das chaves, os placeholders ({value}, {name}...), as tags HTML e o estilo de
   escape do arquivo. Não altere en.json nem outro idioma.

SANDBOX
- .git é somente leitura: não rode git add nem git commit.
- Valide: node -e "JSON.parse(require('fs').readFileSync('src/lang/pt-BR.json','utf8'))"; npx prettier --check
  src/lang/pt-BR.json; npx prettier --write e npx markdownlint --fix no glossário, e npx markdownlint no glossário com
  código 0. Grave em UTF-8 e confira que não há "??" nos dois arquivos.
- Não crie arquivos de log no projeto nem em node_modules.

RELATÓRIO (devolva exatamente isto)
1. Tabela das chaves alteradas no pt-BR.json: chave | valor antigo | valor novo | motivo (D8 ou erro claro).
2. Erros claros encontrados que você NÃO corrigiu por não estarem na D8 (ou "nenhum").
3. Saídas das validações.
4. Duas mensagens de commit em português: glossário e correções do pt-BR.json.
```

## Tarefa 3.3: traduzir os valores idênticos ao inglês (um prompt por lote)

Os lotes rodam em paralelo; cada um grava um patch separado em `tmp-traducao/` (excluído do git só nesta máquina) e o
diretor faz o merge no `pt-BR.json`. O diretor troca `<LOTE>` e `<PREFIXOS>`.

```text
Você é o executor do projeto de migração do Cyberpunk RED Core para Foundry VTT v13 com tradução PT-BR. Trabalhe só em
%USERPROFILE%\Documents\Cyberpunk RED - PTBR (branch main). Lote <LOTE> da tradução da interface.

LEIA ANTES
- docs-ptbr/glossario-ptbr.md (glossário final, obrigatório) e a decisão D8 em docs-ptbr/plano-migracao-v13-ptbr.md.
- src/lang/en.json e src/lang/pt-BR.json.

ESCOPO DO LOTE
Chaves cujo nome começa por: <PREFIXOS>
Dentre elas, só as que têm no pt-BR.json valor IDÊNTICO ao do en.json.

PEDIDO
1. Grave tmp-traducao/lote-<LOTE>.json: um objeto plano { "chave.completa": "tradução" } com todas as chaves do
   escopo. Não altere src/lang/pt-BR.json diretamente.
2. Traduza para PT-BR seguindo o glossário e o estilo do pt-BR.json existente (tratamento "você", maiúsculas como nas
   chaves vizinhas já traduzidas).
3. Mantenha idêntico ao inglês apenas o que o glossário manda manter (siglas, nomes de papéis, nomes próprios,
   jargão como Netrunner). Para cada chave que ficar igual ao inglês, liste no relatório o motivo.
4. Preserve exatamente: placeholders ({value}, {name}, {0}...), tags e atributos HTML, entidades, quebras de linha
   (\n) e espaços no início e no fim do texto.
5. Não use nenhum trecho do livro. Traduza a partir da string do sistema.

SANDBOX
- .git é somente leitura: não rode git add nem git commit.
- Valide o patch: JSON válido; todas as chaves existem no en.json; mesmo conjunto de placeholders e tags que o
  en.json em cada chave (escreva uma checagem rápida com node e mostre a saída). Grave em UTF-8 e confira que não
  há "??" no patch.
- Não crie arquivos fora de tmp-traducao/.

RELATÓRIO (devolva exatamente isto)
1. Número de chaves no escopo, traduzidas e mantidas iguais ao inglês.
2. Lista das mantidas iguais ao inglês, com o motivo de cada uma.
3. Saída da checagem de placeholders/tags.
4. Termos novos que não estavam no glossário e como você os traduziu.
```

## Resultado da Fase 3 (diretor, 2026-11-04)

- Tarefa 3.1: rascunho do glossário (`1d34cee`). Tarefa 3.2: glossário final com a D8 (`7849032`) e 22 valores
  existentes alinhados à D8 (`1c8cb1b`).
- Tarefa 3.3: 5 lotes (A a E) em paralelo, cada um num patch em `tmp-traducao/`, validados e aplicados pelo diretor.
  O validador conferiu, em todas as 667 chaves, placeholders, tags HTML, espaços nas pontas e "??": 0 problemas.
  Commit `f673ed4` (623 valores traduzidos). Lote Z: 3 erros de sentido corrigidos (`0c057d8`). Ajustes finais:
  SDP padronizado como "PV Estrutural" (`29bf902`) e glossário completo (`c27dca2`).
- Estado final: 1426 chaves; 41 valores iguais ao inglês, todos listados no glossário (siglas, nomes de papéis,
  nomes próprios, Base/Total/Mod/Tokens).
- Validação: `npm run prettier` 0; `test:unit` 172/172; mundo novo no Foundry 13.350 com idioma PT-BR: fichas de
  character, mook, container, blackIce, demon, weapon, cyberware, armor, program e role abrem sem erros nem avisos no
  console, e nenhuma linha das fichas tem termos em inglês da lista de checagem.
- Não rodado: a suíte Playwright completa, porque os specs usam o idioma inglês e a mudança é só no `pt-BR.json`.

### Decisões do diretor durante a execução autônoma (revisar)

- Corrigidos 3 erros claros de sentido (lote Z): "preto ICE" → "Black ICE"; aviso de função de Netrunner aponta para
  a seção NET da aba de combate; "Nível + Status" → "Nível + Atributo".
- SDP traduzido como "PV Estrutural" em todas as chaves, seguindo o que o sistema já usava.
- Nas divergências não cobertas pela D8 (Role = Função, Role Ability = Talento da Função, Skill = Habilidade,
  Cyberdeck = Console, Upgrade = Melhoria, Ablation = Avariar), ficou o termo do sistema.
