/* Módulo quiz: "Qual é a sua régua?" (prefixo qz-).
   Doze dilemas, um por tela, com três respostas (A, B e "tanto faz"). Cada resposta soma ou subtrai pontos de pilares.
   Os pesos finais partem do padrão do site, são normalizados para somar 100 (mínimo 2, máximo 40 por pilar) e
   alimentam BEA.geral({pilW}) para mostrar a nota geral de cada governo na régua da pessoa.
   Usa só a API window.BEA. Sem rede, sem rastreamento, sem cookies. Progresso em localStorage (chave bea_quiz).
   Sintaxe segura para iOS 13+: sem "?.", sem "??", sem lookbehind. */
(function () {
  "use strict";

  var B = window.BEA;
  if (!B || typeof B.pilares !== "function" || typeof B.geral !== "function" || B.quizAtivo) { return; }
  B.quizAtivo = true;

  var D = document, W = window;
  var PTS = 5;                       // pontos de cada resposta (ganha em um pilar, perde no outro)
  var MIN = 2, MAX = 40;             // limites por pilar
  var KEY = "bea_quiz";
  var MINUS = "−";
  var KEYS = ["eco", "pov", "soc", "ser", "amb", "fut", "prl", "int"];
  var NOME = {};                     // nome de cada pilar, vindo do site
  B.pilares().forEach(function (p) { NOME[p.k] = p.t; });
  KEYS.forEach(function (k) { if (!NOME[k]) { NOME[k] = k; } });

  /* ---------- perguntas ---------- */
  /* Cada dilema coloca dois pilares frente a frente. A: +5 em a.k e -5 em b.k; B: o inverso; "tanto faz": nada muda.
     Todo pilar aparece em 3 dilemas, com o mesmo total de pontos a ganhar e a perder (15 e 15). */
  var Q = [
    { tt: "Crescer ou igualar", a: "eco", b: "pov",
      sa: "Economia cresce mais", sb: "Desigualdade cai mais",
      ta: "Fazer a economia crescer mais, mesmo que a desigualdade caia devagar.",
      tb: "Reduzir a desigualdade mais depressa, mesmo que a economia cresça menos." },
    { tt: "Corrupção ou direitos", a: "int", b: "soc",
      sa: "Poucos casos de corrupção", sb: "Mais direitos para minorias",
      ta: "Julgar um governo mais pelo número de casos de corrupção que ele teve.",
      tb: "Julgar um governo mais pelo que ele fez pelos direitos de mulheres e de minorias." },
    { tt: "Dívida ou crescimento", a: "fut", b: "eco",
      sa: "Dívida sob controle", sb: "Economia anda agora",
      ta: "Manter a dívida sob controle, mesmo que a economia ande mais devagar agora.",
      tb: "Gastar mais para a economia andar agora, mesmo que a dívida cresça." },
    { tt: "Honestidade ou serviços", a: "int", b: "ser",
      sa: "Sem corrupção", sb: "Serviços melhores",
      ta: "Preferir um governo sem casos de corrupção, mesmo que os serviços públicos melhorem pouco.",
      tb: "Preferir um governo que melhora bastante os serviços públicos, mesmo que tenha casos de corrupção." },
    { tt: "Natureza ou renda", a: "amb", b: "eco",
      sa: "Proteger a natureza", sb: "Mais renda e emprego",
      ta: "Proteger mais as florestas e os rios, mesmo que algumas atividades gerem menos renda e emprego.",
      tb: "Gerar mais renda e emprego, mesmo que a pressão sobre a natureza aumente." },
    { tt: "Promessas ou direitos", a: "prl", b: "soc",
      sa: "Cumprir promessas", sb: "Avançar em direitos",
      ta: "Preferir o governo que cumpre o que prometeu na campanha, mesmo que avance menos em direitos de mulheres e de minorias.",
      tb: "Preferir o governo que avança em direitos de mulheres e de minorias, mesmo que cumpra menos do que prometeu." },
    { tt: "Renda direta ou serviços", a: "pov", b: "ser",
      sa: "Dinheiro para as famílias", sb: "Serviços para todos",
      ta: "Dar mais dinheiro direto às famílias de menor renda.",
      tb: "Investir mais em saúde, educação e segurança para toda a população." },
    { tt: "Natureza ou corrupção", a: "amb", b: "int",
      sa: "Menos desmatamento", sb: "Sem corrupção",
      ta: "Preferir um governo que reduz o desmatamento, mesmo que tenha casos de corrupção.",
      tb: "Preferir um governo sem casos de corrupção, mesmo que o desmatamento caia pouco." },
    { tt: "Gastar hoje ou guardar", a: "ser", b: "fut",
      sa: "Gastar em serviços hoje", sb: "Contas em ordem",
      ta: "Gastar mais hoje em saúde, educação e segurança, mesmo que sobrem contas maiores para os próximos governos.",
      tb: "Deixar as contas em ordem para os próximos governos, mesmo que isso limite os gastos de hoje em saúde, educação e segurança." },
    { tt: "Direitos ou pobreza", a: "soc", b: "pov",
      sa: "Proteger minorias", sb: "Reduzir a pobreza",
      ta: "Dar prioridade a leis e programas de proteção de mulheres e de minorias.",
      tb: "Dar prioridade a reduzir a pobreza de toda a população, sem foco em grupos." },
    { tt: "Contas ou promessas", a: "fut", b: "prl",
      sa: "Contas equilibradas", sb: "Cumprir promessas",
      ta: "Manter as contas equilibradas para o futuro, mesmo que seja preciso deixar promessas sem cumprir.",
      tb: "Cumprir as promessas feitas, mesmo que as contas para o futuro fiquem mais apertadas." },
    { tt: "Promessas ou natureza", a: "prl", b: "amb",
      sa: "Cumprir promessas", sb: "Proteger a natureza",
      ta: "Cumprir as promessas de campanha, mesmo que a proteção do meio ambiente fique em segundo plano.",
      tb: "Proteger o meio ambiente, mesmo que isso leve a cumprir menos promessas de campanha." }
  ];
  var N = Q.length;

  /* pontos de uma resposta (0 = A, 1 = B, 2 = tanto faz) -> objeto {pilar: pontos} */
  function pontos(q, r) {
    var o = {};
    if (r === 0) { o[q.a] = PTS; o[q.b] = -PTS; }
    else if (r === 1) { o[q.a] = -PTS; o[q.b] = PTS; }
    return o;
  }

  /* ---------- utilidades ---------- */
  function el(tag, cls, txt) {
    var e = D.createElement(tag);
    if (cls) { e.className = cls; }
    if (txt != null) { e.textContent = txt; }
    return e;
  }
  function limpar(n) { while (n.firstChild) { n.removeChild(n.firstChild); } }
  function sinal(n) { return n > 0 ? "+" + n : (n < 0 ? MINUS + Math.abs(n) : "0"); }
  function nota1(v) {
    if (v == null || !isFinite(v)) { return "—"; }
    try { return v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
    catch (e) { return (Math.round(v * 10) / 10).toFixed(1).replace(".", ","); }
  }
  function lerLS(k) { try { return W.localStorage.getItem(k); } catch (e) { return null; } }
  function gravarLS(k, v) { try { W.localStorage.setItem(k, v); } catch (e) { } }
  function tirarLS(k) { try { W.localStorage.removeItem(k); } catch (e) { } }

  /* ---------- estado ---------- */
  var ans = [], cur = 0, tela = "intro";   // tela: intro | q | res
  var voltarRes = false;                   // veio do resultado para mudar uma resposta
  var root = null, live = null, montado = false, emPagina = false;
  var resRefs = null;                      // partes do resultado que se atualizam sozinhas

  function zerar() { ans = []; for (var i = 0; i < N; i++) { ans.push(null); } cur = 0; }
  function respondidas() { var n = 0; ans.forEach(function (a) { if (a !== null) { n++; } }); return n; }
  function completo() { return respondidas() === N; }
  function primeiraVazia() { for (var i = 0; i < N; i++) { if (ans[i] === null) { return i; } } return N - 1; }

  function salvar() {
    gravarLS(KEY, JSON.stringify({ v: 1, a: ans, i: cur }));
  }
  function carregar() {
    zerar();
    var s = lerLS(KEY);
    if (!s) { return; }
    try {
      var o = JSON.parse(s);
      if (o && o.a && o.a.length === N) {
        var ok = true;
        o.a.forEach(function (v) { if (v !== null && v !== 0 && v !== 1 && v !== 2) { ok = false; } });
        if (ok) {
          ans = o.a.slice();
          cur = (typeof o.i === "number" && o.i >= 0 && o.i < N) ? Math.floor(o.i) : primeiraVazia();
        }
      }
    } catch (e) { zerar(); }
  }

  /* ---------- pesos ---------- */
  function padrao() {
    var e = B.estado ? B.estado() : null;
    var d = e && e.pilW_padrao ? e.pilW_padrao : { eco: 18, pov: 14, soc: 10, ser: 18, amb: 8, fut: 14, prl: 6, int: 12 };
    var o = {};
    KEYS.forEach(function (k) { o[k] = typeof d[k] === "number" ? d[k] : 0; });
    return o;
  }

  /* normaliza para somar 100, com mínimo 2 e máximo 40 por pilar, em inteiros */
  function normalizar(raw) {
    var fixo = {}, val = {}, guarda = 0;
    while (guarda++ < 20) {
      var sf = 0, nf = 0, sx = 0;
      KEYS.forEach(function (k) { if (fixo[k] != null) { sx += fixo[k]; } else { sf += raw[k]; nf++; } });
      var alvo = 100 - sx;
      KEYS.forEach(function (k) {
        if (fixo[k] != null) { val[k] = fixo[k]; }
        else { val[k] = sf > 0 ? raw[k] * alvo / sf : alvo / nf; }
      });
      var pior = null, dist = 0;
      KEYS.forEach(function (k) {
        if (fixo[k] != null) { return; }
        var d = 0;
        if (val[k] < MIN) { d = MIN - val[k]; } else if (val[k] > MAX) { d = val[k] - MAX; }
        if (d > dist) { dist = d; pior = k; }
      });
      if (!pior) { break; }
      fixo[pior] = val[pior] < MIN ? MIN : MAX;
    }
    var out = {}, soma = 0, livres = [];
    KEYS.forEach(function (k) {
      if (fixo[k] != null) { out[k] = fixo[k]; } else { out[k] = Math.floor(val[k]); livres.push({ k: k, f: val[k] - Math.floor(val[k]) }); }
      soma += out[k];
    });
    livres.sort(function (x, y) { return y.f - x.f; });
    var i = 0, rest = 100 - soma;
    while (rest > 0 && livres.length && i < 200) {
      var it = livres[i % livres.length];
      if (out[it.k] < MAX) { out[it.k]++; rest--; }
      i++;
    }
    return out;
  }

  function pesosDe(resp) {
    var base = padrao(), raw = {};
    KEYS.forEach(function (k) { raw[k] = base[k]; });
    for (var i = 0; i < N; i++) {
      if (resp[i] === null || resp[i] === undefined) { continue; }
      var p = pontos(Q[i], resp[i]);
      for (var k in p) { if (p.hasOwnProperty(k)) { raw[k] += p[k]; } }
    }
    KEYS.forEach(function (k) { if (raw[k] < 0) { raw[k] = 0; } });
    return normalizar(raw);
  }

  /* ---------- notas ---------- */
  function anoIni(a) { var m = String(a || "").match(/\d{4}/); return m ? parseInt(m[0], 10) : 0; }

  /* linhas em ordem cronológica; a última é "ptall" (PT, todos) quando existir */
  function linhas(pilW) {
    var rows = B.geral({ pilW: pilW }) || [], gov = [], tot = null;
    rows.forEach(function (r, i) {
      r._i = i;
      if (r.id === "ptall") { tot = r; } else { gov.push(r); }
    });
    gov.sort(function (x, y) { var d = anoIni(x.anos) - anoIni(y.anos); return d !== 0 ? d : x._i - y._i; });
    return { gov: gov, tot: tot };
  }
  function posicoes(gov) {
    var pos = {};
    gov.forEach(function (g) {
      if (g.nota == null) { pos[g.id] = null; return; }
      var n = 1;
      gov.forEach(function (o) { if (o !== g && o.nota != null && o.nota > g.nota + 1e-9) { n++; } });
      pos[g.id] = n;
    });
    return pos;
  }
  function notaLocal(p, w) {
    var sw = 0, ss = 0;
    KEYS.forEach(function (k) { var v = p[k]; if (v != null && w[k] > 0) { sw += w[k]; ss += w[k] * v; } });
    return sw ? ss / sw : null;
  }
  function lider(gov, w, usarLocal) {
    var best = null, bn = -Infinity;
    gov.forEach(function (g) {
      var n = usarLocal ? notaLocal(g.p, w) : g.nota;
      if (n != null && n > bn + 1e-12) { bn = n; best = g; }
    });
    return best;
  }

  /* o primeiro colocado muda se 1 ou 2 respostas mudarem? Testa todas as variações (288 de 12 perguntas). */
  function robustez(base, w, gov) {
    var local = true;
    gov.forEach(function (g) { var n = notaLocal(g.p, w); if (g.nota == null ? n != null : (n == null || Math.abs(n - g.nota) > 1e-6)) { local = false; } });
    var topo = lider(gov, w, true);
    if (!topo) { return null; }
    var res = { topo: topo, n1: 0, c1: 0, n2: 0, c2: 0, outros: {}, falha: false };
    var ids = {};
    function testa(v, nivel) {
      var wv = pesosDe(v), l;
      if (local) { l = lider(gov, wv, true); }
      else {
        var rr = linhas(wv).gov; l = lider(rr, wv, false);
      }
      if (nivel === 1) { res.n1++; } else { res.n2++; }
      if (l && l.id !== topo.id) {
        if (nivel === 1) { res.c1++; } else { res.c2++; }
        ids[l.id] = l.nome;
      }
    }
    var i, j, a, b, v;
    for (i = 0; i < N; i++) {
      for (a = 0; a < 3; a++) {
        if (a === base[i]) { continue; }
        v = base.slice(); v[i] = a; testa(v, 1);
        for (j = i + 1; j < N; j++) {
          for (b = 0; b < 3; b++) {
            if (b === base[j]) { continue; }
            var v2 = v.slice(); v2[j] = b; testa(v2, 2);
          }
        }
      }
    }
    res.outros = ids;
    return res;
  }

  /* ---------- link da régua ---------- */
  function montarLink(w) {
    var e = B.estado ? B.estado() : { intW: { c: 0.7, w: 0.3 }, forK: 0.25 };
    try {
      if (typeof B.linkDaRegua === "function") {
        var l = B.linkDaRegua(w, e.intW, e.forK);
        if (typeof l === "string" && l) { return l; }
      }
    } catch (x) { }
    var base = String(W.location.href).split("#")[0].split("?")[0];
    var pc = function (v, d) { return Math.max(0, Math.min(100, Math.round((typeof v === "number" ? v : d) * 100))); };
    var ww = KEYS.map(function (k) { return w[k]; }).join("-");
    return base + "?w=" + ww + "&iw=" + pc(e.intW && e.intW.c, 0.7) + "-" + pc(e.intW && e.intW.w, 0.3) + "&fk=" + pc(e.forK, 0.25) + "#inicio";
  }

  /* ---------- peças de tela ---------- */
  function avisoBox() {
    var d = el("p", "qz-aviso");
    d.setAttribute("role", "note");
    d.appendChild(el("strong", null, "Aviso. "));
    d.appendChild(D.createTextNode("O quiz não diz em quem votar nem quem é melhor: ele só reorganiza os mesmos dados com os pesos que você escolheu."));
    return d;
  }

  function anunciar(msg) {
    if (!live) { return; }
    live.textContent = "";
    setTimeout(function () { live.textContent = msg; }, 60);
  }

  function textoOpcao(i, r) {
    var q = Q[i];
    return r === 0 ? q.ta : (r === 1 ? q.tb : "Tanto faz. Os dois lados me parecem igualmente bons.");
  }

  /* tabela completa: pergunta -> resposta -> pilar e pontos */
  function tabelaCalculo(resp) {
    var wrap = el("div", "qz-tblwrap");
    var t = el("table", "qz-tbl");
    var cap = el("caption", "qz-cap", "Cada pergunta, cada resposta e os pontos que ela muda");
    t.appendChild(cap);
    var th = el("thead"), tr = el("tr");
    ["Pergunta", "Resposta", "Pilares e pontos"].forEach(function (h) { var c = el("th", null, h); c.setAttribute("scope", "col"); tr.appendChild(c); });
    th.appendChild(tr); t.appendChild(th);
    var tb = el("tbody");
    Q.forEach(function (q, i) {
      for (var r = 0; r < 3; r++) {
        var row = el("tr", (resp && resp[i] === r) ? "qz-mine" : "");
        if (r === 0) {
          var c0 = el("th", "qz-t-q");
          c0.setAttribute("scope", "rowgroup"); c0.setAttribute("rowspan", "3");
          c0.appendChild(el("span", "qz-t-n", String(i + 1) + "."));
          c0.appendChild(D.createTextNode(" " + q.tt));
          row.appendChild(c0);
        }
        var c1 = el("td", "qz-t-r");
        var lab = r === 0 ? "A" : (r === 1 ? "B" : "Tanto faz");
        c1.appendChild(el("strong", null, lab));
        c1.appendChild(D.createTextNode(r === 0 ? ": " + q.sa : (r === 1 ? ": " + q.sb : "")));
        if (resp && resp[i] === r) { c1.appendChild(el("span", "qz-t-sua", " (sua resposta)")); }
        row.appendChild(c1);
        var c2 = el("td", "qz-t-p");
        var p = pontos(q, r), partes = [];
        for (var k in p) { if (p.hasOwnProperty(k)) { partes.push(k); } }
        if (!partes.length) { c2.textContent = "Nenhum pilar muda (0)"; }
        else {
          partes.sort(function (x, y) { return p[y] - p[x]; });
          partes.forEach(function (k2) {
            var s = el("span", "qz-pp");
            s.appendChild(D.createTextNode(NOME[k2] + " "));
            s.appendChild(el("b", null, sinal(p[k2])));
            c2.appendChild(s);
          });
        }
        row.appendChild(c2);
        tb.appendChild(row);
      }
    });
    t.appendChild(tb); wrap.appendChild(t);
    return wrap;
  }

  /* equilíbrio por pilar: quantas perguntas, quanto pode ganhar e perder */
  function tabelaEquilibrio() {
    var wrap = el("div", "qz-tblwrap");
    var t = el("table", "qz-tbl qz-tbl-eq");
    t.appendChild(el("caption", "qz-cap", "Equilíbrio de cada pilar: o que pode ganhar é igual ao que pode perder"));
    var th = el("thead"), tr = el("tr");
    ["Pilar", "Perguntas", "Pode ganhar", "Pode perder"].forEach(function (h) { var c = el("th", null, h); c.setAttribute("scope", "col"); tr.appendChild(c); });
    th.appendChild(tr); t.appendChild(th);
    var tb = el("tbody");
    KEYS.forEach(function (k) {
      var n = 0, g = 0, l = 0;
      Q.forEach(function (q) {
        if (q.a === k || q.b === k) { n++; var a = pontos(q, 0)[k], b = pontos(q, 1)[k]; g += Math.max(a, b); l += Math.min(a, b); }
      });
      var r = el("tr");
      var c0 = el("th", null, NOME[k]); c0.setAttribute("scope", "row"); r.appendChild(c0);
      r.appendChild(el("td", "qz-n", String(n)));
      r.appendChild(el("td", "qz-n", sinal(g)));
      r.appendChild(el("td", "qz-n", sinal(l)));
      tb.appendChild(r);
    });
    t.appendChild(tb); wrap.appendChild(t);
    return wrap;
  }

  function secaoCalculo(resp) {
    var det = el("details", "qz-calc");
    var sm = el("summary", null, "Como o quiz calcula");
    det.appendChild(sm);
    var d = padrao();
    var ol = el("ol", "qz-passos");
    ol.appendChild(el("li", null, "O ponto de partida são os pesos padrão do site: " + KEYS.map(function (k) { return NOME[k] + " " + d[k]; }).join(", ") + "."));
    ol.appendChild(el("li", null, "Cada dilema põe dois pilares frente a frente. Quem responde A ou B dá " + PTS + " pontos a um pilar e tira " + PTS + " do outro. “Tanto faz” não muda nada."));
    ol.appendChild(el("li", null, "Os pontos são somados aos pesos de partida. Se algum peso ficar abaixo de zero, ele vira zero nesta etapa."));
    ol.appendChild(el("li", null, "Os pesos são ajustados para somar 100, em números inteiros. Nenhum pilar fica com menos de " + MIN + " nem com mais de " + MAX + "."));
    ol.appendChild(el("li", null, "A nota geral de cada governo é a mesma do site: a média das notas dos oito pilares, cada uma multiplicada pelo seu peso. As notas dos pilares não mudam; só os pesos mudam."));
    det.appendChild(ol);
    det.appendChild(el("p", "qz-note", "Todo pilar aparece em três dilemas. Em cada pilar, o máximo que se pode ganhar é igual ao máximo que se pode perder."));
    det.appendChild(tabelaEquilibrio());
    det.appendChild(tabelaCalculo(resp));
    return det;
  }

  /* ---------- telas ---------- */
  function cabecalho() {
    var h = el("header", "wrap page-head");
    h.appendChild(el("p", "eyebrow", "Quiz"));
    h.appendChild(el("h1", null, "Qual é a sua régua?"));
    h.appendChild(el("p", "dek", "Doze dilemas curtos mostram quanto peso você dá a cada tema. Depois, o site refaz a nota de cada governo com a sua régua. A mesma régua vale para todos."));
    return h;
  }

  function foco(n) {
    if (!n) { return; }
    n.setAttribute("tabindex", "-1");
    try { n.focus(); } catch (e) { }
  }

  function telaIntro() {
    limpar(root);
    var box = el("div", "qz-card");
    var h = el("h2", "qz-h", "Antes de começar");
    box.appendChild(h);
    box.appendChild(el("p", null, "São " + N + " perguntas. Em cada uma, você escolhe entre dois lados ou marca “tanto faz”. Não há resposta certa, e os dois lados de cada dilema têm a mesma força."));
    box.appendChild(el("p", null, "Suas respostas ficam só neste aparelho, no navegador. Nada é enviado a lugar nenhum."));
    box.appendChild(avisoBox());
    var n = respondidas();
    var bar = el("div", "qz-actions");
    if (n > 0 && n < N) {
      var c = el("button", "btn primary qz-btn", "Continuar (pergunta " + (primeiraVazia() + 1) + " de " + N + ")");
      c.type = "button";
      c.addEventListener("click", function () { cur = primeiraVazia(); tela = "q"; voltarRes = false; render(true); });
      bar.appendChild(c);
      var r = el("button", "btn qz-btn", "Recomeçar");
      r.type = "button";
      r.addEventListener("click", recomecar);
      bar.appendChild(r);
    } else if (n === N) {
      var v = el("button", "btn primary qz-btn", "Ver meu resultado");
      v.type = "button";
      v.addEventListener("click", function () { tela = "res"; render(true); });
      bar.appendChild(v);
      var r2 = el("button", "btn qz-btn", "Refazer");
      r2.type = "button";
      r2.addEventListener("click", recomecar);
      bar.appendChild(r2);
    } else {
      var s = el("button", "btn primary qz-btn", "Começar o quiz");
      s.type = "button";
      s.addEventListener("click", function () { cur = 0; tela = "q"; voltarRes = false; render(true); });
      bar.appendChild(s);
    }
    box.appendChild(bar);
    root.appendChild(box);
    root.appendChild(secaoCalculo(null));
    return h;
  }

  function recomecar() {
    zerar(); tirarLS(KEY); tela = "q"; voltarRes = false; cur = 0;
    render(true);
    anunciar("Quiz reiniciado. Pergunta 1 de " + N + ".");
  }

  function responder(r) {
    ans[cur] = r;
    if (voltarRes && completo()) { tela = "res"; voltarRes = false; }
    else if (cur < N - 1) { cur++; }
    else if (completo()) { tela = "res"; voltarRes = false; }
    else { cur = primeiraVazia(); }
    salvar();
    render(true);
  }

  function telaPergunta() {
    limpar(root);
    var q = Q[cur];
    var card = el("div", "qz-card");
    var top = el("div", "qz-top");
    var st = el("p", "qz-step", "Pergunta " + (cur + 1) + " de " + N);
    top.appendChild(st);
    var prog = el("div", "qz-prog");
    prog.setAttribute("role", "progressbar");
    prog.setAttribute("aria-label", "Progresso do quiz");
    prog.setAttribute("aria-valuemin", "0");
    prog.setAttribute("aria-valuemax", String(N));
    prog.setAttribute("aria-valuenow", String(cur + 1));
    prog.setAttribute("aria-valuetext", "Pergunta " + (cur + 1) + " de " + N);
    var fill = el("span", "qz-prog-fill");
    fill.style.width = Math.round((cur + 1) / N * 100) + "%";
    prog.appendChild(fill);
    top.appendChild(prog);
    card.appendChild(top);

    var h = el("h2", "qz-h", q.tt);
    h.id = "qz-q-h";
    card.appendChild(h);
    card.appendChild(el("p", "qz-ask", "Qual lado pesa mais para você? Se os dois pesam igual, marque “tanto faz”."));

    var grp = el("div", "qz-opts");
    grp.setAttribute("role", "group");
    grp.setAttribute("aria-labelledby", "qz-q-h");
    [0, 1, 2].forEach(function (r) {
      var b = el("button", "qz-opt" + (r === 2 ? " qz-opt-tf" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", ans[cur] === r ? "true" : "false");
      var lab = el("span", "qz-opt-l", r === 0 ? "A" : (r === 1 ? "B" : "="));
      lab.setAttribute("aria-hidden", "true");
      b.appendChild(lab);
      var tx = el("span", "qz-opt-t", "");
      var sr = el("span", "qz-sr", r === 0 ? "Resposta A. " : (r === 1 ? "Resposta B. " : "Resposta: "));
      tx.appendChild(sr);
      tx.appendChild(D.createTextNode(textoOpcao(cur, r)));
      b.appendChild(tx);
      b.addEventListener("click", function () { responder(r); });
      grp.appendChild(b);
    });
    card.appendChild(grp);

    var bar = el("div", "qz-actions qz-nav");
    var vol = el("button", "btn qz-btn", cur > 0 ? "Voltar" : "Início");
    vol.type = "button";
    vol.addEventListener("click", function () {
      if (cur > 0) { cur--; voltarRes = false; salvar(); render(true); }
      else { tela = "intro"; render(true); }
    });
    bar.appendChild(vol);
    if (voltarRes && completo()) {
      var vr = el("button", "btn qz-btn", "Ver resultado");
      vr.type = "button";
      vr.addEventListener("click", function () { tela = "res"; voltarRes = false; render(true); });
      bar.appendChild(vr);
    } else if (ans[cur] !== null && cur < N - 1) {
      var pu = el("button", "btn qz-btn", "Manter e seguir");
      pu.type = "button";
      pu.addEventListener("click", function () { cur++; salvar(); render(true); });
      bar.appendChild(pu);
    }
    card.appendChild(bar);
    root.appendChild(card);
    return h;
  }

  /* barras de peso */
  function blocoPesos(w) {
    var d = padrao();
    var sec = el("section", "qz-sec");
    sec.appendChild(el("h3", "qz-h3", "Seus pesos"));
    sec.appendChild(el("p", "qz-note", "Cada pilar recebe uma parte de 100. A marca vertical mostra o peso padrão do site."));
    var ul = el("ul", "qz-bars");
    var ord = KEYS.slice().sort(function (a, b) { return w[b] - w[a]; });
    ord.forEach(function (k) {
      var li = el("li", "qz-bar");
      var head = el("div", "qz-bar-h");
      head.appendChild(el("span", "qz-bar-n", NOME[k]));
      head.appendChild(el("b", "qz-bar-v", w[k] + "%"));
      li.appendChild(head);
      var tr = el("div", "qz-track");
      tr.setAttribute("aria-hidden", "true");
      var f = el("span", "qz-fill"); f.style.width = (w[k] / MAX * 100) + "%";
      var m = el("span", "qz-mark"); m.style.left = (d[k] / MAX * 100) + "%";
      tr.appendChild(f); tr.appendChild(m);
      li.appendChild(tr);
      var df = w[k] - d[k];
      li.appendChild(el("span", "qz-bar-d", df === 0 ? "Igual ao padrão (" + d[k] + "%)" : (df > 0 ? "+" + df : MINUS + Math.abs(df)) + " ponto" + (Math.abs(df) === 1 ? "" : "s") + " em relação ao padrão (" + d[k] + "%)"));
      ul.appendChild(li);
    });
    sec.appendChild(ul);
    return sec;
  }

  function blocoNotas(w) {
    var L = linhas(w), D0 = linhas(d0());
    var pos = posicoes(L.gov), pad = posicoes(D0.gov);
    var sec = el("section", "qz-sec");
    sec.appendChild(el("h3", "qz-h3", "A nota de cada governo na sua régua"));
    sec.appendChild(el("p", "qz-note", "Em ordem cronológica. A posição compara só os governos, do mais alto ao mais baixo."));
    var wrap = el("div", "qz-tblwrap");
    var t = el("table", "qz-tbl qz-tbl-n");
    t.appendChild(el("caption", "qz-sr", "Nota geral de 0 a 10 de cada governo com os seus pesos"));
    var th = el("thead"), tr = el("tr");
    [["Governo", ""], ["Nota", "qz-n"], ["Posição", "qz-n"], ["Posição com pesos padrão", "qz-n"]].forEach(function (h) {
      var c = el("th", h[1], h[0]); c.setAttribute("scope", "col"); tr.appendChild(c);
    });
    th.appendChild(tr); t.appendChild(th);
    var tb = el("tbody");
    L.gov.forEach(function (g) {
      var r = el("tr", pos[g.id] === 1 ? "qz-first" : "");
      var c0 = el("th", "qz-gv"); c0.setAttribute("scope", "row");
      c0.appendChild(el("span", "qz-gv-n", g.nome));
      c0.appendChild(el("span", "qz-gv-s", g.partido + ", " + g.anos));
      r.appendChild(c0);
      var c1 = el("td", "qz-n");
      c1.appendChild(el("b", "qz-nota", nota1(g.nota)));
      var bar = el("span", "qz-nbar"); bar.setAttribute("aria-hidden", "true");
      var bf = el("span", "qz-nbar-f"); bf.style.width = (g.nota == null ? 0 : Math.max(0, Math.min(100, g.nota * 10))) + "%";
      bar.appendChild(bf); c1.appendChild(bar);
      r.appendChild(c1);
      r.appendChild(el("td", "qz-n", pos[g.id] == null ? "—" : pos[g.id] + "º"));
      r.appendChild(el("td", "qz-n qz-pad", pad[g.id] == null ? "—" : pad[g.id] + "º"));
      tb.appendChild(r);
    });
    if (L.tot) {
      var rt = el("tr", "qz-tot");
      var ct = el("th", "qz-gv"); ct.setAttribute("scope", "row");
      ct.appendChild(el("span", "qz-gv-n", L.tot.nome));
      ct.appendChild(el("span", "qz-gv-s", "média dos governos do PT, pelo tempo de cada um"));
      rt.appendChild(ct);
      var cn = el("td", "qz-n");
      cn.appendChild(el("b", "qz-nota", nota1(L.tot.nota)));
      var b2 = el("span", "qz-nbar"); b2.setAttribute("aria-hidden", "true");
      var f2 = el("span", "qz-nbar-f"); f2.style.width = (L.tot.nota == null ? 0 : Math.max(0, Math.min(100, L.tot.nota * 10))) + "%";
      b2.appendChild(f2); cn.appendChild(b2);
      rt.appendChild(cn);
      var cx = el("td", "qz-n qz-fora", "fora do ranking");
      cx.setAttribute("colspan", "2");
      rt.appendChild(cx);
      tb.appendChild(rt);
    }
    t.appendChild(tb); wrap.appendChild(t); sec.appendChild(wrap);
    sec.appendChild(el("p", "qz-note", "Posição com pesos padrão: ordem que os governos têm quando os oito pilares usam os pesos de partida do site."));
    return { sec: sec, L: L, pos: pos };
  }
  function d0() { return padrao(); }

  function blocoRobustez(w, L) {
    var sec = el("section", "qz-sec");
    sec.appendChild(el("h3", "qz-h3", "Esse resultado é firme?"));
    var r = null;
    try { r = robustez(ans, w, L.gov); } catch (e) { r = null; }
    var p = el("p", "qz-rob");
    if (!r) { p.textContent = "Não foi possível calcular a firmeza do resultado agora."; sec.appendChild(p); return sec; }
    var tot = r.n1 + r.n2, mud = r.c1 + r.c2;
    var seg = L.gov.filter(function (g) { return g.id !== r.topo.id && g.nota != null; }).sort(function (a, b) { return b.nota - a.nota; })[0];
    var dif = seg ? r.topo.nota - seg.nota : null;
    if (mud === 0) {
      p.appendChild(el("b", "qz-rob-t", "Estável. "));
      p.appendChild(D.createTextNode("Testamos todas as formas de mudar 1 ou 2 respostas (" + tot + " combinações). Em nenhuma delas o primeiro colocado deixa de ser " + r.topo.nome + "."));
    } else {
      p.appendChild(el("b", "qz-rob-t", "Sensível. "));
      var nomes = [];
      for (var id in r.outros) { if (r.outros.hasOwnProperty(id)) { nomes.push(r.outros[id]); } }
      p.appendChild(D.createTextNode("Testamos todas as formas de mudar 1 ou 2 respostas (" + tot + " combinações). O primeiro colocado muda em " + mud + " delas: " + r.c1 + " de " + r.n1 + " mudando 1 resposta e " + r.c2 + " de " + r.n2 + " mudando 2. Poderiam chegar ao topo: " + nomes.join(", ") + "."));
    }
    sec.appendChild(p);
    if (dif != null) {
      sec.appendChild(el("p", "qz-note", "Primeiro colocado agora: " + r.topo.nome + " (" + nota1(r.topo.nota) + "). Diferença para o segundo, " + seg.nome + ": " + nota1(dif) + " ponto" + (nota1(dif) === "1,0" ? "" : "s") + "."));
    }
    return sec;
  }

  function telaResultado() {
    limpar(root);
    var w = pesosDe(ans);
    var card = el("div", "qz-card");
    var resumo = el("div", "qz-resumo");
    resumo.setAttribute("role", "region");
    resumo.setAttribute("aria-live", "polite");
    resumo.setAttribute("aria-label", "Resultado do quiz");
    var h = el("h2", "qz-h", "Sua régua");
    h.id = "qz-res-h";
    resumo.appendChild(h);
    var ord = KEYS.slice().sort(function (a, b) { return w[b] - w[a]; });
    var topo3 = ord.slice(0, 3).map(function (k) { return NOME[k] + " (" + w[k] + "%)"; });
    resumo.appendChild(el("p", "qz-lead", "Os temas que mais pesam na sua régua: " + topo3.join(", ") + "."));
    card.appendChild(resumo);
    card.appendChild(avisoBox());

    card.appendChild(blocoPesos(w));
    var nb = blocoNotas(w);
    var holderN = el("div", "qz-hold");
    holderN.appendChild(nb.sec);
    card.appendChild(holderN);
    var holderR = el("div", "qz-hold");
    holderR.appendChild(blocoRobustez(w, nb.L));
    card.appendChild(holderR);

    /* se houver primeiro colocado, anuncia na região aria-live */
    var top1 = nb.L.gov.filter(function (g) { return nb.pos[g.id] === 1; })[0];
    if (top1) {
      var pr = el("p", "qz-lead", "Na sua régua, a maior nota geral é a de " + top1.nome + " (" + nota1(top1.nota) + "). Veja a tabela abaixo.");
      resumo.appendChild(pr);
    }

    /* ações */
    var acoes = el("section", "qz-sec");
    acoes.appendChild(el("h3", "qz-h3", "O que fazer com a sua régua"));
    var bar = el("div", "qz-actions");
    var bUsar = el("button", "btn primary qz-btn", "Usar estes pesos no site");
    bUsar.type = "button";
    var bLink = el("button", "btn qz-btn", "Copiar link da minha régua");
    bLink.type = "button";
    var bRef = el("button", "btn qz-btn", "Refazer");
    bRef.type = "button";
    bar.appendChild(bUsar); bar.appendChild(bLink); bar.appendChild(bRef);
    acoes.appendChild(bar);
    var msg = el("p", "qz-msg");
    msg.setAttribute("role", "status");
    acoes.appendChild(msg);
    var linkBox = el("div", "qz-linkbox"); linkBox.hidden = true;
    var lab = el("label", "qz-linklab", "Link da sua régua (se o botão não copiar, selecione e copie daqui)");
    var inp = el("input", "qz-linkin"); inp.type = "text"; inp.readOnly = true; inp.id = "qz-link-in";
    lab.setAttribute("for", "qz-link-in");
    linkBox.appendChild(lab); linkBox.appendChild(inp);
    acoes.appendChild(linkBox);
    card.appendChild(acoes);

    bUsar.addEventListener("click", function () {
      try {
        B.aplicarPesos({ pilW: w });
        msg.textContent = "Pesos aplicados no site. Todas as páginas já usam a sua régua.";
        msg.appendChild(D.createTextNode(" "));
        var a = el("a", "qz-a", "Ver a nota geral dos governos");
        a.href = "#governos-hex";
        msg.appendChild(a);
        anunciar("Pesos aplicados no site.");
      } catch (e) { msg.textContent = "Não foi possível aplicar os pesos."; }
    });
    bLink.addEventListener("click", function () {
      var url = montarLink(w);
      linkBox.hidden = false; inp.value = url;
      copiar(url, function (ok) {
        if (ok) { msg.textContent = "Link copiado. Quem abrir verá o site com os seus pesos."; anunciar("Link copiado."); }
        else { msg.textContent = "Não deu para copiar sozinho. O link está na caixa abaixo: selecione e copie."; try { inp.focus(); inp.select(); } catch (e) { } }
      });
    });
    bRef.addEventListener("click", recomecar);

    root.appendChild(card);
    var mudar = el("section", "qz-card qz-card-flat");
    mudar.appendChild(el("h3", "qz-h3", "Suas respostas"));
    mudar.appendChild(el("p", "qz-note", "Quer mudar alguma? Escolha a pergunta."));
    var gl = el("ol", "qz-chg");
    Q.forEach(function (q, i) {
      var li = el("li");
      var b = el("button", "qz-chgb");
      b.type = "button";
      var rr = ans[i];
      b.appendChild(el("span", "qz-chg-n", (i + 1) + ". " + q.tt));
      b.appendChild(el("span", "qz-chg-r", rr === 0 ? "A: " + q.sa : (rr === 1 ? "B: " + q.sb : "Tanto faz")));
      b.addEventListener("click", function () { cur = i; tela = "q"; voltarRes = true; salvar(); render(true); });
      li.appendChild(b); gl.appendChild(li);
    });
    mudar.appendChild(gl);
    root.appendChild(mudar);
    root.appendChild(secaoCalculo(ans));

    resRefs = { w: w, holderN: holderN, holderR: holderR };
    return h;
  }

  function copiar(txt, cb) {
    var feito = false;
    function fb() {
      if (feito) { return; }
      feito = true;
      var ok = false;
      try {
        var ta = D.createElement("textarea");
        ta.value = txt; ta.setAttribute("readonly", ""); ta.className = "qz-fora-tela";
        D.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, txt.length);
        ok = D.execCommand("copy");
        D.body.removeChild(ta);
      } catch (e) { ok = false; }
      cb(ok);
    }
    try {
      if (W.navigator && W.navigator.clipboard && W.navigator.clipboard.writeText) {
        W.navigator.clipboard.writeText(txt).then(function () { if (!feito) { feito = true; cb(true); } }, fb);
        return;
      }
    } catch (e) { }
    fb();
  }

  /* ---------- montagem ---------- */
  function render(comFoco) {
    if (!root) { return; }
    var alvo;
    resRefs = null;
    if (tela === "res" && !completo()) { tela = "q"; cur = primeiraVazia(); }
    if (tela === "q") { alvo = telaPergunta(); anunciar("Pergunta " + (cur + 1) + " de " + N + "."); }
    else if (tela === "res") { alvo = telaResultado(); anunciar("Resultado pronto."); }
    else { alvo = telaIntro(); }
    if (comFoco) { foco(alvo); }
  }

  function montar() {
    var host = D.getElementById("modQuiz");
    if (!host || montado) { return montado; }
    host.appendChild(cabecalho());
    var sec = el("section", "wrap qz-wrap");
    root = el("div", "qz-root");
    root.id = "qz-root";
    live = el("div", "qz-sr");
    live.setAttribute("aria-live", "polite");
    live.setAttribute("aria-atomic", "true");
    sec.appendChild(live);
    sec.appendChild(root);
    host.appendChild(sec);
    montado = true;
    carregar();
    tela = completo() ? "res" : "intro";
    return true;
  }

  function entrar() {
    if (!montar()) { return; }
    D.title = "Quiz | Brasil em Análise";
    var primeira = !emPagina;
    emPagina = true;
    if (primeira) {
      // ao voltar para a página, mostra a tela onde a pessoa parou
      if (tela === "q" && completo()) { tela = "res"; }
    }
    render(false);
  }
  function sair() { emPagina = false; }

  /* atualiza só as notas e a robustez se o site mudar (por exemplo, pesos de integridade) */
  function aoAtualizar() {
    if (!emPagina || tela !== "res" || !resRefs) { return; }
    try {
      var w = resRefs.w;
      var nb = blocoNotas(w);
      limpar(resRefs.holderN); resRefs.holderN.appendChild(nb.sec);
      limpar(resRefs.holderR); resRefs.holderR.appendChild(blocoRobustez(w, nb.L));
    } catch (e) { }
  }

  /* ---------- botões de entrada no site ---------- */
  function ligarEntradas() {
    var slot = D.getElementById("slotHero");
    if (slot && !D.getElementById("qz-hero-btn")) {
      var ac = D.getElementById("heroAcoes");
      if (!ac) { ac = D.createElement("div"); ac.id = "heroAcoes"; ac.className = "hero-acoes"; slot.appendChild(ac); }
      var a = D.createElement("a");
      a.id = "qz-hero-btn"; a.className = "btn"; a.href = "#quiz";
      a.textContent = "Fazer o quiz";
      ac.appendChild(a);
    }
    var rod = D.getElementById("slotRodape");
    if (rod && !D.getElementById("qz-foot-a")) {
      var nav = D.getElementById("rodapeExtra");
      if (!nav) {
        nav = D.createElement("nav"); nav.id = "rodapeExtra"; nav.className = "foot-extra";
        nav.setAttribute("aria-label", "Mais"); rod.appendChild(nav);
      }
      var f = D.createElement("a");
      f.id = "qz-foot-a"; f.href = "#quiz"; f.textContent = "Quiz: qual é a sua régua?";
      nav.appendChild(f);
    }
  }

  ligarEntradas();
  if (typeof B.on === "function") {
    B.on("page", function (nome) { if (nome === "quiz") { entrar(); } else { sair(); } });
    B.on("update", aoAtualizar);
  }
  try { if (B.paginaAtual && B.paginaAtual() === "quiz") { entrar(); } } catch (e) { }
})();
