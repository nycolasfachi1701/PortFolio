(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- tema ---------- */
  const toggle = document.querySelector('.theme-toggle');
  const isLight = () =>
    root.dataset.theme
      ? root.dataset.theme === 'light'
      : window.matchMedia('(prefers-color-scheme: light)').matches;

  toggle.addEventListener('click', () => {
    const next = isLight() ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- nav ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const links = [...document.querySelectorAll('.nav-links a')];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((a) => {
    const s = document.querySelector(a.getAttribute('href'));
    if (s) spy.observe(s);
  });

  /* ---------- relógio de Passo Fundo ---------- */
  const clock = document.querySelector('.clock');
  const tick = () => {
    clock.textContent = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
    }).format(new Date());
  };
  tick();
  setInterval(tick, 30000);

  /* ---------- reveal ---------- */
  const groups = new Map();
  document.querySelectorAll('.reveal').forEach((el) => {
    const parent = el.parentElement;
    const i = groups.get(parent) || 0;
    groups.set(parent, i + 1);
    el.style.setProperty('--d', Math.min(i, 6) * 0.07 + 's');
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ---------- contadores ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = +el.dataset.count;
      countIO.unobserve(el);
      if (reduced) { el.textContent = end; return; }
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / 1400, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));

  /* ---------- medidor da stack (1 ponto = 1 projeto) ---------- */
  const MAX = 10;
  document.querySelectorAll('.meter i').forEach((i) => {
    const n = +i.dataset.n;
    i.setAttribute('aria-label', n + (n === 1 ? ' projeto' : ' projetos'));
    i.setAttribute('role', 'img');
    i.innerHTML = Array.from({ length: MAX }, (_, k) => `<b class="${k < n ? 'on' : ''}"></b>`).join('');
  });

  /* ---------- filtro de projetos ---------- */
  const chips = [...document.querySelectorAll('.chip')];
  const cards = [...document.querySelectorAll('.card')];
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => {
        const on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', on);
      });
      cards.forEach((card) => {
        const show = f === 'all' || card.dataset.tags.split(' ').includes(f);
        card.classList.toggle('is-hidden', !show);
        if (show) card.classList.add('is-in');
      });
    });
  });

  /* ---------- spotlight nos cards ---------- */
  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', e.clientX - r.left + 'px');
      card.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  /* ---------- copiar e-mail ---------- */
  const copy = document.querySelector('.copy');
  const hint = copy.querySelector('.copy-hint');
  copy.addEventListener('click', async () => {
    const email = copy.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      hint.textContent = 'copiado ✓';
    } catch (e) {
      window.location.href = 'mailto:' + email;
      return;
    }
    setTimeout(() => { hint.textContent = 'copiar'; }, 2000);
  });

  document.getElementById('ano').textContent = new Date().getFullYear();

  /* ---------- terminal do hero ---------- */
  const term = document.getElementById('terminal');
  const lines = [
    [['c-prompt', '$ '], ['c-cmd', 'farol status --all']],
    [['c-dim', '  sistema    stack                  estado']],
    [['c-ok', '  ● '], ['c-name', 'reko     '], ['', ' next·prisma·playwright '], ['c-ok', 'no ar']],
    [['c-ok', '  ● '], ['c-name', 'servus   '], ['', ' next·supabase·expo     '], ['c-ok', 'no ar']],
    [['c-warn', '  ● '], ['c-name', 'medtrack '], ['', ' next·postgres·neon     '], ['c-warn', 'privado']],
    [['c-warn', '  ● '], ['c-name', 'farol    '], ['', ' next·redis·jwt         '], ['c-warn', 'interno']],
    [['c-warn', '  ● '], ['c-name', 'nmfinance'], ['', ' node·pg·pwa            '], ['c-warn', 'privado']],
    [['', '']],
    [['c-prompt', '$ '], ['c-cmd', 'whoami']],
    [['', '  dev full-stack · ciência da computação']],
    [['', '  demanda real → spec → código → deploy']],
    [['', '']],
    [['c-prompt', '$ '], ['c-cmd', 'echo $PROXIMO_PROJETO']],
    [['c-ok', '  o seu. bora conversar? ↓']],
  ];

  const render = (segs) =>
    segs.map(([cls, txt]) => {
      const s = document.createElement('span');
      if (cls) s.className = cls;
      s.textContent = txt;
      return s;
    });

  if (reduced) {
    lines.forEach((l) => { term.append(...render(l), '\n'); });
    return;
  }

  let li = 0;
  const typeLine = () => {
    if (li >= lines.length) return;
    const segs = lines[li];
    const isCmd = segs[0][0] === 'c-prompt';
    if (!isCmd) {
      term.append(...render(segs), '\n');
      li++;
      setTimeout(typeLine, 90);
      return;
    }
    term.append(...render([segs[0]]));
    const cmd = document.createElement('span');
    cmd.className = 'c-cmd';
    term.append(cmd);
    const text = segs[1][1];
    let c = 0;
    const typeChar = () => {
      cmd.textContent = text.slice(0, ++c);
      if (c < text.length) setTimeout(typeChar, 40 + Math.random() * 50);
      else { term.append('\n'); li++; setTimeout(typeLine, 380); }
    };
    setTimeout(typeChar, 300);
  };
  setTimeout(typeLine, 700);
})();
