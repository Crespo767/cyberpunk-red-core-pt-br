# Cyberpunk RED v13 - PTBR

![Cidade futurista sob chuva, iluminada por luzes vermelhas](src/images/foundry-background-ptbr.png)

Sistema de Cyberpunk RED (regras básicas) para o Foundry VTT v13, com interface e compêndios em português do Brasil.

> Aviso: este sistema é conteúdo não oficial, disponibilizado sob a
> [Homebrew Content Policy](https://rtalsoriangames.com/homebrew-content-policy/) da R. Talsorian Games, e não é
> aprovado nem endossado pela RTG. Ele faz referência a materiais de propriedade da R. Talsorian Games e de seus
> licenciados.

## O que vem traduzido

- **Interface do sistema:** fichas, diálogos, rolagens, chat, configurações e navegador de documentos.
- **Compêndios:** armas, munições, armaduras, roupas, cibernética, equipamento, drogas, programas, Funções, perícias,
  veículos, melhorias, lesões críticas e tabelas (via módulo Babele).
- **Glossário próprio:** Funções em português (Trilha-Redes, Negociador, Solo...), atributos em português (INT, REF, DES,
  TECH, Moral, Resistência, SORTE, MOVE, CORPO, EMP), REZ como REZ e Mook como Capanga.

## Requisitos

- Foundry VTT v13, build **13.350 ou mais nova**.
- Módulo **[Babele](https://foundryvtt.com/packages/babele)** (obrigatório): traduz o conteúdo dos compêndios. O
  Foundry oferece instalá-lo junto com o sistema.
- Módulo **[libWrapper](https://foundryvtt.com/packages/lib-wrapper)** (obrigatório): necessário para o funcionamento
  do Babele. O Foundry oferece instalá-lo junto com o sistema.
- Módulo **[pt-BR](https://foundryvtt.com/packages/pt-BR)** (recomendado): traduz a interface do próprio Foundry
  (menus, configurações, diretórios).

## Instalação

1. No Foundry, abra **Sistemas de Jogo → Instalar Sistema**.
2. No campo **URL do Manifesto**, cole:

   ```text
   https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases/latest/download/system.json
   ```

3. Instale e, no mundo, ative o **Babele** e o **libWrapper** e escolha o idioma **Português (Brasil)** nas configurações.

As atualizações chegam pelo próprio Foundry. As versões publicadas ficam em
[Releases](https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases).

## Novidades

Na [versão 1.0.6.5](https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases/tag/1.0.6.5), **WILL passa a
Resistência** e **COOL passa a Moral** em PT-BR, nas fichas, seletores, efeitos e novas rolagens. As referências
nas descrições de Laço Negro e Speedheal também foram atualizadas nos compêndios. As chaves internas e os cálculos
permanecem iguais; registros antigos de chat e descrições de itens já copiados para mundos não são reescritos automaticamente.

Na [versão 1.0.6.4](https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases/tag/1.0.6.4), as dez Funções
recebem nomes em português e descrições ampliadas, mantendo o nome original em inglês para consulta. As novas
descrições estão nos compêndios; cópias existentes em mundos não são reescritas automaticamente.

Na [versão 1.0.6.3](https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases/tag/1.0.6.3), as dez Funções
mostram uma única linha de **Talento**, com o nome traduzido, aviso explicativo e edição do nome original pelo lápis.

Na [versão 1.0.6.2](https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases/tag/1.0.6.2), as configurações de
Função mostram o nome traduzido do talento principal e explicam seu nome original e a associação com alguns bônus.

Na [versão 1.0.6.1](https://github.com/Crespo767/cyberpunk-red-core-pt-br/releases/tag/1.0.6.1):

- O **libWrapper** passou a ser uma dependência obrigatória para a tradução dos compêndios pelo Babele.
- O cartão do sistema identifica **Crespo767** como autor do fork e exibe uma nova imagem.
- O modelo de dados permanece na versão 51; esta atualização não exige uma nova migração.

As mudanças de cada versão estão no [CHANGELOG em português](CHANGELOG.pt-BR.md).

## Problemas e sugestões

Abra uma [issue neste repositório](https://github.com/Crespo767/cyberpunk-red-core-pt-br/issues). Este é um projeto
independente: não relate problemas desta versão ao time do sistema original.

## Créditos e licença

Baseado no sistema [fvtt-cyberpunk-red-core](https://gitlab.com/cyberpunk-red-team/fvtt-cyberpunk-red-core), do
Cyberpunk RED Team (versão 0.93). Esta é uma versão modificada, a partir de 2026-11-03, com a tradução para português
do Brasil e correções, mantida por [Crespo767](https://github.com/Crespo767). Os créditos do projeto original estão em
[CREDITS.md](CREDITS.md). A imagem do cartão foi gerada para este fork com a ferramenta de imagens da OpenAI.

Licença: GPLv3, a mesma do original ([LICENCE.md](LICENCE.md)).
