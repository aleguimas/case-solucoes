# Casé Soluções — site

Site institucional da **Casé Soluções em Limpeza** (higiene e segurança alimentar
para restaurantes em Recife/PE).

## Stack e deploy

- **Site estático**: HTML + CSS puro, sem build, sem framework.
- Arquivos principais: `index.html` e `styles.css` na raiz.
- Hospedagem **Netlify** (publish directory = raiz do repo).
- **Deploy = commit/push na branch `main`** (a Netlify builda no push). Push direto na
  `main` pode ser bloqueado pelo classificador do harness — confirmar com o usuário.
- Conteúdo em **pt-BR**, foco em SEO local (Recife/Pernambuco) e no nicho de higiene
  alimentar para restaurantes.

## Estrutura

- `/` → site institucional (`index.html`, `styles.css`).
- `docs/` → base de conhecimento (vídeos do YouTube, schema de FAQ). Consultar antes de
  alterar para manter o padrão.

## Funil de lançamento (removido deste site)

- O funil "Limpeza Sem Mistério" (isca/CPL/vendas/obrigado) foi **removido deste projeto**
  em jul/2026 para ser publicado em **outro domínio**.
- Versão estática pronta preservada em
  `../lancamento-limpeza-sem-misterio/` (fora deste repo).
- Fonte PHP original untracked em `lp_limpezasemmisterios/` (tem `admin/` e credenciais —
  **nunca** deve ir para deploy).
- Como manter/portar esse funil: skill **`funil-lancamento-netlify`** (`.claude/skills/`).

## Observações

- Se o funil voltar para este site, referenciar páginas com `.html` explícito (o site não
  dropa `.html` automaticamente) e usar rewrites `netlify.toml` escopados.
