/* Módulo guia: "Guia de 60 segundos" (prefixo gu-).
   Diálogo modal "Comece aqui" com 4 passos curtos e ilustrados com SVG feito aqui (sem imagens externas).
   Usa só a API window.BEA. Sem rede, sem rastreamento, sem cookies.
   Preferências em localStorage (chaves bea_guia_*), sempre dentro de try/catch.
   Sintaxe segura para iOS 13+: sem "?.", sem "??", sem lookbehind. */
(function () {
  "use strict";

  var B = window.BEA;
  if (!B || typeof B.pilares !== "function" || B.abrirGuia) { return; }

  var D = document, W = window;

  /* ---------- ajustes ---------- */
  var TOTAL = 4;          // número de passos
  var MAX_AUTO = 2;       // quantas vezes o guia abre sozinho, no máximo (1ª visita e, se foi fechado sem terminar, mais uma)
  var ATRASO = 1400;      // atraso (ms) antes de abrir sozinho
  var K_OFF = "bea_guia_off";   // "1" = a pessoa pediu para não abrir sozinho de novo
  var K_N = "bea_guia_n";       // quantas vezes já abriu sozinho
  var K_S = "bea_guia_s";       // (sessionStorage) já abriu sozinho nesta sessão

  var SHORT = { eco: "Economia", pov: "Pobreza", soc: "Direitos", ser: "Serviços", amb: "Ambiente", fut: "Contas futuras", prl: "Promessas", int: "Integridade" };

  /* ---------- estado ---------- */
  var overlay = null, painel = null, corpo = null, boxPasso = null, listaProg = null, segs = [];
  var btnX = null, btnPular = null, btnVolta = null, btnProx = null, chk = null, live = null;
  var aberto = false, auto = false, passo = 0, retorno = null, escondidos = [];
  var memOff = false, memAuto = false, travado = false, padAnt = "";
  var heroBtn = null, footLink = null;
  var tx = 0, ty = 0, tOk = false, trocaT = 0;

  /* ---------- armazenamento (nunca quebra se estiver bloqueado) ---------- */
  function lerLS(k) { try { return W.localStorage.getItem(k); } catch (e) { return null; } }
  function gravarLS(k, v) { try { W.localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function tirarLS(k) { try { W.localStorage.removeItem(k); } catch (e) { } }
  function lerSS(k) { try { return W.sessionStorage.getItem(k); } catch (e) { return null; } }
  function gravarSS(k, v) { try { W.sessionStorage.setItem(k, v); } catch (e) { } }

  function desligado() { return memOff || lerLS(K_OFF) === "1"; }
  function desligar(v) {
    memOff = !!v;
    if (v) { gravarLS(K_OFF, "1"); } else { tirarLS(K_OFF); }
  }
  function contagem() { var n = parseInt(lerLS(K_N), 10); return isNaN(n) ? 0 : n; }

  /* ---------- utilidades ---------- */
  function el(tag, cls, txt) {
    var e = D.createElement(tag);
    if (cls) { e.className = cls; }
    if (txt != null) { e.textContent = txt; }
    return e;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function visivel(e) {
    return !!(e && (e.offsetWidth || e.offsetHeight || (e.getClientRects && e.getClientRects().length)));
  }
  function num(v, d) { return (typeof v === "number" && isFinite(v)) ? v : d; }
  function T(x, y, s, c, anc) {
    return '<text x="' + x + '" y="' + y + '" class="' + c + '"' + (anc ? ' text-anchor="' + anc + '"' : "") + ">" + s + "</text>";
  }

  /* ---------- dados da API: pesos atuais dos pilares ---------- */
  function lerPesos() {
    var est = null, pil = [], lista = [], i, p, w, igual = true, pad, partes = [];
    try { est = B.estado(); } catch (e) { est = null; }
    try { pil = B.pilares() || []; } catch (e2) { pil = []; }
    var pw = (est && est.pilW) ? est.pilW : {};
    pad = (est && est.pilW_padrao) ? est.pilW_padrao : {};
    for (i = 0; i < pil.length; i++) {
      p = pil[i];
      w = num(pw[p.k], 0);
      if (w !== num(pad[p.k], w)) { igual = false; }
      lista.push({ k: p.k, t: p.t, w: w });
      partes.push(p.t + " " + w);
    }
    return {
      lista: lista,
      igual: igual,
      alt: "Escala de 0 a 10 e os " + lista.length + " pilares com os pesos de cada um. " + partes.join("; ") + "."
    };
  }

  /* ---------- ilustrações (SVG inline, só com as cores do site) ---------- */
  function figNota() {
    var d = lerPesos(), L = d.lista, i, b, w, larg, s = "";
    s += '<svg class="gu-svg" viewBox="0 0 288 172" role="img" aria-label="' + esc(d.alt) + '" focusable="false">';
    s += '<defs><linearGradient id="gu-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="gu-s0"/><stop offset="1" class="gu-s1"/></linearGradient></defs>';
    s += T(0, 15, "0", "gu-n", "start") + T(288, 15, "10", "gu-n", "end");
    s += '<rect x="22" y="5" width="244" height="13" rx="6.5" fill="url(#gu-grad)" class="gu-trk"/>';
    s += T(144, 36, "Nota geral, de 0 a 10", "gu-m", "middle");
    for (i = 0; i < L.length; i++) {
      b = 58 + i * 15;
      w = L[i].w;
      larg = Math.max(2, w * 3.3);
      s += T(0, b, esc(SHORT[L[i].k] || L[i].t), "gu-m", "start");
      s += '<rect x="104" y="' + (b - 9) + '" width="' + larg.toFixed(1) + '" height="10" rx="3" class="gu-bar"/>';
      s += T((104 + larg + 6).toFixed(1), b, w, "gu-n", "start");
    }
    s += "</svg>";
    return { svg: s, cap: d.igual ? "Peso de cada pilar (padrão do site)" : "Peso de cada pilar (os seus, salvos neste navegador)" };
  }

  function figRegua() {
    var s = "", i, x, len;
    s += '<svg class="gu-svg" viewBox="0 0 288 172" role="img" aria-label="Ilustração em duas partes. Primeiro, um controle deslizante em que a pessoa escolhe o peso de um pilar. Depois, uma única régua que mede três governos de exemplo, A, B e C, do mesmo jeito." focusable="false">';
    s += T(0, 15, "1. Você ajusta o peso", "gu-t", "start");
    s += '<rect x="0" y="34" width="288" height="6" rx="3" class="gu-fundo"/>';
    s += '<rect x="0" y="34" width="190" height="6" rx="3" class="gu-bar"/>';
    s += '<circle cx="190" cy="37" r="11" class="gu-knob"/>';
    s += T(0, 62, "menos", "gu-m", "start") + T(144, 62, "peso do pilar", "gu-m", "middle") + T(288, 62, "mais", "gu-m", "end");
    s += '<path d="M144 70v17M138 81l6 7 6-7" class="gu-ln"/>';
    s += T(0, 108, "2. A mesma régua mede todos", "gu-t", "start");
    s += '<rect x="0.75" y="118" width="286.5" height="26" rx="4" class="gu-box"/>';
    for (i = 1; i < 20; i++) {
      x = (i * 14.4).toFixed(1);
      len = (i % 5 === 0) ? 13 : 7;
      s += '<line x1="' + x + '" y1="118" x2="' + x + '" y2="' + (118 + len) + '" class="gu-tk"/>';
    }
    s += '<circle cx="52" cy="131" r="6.5" class="gu-pino"/><circle cx="144" cy="131" r="6.5" class="gu-pino"/><circle cx="236" cy="131" r="6.5" class="gu-pino"/>';
    s += T(52, 163, "Governo A", "gu-m", "middle") + T(144, 163, "Governo B", "gu-m", "middle") + T(236, 163, "Governo C", "gu-m", "middle");
    s += "</svg>";
    return { svg: s, cap: "Exemplo ilustrativo, não são dados reais" };
  }

  function figGrafico() {
    var x0 = 64, x1 = 270, u = (x1 - x0) / 10, s = "", ys = [28, 58, 88], ns = [2, 5, 8], i, w, mid = x0 + 5 * u;
    s += '<svg class="gu-svg" viewBox="0 0 288 172" role="img" aria-label="Exemplo de gráfico de barras com notas 2, 5 e 8 numa escala de 0 a 10. O piso, que vale 0, fica na ponta esquerda. A meta, que vale 10, fica na ponta direita. A nota 5 fica no meio do caminho." focusable="false">';
    s += T(x0, 14, "Piso", "gu-t", "middle") + T(x1, 14, "Meta", "gu-t", "middle");
    for (i = 0; i < 3; i++) {
      w = ns[i] * u;
      s += '<rect x="' + x0 + '" y="' + ys[i] + '" width="' + (x1 - x0) + '" height="22" rx="4" class="gu-box"/>';
      s += '<rect x="' + x0 + '" y="' + ys[i] + '" width="' + w.toFixed(1) + '" height="22" rx="4" class="gu-bar"/>';
      s += T(0, ys[i] + 16, "Nota " + ns[i], "gu-m", "start");
      s += T((x0 + w + 6).toFixed(1), ys[i] + 16, ns[i], "gu-n", "start");
    }
    s += '<line x1="' + mid + '" y1="22" x2="' + mid + '" y2="118" class="gu-pt"/>';
    s += '<line x1="' + x0 + '" y1="20" x2="' + x0 + '" y2="120" class="gu-trac"/><line x1="' + x1 + '" y1="20" x2="' + x1 + '" y2="120" class="gu-trac"/>';
    s += T(x0, 138, "0", "gu-m", "middle") + T(mid, 138, "5", "gu-m", "middle") + T(x1, 138, "10", "gu-m", "middle");
    s += T(144, 164, "5 é o meio do caminho entre piso e meta", "gu-m", "middle");
    s += "</svg>";
    return { svg: s, cap: "Exemplo ilustrativo, não são dados reais" };
  }

  function figLimites() {
    var s = "";
    s += '<svg class="gu-svg" viewBox="0 0 288 172" role="img" aria-label="Ilustração. O que tem número público entra na nota. O que não tem número público fica de fora. Cada número que o site mostra tem uma fonte para conferir." focusable="false">';
    s += '<rect x="0" y="12" width="196" height="24" rx="6" class="gu-bar"/>';
    s += T(10, 29, "Tem número público", "gu-inv", "start");
    s += '<circle cx="216" cy="24" r="10" class="gu-acc"/><path d="M211 24.5l3.5 3.5 6.5-7" class="gu-ok"/>';
    s += T(232, 29, "entra", "gu-m", "start");
    s += '<rect x="0.75" y="46" width="194.5" height="24" rx="6" class="gu-trac2"/>';
    s += T(10, 63, "Sem número público", "gu-m", "start");
    s += '<circle cx="216" cy="58" r="10" class="gu-box"/><path d="M211.5 53.5l9 9M220.5 53.5l-9 9" class="gu-ln2"/>';
    s += T(232, 63, "fora", "gu-m", "start");
    s += '<line x1="0" y1="86" x2="288" y2="86" class="gu-div"/>';
    s += '<rect x="0.75" y="98" width="104" height="46" rx="8" class="gu-box"/>';
    s += T(52.75, 118, "Número", "gu-t", "middle") + T(52.75, 135, "no site", "gu-m", "middle");
    s += '<path d="M110 121h62M165 114l8 7-8 7" class="gu-ln"/>';
    s += '<rect x="183.25" y="98" width="104" height="46" rx="8" class="gu-box"/>';
    s += T(235.25, 118, "Fonte", "gu-t", "middle") + T(235.25, 135, "para conferir", "gu-m", "middle");
    s += T(144, 163, "Cada número tem a sua fonte", "gu-m", "middle");
    s += "</svg>";
    return { svg: s, cap: "Exemplo ilustrativo" };
  }

  /* ---------- conteúdo dos passos (até ~35 palavras cada) ---------- */
  var PASSOS = [
    {
      t: "A nota vai de 0 a 10",
      p: "Cada governo recebe uma nota geral de 0 a 10. Ela junta oito pilares, como economia, serviços públicos e integridade. Cada pilar tem um peso, e o peso decide quanto ele conta na nota.",
      fig: figNota,
      links: [{ t: "Ver a nota de cada governo", h: "#governos-hex" }]
    },
    {
      t: "A régua é sua e vale para todos",
      p: "Você muda o peso de cada pilar e a nota é recalculada na hora. A mesma régua vale para todos os governos. Réguas diferentes dão resultados diferentes, e o site não aponta a certa.",
      fig: figRegua,
      links: [{ t: "Ajustar os pesos", h: "#pesos-geral" }]
    },
    {
      t: "Como ler um gráfico",
      p: "Cada barra é uma nota de 0 a 10. Piso (vale 0) e meta (vale 10) são fixos e iguais para todos. Nota 5 é o meio do caminho, 8 está perto da meta e 2, perto do piso.",
      fig: figGrafico,
      links: [{ t: "Ver os gráficos da economia", h: "#economia" }]
    },
    {
      t: "O que o site não mede",
      p: "A nota não diz em quem votar e não mede o que não tem número público. Ela não é sentença: investigação não é condenação. Cada número tem fonte; confira em Fontes e em Como calculamos.",
      fig: figLimites,
      links: [{ t: "Ver as fontes", h: "#fontes" }, { t: "Como calculamos", h: "#metodo" }]
    }
  ];

  /* ---------- montagem do diálogo (uma vez, na primeira abertura) ---------- */
  function montar() {
    var i, li, bt;
    if (overlay) { return; }
    overlay = el("div", "gu-overlay");
    overlay.id = "gu-overlay";
    overlay.hidden = true;

    painel = el("div", "gu-painel");
    painel.setAttribute("role", "dialog");
    painel.setAttribute("aria-modal", "true");
    painel.setAttribute("aria-labelledby", "gu-tit");
    painel.setAttribute("aria-describedby", "gu-txt");
    painel.tabIndex = -1;

    painel.innerHTML =
      '<div class="gu-topo">' +
        '<div class="gu-topo-t"><p class="gu-olho">Guia de 60 segundos</p><h2 class="gu-tit" id="gu-tit">Comece aqui</h2></div>' +
        '<button type="button" class="gu-x" id="gu-x" aria-label="Fechar o guia"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<ol class="gu-prog" id="gu-prog" aria-label="Passos do guia"></ol>' +
      "</div>" +
      '<div class="gu-corpo" id="gu-corpo"><div class="gu-passo" id="gu-passo"></div></div>' +
      '<div class="gu-rodape">' +
        '<label class="gu-chk"><input type="checkbox" id="gu-nao"><span>Não mostrar de novo</span></label>' +
        '<div class="gu-nav">' +
          '<button type="button" class="gu-bt gu-pular" id="gu-pular" aria-label="Pular o guia">Pular</button>' +
          '<button type="button" class="gu-bt gu-volta" id="gu-volta">Voltar</button>' +
          '<button type="button" class="gu-bt gu-prim" id="gu-prox">Próximo</button>' +
        "</div>" +
      "</div>" +
      '<p class="gu-sr" id="gu-live" aria-live="polite" aria-atomic="true"></p>';

    overlay.appendChild(painel);
    D.body.appendChild(overlay);

    corpo = D.getElementById("gu-corpo");
    boxPasso = D.getElementById("gu-passo");
    listaProg = D.getElementById("gu-prog");
    btnX = D.getElementById("gu-x");
    btnPular = D.getElementById("gu-pular");
    btnVolta = D.getElementById("gu-volta");
    btnProx = D.getElementById("gu-prox");
    chk = D.getElementById("gu-nao");
    live = D.getElementById("gu-live");

    for (i = 0; i < TOTAL; i++) {
      li = D.createElement("li");
      bt = D.createElement("button");
      bt.type = "button";
      bt.className = "gu-seg";
      bt.setAttribute("data-i", String(i));
      bt.setAttribute("aria-label", "Passo " + (i + 1) + " de " + TOTAL + ": " + PASSOS[i].t);
      li.appendChild(bt);
      listaProg.appendChild(li);
      segs.push(bt);
    }

    /* eventos */
    overlay.addEventListener("click", function (e) { if (e.target === overlay) { fechar({}); } });
    btnX.addEventListener("click", function () { fechar({}); });
    btnPular.addEventListener("click", function () { fechar({}); });
    btnVolta.addEventListener("click", function () { irPara(passo - 1, false); });
    btnProx.addEventListener("click", function () {
      if (passo >= TOTAL - 1) { fechar({ concluiu: true }); } else { irPara(passo + 1, false); }
    });
    listaProg.addEventListener("click", function (e) {
      var t = e.target, n;
      while (t && t !== listaProg && !(t.getAttribute && t.getAttribute("data-i") != null)) { t = t.parentNode; }
      if (!t || t === listaProg) { return; }
      n = parseInt(t.getAttribute("data-i"), 10);
      if (!isNaN(n)) { irPara(n, false); }
    });
    chk.addEventListener("change", function () { desligar(chk.checked); });
    corpo.addEventListener("click", function (e) {
      var t = e.target;
      while (t && t !== corpo && !(t.classList && t.classList.contains("gu-link"))) { t = t.parentNode; }
      if (t && t !== corpo) { fechar({ semFoco: true }); }   // deixa o link seguir
    });

    /* deslizar para o lado troca de passo (sem atrapalhar a rolagem vertical) */
    corpo.addEventListener("touchstart", function (e) {
      var t = e.touches && e.touches[0];
      if (!t || e.touches.length > 1) { tOk = false; return; }
      tx = t.clientX; ty = t.clientY; tOk = true;
    }, { passive: true });
    corpo.addEventListener("touchend", function (e) {
      var t = e.changedTouches && e.changedTouches[0], dx, dy;
      if (!tOk || !t) { return; }
      tOk = false;
      dx = t.clientX - tx; dy = t.clientY - ty;
      if (Math.abs(dx) > 56 && Math.abs(dy) < 40 && Math.abs(dx) > 1.6 * Math.abs(dy)) {
        if (dx < 0 && passo < TOTAL - 1) { irPara(passo + 1, false); }
        else if (dx > 0 && passo > 0) { irPara(passo - 1, false); }
      }
    }, { passive: true });
    /* evita que a página de trás role junto (iOS) */
    overlay.addEventListener("touchmove", function (e) {
      var t = e.target, dentro = false;
      while (t) { if (t === corpo) { dentro = true; break; } t = t.parentNode; }
      if (!dentro || corpo.scrollHeight <= corpo.clientHeight + 1) { e.preventDefault(); }
    }, { passive: false });
  }

  /* ---------- passo atual ---------- */
  function irPara(i, semAnim) {
    var p, f, cap, h, k, dir, antes, ult, ativo;
    if (i < 0 || i >= TOTAL) { return; }
    antes = D.activeElement;
    dir = i >= passo ? 1 : -1;
    passo = i;
    p = PASSOS[i];
    f = p.fig();
    cap = f.cap;
    h = '<figure class="gu-fig">' + f.svg + '<figcaption class="gu-cap">' + esc(cap) + "</figcaption></figure>" +
        '<div class="gu-passo-t">' +
          '<p class="gu-cont">Passo ' + (i + 1) + " de " + TOTAL + "</p>" +
          '<h3 class="gu-h" id="gu-h">' + esc(p.t) + "</h3>" +
          '<p class="gu-txt" id="gu-txt">' + esc(p.p) + "</p>";
    if (p.links && p.links.length) {
      h += '<p class="gu-links">';
      for (k = 0; k < p.links.length; k++) {
        h += '<a class="gu-link" href="' + esc(p.links[k].h) + '">' + esc(p.links[k].t) + "</a>";
      }
      h += "</p>";
    }
    h += "</div>";
    boxPasso.innerHTML = h;
    corpo.scrollTop = 0;

    if (!semAnim) {
      boxPasso.style.setProperty("--gu-dx", (dir * 14) + "px");
      boxPasso.className = "gu-passo gu-troca";
      W.clearTimeout(trocaT);
      trocaT = W.setTimeout(function () { boxPasso.className = "gu-passo"; }, 320);
    } else {
      boxPasso.className = "gu-passo";
    }

    for (k = 0; k < segs.length; k++) {
      segs[k].className = "gu-seg" + (k < i ? " gu-feito" : "") + (k === i ? " gu-atual" : "");
      if (k === i) { segs[k].setAttribute("aria-current", "step"); } else { segs[k].removeAttribute("aria-current"); }
    }
    ult = (i === TOTAL - 1);
    btnProx.textContent = ult ? "Concluir" : "Próximo";
    btnVolta.hidden = (i === 0);
    btnPular.hidden = ult;
    if ((antes === btnVolta && i === 0) || (antes === btnPular && ult)) {
      try { btnProx.focus(); } catch (e) { }
    }
    if (!semAnim) {
      live.textContent = "Passo " + (i + 1) + " de " + TOTAL + ". " + p.t + ". " + p.p;
    }
    ativo = segs[i];
    return ativo;
  }

  /* ---------- travar a página atrás ---------- */
  function travar() {
    var de = D.documentElement, sw;
    if (travado) { return; }
    sw = W.innerWidth - de.clientWidth;
    padAnt = de.style.paddingRight;
    de.classList.add("gu-trava");
    if (sw > 0) { de.style.paddingRight = sw + "px"; }
    travado = true;
  }
  function destravar() {
    var de = D.documentElement;
    if (!travado) { return; }
    de.classList.remove("gu-trava");
    de.style.paddingRight = padAnt;
    travado = false;
  }
  function esconderFundo() {
    var fs = D.body.children, i, n, t;
    escondidos = [];
    for (i = 0; i < fs.length; i++) {
      n = fs[i];
      if (n === overlay) { continue; }
      t = n.tagName;
      if (t === "SCRIPT" || t === "STYLE" || t === "LINK" || t === "NOSCRIPT") { continue; }
      if (n.getAttribute("aria-hidden") === "true") { continue; }
      n.setAttribute("aria-hidden", "true");
      escondidos.push(n);
    }
  }
  function mostrarFundo() {
    var i;
    for (i = 0; i < escondidos.length; i++) { escondidos[i].removeAttribute("aria-hidden"); }
    escondidos = [];
  }
  function ajustaVh() {
    if (overlay) { overlay.style.setProperty("--gu-vh", (W.innerHeight * 0.01) + "px"); }
  }

  /* ---------- teclado: Esc fecha, Tab fica preso, setas nos passos ---------- */
  function focaveis() {
    var nodes = painel.querySelectorAll('a[href],button,input,[tabindex]'), out = [], i, n;
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      if (n.disabled || n.tabIndex < 0 || n.hidden || !visivel(n)) { continue; }
      out.push(n);
    }
    return out;
  }
  function aoTecla(e) {
    var k = e.key, f, a, primeiro, ultimo, n;
    if (!aberto) { return; }
    if (k === "Escape" || k === "Esc" || e.keyCode === 27) {
      e.preventDefault(); e.stopPropagation();
      fechar({});
      return;
    }
    if (k === "Tab" || e.keyCode === 9) {
      f = focaveis();
      a = D.activeElement;
      if (!f.length) { e.preventDefault(); painel.focus(); return; }
      primeiro = f[0]; ultimo = f[f.length - 1];
      if (e.shiftKey) {
        if (a === primeiro || a === painel || !painel.contains(a)) { e.preventDefault(); ultimo.focus(); }
      } else if (a === ultimo || !painel.contains(a)) {
        e.preventDefault(); primeiro.focus();
      }
      return;
    }
    if ((k === "ArrowRight" || k === "ArrowLeft") && e.target && e.target.classList && e.target.classList.contains("gu-seg")) {
      n = passo + (k === "ArrowRight" ? 1 : -1);
      if (n >= 0 && n < TOTAL) {
        e.preventDefault();
        irPara(n, false);
        try { segs[n].focus(); } catch (er) { }
      }
    }
  }
  function aoFoco(e) {
    if (!aberto || !overlay) { return; }
    if (!overlay.contains(e.target)) {
      try { (visivel(btnProx) ? btnProx : painel).focus(); } catch (er) { }
    }
  }

  /* ---------- abrir e fechar ---------- */
  function abrir(o) {
    var a;
    o = o || {};
    if (aberto) { return; }
    montar();
    aberto = true;
    auto = !!o.auto;
    a = D.activeElement;
    retorno = (a && a !== D.body && a !== D.documentElement && typeof a.focus === "function") ? a : null;
    chk.checked = desligado();
    ajustaVh();
    overlay.hidden = false;
    overlay.className = "gu-overlay gu-in";
    travar();
    irPara(0, true);
    try { btnProx.focus(); } catch (e) { }
    esconderFundo();
    D.addEventListener("keydown", aoTecla, true);
    D.addEventListener("focusin", aoFoco, true);
    W.addEventListener("resize", ajustaVh);
    W.addEventListener("orientationchange", ajustaVh);
  }

  function limparHash() {
    try { W.history.replaceState(W.history.state, "", W.location.pathname + W.location.search); } catch (e) { }
  }

  function fechar(o) {
    var alvo, main;
    o = o || {};
    if (!aberto) { return; }
    aberto = false;
    overlay.hidden = true;
    overlay.className = "gu-overlay";
    D.removeEventListener("keydown", aoTecla, true);
    D.removeEventListener("focusin", aoFoco, true);
    W.removeEventListener("resize", ajustaVh);
    W.removeEventListener("orientationchange", ajustaVh);
    destravar();
    mostrarFundo();
    if (o.concluiu) { desligar(true); }
    if (W.location.hash === "#guia") { limparHash(); }
    if (!o.semFoco) {
      alvo = retorno;
      if (!alvo || !D.documentElement.contains(alvo) || !visivel(alvo)) { alvo = (auto && visivel(heroBtn)) ? heroBtn : null; }
      if (!alvo) { main = D.getElementById("conteudo"); alvo = main || null; }
      if (alvo) {
        try { alvo.focus({ preventScroll: true }); } catch (e) { try { alvo.focus(); } catch (e2) { } }
      }
    }
    retorno = null;
    auto = false;
  }

  /* ---------- botão no #slotHero e link no rodapé ---------- */
  function montarBotoes() {
    var slot = D.getElementById("slotHero"), box, nav, slotR, ic;
    if (slot && !D.getElementById("gu-hero-btn")) {
      box = D.getElementById("heroAcoes");
      if (!box) {
        box = D.createElement("div");
        box.id = "heroAcoes";
        box.className = "hero-acoes";
        slot.appendChild(box);
      }
      heroBtn = D.createElement("button");
      heroBtn.type = "button";
      heroBtn.id = "gu-hero-btn";
      heroBtn.className = "btn gu-hero-btn";
      heroBtn.setAttribute("aria-haspopup", "dialog");
      ic = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="13" r="8"/><path d="M12 9v4.5l3 1.8M9.5 3h5"/></svg>';
      heroBtn.innerHTML = ic + "<span>Guia de 60 segundos</span>";
      heroBtn.addEventListener("click", function () { abrir({}); });
      box.appendChild(heroBtn);
    } else {
      heroBtn = D.getElementById("gu-hero-btn");
    }
    slotR = D.getElementById("slotRodape");
    if (slotR && !D.getElementById("gu-foot-link")) {
      nav = D.getElementById("rodapeExtra");
      if (!nav) {
        nav = D.createElement("nav");
        nav.id = "rodapeExtra";
        nav.className = "foot-extra";
        nav.setAttribute("aria-label", "Mais");
        slotR.appendChild(nav);
      }
      footLink = D.createElement("a");
      footLink.id = "gu-foot-link";
      footLink.className = "gu-foot-link";
      footLink.href = "#guia";
      footLink.setAttribute("aria-haspopup", "dialog");
      footLink.textContent = "Guia de 60 segundos";
      footLink.addEventListener("click", function (e) { e.preventDefault(); abrir({}); });
      nav.appendChild(footLink);
    }
  }

  /* ---------- abrir sozinho na primeira visita ---------- */
  function haModalAberto() {
    var m = D.querySelectorAll('[aria-modal="true"]'), i;
    for (i = 0; i < m.length; i++) { if (m[i] !== painel && visivel(m[i])) { return true; } }
    return false;
  }
  function podeAbrirSozinho() {
    var pg = "", h;
    if (desligado()) { return false; }
    if (contagem() >= MAX_AUTO) { return false; }
    if (memAuto || lerSS(K_S) === "1") { return false; }
    try { pg = B.paginaAtual(); } catch (e) { pg = ""; }
    if (pg !== "inicio") { return false; }
    h = (W.location.hash || "").replace(/^#/, "");
    if (h && h !== "inicio" && h !== "topo") { return false; }      // veio por um link para uma seção ou outra página
    if (/[?&#]w=/.test(W.location.href)) { return false; }           // régua compartilhada (?w=)
    return true;
  }
  function tentarAuto() {
    var a;
    if (aberto) { return; }
    if (D.hidden) {
      D.addEventListener("visibilitychange", function once() {
        if (!D.hidden) { D.removeEventListener("visibilitychange", once); W.setTimeout(tentarAuto, 600); }
      });
      return;
    }
    if (!podeAbrirSozinho()) { return; }
    a = D.activeElement;
    if (a && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)) { return; }  // não interrompe quem já está mexendo
    if (haModalAberto()) { return; }
    memAuto = true;
    gravarSS(K_S, "1");
    gravarLS(K_N, String(contagem() + 1));
    abrir({ auto: true });
  }

  /* ---------- ganchos do site ---------- */
  function aoHash() {
    if ((W.location.hash || "") === "#guia") { abrir({}); }
  }
  if (typeof B.on === "function") {
    B.on("page", function () { if (aberto) { fechar({ semFoco: true }); } });
  }
  W.addEventListener("hashchange", aoHash);

  B.abrirGuia = function () { abrir({}); };

  montarBotoes();
  if ((W.location.hash || "") === "#guia") {
    abrir({});
  } else {
    W.setTimeout(tentarAuto, ATRASO);
  }
})();
