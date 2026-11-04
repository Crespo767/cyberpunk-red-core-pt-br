# Fase 9: pré-requisitos de cibernética (1.0.4)

Pedido do dono (2026-11-04): avisar, ao instalar cibernética, quando um pré-requisito do livro não está cumprido (caso
de origem: Empunhadura Subdermal exige Neural Link). Base: levantamento feito pelo dono com o ChatGPT
(`cyberpunk_red_prerequisitos_core.json`), conferido pelo diretor contra o sistema e os compêndios.

## Conferência do levantamento

### Já garantido pelo sistema (nada a fazer)

O sistema exige uma peça-base instalada do mesmo tipo e controla os espaços. Isso já cobre:

- Neuralware (Gravador de Braindance, Soquete de Chipware, Conectores de Interface, Kerenzikov, Sandevistan): exige
  Neural Link.
- Opções de olho, áudio, braço e perna: exigem Olho Cibernético, Conjunto de Áudio, Ciberbraço e Ciberperna. Os
  espaços (Dartgun 3, Microvídeo 2, etc.) vêm de `size` nos YAML.
- Exceção dos Óculos Inteligentes: eles são peça-base do tipo olho, com 2 espaços, e já aceitam opções de olho.
- Coberturas (Realskinn, Plástico, Superchrome, Exposta): há uma versão para braço e outra para perna.
- Armas embutidas no braço de carne: resolvido na 1.0.1.
- Hardware e programas exigem cyberdeck, e acessórios de arma seguem os espaços de melhoria.

### Lacunas reais (escopo da 1.0.4)

| Item                                                                                                                     | Pré-requisito                                                | Fonte no compêndio                     |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | -------------------------------------- |
| Subdermal Grip                                                                                                           | Neural Link instalado                                        | "Requires a neural link"               |
| Implanted Linear Frame Σ                                                                                                 | CORPO 6 e 1 Grafted Muscle and Bone Lace                     | "Requires BODY 6, Grafted Muscle..."   |
| Implanted Linear Frame β                                                                                                 | CORPO 8 e 2 Grafted Muscle and Bone Lace                     | "Requires BODY 8, 2 Grafted Muscle..." |
| Anti-Dazzle, Image Enhance, Low Light/IR/UV, Virtuality                                                                  | em par: 2 olhos cibernéticos, ou Óculos Inteligentes         | "Must be paired"                       |
| Grip Foot, Skate Foot, Web Foot, Jump Booster                                                                            | em par: 2 ciberpernas                                        | "Must be paired"                       |
| Chipware (Chemical Analyzer, Memory Chip, Olfactory Boost, Pain Editor, Skill Chip, Difficult Skill Chip, Tactile Boost) | instalado num Soquete de Chipware, não direto no Neural Link | "Chipware."                            |

### Correções ao levantamento

- Subdermal Grip ocupa 1 espaço de **braço** (`size: 1`, tipo cyberArm), não de neuralware. O Neural Link é só
  pré-requisito.
- Chipware é pré-requisito de **instalação** (o chip vai num soquete), não de uso.
- Talon Foot em perna de carne: o texto do compêndio não diz isso. Precisa conferir na tabela da pág. 115 antes de
  liberar.
- Fora de escopo: itens de fase "use/activate/fire" (bônus do Smartgun Link, Munição Inteligente exige Targeting
  Scope, uso do cyberdeck, Linear Frame externo, bônus de Techhair + Chemskin, Light Tattoo, saída visual do Agente). O
  sistema não automatiza esses efeitos, então não há onde avisar sem mexer nas rolagens.

## Desenho

1. **Campo novo no item de cibernética:** `system.prerequisites` (datamodel + `template.json`):
   - `foundationalTypes`: tipos que precisam de peça-base instalada (ex.: `["neuralWare"]`);
   - `paired`: precisa de 2 peças-base instaladas do próprio tipo (Óculos Inteligentes contam como par);
   - `cyberware`: lista `{ id, name, count }` de itens exigidos, com `_id` do compêndio core e nome em inglês
     (mesma identificação da migração 050, imune à tradução);
   - `minBody`: CORPO mínimo (0 = sem exigência);
   - `host`: `_id` core do item onde precisa ser instalado (Soquete de Chipware), vazio = qualquer.
2. **Avaliação pura** (`src/modules/item/prerequisites.js`, sem Foundry): recebe um retrato do ator (peças instaladas,
   CORPO, itens) e o alvo escolhido, e devolve a lista de pendências. Testável em Vitest.
3. **Instalação:** `installCyberware` avalia antes do diálogo. Se houver pendências, mostra um aviso (`Rules.lawyer`)
   listando cada uma em PT-BR/EN e **deixa instalar** (aviso, não bloqueio, por causa das regras da casa). Para o
   `host`, o aviso aparece quando o alvo escolhido não é um Soquete de Chipware.
4. **Ficha do item:** resumo somente leitura "Pré-requisitos: ..." na aba de configurações. A edição pela interface
   fica para depois; quem faz conteúdo próprio edita pelos dados.
5. **Compêndio:** preencher `prerequisites` nos YAML dos 17 itens da tabela.
6. **Migração 051:** preenche o campo nas cópias existentes, por origem no compêndio ou nome em inglês (como a 050).
7. **Localização:** chaves novas em `en.json` e `pt-BR.json`.

## Testes (antes da correção, em commits separados)

- Vitest: avaliação pura (cada tipo de pendência, com e sem cumprir; Óculos Inteligentes contando como par).
- Playwright: Empunhadura Subdermal sem Neural Link mostra o aviso e instala; com Neural Link, sem aviso. Linear Frame
  Σ com CORPO 5 avisa. Um chip direto no Neural Link avisa; no Soquete, não.
- Playwright: migração 051 (origem core, nome em inglês, item alheio intocado, idempotência).

## Commits

1. Teste da avaliação pura → avaliação pura.
2. Testes Playwright de instalação e da 051 → campo, migração, instalação, ficha, YAML, localização.
3. Versão 1.0.4 e changelogs. Suíte completa, pacote, release (ok do dono), conferência no mundo do dono.

## Perguntas ao dono

1. Talon Foot em perna de carne: a tabela da pág. 115 marca esse item como os do braço?
2. Chipware só em Soquete de Chipware: incluir agora ou deixar para depois?
3. Confirma aviso em vez de bloqueio?

## Estado

- [ ] plano aprovado pelo dono
- [ ] implementação, testes e release 1.0.4
