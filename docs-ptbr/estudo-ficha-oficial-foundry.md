# Estudo de adaptação da ficha oficial para o Foundry v13

Data: 2026-11-06. Base consultada: versão 1.0.6.4, commit `edd0451`.

**Estado: estudo e planejamento. A implementação da nova ficha não foi iniciada.**

## 1. Objetivo e decisões já aprovadas

Adaptar a organização visual da ficha oficial brasileira de Cyberpunk RED ao Foundry, conectando seus campos aos dados e às automações do sistema existente.

Decisões expressas do dono:

- Documentar e avaliar a solução antes de implementar.
- Usar exatamente quatro abas principais, nesta ordem: **Personagem > Equipamento > Cibernéticos > Histórico**.
- Manter o termo **Função**, mesmo onde a ficha impressa usa Cargo.
- Preservar os nomes internos usados pelas regras e apresentar os nomes traduzidos ao usuário.

As demais escolhas deste documento são propostas para avaliação, não decisões já aprovadas.

## 2. Referências e limites do estudo

Referência visual: PDF oficial de três páginas fornecido pelo dono como `CyberPunk-RED_fichas.pdf`.

- Página 1: identidade, atributos, perícias, humanidade, PV, lesões, armas e armaduras.
- Página 2: reputação, melhoria, caminho de vida, equipamento e estilo de vida.
- Página 3: cibernéticos por região e categoria, com diagrama corporal.

