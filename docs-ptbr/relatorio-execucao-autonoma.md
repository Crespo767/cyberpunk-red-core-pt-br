# Relatório da execução autônoma (noite de 2026-11-03 para 2026-11-04)

O dono autorizou seguir sem aprovações enquanto dormia. Este é o resumo do que foi feito, o que foi verificado e o
que ficou para decidir. Detalhes em `docs-ptbr/tarefas/fase-3.md` a `fase-6.md`.

## Feito

| Fase          | Resultado                                                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 3. Interface  | `pt-BR.json` completo: 623 valores traduzidos, 22 alinhados à D8, 3 erros de sentido corrigidos; 41 ficam em inglês por decisão do glossário |
| 4. Compêndios | Babele PT-BR completo e consistente; corrigido o bug das tabelas VD de autofire traduzidas; nomes padronizados                               |
| 5. Livros     | Tudo coberto nas seções verificadas, exceto 12 Black ICE e 3 demônios (`docs-ptbr/relatorio-cobertura-livros.md`)                            |
| 6. Fechamento | Versão `0.93.0-ptbr.1`, CHANGELOG, pacote em `dist/`                                                                                         |

Verificação final: lint, prettier e markdownlint 0; testes unitários 172/172; Playwright 453/453 no Windows.

## Decisões do diretor para revisar

1. Corrigidos 3 erros claros de sentido no `pt-BR.json` (Black ICE, aviso da seção NET, "Nível + Atributo").
2. SDP traduzido como "PV Estrutural" em todas as chaves.
3. Divergências fora da D8 ficaram com o termo do sistema: Role = Função, Role Ability = Talento da Função, Skill =
   Habilidade, Cyberdeck = Console, Upgrade = Melhoria, Ablation = Avariar.
4. Qualidade no nome dos itens: "(Inferior)" e "(Excelente)", como a interface.
5. Tabelas VD de autofire mantêm o sufixo " (Autofire)" no nome traduzido (o código procura esse texto).
6. Nenhuma divergência de estatística do livro foi alterada; ficaram listadas para conferência.

## Pendências para o dono

1. **Babele em sessão real:** no ambiente de teste, o Babele 2.9.1 traduziu índices e rótulos, mas não aplicou a
   tradução aos documentos abertos. Abrir um compêndio numa sessão normal e conferir.
2. **Manifesto: RESOLVIDO (D9, 2026-11-04).** O diagnóstico da noite estava errado: o gulp sobrescreve as URLs no build (sem CI, `example.com`). Agora `npm run package:ptbr` gera o pacote com as URLs do GitHub Releases de `Crespo767/cyberpunk-red-core-pt-br`. Falta criar o repositório e publicar o release.
3. **Black ICE e demônios:** criar ou não os 12 programas de Black ICE e os 3 demônios do livro.
4. **6 divergências de estatística** em `docs-ptbr/relatorio-cobertura-livros.md` (algumas podem ser errata).
5. **Babele.get depreciado** em `src/modules/hooks/external/babele.js`.
6. **Compêndios marcados 13.351** (Foundry instalado é 13.350): atualizar o Foundry ou ignorar.
7. **CHANGELOG em PT-BR** do fork: manter ou não.
8. **Migrações de reparo** para mundos que já passaram pelas 7 migrações com bug (só importa se o projeto for
   distribuído).
9. Instalar no Foundry real e testar com um mundo cópia (não foi feito, por regra).
