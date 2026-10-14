/* Navegação do celular: barra fixa embaixo com 5 destinos; "Temas" e "Mais" abrem uma gaveta. */
(function () {
  "use strict";
  var W = window, D = document, mq = W.matchMedia ? W.matchMedia("(max-width: 820px)") : null;
  var TEMAS = [["economia", "Economia e pobreza", "Renda, emprego, inflação, dívida"], ["servicos", "Serviços e ambiente", "Saúde, escola, segurança, Amazônia"], ["sociedade", "Direitos e minorias", "O que cada governo fez"], ["pt-x-pl", "Placar PT × PL", "Corrupção, feitos e promessas"], ["falas", "Falas e gastos", "O que disseram e o que gastaram"], ["poderes", "Três Poderes", "Quem manda em quê"], ["eleicao", "Eleição 2026", "2º turno, 25 de outubro"], ["regua-politica", "Régua política", "De 0 a 100, autor por autor"]];
  var MAIS = [["a-formula", "A fórmula completa", "Todas as variáveis e os pesos em uso"], ["metodo", "Como calculamos", "A conta completa"], ["dados", "Dados abertos", "CSV e JSON"], ["fontes", "Fontes", "De onde vem cada número"], ["sobre", "Sobre e correções", "Quem faz e como corrigir"], ["novidades", "Novidades", "O que mudou"]];
  var barra, gaveta, fundo, titulo, lista, ultimoFoco = null;

  function el(t, c, x) { var e = D.createElement(t); if (c) { e.className = c; } if (x != null) { e.textContent = x; } return e; }
  function ic(d) { return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + d + "</svg>"; }
  var ICON = {
    inicio: ic('<path d="M4 11l8-7 8 7v9H4z"/>'),
    temas: ic('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
    regua: ic('<path d="M4 8h16M4 16h16"/><circle cx="9" cy="8" r="2.3" fill="currentColor"/><circle cx="15" cy="16" r="2.3" fill="currentColor"/>'),
    quiz: ic('<circle cx="12" cy="12" r="8"/><path d="M9.7 9.6a2.4 2.4 0 1 1 3.4 2.2c-.7.4-1.1.8-1.1 1.6M12 16.6v.1"/>'),
    mais: ic('<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/>')
  };

  function atual() { var h = (W.location.hash || "#inicio").replace("#", ""); return (W.BEA && W.BEA.paginaAtual && W.BEA.paginaAtual()) || h.split("?")[0] || "inicio"; }

  function marcar() {
    if (!barra) { return; }
    var p = atual(), btns = barra.querySelectorAll("[data-d]"), i, d, on;
    var gT = TEMAS.some(function (t) { return t[0] === p; }), gM = MAIS.some(function (t) { return t[0] === p; });
    for (i = 0; i < btns.length; i++) {
      d = btns[i].getAttribute("data-d");
      on = d === p || (d === "temas" && gT) || (d === "mais" && gM);
      if (on) { btns[i].setAttribute("aria-current", "page"); } else { btns[i].removeAttribute("aria-current"); }
    }
  }

  function abrir(qual, gatilho) {
    var l = qual === "temas" ? TEMAS : MAIS;
    ultimoFoco = gatilho;
    titulo.textContent = qual === "temas" ? "Explorar por tema" : "Sobre o site e os dados";
    lista.textContent = "";
    l.forEach(function (x) {
      var a = el("a", "nm-it"); a.href = "#" + x[0];
      a.appendChild(el("b", null, x[1])); a.appendChild(el("small", null, x[2]));
      a.addEventListener("click", fechar);
      lista.appendChild(a);
    });
    fundo.hidden = false; gaveta.hidden = false;
    D.documentElement.classList.add("nm-trava");
    var a1 = lista.querySelector("a"); if (a1) { a1.focus(); }
  }
  function fechar() {
    if (gaveta.hidden) { return; }
    fundo.hidden = true; gaveta.hidden = true;
    D.documentElement.classList.remove("nm-trava");
    if (ultimoFoco && ultimoFoco.focus) { try { ultimoFoco.focus(); } catch (e) { } }
  }

  function montar() {
    barra = el("nav", "nm-bar"); barra.setAttribute("aria-label", "Navegação principal");
    function item(d, rot, href, aoClicar) {
      var a = el(href ? "a" : "button", "nm-btn"); a.setAttribute("data-d", d);
      if (href) { a.href = href; } else { a.type = "button"; }
      a.innerHTML = ICON[d.split("-")[0]] || ICON.temas; a.appendChild(el("span", null, rot));
      if (aoClicar) { a.addEventListener("click", function () { aoClicar(a); }); }
      barra.appendChild(a);
    }
    item("inicio", "Início", "#inicio");
    item("temas", "Temas", null, function (a) { abrir("temas", a); });
    item("regua", "Régua", "#regua");
    item("quiz", "Quiz", "#quiz");
    item("mais", "Mais", null, function (a) { abrir("mais", a); });
    fundo = el("div", "nm-fundo"); fundo.hidden = true; fundo.addEventListener("click", fechar);
    gaveta = el("div", "nm-gav"); gaveta.hidden = true; gaveta.setAttribute("role", "dialog"); gaveta.setAttribute("aria-modal", "true"); gaveta.setAttribute("aria-labelledby", "nm-t");
    var top = el("div", "nm-top"); titulo = el("h2", null); titulo.id = "nm-t";
    var x = el("button", "nm-x", "Fechar"); x.type = "button"; x.addEventListener("click", fechar);
    top.appendChild(titulo); top.appendChild(x);
    lista = el("div", "nm-lista");
    gaveta.appendChild(top); gaveta.appendChild(lista);
    D.body.appendChild(fundo); D.body.appendChild(gaveta); D.body.appendChild(barra);
    D.addEventListener("keydown", function (e) { if (e.key === "Escape") { fechar(); } });
    W.addEventListener("hashchange", function () { fechar(); marcar(); });
    if (W.BEA && W.BEA.on) { W.BEA.on("page", marcar); }
    D.body.classList.add("nm-on");
    marcar();
  }
  /* computador: páginas secundárias saem da linha do menu e vão para "Mais" */
  var SEC = ["poderes", "eleicao", "metodo", "fontes"];
  var EXTRA = [["a-formula", "A fórmula completa", "Todas as variáveis e os pesos"], ["quiz", "Quiz", "Qual é a sua régua?"], ["dados", "Dados abertos", "CSV e JSON"], ["sobre", "Sobre e correções", "Quem faz e como corrigir"], ["novidades", "Novidades", "O que mudou"]];
  var DESC = { poderes: "Quem manda em quê", eleicao: "2º turno, 25 de outubro", metodo: "A conta completa", fontes: "De onde vem cada número" };
  var snBtn = null, snPop = null, snNav = null, snBox = null;
  var AUTO = ["regua", "regua-politica", "falas", "sociedade", "servicos", "economia", "pt-x-pl"];
  function montarDesktop() {
    var nav = D.querySelector(".sitenav"); if (!nav) { return; }
    var box = el("div", "sn-mais");
    snBtn = el("button", null, "Mais"); snBtn.type = "button";
    snBtn.setAttribute("aria-expanded", "false"); snBtn.setAttribute("aria-controls", "sn-pop");
    snPop = el("div", "sn-pop"); snPop.id = "sn-pop"; snPop.hidden = true;
    SEC.forEach(function (k) {
      var a = nav.querySelector('a[data-page="' + k + '"]'); if (!a) { return; }
      a.classList.add("sn-sec");
      var b = el("a"); b.href = "#" + k; b.setAttribute("data-p", k);
      b.appendChild(el("b", null, a.textContent)); b.appendChild(el("small", null, DESC[k] || ""));
      snPop.appendChild(b);
    });
    EXTRA.forEach(function (x) { var b = el("a"); b.href = "#" + x[0]; b.setAttribute("data-p", x[0]); b.appendChild(el("b", null, x[1])); b.appendChild(el("small", null, x[2])); snPop.appendChild(b); });
    box.appendChild(snBtn); box.appendChild(snPop); nav.appendChild(box); nav.classList.add("sn-on");
    snNav = nav; snBox = box;
    var t = null; W.addEventListener("resize", function () { if (t) { W.clearTimeout(t); } t = W.setTimeout(caber, 120); });
    caber(); W.setTimeout(caber, 600);
    function fecharPop(foco) { if (snPop.hidden) { return; } snPop.hidden = true; snBtn.setAttribute("aria-expanded", "false"); if (foco) { snBtn.focus(); } }
    snBtn.addEventListener("click", function (e) { e.stopPropagation(); var ab = snPop.hidden; snPop.hidden = !ab; snBtn.setAttribute("aria-expanded", ab ? "true" : "false"); if (ab) { var f = snPop.querySelector("a"); if (f) { f.focus(); } } });
    snPop.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("a")) { fecharPop(false); } });
    D.addEventListener("click", function (e) { if (!box.contains(e.target)) { fecharPop(false); } });
    D.addEventListener("keydown", function (e) { if (e.key === "Escape") { fecharPop(true); } });
    marcarDesktop();
  }
  /* se a linha do menu não cabe, os itens da direita passam para o "Mais" */
  function caber() {
    if (!snNav) { return; }
    var i, a, ocult = [];
    var auto = snNav.querySelectorAll("a.sn-auto"); for (i = 0; i < auto.length; i++) { auto[i].classList.remove("sn-auto"); }
    var velhos = snPop.querySelectorAll("a[data-auto]"); for (i = 0; i < velhos.length; i++) { velhos[i].parentNode.removeChild(velhos[i]); }
    if (W.innerWidth <= 820) { return; }
    var sobra = function () { return snBox.getBoundingClientRect().right - snNav.getBoundingClientRect().right; };
    for (i = 0; i < AUTO.length && sobra() > 1; i++) {
      a = snNav.querySelector('a[data-page="' + AUTO[i] + '"]'); if (!a) { continue; }
      a.classList.add("sn-auto"); ocult.push(a);
    }
    ocult.forEach(function (o) {
      var b = el("a"); b.href = o.getAttribute("href"); b.setAttribute("data-p", o.getAttribute("data-page")); b.setAttribute("data-auto", "1");
      b.appendChild(el("b", null, o.textContent)); snPop.insertBefore(b, snPop.firstChild);
    });
    marcarDesktop();
  }
  function marcarDesktop() {
    if (!snBtn) { return; }
    var p = atual(), dentro = SEC.indexOf(p) >= 0 || EXTRA.some(function (x) { return x[0] === p; }) || !!snPop.querySelector('a[data-auto][data-p="' + p + '"]');
    snBtn.classList.toggle("atual", dentro);
    var as = snPop.querySelectorAll("a"), i;
    for (i = 0; i < as.length; i++) { if (as[i].getAttribute("data-p") === p) { as[i].setAttribute("aria-current", "page"); } else { as[i].removeAttribute("aria-current"); } }
  }
  function iniciar() { montar(); montarDesktop(); W.addEventListener("hashchange", marcarDesktop); if (W.BEA && W.BEA.on) { W.BEA.on("page", marcarDesktop); } }
  if (D.readyState === "loading") { D.addEventListener("DOMContentLoaded", iniciar); } else { iniciar(); }
})();
