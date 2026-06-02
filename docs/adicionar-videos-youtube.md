# Adicionar vídeos do YouTube

> **Regra de ouro:** sempre que for colocar um vídeo na página, **puxe todas as
> informações reais do vídeo no YouTube** (título, descrição, thumbnail, data de
> publicação e duração). Nunca use dados genéricos ou inventados — o Schema
> VideoObject precisa refletir o vídeo real.

A seção de vídeos fica em `index.html`, no bloco `<!-- ===== VÍDEOS / YOUTUBE ===== -->`.
O Schema dos vídeos fica no `<head>`, no bloco `<!-- Schema.org: Vídeos (VideoObject) -->`.

---

## Passo 1 — Pegar o ID do vídeo

A partir do link, extraia o ID:

| Formato do link | ID |
|---|---|
| `https://youtube.com/shorts/oby16nbcaQY` | `oby16nbcaQY` |
| `https://www.youtube.com/watch?v=oby16nbcaQY` | `oby16nbcaQY` |
| `https://youtu.be/oby16nbcaQY` | `oby16nbcaQY` |

## Passo 2 — Puxar as informações reais do vídeo

### a) Título e thumbnail (endpoint oEmbed, não precisa de chave)

```bash
curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json"
```

Retorna `title`, `author_name` e `thumbnail_url`.

### b) Data de publicação, duração e descrição (HTML bruto)

O oEmbed **não** traz data/duração/descrição. Pegue do HTML da página:

```bash
# Data de publicação e duração
curl -s "https://www.youtube.com/watch?v=VIDEO_ID" -H "Accept-Language: pt-BR" \
  | grep -oE '"uploadDate":"[^"]*"|"lengthSeconds":"[^"]*"'

# Descrição completa
curl -s "https://www.youtube.com/watch?v=VIDEO_ID" -H "Accept-Language: pt-BR" \
  | grep -oE '"shortDescription":"([^"\\]|\\.)*"' | head -1
```

> Obs.: o WebFetch padrão **não** funciona aqui porque o YouTube renderiza por
> JavaScript e o conteúdo se perde na conversão para markdown. Use `curl` no HTML
> bruto (como acima) para os campos de data/duração/descrição.

### c) Converter a duração para ISO 8601

`lengthSeconds` vem em segundos. Converta para o formato `PT#M#S`:

| Segundos | ISO 8601 |
|---|---|
| 31 | `PT31S` |
| 49 | `PT49S` |
| 133 | `PT2M13S` |

## Passo 3 — Adicionar o `<iframe>` na seção de vídeos

Dentro de `.videos__grid`, adicione um novo `.video-card`. Padrão:

```html
<div class="video-card">
  <iframe
    src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
    title="TÍTULO DESCRITIVO DO VÍDEO | Casé Soluções"
    width="560"
    height="315"
    loading="lazy"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>
```

Regras do iframe:
- **`title` único e descritivo** por vídeo (acessibilidade + SEO). Nunca repetir
  um título genérico tipo "Vídeo da Casé Soluções".
- **`width="560" height="315"`** — proporção padrão YouTube, ajuda o navegador a
  reservar espaço e reduz o CLS (Core Web Vitals). O CSS faz o layout real
  (cards 9:16 responsivos via `.video-card { aspect-ratio: 9 / 16 }`).
- `youtube-nocookie.com` — modo de privacidade aprimorada.
- `loading="lazy"` — não pesa no carregamento inicial.

> A grade é responsiva: 4 colunas no desktop, 2 em tablet/mobile
> (`.videos__grid` em `styles.css`). Mais de 4 vídeos quebram a linha
> automaticamente.

## Passo 4 — Adicionar o Schema VideoObject no `<head>`

No bloco `<!-- Schema.org: Vídeos (VideoObject) -->`, adicione mais um objeto ao
array `@graph` (com os dados **reais** puxados no Passo 2):

```json
{
  "@type": "VideoObject",
  "name": "TÍTULO DO VÍDEO",
  "description": "DESCRIÇÃO REAL (resumida) DO VÍDEO.",
  "thumbnailUrl": "https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg",
  "uploadDate": "2026-05-25T11:00:33-07:00",
  "duration": "PT2M13S",
  "contentUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "embedUrl": "https://www.youtube.com/embed/VIDEO_ID",
  "publisher": {
    "@type": "Organization",
    "name": "Casé Soluções em Limpeza",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.casesolucoesemlimpeza.com.br/logo.png"
    }
  }
}
```

Campos obrigatórios para o rich result do Google: `name`, `description`,
`thumbnailUrl`, `uploadDate`. Os demais reforçam o resultado.

- **`thumbnailUrl`:** use `hqdefault.jpg` (sempre existe). `maxresdefault.jpg` tem
  resolução maior, mas pode dar 404 em alguns Shorts.
- **`uploadDate`:** mantenha o ISO completo com fuso (ex.: `...T11:00:33-07:00`).

## Passo 5 — Validar

```bash
# Conferir que todos os blocos JSON-LD são válidos
python3 -c "
import re, json
html = open('index.html').read()
for i,b in enumerate(re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.S),1):
    json.loads(b); print(f'Bloco {i}: OK')
"
```

Depois de publicar, teste no
[Rich Results Test](https://search.google.com/test/rich-results) — o VideoObject
**gera rich results ativos** (thumbnail, duração e data na busca e na aba Vídeos).

---

## Checklist rápido por vídeo

- [ ] ID extraído do link
- [ ] Título, thumbnail (oEmbed)
- [ ] uploadDate, duração, descrição (HTML bruto via curl)
- [ ] Duração convertida para ISO 8601 (`PT#M#S`)
- [ ] `<iframe>` adicionado com `title` único + `width/height`
- [ ] VideoObject adicionado ao `@graph` com dados reais
- [ ] JSON-LD validado
