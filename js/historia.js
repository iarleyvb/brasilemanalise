/* Placar em 10 segundos + "o que pesa mais pra você" (camada simples do Início).
   Usa só a API pública window.BEA; tudo o que é detalhe fica nas páginas de baixo. */
(function () {
  "use strict";
  var W = window, D = document, B = null;
  var ROT = { eco: "Bolso e emprego", pov: "Pobreza e desigualdade", soc: "Direitos e minorias", sau: "Saúde", seg: "Segurança", edu: "Educação", amb: "Floresta e clima", fut: "Contas do país", prl: "Feitos e promessas", int: "Honestidade (corrupção)" };
  var ORD = ["eco", "pov", "sau", "seg", "edu", "int", "fut", "amb", "soc", "prl"];
  var PRE = [
    { id: "pad", t: "Neutro (cada indicador igual)", w: null },
    { id: "bol", t: "Meu bolso", w: { eco: 35, pov: 20, sau: 4, seg: 3, edu: 3, soc: 5, amb: 4, fut: 10, prl: 6, int: 10 } },
    { id: "ser", t: "Saúde, escola e segurança", w: { eco: 8, pov: 10, sau: 18, seg: 18, edu: 18, soc: 6, amb: 6, fut: 6, prl: 4, int: 6 } },
    { id: "hon", t: "Honestidade", w: { eco: 12, pov: 8, sau: 4, seg: 4, edu: 4, soc: 6, amb: 5, fut: 10, prl: 12, int: 35 } },
    { id: "fut", t: "Contas e futuro", w: { eco: 20, pov: 6, sau: 4, seg: 3, edu: 3, soc: 4, amb: 12, fut: 30, prl: 6, int: 12 } },
    { id: "dir", t: "Direitos e floresta", w: { eco: 8, pov: 15, sau: 4, seg: 4, edu: 4, soc: 25, amb: 25, fut: 4, prl: 3, int: 8 } }
  ];
  var aberto = null, raiz = null;

  function el(t, c, x) { var e = D.createElement(t); if (c) { e.className = c; } if (x != null) { e.textContent = x; } return e; }
  function f1(n) { return (Math.round(n * 10) / 10).toFixed(1).replace(".", ","); }
  function anos(a) { return a ? String(a) : ""; }

  function pesosAtuais() { try { return B.estado().pilW; } catch (e) { return null; } }
  function presetAtivo() {
    var w = pesosAtuais(), i, k, ok;
    if (!w) { return "pad"; }
    for (i = 0; i < PRE.length; i++) {
      var alvo = PRE[i].w || B.estado().pilW_padrao; ok = true;
      for (k in alvo) { if (Math.round(w[k]) !== Math.round(alvo[k])) { ok = false; break; } }
      if (ok) { return PRE[i].id; }
    }
    return "";
  }

  function barras(g) {
    var ul = el("ul", "hs-pil"), i, k, v, li, a;
    var par = []; ORD.forEach(function (k) { if (g.p[k] != null) { par.push(k); } });
    var melhor = par.slice().sort(function (x, y) { return g.p[y] - g.p[x]; })[0];
    var pior = par.slice().sort(function (x, y) { return g.p[x] - g.p[y]; })[0];
    for (i = 0; i < par.length; i++) {
      k = par[i]; v = g.p[k];
      li = el("li", "hs-pi" + (k === melhor ? " hs-top" : "") + (k === pior ? " hs-low" : ""));
      a = el("span", "hs-pn", ROT[k]);
      var tr = el("span", "hs-tr"), fl = el("i", "hs-fl"); fl.style.width = Math.max(2, v * 10) + "%";
      tr.appendChild(fl);
      li.appendChild(a); li.appendChild(tr); li.appendChild(el("b", "hs-pv", f1(v)));
      ul.appendChild(li);
    }
    var r = el("p", "hs-res");
    r.textContent = "Ponto forte: " + ROT[melhor].toLowerCase() + " (" + f1(g.p[melhor]) + "). Ponto fraco: " + ROT[pior].toLowerCase() + " (" + f1(g.p[pior]) + ").";
    var wrap = el("div", "hs-det"); wrap.appendChild(r); wrap.appendChild(ul);
    var mais = el("a", "hs-mais", "Ver a fórmula completa"); mais.href = "#a-formula";
    wrap.appendChild(mais);
    return wrap;
  }

  function desenhar() {
    var dados = B.geral(), gs = [], pt = null, i, ul, li, bt, row, tr, fl, g;
    for (i = 0; i < dados.length; i++) { if (dados[i].id === "ptall") { pt = dados[i]; } else if (dados[i].nota != null && dados[i].p) { gs.push(dados[i]); } }
    gs.sort(function (a, b) { return b.nota - a.nota; });
    raiz.textContent = "";
    var tit = el("h2", "hs-h", "O placar em 10 segundos"); tit.id = "hs-h";
    raiz.setAttribute("aria-labelledby", "hs-h");
    raiz.appendChild(tit);
    raiz.appendChild(el("p", "hs-sub", "Nota de 0 a 10 na régua que você escolheu. Toque em um governo para ver o porquê. O “força ×” ajusta Direitos e Feitos pelo apoio no Congresso e no STF: abaixo de 1, o governo tinha mais apoio que a média."));

    ul = el("ul", "hs-rank");
    gs.forEach(function (g) {
      li = el("li", "hs-it" + (g.bloco === "PL" || /PL/.test(g.partido) ? " pl" : " pt"));
      bt = el("button", "hs-row"); bt.type = "button";
      bt.setAttribute("aria-expanded", aberto === g.nome ? "true" : "false");
      row = el("span", "hs-n");
      row.appendChild(el("b", null, g.nome));
      row.appendChild(el("small", null, g.partido + " · " + anos(g.anos)));
      tr = el("span", "hs-tr"); fl = el("i", "hs-fl"); fl.style.width = Math.max(2, g.nota * 10) + "%"; tr.appendChild(fl);
      var nv = el("span", "hs-vw"); nv.appendChild(el("b", "hs-v", f1(g.nota)));
      if (g.mult != null && isFinite(g.mult)) {
        var mx = el("small", "hs-mx", "força ×" + (Math.round(g.mult * 100) / 100).toFixed(2).replace(".", ","));
        mx.title = "Multiplicador de força no Congresso e no STF. Vale só para Direitos e minorias e para Feitos e promessas.";
        nv.appendChild(mx);
      }
      bt.appendChild(row); bt.appendChild(tr); bt.appendChild(nv);
      bt.addEventListener("click", function () { aberto = (aberto === g.nome) ? null : g.nome; desenhar(); var n = raiz.querySelector('[aria-expanded="true"]'); if (n) { n.focus(); } });
      li.appendChild(bt);
      if (aberto === g.nome) { li.appendChild(barras(g)); }
      ul.appendChild(li);
    });
    raiz.appendChild(ul);

    if (pt) {
      var med = el("p", "hs-med");
      med.innerHTML = "Média dos governos do PT: <b>" + f1(pt.nota) + "</b>";
      raiz.appendChild(med);
    }

    var q = el("h3", "hs-q", "O que pesa mais pra você?"); q.id = "hs-q";
    raiz.appendChild(q);
    raiz.appendChild(el("p", "hs-sub", "Escolha uma ênfase. A mesma régua vale para todos os governos."));
    var gr = el("div", "hs-chips"); gr.setAttribute("role", "radiogroup"); gr.setAttribute("aria-labelledby", "hs-q");
    var at = presetAtivo();
    PRE.forEach(function (p) {
      var c = el("button", "hs-chip" + (p.id === at ? " on" : ""), p.t); c.type = "button";
      c.setAttribute("role", "radio"); c.setAttribute("aria-checked", p.id === at ? "true" : "false");
      c.addEventListener("click", function () { if (p.w) { B.aplicarPesos({ pilW: p.w }); } else { B.restaurarPesos(); } });
      gr.appendChild(c);
    });
    raiz.appendChild(gr);
    var fino = el("a", "hs-mais", "Ajuste fino, peso por peso"); fino.href = "#regua"; raiz.appendChild(fino);
    var fm = el("a", "hs-mais", "A fórmula completa"); fm.href = "#a-formula"; fm.style.marginLeft = "18px"; raiz.appendChild(fm);
  }

  function iniciar() {
    B = W.BEA; raiz = D.getElementById("hist");
    if (!B || !raiz) { return; }
    desenhar();
    B.on("update", function () { try { desenhar(); } catch (e) { } });
  }
  if (D.readyState === "loading") { D.addEventListener("DOMContentLoaded", iniciar); } else { iniciar(); }
})();
