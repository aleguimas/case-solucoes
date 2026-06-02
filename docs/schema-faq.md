# Schema de FAQ (FAQPage)

O Schema de FAQ fica em `index.html`, no `<head>`, no bloco
`<!-- Schema.org: FAQ -->` (JSON-LD `FAQPage`). O FAQ visível fica na seção
`<!-- ===== FAQ ===== -->` (`<dl class="faq__list">`).

---

## Regra nº 1: o schema PRECISA bater com o conteúdo visível

A diretriz do Google é clara: o conteúdo do `FAQPage` (perguntas **e** respostas)
deve ser **idêntico** ao que está visível na página. Se não bater:

- o Google ignora o markup, **ou**
- pode aplicar penalidade por structured data enganoso.

Por isso, **toda vez** que adicionar, remover ou editar uma pergunta no FAQ
visível, atualize o JSON-LD na mesma proporção — mesmas perguntas, mesma ordem,
mesmo texto.

> Diferenças de `<strong>`/HTML no texto visível podem ser removidas no JSON
> (texto puro), desde que as **palavras** sejam as mesmas.

## Expectativa realista de resultado

⚠️ Desde **agosto de 2023**, o Google **restringiu os rich results de FAQ**
(perguntas expansíveis no resultado da busca) apenas para sites de **governo e
saúde** reconhecidos. Para sites comerciais — como o da Casé — as perguntas
**praticamente não aparecem mais** na busca, mesmo com o markup 100% correto.

O que o markup de FAQ ainda traz de valor:
- ajuda o Google a **entender o conteúdo** da página (SEO semântico);
- fica pronto caso o Google reative o recurso;
- aproveitado por busca por voz / assistentes.

Para destaque **visual** que de fato funciona hoje, priorizar:
- **Google Business Profile** (perfil da empresa) — busca local.
- **Schema de avaliações/estrelas** (`AggregateRating`) — gera estrelinhas.
- **Schema VideoObject** — ver [adicionar-videos-youtube.md](./adicionar-videos-youtube.md).

## Como adicionar/editar uma pergunta

1. Edite o item **visível** em `<dl class="faq__list">`:

   ```html
   <div class="faq__item">
     <dt>PERGUNTA?</dt>
     <dd>RESPOSTA.</dd>
   </div>
   ```

2. Adicione/edite a entrada correspondente no JSON-LD `FAQPage`, com o **mesmo
   texto** (mesma ordem):

   ```json
   {
     "@type": "Question",
     "name": "PERGUNTA?",
     "acceptedAnswer": {
       "@type": "Answer",
       "text": "RESPOSTA."
     }
   }
   ```

3. Dica: priorize perguntas que aparecem nas consultas reais do **Search
   Console** (ex.: "RDC 216", "material de limpeza recife") — bom para SEO.

## Validar

```bash
# Conferir que as perguntas do schema batem 1:1 com as visíveis
python3 -c "
import re, json
html = open('index.html').read()
schema = [q['name'] for b in re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.S)
          for d in [json.loads(b)] if d.get('@type')=='FAQPage' for q in d['mainEntity']]
visiveis = re.findall(r'<dt>([^<]+)</dt>', html)
print('Schema  :', len(schema))
print('Visíveis:', len(visiveis))
print('IGUAL' if schema == visiveis else 'DIVERGENTE -> corrigir!')
"
```

Depois de publicar, valide em
[Rich Results Test](https://search.google.com/test/rich-results) e
[Schema Validator](https://validator.schema.org).

---

## Histórico

- O schema já existia, mas estava **desalinhado** com o FAQ visível (tinha uma
  pergunta "RDC 216" que não aparecia e faltava a de "pagamento"). Foi
  sincronizado para 8 perguntas idênticas, e a pergunta da RDC 216 passou a ser
  também um item visível.
