# Casé Soluções — site

Site institucional + funil de lançamento da **Casé Soluções em Limpeza**
(higiene e segurança alimentar para restaurantes em Recife/PE).

## Stack e deploy

- **Site estático**: HTML + CSS puro, sem build, sem framework.
- Arquivos principais do site: `index.html` e `styles.css` na raiz.
- Hospedagem **Netlify** (publish directory = raiz do repo).
- **Deploy = commit/push na branch `main`** (a Netlify builda no push). Push direto na
  `main` pode ser bloqueado pelo classificador do harness — confirmar com o usuário.
- Conteúdo em **pt-BR**, foco em SEO local (Recife/Pernambuco) e no nicho de higiene
  alimentar para restaurantes.

## Estrutura

- `/` → site institucional (`index.html`, `styles.css`).
- `/lancamento/` → funil de lançamento estático (LP "Limpeza Sem Mistério"):
  - `index.html` = página de vendas (`/lancamento`)
  - `isca.html`, `cpl.html`, `obrigado-isca.html`, `obrigado-cpl.html`, `obrigado-lancamento.html`
  - assets em `lancamento/{css,js,imagens}` (caminhos relativos)
- `netlify.toml` → rewrites 200 escopados a `/lancamento/*` (o site não dropa `.html`
  automaticamente; referenciar páginas com `.html` explícito).
- `docs/` → base de conhecimento (vídeos do YouTube, schema de FAQ). Consultar antes de
  alterar para manter o padrão.

## Conhecimento e skills

- Skill **`funil-lancamento-netlify`** (`.claude/skills/`): como portar/manter o funil
  estático na Netlify — conversão PHP→estático, Netlify Forms, rotas `.html`, deploy.
  Usar ao mexer em `/lancamento`.

## Pendências em aberto (atualizar conforme resolver)

- [ ] **Ativar detecção de formulários na Netlify** (Project configuration → Forms → Enable)
      e fazer um **Trigger deploy** — sem isso os leads dos Netlify Forms não são capturados.
- [ ] Configurar **Email notification** dos forms (Forms → Settings).
- [ ] Substituir links placeholder `href="#"` pelos reais: **grupo do WhatsApp**,
      política de privacidade, termos, contato.
- [ ] Funil usa **Netlify Forms** (plano grátis = 100 leads/mês). Acima disso, migrar para
      Function + banco externo (Supabase/Neon).

## Observações

- A fonte original do funil em PHP (`lp_limpezasemmisterios/`) **não deve ir para o deploy**
  (tem `admin/` e credenciais de banco). Manter untracked / fora da Netlify.
