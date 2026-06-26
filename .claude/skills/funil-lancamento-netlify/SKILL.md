---
name: funil-lancamento-netlify
description: Como portar/manter um funil de landing pages (isca, CPL, vendas, obrigado) no site da Casé Soluções, que é estático e hospedado na Netlify (deploy via commit na main). Use ao trazer uma LP em PHP para dentro do projeto, converter para estático, configurar captura de leads com Netlify Forms, ajustar rotas .html e publicar. Também serve de referência ao editar as páginas em /lancamento.
---

# Funil de lançamento na Netlify (Casé Soluções)

Conhecimento consolidado do projeto para portar e manter funis de landing page.

## Contexto fixo do projeto

- O site (`casesolucoesemlimpeza.com.br`) é **100% estático** (HTML + CSS puro, sem build/framework).
- Hospedagem: **Netlify**, com **publish directory = raiz do repositório**.
- **Deploy = commit/push na branch `main`** (não há PR obrigatório; a Netlify builda no push).
- O funil de lançamento vive em **`/lancamento/`** na raiz do repo. Estrutura atual:
  - `lancamento/index.html` → página de **vendas** (URL `/lancamento`)
  - `lancamento/isca.html` → isca / e-book (`/lancamento/isca`)
  - `lancamento/cpl.html` → aula gratuita / CPL (`/lancamento/cpl`)
  - `lancamento/obrigado-isca.html`, `obrigado-cpl.html`, `obrigado-lancamento.html`
  - `lancamento/css/`, `lancamento/js/`, `lancamento/imagens/` (assets relativos)

## Regra de ouro: PHP e MySQL NÃO rodam na Netlify (nem na Vercel)

Netlify e Vercel são **estático + funções serverless (JS)**. Nenhum dos dois roda PHP
nativamente nem hospeda MySQL. Quem rodaria PHP+MySQL "como está" é hospedagem
tradicional/cPanel (Hostinger etc.) ou VPS — o que sairia do fluxo atual. Portanto:
**sempre converter o funil para estático** e tratar leads com Netlify Forms (ou
Function + banco externo se precisar de volume/painel próprio).

## Passo a passo para portar uma LP em PHP → estático Netlify

1. **Analisar quanto há de PHP real.** Muitas páginas `.php` são HTML puro (a lógica de
   countdown/FAQ/obrigado dinâmico costuma ser JS no cliente). Cheque com:
   `grep -c "<?php" pagina.php`. O PHP "de verdade" geralmente é só a gravação de leads
   e o painel admin.
2. **Criar `lancamento/`** e copiar `css/`, `js/`, `imagens/` para dentro. Copiar as
   páginas como `.html`. Definir o `index.html` conforme a rota raiz desejada
   (no nosso caso `/lancamento` = página de vendas).
3. **Remover todo PHP**: blocos `<?php ... ?>` (gravação no banco, `require conexao.php`).
   Conferir que não sobrou nada: `grep -rl "<?php" lancamento/`.
4. **Converter os formulários para Netlify Forms** (ver seção abaixo).
5. **Corrigir links internos** para apontar para arquivos `.html` reais e existentes.
   Validar que nenhum link aponta para arquivo inexistente.
6. **NÃO publicar a fonte PHP.** A pasta-fonte original (ex.: `lp_limpezasemmisterios/`)
   contém `admin/` e credenciais de banco — deve ficar **fora do deploy** (untracked ou no
   `.gitignore`). Nunca commitar a fonte PHP no repo que a Netlify publica.

## Netlify Forms (captura de leads sem backend)

- Cada formulário precisa de: `name="..."`, `method="POST"`, `data-netlify="true"`,
  honeypot `netlify-honeypot="bot-field"` + os inputs com **atributo `name`**
  (o Netlify registra os campos pelos `name` do HTML estático, não pelos `id`).
- Inclua sempre os campos ocultos:
  ```html
  <form name="lead-x" method="POST" data-netlify="true" netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="lead-x">
    <p hidden><label>Não preencha: <input name="bot-field"></label></p>
    <input type="hidden" name="origem" value="x">
    <!-- inputs com name="nome" name="email" name="whatsapp" etc -->
  </form>
  ```
- **Form nativo** (sem JS): use `action="/lancamento/obrigado-x.html"`. O Netlify captura
  o POST e redireciona para o `action`.
- **Form via AJAX** (modal): poste **urlencoded** para um caminho real do site, incluindo
  `form-name`:
  ```js
  fetch('/lancamento/cpl.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ 'form-name': 'lead-cpl', nome, email, whatsapp, origem }).toString()
  })
  ```
- Forms atuais: `lead-isca`, `lead-cpl`, `lead-lancamento`. O `lead-lancamento` salva e
  depois redireciona para o checkout **Kiwify** (preservar esse redirect).

### IMPORTANTE: ativar a detecção no painel (passo manual do usuário)
A Netlify hoje **não detecta formulários até a detecção ser ativada** + um novo deploy:
1. Painel → **Project configuration → Forms (ou Build & deploy → Form detection) → Enable**.
2. **Deploys → Trigger deploy → Deploy site** (a detecção só ocorre em deploys feitos
   *depois* de ativada).
3. Os forms aparecem em **Forms**; configurar **Email notification** em Settings.
- Limite do plano grátis: **100 submissões/mês**. Acima disso, migrar para Function +
  banco externo (Supabase/Neon).

## Rotas / URLs (.html)

Este site **não dropa o `.html` automaticamente** (pretty URLs desligado): acessar
`/lancamento/obrigado-isca` sem extensão dava **404**. Por isso:
- Sempre referenciar páginas internas com `.html` explícito.
- Existe um `netlify.toml` na raiz com **rewrites (status 200) escopados a `/lancamento/*`**
  para aceitar também as URLs sem extensão. Ao criar uma nova página no funil, adicionar
  o rewrite correspondente nesse arquivo. Não mexer em rotas fora de `/lancamento/` para
  não afetar o site principal.

## Publicar

```bash
git add lancamento/ netlify.toml
git commit -m "..."   # rodapé: Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
git push origin main  # dispara o deploy na Netlify
```
Push direto na `main` pode ser bloqueado pelo classificador do harness — confirmar com o
usuário antes. Depois do deploy, validar as URLs ao vivo (com e sem `.html`).

## Pontos de atenção recorrentes

- Páginas de **obrigado** devem ser coerentes com o que o lead já fez (ex.: não pedir para
  baixar de novo um material já entregue). Foco em um próximo passo único e claro.
- Links placeholder `href="#"` (baixar material, grupo de WhatsApp, política/termos):
  confirmar e preencher os links reais antes de divulgar.
- Assets são **relativos** (`css/...`, `imagens/...`); manter todas as páginas do funil no
  mesmo nível de `lancamento/` para os caminhos resolverem.
