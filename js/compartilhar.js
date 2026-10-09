/* Módulo compartilhar: "Compartilhar a sua régua" (prefixo cp-).
   (a) Botões "Copiar link da minha régua", "Compartilhar" e "Criar cartão em imagem" em #slotHex e #slotPesos.
   (b) Leitura do link ao carregar: ?w= (pesos dos 8 pilares), iw= (pesos da integridade, em %), fk= (força política x100).
       Se algum parâmetro for válido, aplica com BEA.aplicarPesos e mostra uma faixa dispensável no topo do conteúdo.
   (c) Cartão em PNG desenhado em canvas (sem imagens externas) em dois formatos: horizontal 1200x630 e vertical 1080x1350.
   (d) Expõe BEA.linkDaRegua(pilW, intW, fk) e BEA.cartaoDaRegua({formato:"h"|"v"}) -> Promise<Blob>.
   Formato do link: ?w=18-14-10-18-8-14-6-12&iw=70-30&fk=25#inicio
     w  = pesos inteiros (0 a 40) na ordem eco-pov-soc-ser-amb-fut-prl-int
     iw = peso dos casos - peso do índice do Banco Mundial, em % (0 a 100 cada)
     fk = expoente da força política x 100 (0 a 100)
   Usa só a API window.BEA. Sem rede, sem rastreamento, sem cookies. Nada é enviado: o cartão nasce no aparelho.
   Sintaxe segura para iOS 13+: sem "?.", sem "??", sem lookbehind. */