Fonte da editora: [página de Cyberpunk RED da Devir](https://devir.com.br/cyberpunk-red/), com [PDF da ficha](https://devir.com.br/wp-content/uploads/2024/02/CyberPunk-RED_fichas.pdf).

O PDF foi inspecionado visualmente nesta conversa. Ele serve como referência de organização e aparência; não estabelece sozinho as regras de automação. O funcionamento atual e os dados do sistema precisam ser preservados e verificados separadamente.

Este estudo incluiu leitura dos modelos de dados, das classes de ficha, dos templates e da estrutura dos testes. Não houve teste da futura interface, implantação no servidor, conversão de atores ou alteração de arquivos de execução.

## 3. Viabilidade técnica confirmada

O projeto já possui uma ficha de personagem baseada em `ActorSheetV2`, templates Handlebars e CSS. O layout e as ações ficam em camadas distintas dos documentos e modelos de dados.

Pontos verificados:

- `src/cpr.js` registra a ficha de personagem e permite escolher outras fichas para o mesmo tipo de ator.
- `CPRCharacterActorSheet` estende `CPRActorSheet` e acrescenta controles específicos de personagem.
- Os cálculos e as rolagens usam os atores, itens e modificadores existentes.
- Perícias, Funções, armas, armaduras e cibernética são itens incorporados ao ator; não devem virar cópias independentes no novo layout.
- O caminho de vida já tem campos narrativos próprios no modelo de personagem.
- A ficha atual possui duas navegações independentes, à direita e na parte inferior. Elas exigem adaptação para a navegação única proposta.

Conclusão do estudo: a adaptação é tecnicamente viável. A equivalência funcional depende de conectar e testar os controles da nova interface; herdar uma classe não garante que todos os comportamentos funcionem automaticamente em outro HTML.

## 4. Organização proposta das quatro abas

### 4.1 Elementos comuns

Proposta de cabeçalho compacto: retrato, nome do ator, Função ativa e resumo de PV/humanidade. As quatro abas aparecem sempre na ordem aprovada.

O resumo deve ler os mesmos valores da seção detalhada. Evitar duplicar campos editáveis com o mesmo nome no formulário: um valor pode ser mostrado em mais de um lugar, mas sua edição precisa ter um controle inequívoco.

Referências visuais: blocos geométricos, títulos bem destacados e agrupamento semelhante ao formulário impresso. A fidelidade ao papel precisa ser equilibrada com legibilidade, redimensionamento e quantidade variável de itens.

### 4.2 Personagem

Objetivo: reunir identificação, capacidades e ações usadas durante a sessão.

Distribuição proposta:

1. Identidade, retrato, Funções e talentos, incluindo múltiplas Funções.
2. Atributos e recursos: PV, humanidade, SORTE, EMP, deslocamento e estado de ferimento.
3. Perícias agrupadas por categoria, com nome, nível, atributo e base claramente identificados.
4. Combate: armas equipadas, armadura ativa, escudo, ferimentos críticos e teste de morte.
5. Painel expansível de combate na NET, quando aplicável: Função de NET selecionada, Interface, ações e programas.
6. Painel expansível de efeitos e modificadores do personagem.

As armas deste painel são as mesmas do inventário da aba Equipamento. O painel oferece atalhos de uso; não cria novos itens.

Reputação e pontos de melhoria podem ter resumo nesta aba, com acesso aos registros. O local principal desses registros é Histórico.

Combate na NET e efeitos ficam dentro de Personagem; a proposta não acrescenta uma quinta ou sexta aba principal.

### 4.3 Equipamento

Objetivo: administrar posses e preparar o que será usado em Personagem.

Distribuição proposta:

1. Dinheiro e registro de transações.
2. Inventário, com filtros e quantidades variáveis.
3. Armas e munições: equipar, carregar, descarregar e administrar acessórios.
4. Armaduras, escudos e roupas: proteção, desgaste, reparo e estado equipado.
5. Equipamentos, drogas, veículos e demais tipos já admitidos no inventário atual.
6. Cyberdecks, programas e melhorias: instalação e administração de capacidade.
7. Moda, habitação, aluguel, estilo de vida e serviços associados já existentes.

Separação proposta: a preparação do cyberdeck e de seus programas fica aqui; seu uso durante uma incursão fica em Personagem.

Cibernéticas disponíveis para instalar continuam acessíveis. A organização e a instalação corporal ficam em Cibernéticos, com atalhos quando necessários.

### 4.4 Cibernéticos

Objetivo: apresentar instalações e pré-requisitos por região corporal ou categoria, usando o diagrama da ficha como referência.

Distribuição proposta:

1. Resumo de humanidade e EMP, lendo os valores do ator.
2. Diagrama corporal com alternativas textuais para navegar pelas regiões.
3. Ciberáudio, ciberolhos, ciberbraços, ciberpernas e neuralware.
4. Cibernéticos internos, externos, de moda e borgware.
5. Peças-base e respectivas opções instaladas, com ocupação de espaços.
6. Instalação, remoção, configuração e avisos de pré-requisitos pendentes.

A representação corporal deve refletir os itens instalados e seus vínculos reais. Não inferir que um item pertence ao braço esquerdo apenas porque foi solto perto dele no desenho.

Casos obrigatórios para o desenho: dois membros do mesmo tipo, opções emparelhadas, instalações em carne, chips, múltiplos hospedeiros e cibernética com pré-requisito pendente.

Armas cibernéticas devem continuar disponíveis no combate sem serem duplicadas como armas novas no inventário.

O diagrama pode ser inicialmente uma representação de consulta. Transformá-lo em área de instalação por arrastar e soltar depende de aprovação específica do comportamento e de validação dos hospedeiros.

### 4.5 Histórico

Objetivo: organizar identidade narrativa, relações e registros de evolução.

Distribuição proposta:

1. Pseudônimos, descrição e história do personagem.
2. Origem cultural, idiomas narrativos e personalidade.
3. Estilo de vestimenta, cabelo, maneirismos e valores.
4. Pessoas e posses importantes, sentimentos sobre outras pessoas.
5. Origem familiar, criação, crise familiar e objetivos.
6. Amigos, inimigos e relacionamentos.
7. Caminho de vida específico da Função.
8. Observações livres, reputação e pontos de melhoria, com seus registros.

Amigos, inimigos e relacionamentos já são textos ricos. Uma apresentação em cartões pode usar esses campos; transformá-los em tabelas estruturadas exigiria um estudo de dados e possível migração separado.

Moda/habitação ficam em Equipamento; preferências narrativas de vestimenta e cabelo ficam em Histórico. Essa distinção precisa ser compreensível nos títulos e ajudas.

## 5. Mapeamento inicial de dados

Os caminhos abaixo são os existentes no código consultado, não novos campos propostos.

| Informação | Origem existente | Destino proposto | Observação |
| --- | --- | --- | --- |
| Nome principal e retrato | `actor.name`, `actor.img` | Cabeçalho/Personagem | Preservar os controles e permissões atuais. |
| Pseudônimos | `system.information.alias` | Histórico | Não confundir com o nome principal do ator. |
| Descrição, história e notas | `system.information.description`, `.history`, `.notes` | Histórico | Conservar HTML e links. |
| Atributos | `system.stats` | Personagem | Manter chaves como `cool`, `will` e `tech`, independentemente dos rótulos. |
| SORTE e EMP | `system.stats.luck`, `system.stats.emp` | Personagem | Preservar valores atuais e máximos. |
| PV | `system.derivedStats.hp` | Personagem | Reutilizar os cálculos e controles existentes. |
| Humanidade | `system.derivedStats.humanity` | Personagem/Cibernéticos | Um único estado, inclusive transações. |
| Ferimento e teste de morte | `system.derivedStats.currentWoundState`, `.seriouslyWounded`, `.deathSave` | Personagem | Não recalcular na camada visual por fórmulas paralelas. |
| Deslocamento | `system.derivedStats.walk`, `.run` | Personagem | Preservar modificadores e valores derivados. |
| Perícias | `actor.itemTypes.skill` | Personagem | Nível em `skill.system.level`; nível efetivo por `actor.getSkillLevel`. |
| Funções e talentos | `actor.itemTypes.role` | Personagem | `mainRoleAbility`, `rank` e `abilities` permanecem nos itens. |
| Função ativa e Função de NET | `system.roleInfo.activeRole`, `.activeNetRole` | Personagem | A primeira usa nome; a segunda referencia ID de item. |
| Ferimentos críticos | `actor.itemTypes.criticalInjury` | Personagem | Conservar efeitos e ações de tratamento existentes. |
| Armas, armaduras e munições | Itens incorporados e `system.weapons` | Equipamento/Personagem | Mesmo item em administração e combate. |
| Barras de recursos do token | `system.externalData` | Integração transversal | Manter sincronização com armadura e arma selecionadas. |
| Dinheiro | `system.wealth` | Equipamento | Valor e transações do mesmo registro. |
| Reputação | `system.reputation` | Histórico | Preservar valor, transações e ação de confronto existente. |
| Melhoria | `system.improvementPoints` | Histórico | Preservar valor, transações e controles de gasto existentes. |
| Caminho de vida | `system.lifepath` | Histórico | Campos detalhados abaixo. |
| Moda | `system.lifestyle.fashion.desription` | Equipamento | A grafia interna `desription` existe; não corrigir incidentalmente neste trabalho. |
| Habitação e estilo de vida | `system.lifestyle.housing`, `.lifeStyle` | Equipamento | Preservar descrição e custo dos modelos existentes. |
| Trauma Team | `system.lifestyle.traumaTeam` | Equipamento | Não confundir o serviço com o talento da Função Executivo. |
| Cibernética e chips | `actor.itemTypes.cyberware` e estruturas de instalação dos itens | Cibernéticos | Reusar instalação, espaços, hospedeiros e pré-requisitos. |
| Cyberdeck e programas | Itens incorporados e métodos atuais de execução | Equipamento/Personagem | Separar preparação de uso visualmente, sem duplicar dados. |
| Efeitos | Documentos ActiveEffect e modificadores aplicáveis | Personagem e itens de origem | A interface precisa explicar a origem do modificador. |

Campos de `system.lifepath` já presentes:

`aboutPeople`, `affectations`, `childhoodEnvironment`, `clothingStyle`, `culturalOrigin`, `enemies`, `familyBackground`, `familyCrisis`, `friends`, `hairStyle`, `lifeGoals`, `personality`, `roleLifepath`, `tragicLoveAffairs`, `valueMost`, `valuedPerson`, `valuedPossession`.

O texto narrativo de idiomas está atualmente em `system.lifepath.languages`, usado pelo template/contexto, mas não aparece declarado no esquema de personagem consultado. Essa divergência precisa ser investigada antes de escolher seu controle de edição; não criar nem remover dados por suposição.

## 6. Matriz de preservação das automações

Reaproveitar significa chamar os fluxos existentes, incluindo confirmações e diálogos, preservando o comportamento atual. Não significa automatizar novas regras ou tornar cálculos manuais obrigatoriamente automáticos.

| Fluxo | Requisito para a nova ficha | Validação necessária |
| --- | --- | --- |
| Atributos e SORTE | Mesmos dados e diálogos de rolagem | Comparar resultados e persistência com a ficha atual. |
| PV/humanidade | Mesmas operações de alteração e recálculo | Atual, máximo, ferimentos, EMP e transações coerentes. |
| Perícias | Manter dificuldade, atributos, chips e modificadores | Perícia comum, x2, personalizada e chip com nível-base zero. |
| Funções | Manter talentos, níveis e configuração | As dez Funções, múltiplas Funções e talento personalizado. |
| Efeitos | Manter aplicação, origem e permissões | Efeito persistente, situacional e efeito de item instalado. |
| Ataque e dano | Mesmas armas e fluxos de rolagem | Corpo a corpo, distância, arma cibernética e munição especial. |
| Munição | Mesmos controles de carga e consumo | Carregar, descarregar, recarregar e reabrir a ficha. |
| Modos de disparo | Preservar seleção e tabela de VD do token | Entrar/sair de Autofire e retornar ao modo anterior. |
| Armadura e escudo | Mesma seleção, proteção e desgaste | Dano, ablação, reparo e barras do token. |
| Ferimentos críticos | Mesmos itens, efeitos e teste de morte | Adicionar, remover e conferir penalidades. |
| Equipamento | Mesmos documentos e quantidades | Arrastar, dividir pilha, transferir e remover pelos fluxos atuais. |
| Dinheiro e registros | Mesmas transações | Comparar saldo e histórico após operações. |
| Cyberdeck/programas | Mesma instalação e execução | Espaços, ativação, desativação, dano e consumo de ações existentes. |
| NET | Mesma Função ativa e integração com token | Interface, programas e Black ICE vinculados. |
| Cibernética | Mesmos hospedeiros e opções de instalação | Instalar/desinstalar, espaços e membros de carne. |
| Pré-requisitos | Mesma detecção de pendências e supressão de efeitos | Válido, inválido e mudança posterior do pré-requisito. |
| Chips | Mesmo cálculo efetivo sem regravar a perícia | Instalar, rolar, remover e confirmar restauração. |
| Texto rico | Mesmos campos e editores compatíveis | Salvar, reabrir, links, permissões e conteúdo longo. |
| Reabertura/sincronização | Mesmo estado persistido | Atualização remota, duas janelas e troca de abas. |

## 7. Arquitetura proposta e pontos de atenção

### Nova opção de ficha

Proposta: registrar uma ficha alternativa para o ator `character`, selecionável nas configurações de ficha do Foundry. O layout atual continua disponível durante a validação.

O protótipo começa no tipo Personagem. A extensão ao tipo Capanga deve ser uma decisão posterior, pois seu modelo de dados não tem todos os campos do Personagem. Black ICE, Demônio e Contêiner mantêm suas fichas próprias.

Não usar o nome "oficial" para sugerir que a adaptação digital foi produzida ou aprovada pela Devir. Nome provisório: **Ficha com layout da edição brasileira**.

### Reuso e adaptação

- Avaliar herança de `CPRCharacterActorSheet` para reutilizar contexto e ações.
- Tratar explicitamente as duas navegações atuais em `_onRender`; não deixá-las concorrendo com a nova navegação.
- Preservar as classes e os atributos HTML exigidos pelos eventos de rolagem, edição e arrastar itens, ou fornecer adaptações equivalentes verificadas.
- Não copiar as fórmulas de ator/itens para o template ou CSS.
- Registrar/precarregar os novos templates conforme o fluxo já usado no projeto.
- Definir CSS restrito ao novo layout. A classe global `.actor-sheet` tem regras de grade da ficha atual e pode causar interferência se for reaproveitada sem isolamento.
- Usar os mesmos documentos de ator e itens, sem manter uma segunda representação persistida da ficha.
- Separar preferências visuais de dados de regras e documentar onde serão guardadas antes de implementá-las.

### Arquivos de referência para a implementação futura

- `src/cpr.js`: registro das opções de ficha.
- `src/modules/actor/sheet/cpr-actor-sheet.js`: contexto e ações compartilhadas.
- `src/modules/actor/sheet/cpr-character-sheet.js`: comportamento específico de Personagem.
- `src/modules/datamodels/actor/character-datamodel.js` e `mixins/common-schema.js`: campos persistidos.
- `src/modules/datamodels/actor/components/derivedStats-schema.js`: valores derivados.
- `src/templates/actor/character/`: Funções, perícias, combate, inventário, cibernética e caminho de vida.
- `src/templates/actor/mixin/netrunning/`: ações e programas de NET.
- `src/css/sheets/actor/character.css`: layout existente e possíveis conflitos de estilo.
- `src/modules/system/preload-templates.js`: carregamento de templates.

Os nomes e caminhos dos arquivos novos serão definidos no desenho técnico aprovado, antes de criá-los.

## 8. Compatibilidade e proteção de dados

Hipótese inicial: mudança de apresentação, sem necessidade de migração do modelo de dados. A hipótese só será confirmada depois de resolver os campos pendentes.

Requisitos:

- Abrir o mesmo ator nas duas fichas e obter os mesmos valores.
- Trocar a opção de ficha sem criar, converter ou excluir itens.
- Preservar IDs, UUIDs, chaves de atributos e identificadores de talentos/programas.
- Manter os nomes traduzidos como apresentação, sem usá-los como novos identificadores de regras.
- Conservar conteúdo narrativo existente e referências dos compêndios.
- Exibir campos de acordo com propriedade e permissões, inclusive em atores vinculados a tokens.
- Usar os mesmos controles de cálculo já existentes, sem fazer uma troca de aba alterar valores.
- Qualquer necessidade de campo novo ou migração exige um desenho adicional antes da implementação correspondente.

## 9. Pendências para fechar o desenho

| ID | Questão | Proposta inicial / condição de fechamento |
| --- | --- | --- |
| D01 | Seleção da ficha | Começar como alternativa para Personagem; decidir depois sobre torná-la padrão. |
| D02 | Aparência | Avaliar uma prévia com cores, tipografia, contraste e distribuição dos blocos. |
| D03 | Vícios | Identificar o significado do campo no PDF e sua relação com os documentos existentes. Não ligar automaticamente a `affectations` nem inventar regra de dependência. |
| D04 | Idiomas narrativos | Investigar a divergência entre o template/contexto e o esquema de `lifepath.languages`. |
| D05 | Diagrama corporal | Definir imagem, créditos, navegação por região e se haverá instalação por arrastar e soltar. |
| D06 | Campos narrativos | Começar conservando textos ricos; tabelas estruturadas para relações ficam para outro escopo. |
| D07 | NET | Validar os painéis dentro de Personagem e a preparação do cyberdeck em Equipamento. |
| D08 | Efeitos | Definir painel e acesso aos efeitos de ator e de itens, respeitando permissões. |
| D09 | Cabeçalho fixo | Escolher quais resumos permanecem visíveis e evitar controles editáveis duplicados. |
| D10 | Nomes visíveis | Manter Função e terminologia aprovada; listar divergências do PDF para avaliação. |
| D11 | Janela e densidade | Validar legibilidade em 1024×768, 1280×800 e 1920×1080; definir tamanho inicial após a prévia. |
| D12 | Preferências visuais | Definir persistência de aba, rolagem e seções expansíveis por usuário/janela. |

### Divergências visíveis que não devem ser alteradas automaticamente

- Cargo no PDF corresponde a Função por decisão do dono.
- Habilidade de Cargo precisa ser conciliada com a apresentação atual de Talento da Função.
- O PDF usa siglas como TEC, MOR, VON e MOV; o projeto usa TECH, FRIEZA, VONT e MOVE.
- A ficha impressa não tem listas dinâmicas nem todos os controles digitais de NET e efeitos.
- A ordem e as categorias de perícias precisam seguir os dados de regras existentes; rótulos do PDF não bastam para redefini-las.
- Alterações em imagens, marcas e textos editoriais devem ter sua origem registrada; o PDF não será adicionado ao pacote como um fundo automático por padrão.

## 10. Validação prevista

### Ambiente

Executar em mundo isolado, com dados de teste e versão exata do Foundry registrada. Usar PT-BR, Babele e libWrapper; repetir verificações essenciais com fallback inglês.

O servidor fornecido na conversa não chegou a uma sessão de jogo acessível durante a tentativa anterior. Será necessário confirmar o acesso e a instalação do candidato quando houver código para testar. Não presumir que o servidor já contém alterações locais.

Não executar preparação de testes nem migrações sobre o mundo real. Manter disponíveis as fichas atuais para comparação.

### Casos e evidências

- Personagem vazio, personagem completo e personagem com muitos itens/textos longos.
- Exemplos das dez Funções, múltiplas Funções e itens personalizados.
- Cyberdeck equipado, combate na NET e personagem sem capacidade de NET.
- Instalações corporais complexas, chips e pré-requisitos pendentes.
- GM, proprietário e usuários com permissões limitadas ou somente leitura.
- Token vinculado e não vinculado, dois personagens abertos e atualização por outro cliente.
- Redimensionamento, navegação por teclado, foco após edição, rolagem e reabertura.
- Capturas das quatro abas e de estados relevantes; registrar versão, cenário, resultado e limitações.
- Comparação dos documentos antes/depois da simples abertura e troca de abas: nenhuma alteração de regras ou itens deve decorrer apenas da navegação.

A suíte unitária existente é uma proteção parcial. A nova interface exige testes de navegador que acionem os controles reais; um teste que apenas confere texto no template não comprova as automações.

Reaproveitar os cenários de criação, personagem, equipamentos, cibernética, chips, Autofire, permissões e rolagem já presentes em `tests/playwright/actors/` e `tests/playwright/sheets/`, acrescentando cobertura específica para o novo layout.

Critérios de aceite:

- Exatamente quatro abas principais, na ordem aprovada.
- Campos existentes acessíveis sem perda de informação.
- Nível, atributo, base e modificadores de perícia compreensíveis e coerentes com a ficha atual.
- Ações da matriz de automações equivalentes nos cenários verificados.
- Nenhum controle de edição apresentado a quem não pode editar.
- Nenhuma duplicação de documentos ou regravação de identificadores por causa do layout.
- Blocos legíveis, sem sobreposição ou cortes nas resoluções acordadas.
- Zero falhas pendentes nas verificações aplicáveis; limitações residuais explicitadas.
- Possibilidade de retornar à ficha anterior pelo seletor de ficha.

## 11. Etapas propostas

| Etapa | Entrega | Condição para avançar |
| --- | --- | --- |
| E0 — estudo | Este documento, mapeamento e pendências | Revisão do dono e fechamento das decisões necessárias. |
| E1 — desenho | Prévia das quatro abas, sem conexão com dados reais | Aprovar distribuição, terminologia e controles. |
| E2 — arquitetura | Plano dos arquivos, eventos, permissões e preferências | Resolver pendências que afetem dados ou comportamento. |
| E3 — protótipo | Ficha alternativa conectada ao ator de teste | Solicitação explícita para começar a implementação. |
| E4 — integrações | Fluxos da matriz implementados e verificados | Evidências em navegador, sem falhas pendentes. |
| E5 — candidato | Build, testes, documentação e pacote revisável | Revisão funcional e visual concluída. |
| E6 — distribuição | Versão e release | Publicação solicitada pelo dono. |

Não estimar o trabalho como uma simples troca de imagem ou CSS. Há controles, permissões e eventos que precisam ser reposicionados e validados.

## 12. Registro de acompanhamento

- [x] Ordem das quatro abas registrada conforme solicitação.
- [x] PDF de referência inspecionado.
- [x] Estrutura da ficha atual e principais campos consultados.
- [x] Mapeamento inicial e matriz de automações documentados.
- [x] Pendências de dados, interface e acesso registradas.
- [ ] Distribuição interna das abas aprovada.
- [ ] Pendências necessárias ao protótipo resolvidas.
- [ ] Desenho técnico aprovado.
- [ ] Implementação solicitada e iniciada.
- [ ] Validação visual e funcional concluída.

Nenhuma etapa de implementação ou publicação está concluída ou autorizada apenas pela existência deste documento.
