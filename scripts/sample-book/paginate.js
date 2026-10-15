
(async () => {
  await document.fonts.ready;
  // 1. paginate overflowing pages: move blocks from [data-flow] to continuation pages
  let guard = 0;
  for (let pg of [...document.querySelectorAll(".page")]) {
    while (pg.scrollHeight > pg.clientHeight + 1 && guard++ < 200) {
      const flow = pg.querySelector("[data-flow]");
      if (!flow || flow.children.length < 2) { pg.dataset.overflow = "1"; break; }
      let next = pg.nextElementSibling;
      if (!next || !next.classList.contains("cont") || next.dataset.of !== (pg.dataset.of || pg.dataset.id || "x")) {
        next = document.createElement("section");
        next.className = pg.className.replace(/\bleft\b/, "") + " cont";
        next.dataset.of = pg.dataset.of || pg.dataset.id || "x";
        next.innerHTML = `<${flow.tagName.toLowerCase()} class="${flow.className}" data-flow></${flow.tagName.toLowerCase()}>`;
        pg.after(next);
      }
      // 1) drop purely decorative endings first
      const deco = pg.querySelector(":scope > .endvig, :scope > .orn");
      if (deco) { deco.remove(); next.remove(); continue; }
      // 2) move trailing blocks (quote, letter, note) together with the last paragraph, so no page holds only a quote
      const tail = [...pg.children].filter((c) => c !== flow && flow.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING && !c.classList.contains("pnum"));
      if (tail.length) { next.append(...tail); next.querySelector("[data-flow]").prepend(flow.lastElementChild); continue; }
      next.querySelector("[data-flow]").prepend(flow.lastElementChild);
    }
  }
  // keep an even page count: add a lined notes page before the colophon
  if (document.querySelectorAll(".page").length % 2) {
    const colo = document.querySelector('[data-id="colo"]');
    colo.insertAdjacentHTML("beforebegin", `<section class="page notes"><h2>${document.body.dataset.notesTitle}</h2><p class="lead">${document.body.dataset.notesLead}</p>${'<div class="ln"></div>'.repeat(17)}</section>`);
  }
  // 2. number pages, set left/right
  const pages = [...document.querySelectorAll(".page")];
  const num = {};
  pages.forEach((p, i) => {
    const n = i + 1; p.classList.toggle("left", n % 2 === 0);
    if (p.dataset.id && !num[p.dataset.id]) num[p.dataset.id] = n;
    if (!p.classList.contains("full") && n > 4) p.insertAdjacentHTML("beforeend", `<div class="pnum">${n}</div>`);
  });
  document.querySelectorAll("[data-ref]").forEach((b) => b.textContent = num[b.dataset.ref] ?? "");
  window.__report = { pages: pages.length, overflow: pages.filter((p) => p.scrollHeight > p.clientHeight + 1).map((p, i) => (p.dataset.id || p.dataset.of || "") + "@" + (pages.indexOf(p) + 1)) };
  window.__done = true;
})();
