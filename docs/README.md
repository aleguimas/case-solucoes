# Base de Conhecimento — Casé Soluções

Documentação dos procedimentos e convenções do projeto da landing page.
Consulte antes de fazer alterações para manter o padrão e não perder conhecimento.

## Índice

- [Adicionar vídeos do YouTube](./adicionar-videos-youtube.md) — como incorporar
  novos vídeos puxando **todas** as informações reais do YouTube (título,
  descrição, thumbnail, data, duração) e gerando o Schema VideoObject.
- [Schema de FAQ (FAQPage)](./schema-faq.md) — como manter o structured data de
  FAQ correto, alinhado ao conteúdo visível, e o que esperar de resultado no
  Google.

## Convenções gerais

- Site **estático** (HTML + CSS puro). Sem build, sem framework.
- Arquivos principais: `index.html` e `styles.css` na raiz.
- Deploy: commits vão direto para a branch `main`.
- Todo conteúdo é em **pt-BR**, com foco em SEO local (Recife / Pernambuco) e no
  nicho de higiene e segurança alimentar para restaurantes.