(function () {
  "use strict";

  var B = window.BEA;
  if (!B || typeof B.estado !== "function" || typeof B.geral !== "function" || typeof B.aplicarPesos !== "function" || B.compartilharAtivo) { return; }
  B.compartilharAtivo = true;

  var D = document, W = window;
  var KEYS = ["eco", "pov", "soc", "ser", "amb", "fut", "prl", "int"];
  var NOME = {};
  try { B.pilares().forEach(function (p) { NOME[p.k] = p.t; }); } catch (e0) { }
  KEYS.forEach(function (k) { if (!NOME[k]) { NOME[k] = k; } });

  /* ---------- utilidades ---------- */
  function el(tag, cls, txt) {
    var n = D.createElement(tag);
    if (cls) { n.className = cls; }
    if (txt != null) { n.textContent = txt; }
    return n;
  }
  function clampInt(v, lo, hi, d) {
    v = Number(v);
    if (!isFinite(v)) { return d; }
    v = Math.round(v);
    return v < lo ? lo : (v > hi ? hi : v);
  }
  function pc(v, d) {
    v = Number(v);
    if (!isFinite(v)) { v = d; }
    return clampInt(v * 100, 0, 100, Math.round(d * 100));
  }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1).replace(".", ","); }
  function f2(v) { return (Math.round(v * 100) / 100).toFixed(2).replace(".", ","); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function dataHoje() { var d = new Date(); return pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1) + "/" + d.getFullYear(); }
  function baseUrl() { return String(W.location.href).split("#")[0].split("?")[0]; }
  function enderecoSite() {
    var p = W.location.protocol;
    if ((p === "http:" || p === "https:") && W.location.host) { return W.location.host; }
    return "brasilemanalise.com";
  }
  function soma(w) { var s = 0; KEYS.forEach(function (k) { s += Number(w[k]) || 0; }); return s; }
  function partePc(w, k) { var s = soma(w); return s > 0 ? Math.round((Number(w[k]) || 0) / s * 100) : 0; }

  /* ---------- região aria-live global ---------- */
  var live = null;
  function garantirLive() {
    if (live || !D.body) { return; }
    live = el("div", "cp-sr");
    live.id = "cp-live";
    live.setAttribute("role", "status");
    live.setAttribute("aria-live", "polite");
    live.setAttribute("aria-atomic", "true");
    D.body.appendChild(live);
  }
  var msgTimer = 0;
  function dizer(txt) {
    garantirLive();
    if (live) { live.textContent = ""; setTimeout(function () { if (live) { live.textContent = txt; } }, 40); }
    var ms = D.querySelectorAll(".cp-msg");
    var i;
    for (i = 0; i < ms.length; i++) { ms[i].textContent = txt; }
    clearTimeout(msgTimer);
    msgTimer = setTimeout(function () {
      var j, m2 = D.querySelectorAll(".cp-msg");
      for (j = 0; j < m2.length; j++) { m2[j].textContent = ""; }
    }, 9000);
  }

  /* ---------- link da régua ---------- */
  /* pilW: {eco:..}, intW: {c,w} em fração 0 a 1 (como BEA.estado), fk: fração 0 a 1 (como BEA.estado().forK).
     Valores de fk acima de 1 são entendidos como já multiplicados por 100. */
  function linkDaRegua(pilW, intW, fk) {
    var e = B.estado();
    var pw = pilW || e.pilW || {};
    var iw = intW || e.intW || {};
    var k0 = (fk == null) ? e.forK : fk;
    var w = KEYS.map(function (k) { return clampInt(pw[k], 0, 40, (e.pilW && e.pilW[k] != null) ? e.pilW[k] : 0); });
    var fkv = Number(k0);
    var fkp = isFinite(fkv) ? (fkv > 1 ? clampInt(fkv, 0, 100, 25) : pc(fkv, 0.25)) : 25;
    return baseUrl() + "?w=" + w.join("-") + "&iw=" + pc(iw.c, 0.5) + "-" + pc(iw.w, 0.5) + "&fk=" + fkp + "#inicio";
  }
  B.linkDaRegua = linkDaRegua;

  /* ---------- leitura do link ---------- */
  function parametros() {
    var out = {};
    var q = String(W.location.search || "");
    if (q.charAt(0) === "?") { q = q.slice(1); }
    if (!q) { return out; }
    q.split("&").forEach(function (par) {
      var i = par.indexOf("=");
      if (i < 1) { return; }
      var k = par.slice(0, i), v = par.slice(i + 1);
      try { v = decodeURIComponent(v.replace(/\+/g, " ")); } catch (e1) { return; }
      if (out[k] == null) { out[k] = v; }
    });
    return out;
  }
  function lerRegua() {
    var p = parametros();
    var res = {};
    var achou = false;
    var partes, i, n, ok;
    if (p.w != null && /^\d{1,2}(-\d{1,2}){7}$/.test(p.w)) {
      partes = p.w.split("-");
      ok = true;
      var pw = {}, s = 0;
      for (i = 0; i < 8; i++) {
        n = parseInt(partes[i], 10);
        if (!(n >= 0 && n <= 40)) { ok = false; break; }
        pw[KEYS[i]] = n; s += n;
      }
      if (ok && s > 0) { res.pilW = pw; achou = true; }
    }
    if (p.iw != null && /^\d{1,3}-\d{1,3}$/.test(p.iw)) {
      partes = p.iw.split("-");
      var a = parseInt(partes[0], 10), b = parseInt(partes[1], 10);
      if (a >= 0 && a <= 100 && b >= 0 && b <= 100) { res.intW = { c: a / 100, w: b / 100 }; achou = true; }
    }
    if (p.fk != null && /^\d{1,3}$/.test(p.fk)) {
      n = parseInt(p.fk, 10);
      if (n >= 0 && n <= 100) { res.forK = n / 100; achou = true; }
    }
    return achou ? res : null;
  }
  function limparQuery() {
    try {
      if (W.location.search) { W.history.replaceState(W.history.state, "", W.location.pathname + W.location.hash); }
    } catch (e2) { }
  }

  /* ---------- copiar / compartilhar ---------- */
  function copiarLegado(txt) {
    var ta = D.createElement("textarea");
    ta.value = txt;
    ta.setAttribute("readonly", "");
    ta.setAttribute("aria-hidden", "true");
    ta.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;font-size:16px";
    D.body.appendChild(ta);
    var ok = false;
    try {
      ta.focus({ preventScroll: true });
      ta.select();
      ta.setSelectionRange(0, txt.length);
      ok = D.execCommand("copy");
    } catch (e3) { ok = false; }
    D.body.removeChild(ta);
    return ok;
  }
  function copiar(txt) {
    return new Promise(function (resolve, reject) {
      function viaLegado() { if (copiarLegado(txt)) { resolve(); } else { reject(new Error("copia")); } }
      try {
        if (W.navigator.clipboard && typeof W.navigator.clipboard.writeText === "function") {
          W.navigator.clipboard.writeText(txt).then(resolve, viaLegado);
          return;
        }
      } catch (e4) { }
      viaLegado();
    });
  }

  var blocos = [];
  function mostrarManual(url) {
    blocos.forEach(function (b) {
      if (!b.manual) { return; }
      b.manual.hidden = false;
      b.entrada.value = url;
    });
    var vis = null;
    blocos.forEach(function (b) { if (!vis && b.raiz.offsetParent !== null) { vis = b; } });
    if (vis) {
      try { vis.entrada.focus(); vis.entrada.select(); vis.entrada.setSelectionRange(0, url.length); } catch (e5) { }
    }
  }
  function esconderManual() {
    blocos.forEach(function (b) { if (b.manual) { b.manual.hidden = true; } });
  }
  function acaoCopiar() {
    var url = linkDaRegua();
    esconderManual();
    copiar(url).then(function () {
      dizer("Link copiado. Quem abrir vê os mesmos pesos e as mesmas notas.");
    }, function () {
      mostrarManual(url);
      dizer("Não foi possível copiar sozinho. O link está no campo abaixo: selecione e copie.");
    });
  }
  function acaoCompartilhar() {
    var url = linkDaRegua();
    esconderManual();
    var nav = W.navigator;
    if (nav && typeof nav.share === "function") {
      var p;
      try {
        p = nav.share({ title: "Brasil em Análise: a minha régua", text: "Veja como os governos ficam na minha régua. As notas mudam conforme os pesos.", url: url });
      } catch (e6) { p = null; }
      if (p && typeof p.then === "function") {
        p.then(function () { dizer("Compartilhado."); }, function (err) {
          if (err && err.name === "AbortError") { return; }
          acaoCopiar();
        });
        return;
      }
    }
    acaoCopiar();
  }

  /* ---------- cartão em imagem (canvas) ---------- */
  var COR = { fundo: "#fcfcfb", tinta: "#111314", tinta2: "#464a4d", trilho: "#e3e5e0", linha: "#9a9d96", barra: "#464a4d" };
  var FONTE = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  function fonte(px, peso) { return (peso || 400) + " " + px + "px " + FONTE; }
  function larg(c, t, px, peso) { c.font = fonte(px, peso); return c.measureText(t).width; }
  function ajustar(c, t, max, px, min, peso) {
    var s = px;
    while (s > min && larg(c, t, s, peso) > max) { s -= 1; }
    return s;
  }
  function cortar(c, t, max, px, peso) {
    if (larg(c, t, px, peso) <= max) { return t; }
    while (t.length > 1 && larg(c, t + "…", px, peso) > max) { t = t.slice(0, -1); }
    return t + "…";
  }
  function quebrar(c, t, max, px, peso) {
    var pal = t.split(" "), linhas = [], atual = "", i, teste;
    for (i = 0; i < pal.length; i++) {
      teste = atual ? atual + " " + pal[i] : pal[i];
      if (larg(c, teste, px, peso) <= max || !atual) { atual = teste; } else { linhas.push(atual); atual = pal[i]; }
    }
    if (atual) { linhas.push(atual); }
    return linhas;
  }
  /* escreve texto quebrado em até maxLinhas, reduzindo a fonte até caber; devolve o y depois da última linha */
  function paragrafo(c, t, x, y, max, px, min, peso, cor, maxLinhas, alt) {
    var s = px, linhas = quebrar(c, t, max, s, peso), i, ok;
    for (;;) {
      linhas = quebrar(c, t, max, s, peso);
      ok = linhas.length <= maxLinhas;
      for (i = 0; ok && i < linhas.length; i++) { if (larg(c, linhas[i], s, peso) > max) { ok = false; } }
      if (ok || s <= min) { break; }
      s -= 1;
    }
    c.font = fonte(s, peso);
    c.fillStyle = cor;
    c.textAlign = "left";
    c.textBaseline = "alphabetic";
    var lh = alt || Math.round(s * 1.28);
    for (i = 0; i < linhas.length && i < maxLinhas; i++) {
      var ln = linhas[i];
      if (larg(c, ln, s, peso) > max) { ln = cortar(c, ln, max, s, peso); }
      c.fillText(ln, x, y + i * lh);
    }
    return y + Math.min(linhas.length, maxLinhas) * lh;
  }
  function texto(c, t, x, y, px, peso, cor, alinh, max, min) {
    var s = px;
    if (max) { s = ajustar(c, t, max, px, min || 12, peso); if (larg(c, t, s, peso) > max) { t = cortar(c, t, max, s, peso); } }
    c.font = fonte(s, peso);
    c.fillStyle = cor;
    c.textAlign = alinh || "left";
    c.textBaseline = "alphabetic";
    c.fillText(t, x, y);
    return s;
  }
  function retRound(c, x, y, w, h, r) {
    r = Math.min(r, h / 2, w / 2);
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.arc(x + w - r, y + r, r, -Math.PI / 2, 0);
    c.lineTo(x + w, y + h - r);
    c.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
    c.lineTo(x + r, y + h);
    c.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
    c.lineTo(x, y + r);
    c.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    c.closePath();
  }
  function linhaH(c, x1, x2, y, cor, esp) {
    c.fillStyle = cor;
    c.fillRect(x1, y, x2 - x1, esp || 2);
  }

  function anoInicial(s) { var m = String(s || "").match(/\d{4}/); return m ? parseInt(m[0], 10) : 9999; }

  function dadosDoCartao(opts) {
    opts = opts || {};
    var e = B.estado();
    var pilW = {}, i;
    for (i = 0; i < KEYS.length; i++) {
      var src = (opts.pilW && opts.pilW[KEYS[i]] != null) ? opts.pilW[KEYS[i]] : e.pilW[KEYS[i]];
      pilW[KEYS[i]] = clampInt(src, 0, 40, 0);
    }
    var intW = { c: (opts.intW && opts.intW.c != null) ? opts.intW.c : e.intW.c, w: (opts.intW && opts.intW.w != null) ? opts.intW.w : e.intW.w };
    var forK = opts.forK != null ? opts.forK : e.forK;
    var lista = B.geral({ pilW: pilW, intW: intW, forK: forK }) || [];
    var govs = [], agg = null;
    lista.forEach(function (x) { if (x.id === "ptall") { agg = x; } else { govs.push(x); } });
    govs.sort(function (a, b) { return anoInicial(a.anos) - anoInicial(b.anos); });
    return {
      govs: govs,
      agg: agg,
      pilW: pilW,
      intW: intW,
      forK: forK,
      data: dataHoje(),
      site: enderecoSite(),
      versao: String(B.versao != null ? B.versao : "")
    };
  }
  function notaTxt(g) { return (g && typeof g.nota === "number" && isFinite(g.nota)) ? f1(g.nota) : "n/d"; }

  function descreverCartao(d) {
    var t = "Cartão com a nota geral de cada governo na minha régua, de 0 a 10. ";
    d.govs.forEach(function (g) { t += g.nome + " (" + g.partido + ", " + g.anos + "): " + notaTxt(g) + ". "; });
    if (d.agg) { t += d.agg.nome + " (" + d.agg.anos + "): " + notaTxt(d.agg) + ". "; }
    t += "Pesos dos pilares: ";
    t += KEYS.map(function (k) { return NOME[k] + " " + (d.pilW[k] > 0 ? partePc(d.pilW, k) + "%" : "fora"); }).join(", ") + ". ";
    t += "Integridade: peso " + f2(d.intW.c) + " dos casos e " + f2(d.intW.w) + " do índice do Banco Mundial. Força política: " + f2(d.forK) + ". ";
    t += "As notas mudam conforme os pesos. Veja a conta completa em " + d.site + ". Modelo versão " + d.versao + ", " + d.data + ".";
    return t;
  }

  /* linha de barra de um governo; devolve nada. x,y = canto superior esquerdo da linha */
  function linhaBarra(c, g, x, y, rowH, colW, cfg) {
    var labW = cfg.labW, valW = cfg.valW;
    var trX = x + labW, trW = colW - labW - valW - cfg.gap;
    var nome = g.nome, sub = g.partido + " · " + g.anos;
    var base = y + rowH / 2;
    if (cfg.doisLinhas) {
      texto(c, nome, x, y + rowH * 0.46, cfg.nomePx, 700, COR.tinta, "left", labW - 12, 20);
      texto(c, sub, x, y + rowH * 0.46 + cfg.subPx + 6, cfg.subPx, 400, COR.tinta2, "left", labW - 12, 16);
    } else {
      var s = ajustar(c, nome, labW - 14 - larg(c, sub, cfg.subPx, 400), cfg.nomePx, 18, 700);
      var nw = larg(c, nome, s, 700);
      if (nw + 8 + larg(c, sub, cfg.subPx, 400) > labW - 4) { sub = g.anos; }
      texto(c, nome, x, base + s * 0.35, s, 700, COR.tinta, "left");
      texto(c, sub, x + nw + 10, base + s * 0.35, cfg.subPx, 400, COR.tinta2, "left", labW - nw - 14, 14);
    }
    var th = cfg.barH, ty = base - th / 2;
    retRound(c, trX, ty, trW, th, th / 4);
    c.fillStyle = COR.trilho;
    c.fill();
    var v = (typeof g.nota === "number" && isFinite(g.nota)) ? Math.max(0, Math.min(10, g.nota)) : 0;
    if (v > 0) {
      retRound(c, trX, ty, Math.max(th / 2, trW * v / 10), th, th / 4);
      c.fillStyle = COR.barra;
      c.fill();
    }
    texto(c, notaTxt(g), trX + trW + cfg.gap + valW, base + cfg.valPx * 0.35, cfg.valPx, 700, COR.tinta, "right");
  }

  function blocoBarras(c, d, x, y, colW, cfg) {
    var yy = y;
    d.govs.forEach(function (g) { linhaBarra(c, g, x, yy, cfg.rowH, colW, cfg); yy += cfg.rowH; });
    if (d.agg) {
      yy += cfg.sepGap / 2;
      linhaH(c, x, x + colW, yy, COR.linha, 2);
      yy += cfg.sepGap / 2;
      linhaBarra(c, d.agg, x, yy, cfg.rowH, colW, cfg);
      yy += cfg.rowH;
    }
    return yy;
  }

  /* pesos dos pilares: nome + %, com mini-barra. cols = número de colunas */
  function blocoPesos(c, d, x, y, w, cols, rowH, nomePx, barH, colGap) {
    var porCol = Math.ceil(KEYS.length / cols);
    var cw = (w - colGap * (cols - 1)) / cols;
    var maxW = 0, i;
    for (i = 0; i < KEYS.length; i++) { if (d.pilW[KEYS[i]] > maxW) { maxW = d.pilW[KEYS[i]]; } }
    for (i = 0; i < KEYS.length; i++) {
      var k = KEYS[i], col = Math.floor(i / porCol), lin = i % porCol;
      var cx = x + col * (cw + colGap), cy = y + lin * rowH;
      var pcTxt = d.pilW[k] > 0 ? partePc(d.pilW, k) + "%" : "fora";
      var pcW = larg(c, "100%", nomePx, 700) + 4;
      texto(c, NOME[k], cx, cy + nomePx, nomePx, 400, COR.tinta, "left", cw - pcW - 10, 15);
      texto(c, pcTxt, cx + cw, cy + nomePx, nomePx, 700, COR.tinta, "right");
      var by = cy + nomePx + 7;
      retRound(c, cx, by, cw, barH, barH / 2);
      c.fillStyle = COR.trilho;
      c.fill();
      if (d.pilW[k] > 0 && maxW > 0) {
        retRound(c, cx, by, Math.max(barH, cw * d.pilW[k] / maxW), barH, barH / 2);
        c.fillStyle = COR.barra;
        c.fill();
      }
    }
  }

  function textoExtras(d) {
    return "Integridade: casos " + f2(d.intW.c) + " e índice do Banco Mundial " + f2(d.intW.w) + ". Força política: " + f2(d.forK) + ".";
  }

  function desenharH(cv, d) {
    var Wd = 1200, Hd = 630, m = 56;
    cv.width = Wd; cv.height = Hd;
    var c = cv.getContext("2d");
    c.fillStyle = COR.fundo; c.fillRect(0, 0, Wd, Hd);
    c.fillStyle = COR.tinta; c.fillRect(0, 0, Wd, 10);
    texto(c, "BRASIL EM ANÁLISE", m, 56, 22, 700, COR.tinta2, "left");
    texto(c, d.data, Wd - m, 56, 22, 400, COR.tinta2, "right");
    texto(c, "Nota geral na minha régua", m, 114, 52, 800, COR.tinta, "left", Wd - 2 * m, 36);
    texto(c, "De 0 a 10, com os pesos que eu escolhi. A mesma régua vale para todos.", m, 152, 25, 400, COR.tinta2, "left", Wd - 2 * m, 18);
    linhaH(c, m, Wd - m, 172, COR.linha, 2);

    var colW = 650;
    blocoBarras(c, d, m, 184, colW, { rowH: 46, sepGap: 12, labW: 292, valW: 58, gap: 10, nomePx: 26, subPx: 19, valPx: 28, barH: 22, doisLinhas: false });

    var px = m + colW + 46, pw = Wd - m - px;
    texto(c, "Peso de cada pilar", px, 214, 26, 700, COR.tinta, "left", pw, 18);
    blocoPesos(c, d, px, 232, pw, 1, 34, 21, 5, 0);
    paragrafo(c, textoExtras(d), px, 527, pw, 19, 15, 400, COR.tinta2, 2, 23);

    linhaH(c, m, Wd - m, 560, COR.linha, 2);
    texto(c, "As notas mudam conforme os pesos. Veja a conta completa.", m, 596, 26, 700, COR.tinta, "left", 700, 18);
    texto(c, d.site + " · modelo " + d.versao, Wd - m, 596, 22, 400, COR.tinta2, "right", 400, 15);
  }

  function desenharV(cv, d) {
    var Wd = 1080, Hd = 1350, m = 72;
    cv.width = Wd; cv.height = Hd;
    var c = cv.getContext("2d");
    c.fillStyle = COR.fundo; c.fillRect(0, 0, Wd, Hd);
    c.fillStyle = COR.tinta; c.fillRect(0, 0, Wd, 12);
    texto(c, "BRASIL EM ANÁLISE", m, 84, 28, 700, COR.tinta2, "left");
    texto(c, d.data, Wd - m, 84, 28, 400, COR.tinta2, "right");
    texto(c, "Nota geral na minha régua", m, 172, 66, 800, COR.tinta, "left", Wd - 2 * m, 40);
    var y1 = paragrafo(c, "De 0 a 10, com os pesos que eu escolhi. A mesma régua vale para todos.", m, 226, Wd - 2 * m, 31, 22, 400, COR.tinta2, 2, 40);
    linhaH(c, m, Wd - m, y1 - 8, COR.linha, 2);

    var yb = blocoBarras(c, d, m, y1 + 14, Wd - 2 * m, { rowH: 74, sepGap: 20, labW: 340, valW: 76, gap: 14, nomePx: 34, subPx: 23, valPx: 36, barH: 28, doisLinhas: true });

    var yp = yb + 30;
    texto(c, "Peso de cada pilar", m, yp + 24, 32, 700, COR.tinta, "left", Wd - 2 * m, 22);
    blocoPesos(c, d, m, yp + 52, Wd - 2 * m, 2, 58, 26, 8, 48);
    var ye = yp + 52 + 4 * 58 + 6;
    paragrafo(c, textoExtras(d), m, ye + 18, Wd - 2 * m, 23, 17, 400, COR.tinta2, 2, 30);

    linhaH(c, m, Wd - m, 1246, COR.linha, 2);
    texto(c, "As notas mudam conforme os pesos. Veja a conta completa.", m, 1294, 31, 700, COR.tinta, "left", Wd - 2 * m, 20);
    texto(c, d.site + " · modelo " + d.versao, m, 1328, 24, 400, COR.tinta2, "left", Wd - 2 * m, 16);
  }

  function canvasParaBlob(cv) {
    return new Promise(function (resolve, reject) {
      function viaDataUrl() {
        try {
          var u = cv.toDataURL("image/png"), partes = u.split(","), bin = W.atob(partes[1]), n = bin.length, arr = new Uint8Array(n), i;
          for (i = 0; i < n; i++) { arr[i] = bin.charCodeAt(i); }
          resolve(new Blob([arr], { type: "image/png" }));
        } catch (e7) { reject(e7); }
      }
      if (typeof cv.toBlob === "function") {
        try {
          cv.toBlob(function (b) { if (b) { resolve(b); } else { viaDataUrl(); } }, "image/png");
          return;
        } catch (e8) { }
      }
      viaDataUrl();
    });
  }

  function cartaoDaRegua(opts) {
    opts = opts || {};
    var vert = (opts.formato === "v" || opts.formato === "vertical");
    return new Promise(function (resolve, reject) {
      try {
        var d = dadosDoCartao(opts);
        var cv = D.createElement("canvas");
        if (vert) { desenharV(cv, d); } else { desenharH(cv, d); }
        canvasParaBlob(cv).then(resolve, reject);
      } catch (e9) { reject(e9); }
    });
  }
  B.cartaoDaRegua = cartaoDaRegua;

  /* ---------- janela do cartão ---------- */
  var dlg = null;          // { fundo, caixa, ... }
  var abridor = null;
  var formato = "h";
  var blobAtual = null, urlAtual = null, geracao = 0;

  function revogar() {
    if (urlAtual) { try { W.URL.revokeObjectURL(urlAtual); } catch (e10) { } urlAtual = null; }
    blobAtual = null;
  }
  function nomeArquivo() { return "minha-regua-brasil-em-analise-" + (formato === "v" ? "vertical" : "horizontal") + ".png"; }

  function focaveis() {
    if (!dlg) { return []; }
    var lista = dlg.caixa.querySelectorAll("button, a[href], input, select, textarea, [tabindex]");
    var out = [], i;
    for (i = 0; i < lista.length; i++) {
      var n = lista[i];
      if (n.disabled || n.hidden || n.getAttribute("tabindex") === "-1") { continue; }
      if (n.offsetParent === null && n !== D.activeElement) { continue; }
      out.push(n);
    }
    return out;
  }
  function aoTeclar(ev) {
    if (!dlg || dlg.fundo.hidden) { return; }
    if (ev.key === "Escape" || ev.key === "Esc") { ev.preventDefault(); fecharCartao(); return; }
    if (ev.key === "Tab") {
      var f = focaveis();
      if (!f.length) { ev.preventDefault(); dlg.caixa.focus(); return; }
      var primeiro = f[0], ultimo = f[f.length - 1], at = D.activeElement;
      if (ev.shiftKey && (at === primeiro || at === dlg.caixa || !dlg.caixa.contains(at))) { ev.preventDefault(); ultimo.focus(); }
      else if (!ev.shiftKey && (at === ultimo || !dlg.caixa.contains(at))) { ev.preventDefault(); primeiro.focus(); }
    }
  }

  function montarJanela() {
    if (dlg) { return; }
    var fundo = el("div", "cp-fundo");
    fundo.id = "cp-fundo";
    fundo.hidden = true;
    var caixa = el("div", "cp-dlg");
    caixa.id = "cp-dlg";
    caixa.setAttribute("role", "dialog");
    caixa.setAttribute("aria-modal", "true");
    caixa.setAttribute("aria-labelledby", "cp-dlg-t");
    caixa.setAttribute("aria-describedby", "cp-dlg-d");
    caixa.tabIndex = -1;

    var cab = el("div", "cp-dlg-cab");
    var h = el("h2", "cp-dlg-t", "Cartão da minha régua");
    h.id = "cp-dlg-t";
    var x = el("button", "btn cp-btn cp-x", "Fechar");
    x.type = "button";
    x.setAttribute("aria-label", "Fechar a janela do cartão");
    cab.appendChild(h); cab.appendChild(x);

    var desc = el("p", "cp-txt", "A imagem é criada neste aparelho. Nada é enviado para servidores. As notas e os pesos são os que estão na tela agora.");
    desc.id = "cp-dlg-d";

    var fml = el("p", "cp-fmt-l", "Formato do cartão");
    fml.id = "cp-fmt-l";
    var fm = el("div", "cp-fmt");
    fm.setAttribute("role", "group");
    fm.setAttribute("aria-labelledby", "cp-fmt-l");
    var bh = el("button", "btn cp-btn cp-fmt-b", "Horizontal (1200 × 630)");
    bh.type = "button"; bh.setAttribute("data-f", "h");
    var bv = el("button", "btn cp-btn cp-fmt-b", "Vertical (1080 × 1350)");
    bv.type = "button"; bv.setAttribute("data-f", "v");
    fm.appendChild(bh); fm.appendChild(bv);

    var ac = el("div", "cp-acoes");
    var baixar = el("button", "btn primary cp-btn", "Baixar cartão");
    baixar.type = "button";
    var partilhar = el("button", "btn cp-btn", "Compartilhar imagem");
    partilhar.type = "button";
    partilhar.hidden = true;
    var fechar = el("button", "btn cp-btn", "Fechar");
    fechar.type = "button";
    ac.appendChild(baixar); ac.appendChild(partilhar); ac.appendChild(fechar);

    var msg = el("p", "cp-msg cp-msg-dlg");
    msg.setAttribute("aria-hidden", "true");

    var prev = el("div", "cp-prev");
    var img = el("img", "cp-img");
    img.alt = "";
    img.hidden = true;
    var carregando = el("p", "cp-carregando", "Criando o cartão...");
    prev.appendChild(img); prev.appendChild(carregando);

    caixa.appendChild(cab); caixa.appendChild(desc); caixa.appendChild(fml); caixa.appendChild(fm); caixa.appendChild(ac); caixa.appendChild(msg); caixa.appendChild(prev);
    fundo.appendChild(caixa);
    D.body.appendChild(fundo);

    dlg = { fundo: fundo, caixa: caixa, bh: bh, bv: bv, baixar: baixar, partilhar: partilhar, img: img, carregando: carregando, msg: msg };

    x.addEventListener("click", fecharCartao);
    fechar.addEventListener("click", fecharCartao);
    fundo.addEventListener("click", function (ev) { if (ev.target === fundo) { fecharCartao(); } });
    bh.addEventListener("click", function () { trocarFormato("h"); });
    bv.addEventListener("click", function () { trocarFormato("v"); });
    baixar.addEventListener("click", baixarCartao);
    partilhar.addEventListener("click", compartilharImagem);
    D.addEventListener("keydown", aoTeclar, true);
  }

  function marcarFormato() {
    dlg.bh.setAttribute("aria-pressed", formato === "h" ? "true" : "false");
    dlg.bv.setAttribute("aria-pressed", formato === "v" ? "true" : "false");
  }
  function msgDlg(t) {
    dizer(t);
    if (dlg) { dlg.msg.textContent = t; }
  }
  function gerarPrevia() {
    var minha = ++geracao;
    revogar();
    dlg.img.hidden = true;
    dlg.carregando.hidden = false;
    dlg.carregando.textContent = "Criando o cartão...";
    dlg.baixar.disabled = true;
    dlg.partilhar.hidden = true;
    var d = dadosDoCartao();
    cartaoDaRegua({ formato: formato }).then(function (blob) {
      if (minha !== geracao || !dlg || dlg.fundo.hidden) { return; }
      blobAtual = blob;
      try { urlAtual = W.URL.createObjectURL(blob); } catch (e11) { urlAtual = null; }
      if (urlAtual) {
        dlg.img.src = urlAtual;
        dlg.img.alt = descreverCartao(d);
        dlg.img.hidden = false;
        dlg.carregando.hidden = true;
      } else {
        dlg.carregando.textContent = "Não foi possível mostrar a prévia, mas você pode baixar o cartão.";
      }
      dlg.baixar.disabled = false;
      if (podeCompartilharArquivo(blob)) { dlg.partilhar.hidden = false; }
    }, function () {
      if (minha !== geracao || !dlg) { return; }
      dlg.carregando.textContent = "Não foi possível criar o cartão neste navegador.";
      msgDlg("Não foi possível criar o cartão neste navegador.");
    });
  }
  function trocarFormato(f) {
    if (f === formato) { return; }
    formato = f;
    marcarFormato();
    gerarPrevia();
    try { W.localStorage.setItem("bea_cartao_formato", f); } catch (e12) { }
  }
  function arquivoDe(blob) {
    try { return new W.File([blob], nomeArquivo(), { type: "image/png" }); } catch (e13) { return null; }
  }
  function podeCompartilharArquivo(blob) {
    var n = W.navigator;
    if (!n || typeof n.share !== "function" || typeof n.canShare !== "function") { return false; }
    var f = arquivoDe(blob);
    if (!f) { return false; }
    try { return !!n.canShare({ files: [f] }); } catch (e14) { return false; }
  }
  function baixarCartao() {
    if (!blobAtual) { return; }
    var u;
    try { u = W.URL.createObjectURL(blobAtual); } catch (e15) { msgDlg("Não foi possível baixar neste navegador."); return; }
    var a = D.createElement("a");
    a.href = u;
    a.download = nomeArquivo();
    a.rel = "noopener";
    a.style.display = "none";
    D.body.appendChild(a);
    a.click();
    D.body.removeChild(a);
    setTimeout(function () { try { W.URL.revokeObjectURL(u); } catch (e16) { } }, 4000);
    msgDlg("Cartão baixado: " + nomeArquivo() + ".");
  }
  function compartilharImagem() {
    if (!blobAtual) { return; }
    var f = arquivoDe(blobAtual);
    if (!f) { msgDlg("Não foi possível compartilhar a imagem. Use Baixar cartão."); return; }
    var p;
    try {
      p = W.navigator.share({ files: [f], title: "Brasil em Análise: a minha régua", text: "As notas mudam conforme os pesos. Veja a conta completa em " + enderecoSite() + "." });
    } catch (e17) { p = null; }
    if (p && typeof p.then === "function") {
      p.then(function () { msgDlg("Imagem compartilhada."); }, function (err) {
        if (err && err.name === "AbortError") { return; }
        msgDlg("Não foi possível compartilhar a imagem. Use Baixar cartão.");
      });
    } else {
      msgDlg("Não foi possível compartilhar a imagem. Use Baixar cartão.");
    }
  }
  function abrirCartao(origem) {
    montarJanela();
    abridor = origem || D.activeElement;
    try { var salvo = W.localStorage.getItem("bea_cartao_formato"); if (salvo === "h" || salvo === "v") { formato = salvo; } } catch (e18) { }
    marcarFormato();
    dlg.msg.textContent = "";
    dlg.fundo.hidden = false;
    D.documentElement.classList.add("cp-trava");
    dlg.caixa.scrollTop = 0;
    gerarPrevia();
    try { dlg.caixa.focus({ preventScroll: true }); } catch (e19) { dlg.caixa.focus(); }
    var primeiro = dlg.caixa.querySelector(".cp-x");
    if (primeiro) { try { primeiro.focus({ preventScroll: true }); } catch (e20) { primeiro.focus(); } }
  }
  function fecharCartao() {
    if (!dlg || dlg.fundo.hidden) { return; }
    geracao++;
    dlg.fundo.hidden = true;
    D.documentElement.classList.remove("cp-trava");
    dlg.img.removeAttribute("src");
    revogar();
    var o = abridor;
    abridor = null;
    if (o && typeof o.focus === "function" && D.documentElement.contains(o)) { try { o.focus(); } catch (e21) { } }
  }

  /* ---------- blocos nos encaixes ---------- */
  var seq = 0;
  function montarBloco(slotId, compacto) {
    var slot = D.getElementById(slotId);
    if (!slot) { return; }
    seq++;
    var id = "cp-bloco-" + seq;
    if (slot.querySelector(".cp-bloco")) { return; }
    var raiz = el("div", "cp-bloco" + (compacto ? " cp-compacto" : ""));
    raiz.id = id;
    raiz.setAttribute("role", "group");
    raiz.setAttribute("aria-labelledby", id + "-t");
    var t = el("p", "cp-titulo", "Compartilhe a sua régua");
    t.id = id + "-t";
    var tx = el("p", "cp-txt", "O link leva os seus pesos. Quem abrir vê as mesmas notas, e pode voltar aos pesos padrão.");
    var ac = el("div", "cp-acoes");
    var b1 = el("button", "btn cp-btn", "Copiar link da minha régua");
    b1.type = "button";
    var b2 = el("button", "btn cp-btn", "Compartilhar");
    b2.type = "button";
    var b3 = el("button", "btn cp-btn", "Criar cartão em imagem");
    b3.type = "button";
    b3.setAttribute("aria-haspopup", "dialog");
    ac.appendChild(b1); ac.appendChild(b2); ac.appendChild(b3);
    var msg = el("p", "cp-msg");
    msg.setAttribute("aria-hidden", "true");
    var manual = el("div", "cp-manual");
    manual.hidden = true;
    var lab = el("label", "cp-manual-l", "Link da minha régua (selecione e copie)");
    var ent = D.createElement("input");
    ent.type = "text";
    ent.readOnly = true;
    ent.className = "cp-manual-i";
    ent.id = id + "-url";
    lab.setAttribute("for", ent.id);
    ent.setAttribute("autocomplete", "off");
    ent.setAttribute("spellcheck", "false");
    ent.addEventListener("focus", function () { try { ent.select(); } catch (e22) { } });
    manual.appendChild(lab); manual.appendChild(ent);
    raiz.appendChild(t); raiz.appendChild(tx); raiz.appendChild(ac); raiz.appendChild(msg); raiz.appendChild(manual);
    slot.appendChild(raiz);
    b1.addEventListener("click", acaoCopiar);
    b2.addEventListener("click", acaoCompartilhar);
    b3.addEventListener("click", function () { abrirCartao(b3); });
    blocos.push({ raiz: raiz, manual: manual, entrada: ent });
  }

  /* ---------- faixa de régua compartilhada ---------- */
  var faixa = null;
  function descreverPesos(r, e) {
    var pw = r.pilW || e.pilW;
    var partes = KEYS.map(function (k) { return NOME[k] + " " + (Number(pw[k]) > 0 ? partePc(pw, k) + "%" : "fora"); });
    return partes.join(", ");
  }
  function fecharFaixa(msg) {
    if (!faixa) { return; }
    var f = faixa;
    faixa = null;
    if (f.parentNode) { f.parentNode.removeChild(f); }
    var main = D.getElementById("conteudo");
    if (main) { try { main.focus({ preventScroll: true }); } catch (e23) { } }
    if (msg) { dizer(msg); }
  }
  function mostrarFaixa(r, e) {
    var main = D.getElementById("conteudo");
    if (!main) { return; }
    var wrap = el("div", "wrap cp-faixa-wrap");
    wrap.id = "cp-faixa";
    var box = el("section", "cp-faixa");
    box.setAttribute("aria-labelledby", "cp-faixa-t");
    var p = el("p", "cp-faixa-txt");
    var forte = el("strong", "", "Você abriu uma régua compartilhada");
    forte.id = "cp-faixa-t";
    p.appendChild(forte);
    p.appendChild(D.createTextNode(" (pesos: " + descreverPesos(r, e) + ")."));
    box.appendChild(p);
    if (r.intW || r.forK != null) {
      var cur = B.estado();
      var q = el("p", "cp-faixa-sub", "Integridade: peso " + f2(cur.intW.c) + " dos casos e " + f2(cur.intW.w) + " do índice do Banco Mundial. Força política: " + f2(cur.forK) + ".");
      box.appendChild(q);
    }
    var ac = el("div", "cp-acoes");
    var padrao = el("button", "btn cp-btn", "Ver pesos padrão");
    padrao.type = "button";
    var manter = el("button", "btn primary cp-btn", "Manter");
    manter.type = "button";
    ac.appendChild(padrao); ac.appendChild(manter);
    box.appendChild(ac);
    wrap.appendChild(box);
    main.insertBefore(wrap, main.firstChild);
    faixa = wrap;
    padrao.addEventListener("click", function () {
      try { B.restaurarPesos(); } catch (e24) { }
      limparQuery();
      fecharFaixa("Pesos padrão restaurados.");
    });
    manter.addEventListener("click", function () {
      limparQuery();
      fecharFaixa("Régua mantida.");
    });
    wrap.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" || ev.key === "Esc") { limparQuery(); fecharFaixa("Régua mantida."); }
    });
  }

  function lerLink() {
    var r = lerRegua();
    if (!r) { return; }
    try { B.aplicarPesos(r); } catch (e25) { return; }
    mostrarFaixa(r, B.estado());
    /* se o visitante mexer nos pesos depois, o endereço deixa de representar a tela: tira a query */
    if (typeof B.on === "function") {
      B.on("update", function () { limparQuery(); });
    }
  }

  /* ---------- início ---------- */
  function iniciar() {
    garantirLive();
    montarBloco("slotHex", true);
    montarBloco("slotPesos", false);
    lerLink();
  }
  if (D.readyState === "loading") { D.addEventListener("DOMContentLoaded", iniciar); } else { iniciar(); }
})();
