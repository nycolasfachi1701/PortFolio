# Portfólio — Nycolas Musskopf Fachi

Acesse: https://nycolasfachi1701.github.io/PortFolio/

Site estático em **HTML, CSS e JavaScript puros** (sem build, sem framework), pronto para o GitHub Pages.

## Estrutura

| Arquivo      | O que tem                                                                 |
| ------------ | ------------------------------------------------------------------------- |
| `index.html` | Todo o conteúdo: hero, método, projetos, stack, trajetória e contato      |
| `style.css`  | Tokens de cor (tema escuro e claro), layout e responsivo                   |
| `script.js`  | Tema, terminal animado, filtro de projetos, contadores e efeitos de scroll |

## Como editar

- **Novo projeto:** copie um `<article class="card">` em `#projetos`. O atributo `data-tags`
  define os filtros (`produto`, `web`, `mobile`, `backend`, `academico`). Use `card-feature` para destaque.
- **Status (o "farol"):** `dot-green` = produção · `dot-amber` = interno/privado · `dot-gray` = acadêmico.
- **Stack:** em `#stack`, `data-n` é a quantidade de projetos que usam a tecnologia (1 ponto = 1 projeto).
- **Terminal do topo:** array `lines` no fim do `script.js`.
- **Cores:** variáveis em `:root` no início do `style.css` (`--accent` é a cor de destaque).

Para ver localmente, basta abrir o `index.html` no navegador.
