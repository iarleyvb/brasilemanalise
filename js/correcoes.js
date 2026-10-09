/* Módulo correcoes: botão "Corrigir" em cada item verificável do site (prefixo cr-).
   Ao tocar, abre um diálogo curto "Enviar correção" com o item e a página, e oferece:
   "Abrir no GitHub" (abre um pedido já preenchido), "Enviar por e-mail" (só se houver e-mail em CONTATO)
   e "Copiar o texto". Nada é enviado pelo site: o texto só sai quando a pessoa abre o link.
   Os itens são achados por seletores (lista ALVOS) com delegação de eventos e um MutationObserver,
   porque várias listas do site são redesenhadas (filtros, ordem, pesos). O botão nunca é duplicado.
   Os dados de contato vêm de window.BEA_CONTATO (definido no topo de js/sobre.js).
   API: window.BEA_CORRECOES.abrir({item, tipo, contexto, pagina}) abre o diálogo para um assunto geral.
   Sem rede, sem rastreamento, sem cookies, sem localStorage.
   Sintaxe segura para iOS 13+: sem "?.", sem "??", sem lookbehind. */
(function () {
  "use strict";

  var B = window.BEA;
  if (!B || typeof B.paginaAtual !== "function") { return; }

  var D = document, W = window;

  /* ---------- ajustes ---------- */
  var REPO_PADRAO = "iarleyvb/brasilemanalise";
  var LIMITE_URL = 1800;      // tamanho máximo do link (em caracteres, já com %XX)
  var MAX_NOME = 110;         // tamanho máximo do nome do item no rótulo do botão
  var NOMES_FORA_DO_MENU = {  // páginas que não estão no menu de cima
    sobre: "Sobre e correções", quiz: "Quiz", dados: "Dados", novidades: "Novidades"
  };

  /* ---------- utilidades ---------- */
  function el(tag, cls, txt) {
    var e = D.createElement(tag);
    if (cls) { e.className = cls; }
    if (txt != null) { e.textContent = txt; }
    return e;
  }
  function limpar(s) {
    return String(s == null ? "" : s).replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
  }
  function cortar(s, n) {
    s = limpar(s);
    if (s.length <= n) { return s; }
    var c = s.slice(0, Math.max(1, n - 1)), u = c.charCodeAt(c.length - 1);
    if (u >= 0xD800 && u <= 0xDBFF) { c = c.slice(0, -1); }   // não corta no meio de um par substituto
    return c.replace(/\s+$/, "") + "…";
  }
  function textoDe(e) { return e ? limpar(e.textContent) : ""; }
  function filho(e, sel) { return e ? e.querySelector(sel) : null; }
  function textoProprio(e) {   // só os nós de texto diretos (sem as etiquetas de dentro)
    var s = "", i, n;
    if (!e) { return ""; }
    for (i = 0; i < e.childNodes.length; i++) {
      n = e.childNodes[i];
      if (n.nodeType === 3) { s += n.nodeValue; }
    }
    return limpar(s);
  }

  /* ---------- contato (vem de js/sobre.js) ---------- */
  function contato() {
    var c = W.BEA_CONTATO, out = { nome: null, email: null, github: REPO_PADRAO };
    if (c && typeof c === "object") {
      if (typeof c.github === "string" && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(c.github)) { out.github = c.github; }
      if (typeof c.email === "string" && /^[^\s@<>"?&]+@[^\s@<>"?&]+\.[^\s@<>"?&]+$/.test(c.email)) { out.email = c.email; }
      if (c.nome) { out.nome = limpar(c.nome); }
    }
    return out;
  }

  /* ---------- página atual ---------- */
  function nomeDaPagina(p) {
    var a, i, links;
    if (!p) { return "Início"; }
    links = D.querySelectorAll(".sitenav a[data-page]");
    for (i = 0; i < links.length; i++) {
      if (links[i].getAttribute("data-page") === p) { a = links[i]; break; }
    }
    if (a) { return limpar(a.textContent); }
    return NOMES_FORA_DO_MENU[p] || p;
  }
  function paginaDoElemento(e) {
    var pg = e && e.closest ? e.closest(".page") : null;
    return pg ? pg.getAttribute("data-page") : null;
  }
  function urlBase() {
    var u = String(W.location.href), i = u.indexOf("#");
    return i >= 0 ? u.slice(0, i) : u;
  }

  /* ---------- o que é um "item verificável" ---------- */
  /* Cada alvo: sel (seletor do item), host (onde pôr o botão; omitido = o próprio item), tipo, nome(e), ctx(e).
     Os seletores vêm das classes reais criadas em index.html (buildCases, buildLegado, buildPromessas,
     flCard, buildFalsas, buildGastos, buildFut, buildSocList, buildCandidatos, rpRow, rpMediaRow). */
  var ALVOS = [
    {
      sel: "details.case", host: ".case-body", tipo: "Caso do placar",
      nome: function (e) { return textoDe(filho(e, "summary h3")); },
      ctx: function (e) { return textoDe(filho(e, ".case-top .per")); }
    },
    {
      sel: "article.leg-item", tipo: "Feito de governo (legado)",
      nome: function (e) { return textoDe(filho(e, ".lt h3")); },
      ctx: function (e) { var y = textoDe(filho(e, ".lt .yr")); return y ? "ano: " + y : ""; }
    },
    {
      sel: ".pcard .plist > li", tipo: "Promessa de campanha",
      nome: function (e) { return textoDe(filho(e, ":scope > b")) || textoDe(filho(e, "b")); },
      ctx: function (e) { var c = e.closest ? e.closest(".pcard") : null; return textoDe(filho(c, ".pc-head h3")); }
    },
    {
      sel: "article.fala", tipo: "Fala",
      nome: function (e) { return cortar(textoDe(filho(e, ".fl-q")), 90); },
      ctx: function (e) { return limpar(textoDe(filho(e, ".fl-top .chip")) + " " + textoDe(filho(e, ".fl-when"))); }
    },
    {
      sel: "#flFalsas > li", tipo: "Frase falsa atribuída",
      nome: function (e) { return cortar(textoDe(filho(e, "q")), 90); },
      ctx: function (e) { return textoDe(filho(e, ".fl-top .chip")); }
    },
    {
      sel: "article.rcpt",
      tipo: function (e) { return e.closest && e.closest("#futContas") ? "Conta deixada para o futuro" : "Gasto"; },
      nome: function (e) { return textoDe(filho(e, "h4")); },
      ctx: function (e) { return textoDe(filho(e, ".rc-h")); }
    },
    {
      sel: ".gs-c", tipo: "Comparação de gastos",
      nome: function (e) { return textoDe(filho(e, "h3")); },
      ctx: function () { return ""; }
    },
    {
      sel: "li.socitem", tipo: "Medida de direitos e minorias",
      nome: function (e) { return textoDe(filho(e, "h4")); },
      ctx: function (e) {
        var g = e.closest ? e.closest(".socgov") : null, y = textoDe(filho(e, ".si-yr"));
        return limpar(textoDe(filho(g, "summary h3")) + (y ? " · " + y : ""));
      }
    },
    {
      sel: "article.cand", tipo: "Ficha de candidato",
      nome: function (e) { return textoProprio(filho(e, ".cand-name")) || textoDe(filho(e, ".cand-name")); },
      ctx: function (e) { return textoDe(filho(e, ".cand-name .chip")); }
    },
    {
      sel: ".rp-r", host: ".rp-r-b", tipo: "Nota da Régua política",
      nome: function (e) {
        var c = e.closest ? e.closest(".rp-card") : null, a = textoDe(filho(c, "h3"));
        return textoDe(filho(e, "summary b")) + (a ? ", régua de " + a : "");
      },
      ctx: function (e) { var v = textoDe(filho(e, ".rp-r-v")); return v ? "nota " + v : ""; }
    },
    {
      sel: "li.rp-m", tipo: "Média da Régua política",
      nome: function (e) { return textoDe(filho(e, ".rp-m-h b")); },
      ctx: function (e) { return textoDe(filho(e, ".rp-m-v")); }
    },
    {
      sel: "#futAlivios > li", tipo: "Medida que aliviou as contas futuras",
      nome: function (e) { return textoDe(filho(e, "b")); },
      ctx: function () { return ""; }
    }
  ];

  var SEL_TODOS = ALVOS.map(function (a) { return a.sel; }).join(",");

  function alvoDe(item) {
    var i;
    for (i = 0; i < ALVOS.length; i++) {
      if (item.matches ? item.matches(ALVOS[i].sel) : item.msMatchesSelector(ALVOS[i].sel)) { return ALVOS[i]; }
    }
    return null;
  }

  /* ---------- colocar os botões (sem duplicar) ---------- */
  var ICONE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 21V4M5 4h11l-1.8 3.5L16 11H5"/></svg>';

  function temBotao(host) {
    var i, c = host.children;
    for (i = c.length - 1; i >= 0; i--) {
      if (c[i].className && typeof c[i].className === "string" && c[i].className.indexOf("cr-bar") >= 0) { return true; }
    }
    return false;
  }
  function nomeDoItem(item, alvo) {
    var n = "";
    try { n = limpar(alvo.nome(item)); } catch (e) { n = ""; }
    return n || "este item";
  }
  function hostDe(item, alvo) {
    return alvo.host ? item.querySelector(alvo.host) : item;
  }
  function poeBotao(item, alvo) {
    var host = hostDe(item, alvo), bar, btn, nome;
    if (!host || temBotao(host)) { return; }
    nome = nomeDoItem(item, alvo);
    bar = el("div", "cr-bar");
    bar.setAttribute("data-gl-ignore", "");
    btn = el("button", "cr-btn");
    btn.type = "button";
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-label", "Corrigir. Enviar correção sobre " + cortar(nome, MAX_NOME));
    btn.innerHTML = ICONE + "<span>Corrigir</span>";
    bar.appendChild(btn);
    host.appendChild(bar);
  }
  function varrer(raiz) {
    var lista, i, alvo;
    raiz = raiz || D;
    try { lista = raiz.querySelectorAll(SEL_TODOS); } catch (e) { return; }
    for (i = 0; i < lista.length; i++) {
      alvo = alvoDe(lista[i]);
      if (alvo) { poeBotao(lista[i], alvo); }
    }
    if (raiz.nodeType === 1 && raiz !== D) {   // o próprio nó novo também pode ser um item
      alvo = alvoDe(raiz);
      if (alvo) { poeBotao(raiz, alvo); }
    }
  }

  var agendado = 0;
  function agendar() {
    if (agendado) { return; }
    agendado = W.setTimeout(function () { agendado = 0; varrer(D); }, 80);
  }
  function soBotoes(muts) {   // ignora o que a gente mesmo inseriu
    var i, j, m, n;
    for (i = 0; i < muts.length; i++) {
      m = muts[i];
      for (j = 0; j < m.addedNodes.length; j++) {
        n = m.addedNodes[j];
        if (n.nodeType === 1 && !(typeof n.className === "string" && n.className.indexOf("cr-bar") >= 0)) { return false; }
      }
    }
    return true;
  }

  /* ---------- texto do pedido ---------- */
  function montarTexto(info, limiteExtra) {
    var c = contato(), item = limpar(info.item) || "Assunto geral", ctx = limpar(info.contexto), urlp = limpar(info.url);
    var ver = limpar(B.versao || ""), pag = limpar(info.pagina), tipo = limpar(info.tipo);
    var n = 0, r;

    function corpo() {
      var l = [];
      l.push("Item: " + item);
      if (tipo) { l.push("Tipo: " + tipo); }
      if (ctx) { l.push("Contexto: " + ctx); }
      l.push("Página: " + pag);
      if (urlp) { l.push("URL: " + urlp); }
      if (ver) { l.push("Versão do modelo: " + ver); }
      l.push("");
      l.push("## O que está errado");
      l.push("", "");
      l.push("## Qual é a fonte (link)");
      l.push("", "");
      l.push("## O que deveria estar");
      l.push("", "");
      return l.join("\n");
    }
    function titulo() { return "Correção: " + cortar(item, 70); }
    function montaGit() {
      return "https://github.com/" + c.github + "/issues/new?title=" + encodeURIComponent(titulo()) + "&body=" + encodeURIComponent(corpo());
    }
    function montaMail() {
      if (!c.email) { return ""; }
      return "mailto:" + c.email + "?subject=" + encodeURIComponent(titulo()) +
        "&body=" + encodeURIComponent(corpo().replace(/\n/g, "\r\n"));
    }
    function grande() {
      var g = montaGit().length, m = montaMail().length;
      return g > LIMITE_URL || m > LIMITE_URL;
    }

    /* encurta o contexto primeiro, depois a URL e o nome do item, até caber */
    while (grande() && n < 40) {
      n++;
      if (ctx) { ctx = ctx.length > 40 ? cortar(ctx, Math.floor(ctx.length * 0.6)) : ""; }
      else if (urlp && urlp.length > 60) { urlp = cortar(urlp, Math.floor(urlp.length * 0.6)); }
      else if (urlp) { urlp = ""; }
      else if (item.length > 30) { item = cortar(item, Math.floor(item.length * 0.7)); }
      else if (tipo) { tipo = ""; }
      else { break; }
    }
    r = { titulo: titulo(), corpo: corpo(), github: montaGit(), email: montaMail() };
    return r;
  }

  /* ---------- diálogo ---------- */
  var fundo = null, dlg = null, campoItem = null, campoTipo = null, campoPag = null;
  var btnGit = null, btnMail = null, btnCopiar = null, btnFechar = null, areaTexto = null, msg = null, linkPolitica = null;
  var aberto = false, gatilho = null, atual = null;

  function construir() {
    var cab, dl, linha, acoes, det, sum, rod;
    fundo = el("div", "cr-fundo");
    fundo.hidden = true;
    fundo.setAttribute("data-gl-ignore", "");
    dlg = el("div", "cr-dlg");
    dlg.setAttribute("role", "dialog");
    dlg.setAttribute("aria-modal", "true");
    dlg.setAttribute("aria-labelledby", "cr-titulo");
    dlg.setAttribute("aria-describedby", "cr-intro");
    dlg.tabIndex = -1;

    cab = el("div", "cr-cab");
    cab.appendChild(el("h2", "cr-titulo", "Enviar correção")).id = "cr-titulo";
    btnFechar = el("button", "cr-fechar");
    btnFechar.type = "button";
    btnFechar.setAttribute("aria-label", "Fechar");
    btnFechar.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    cab.appendChild(btnFechar);
    dlg.appendChild(cab);

    dlg.appendChild(el("p", "cr-intro", "Achou um erro? Diga o que está errado e mande a fonte. O pedido só sai daqui quando você tocar em um dos botões e confirmar na página ou no programa que abrir.")).id = "cr-intro";

    dl = el("dl", "cr-dl");
    linha = el("div"); linha.appendChild(el("dt", null, "Item")); campoItem = el("dd"); linha.appendChild(campoItem); dl.appendChild(linha);
    linha = el("div"); linha.appendChild(el("dt", null, "Tipo")); campoTipo = el("dd"); linha.appendChild(campoTipo); linha.className = "cr-tipo"; dl.appendChild(linha);
    linha = el("div"); linha.appendChild(el("dt", null, "Página")); campoPag = el("dd"); linha.appendChild(campoPag); dl.appendChild(linha);
    dlg.appendChild(dl);

    acoes = el("div", "cr-acoes");
    btnGit = el("a", "btn primary cr-a");
    btnGit.target = "_blank";
    btnGit.rel = "noopener noreferrer";
    btnGit.textContent = "Abrir no GitHub";
    acoes.appendChild(btnGit);
    btnMail = el("a", "btn cr-a", "Enviar por e-mail");
    btnMail.hidden = true;
    acoes.appendChild(btnMail);
    btnCopiar = el("button", "btn cr-a", "Copiar o texto");
    btnCopiar.type = "button";
    acoes.appendChild(btnCopiar);
    dlg.appendChild(acoes);

    msg = el("p", "cr-msg");
    msg.setAttribute("role", "status");
    msg.setAttribute("aria-live", "polite");
    dlg.appendChild(msg);

    det = el("details", "cr-det");
    sum = el("summary", null, "Ver o texto do pedido");
    det.appendChild(sum);
    areaTexto = el("textarea", "cr-texto");
    areaTexto.readOnly = true;
    areaTexto.rows = 9;
    areaTexto.setAttribute("aria-label", "Texto do pedido de correção");
    areaTexto.setAttribute("spellcheck", "false");
    det.appendChild(areaTexto);
    dlg.appendChild(det);

    rod = el("p", "cr-rodape");
    rod.appendChild(D.createTextNode("No GitHub, o pedido fica público, com o seu nome de usuário. Não escreva dados pessoais. "));
    linkPolitica = el("a", null, "Como tratamos as correções");
    linkPolitica.href = "#sb-correcoes";
    rod.appendChild(linkPolitica);
    rod.appendChild(D.createTextNode("."));
    dlg.appendChild(rod);

    fundo.appendChild(dlg);
    D.body.appendChild(fundo);

    btnFechar.addEventListener("click", function () { fechar(); });
    fundo.addEventListener("click", function (e) { if (e.target === fundo) { fechar(); } });
    linkPolitica.addEventListener("click", function () { fechar(true); });
    btnCopiar.addEventListener("click", copiar);
    btnGit.addEventListener("click", function () { avisar("Abrimos o GitHub em outra aba. Se nada abriu, use “Copiar o texto”."); });
    btnMail.addEventListener("click", function () { avisar("Abrimos o seu programa de e-mail. Se nada abriu, use “Copiar o texto”."); });
  }

  function avisar(t) {
    msg.textContent = "";
    W.setTimeout(function () { msg.textContent = t; }, 30);
  }

  function copiar() {
    var txt = atual ? atual.corpo : "", feito = false;
    function ok() { if (!feito) { feito = true; avisar("Texto copiado. Cole no GitHub ou no e-mail."); } }
    function falhou() {
      var det = areaTexto.parentNode;
      if (feito) { return; }
      feito = true;
      det.open = true;
      areaTexto.focus();
      areaTexto.select();
      avisar("Não foi possível copiar sozinho. O texto está selecionado: copie com o menu do aparelho.");
    }
    function antigo() {
      var ok2 = false;
      try {
        areaTexto.focus();
        areaTexto.select();
        ok2 = D.execCommand && D.execCommand("copy");
      } catch (e) { ok2 = false; }
      if (ok2) { ok(); } else { falhou(); }
    }
    if (W.navigator && W.navigator.clipboard && W.navigator.clipboard.writeText) {
      try { W.navigator.clipboard.writeText(txt).then(ok, antigo); } catch (e) { antigo(); }
    } else { antigo(); }
  }

  function focaveis() {
    var l = dlg.querySelectorAll("a[href], button, textarea, summary, [tabindex]:not([tabindex='-1'])"), r = [], i, e;
    for (i = 0; i < l.length; i++) {
      e = l[i];
      if (e.hidden || e.disabled) { continue; }
      if (!(e.offsetWidth || e.offsetHeight || (e.getClientRects && e.getClientRects().length))) { continue; }
      r.push(e);
    }
    return r;
  }

  function aoTeclar(e) {
    var f, i, ult, pri, a;
    if (!aberto) { return; }
    if (e.key === "Escape" || e.key === "Esc") {
      e.preventDefault();
      e.stopPropagation();
      fechar();
      return;
    }
    if (e.key === "Tab") {
      f = focaveis();
      if (!f.length) { e.preventDefault(); dlg.focus(); return; }
      pri = f[0];
      ult = f[f.length - 1];
      a = D.activeElement;
      i = f.indexOf(a);
      if (!dlg.contains(a) || a === dlg) {
        e.preventDefault();
        (e.shiftKey ? ult : pri).focus();
      } else if (e.shiftKey && a === pri) {
        e.preventDefault();
        ult.focus();
      } else if (!e.shiftKey && a === ult) {
        e.preventDefault();
        pri.focus();
      } else if (i < 0) {
        e.preventDefault();
        pri.focus();
      }
    }
  }
  function aoFocar(e) {   // foco que escapou do diálogo volta para dentro
    if (aberto && dlg && !dlg.contains(e.target)) { dlg.focus(); }
  }

  function abrir(info) {
    var c, tx, pag, nomePag;
    info = info || {};
    if (!fundo) { construir(); }
    c = contato();
    pag = info.paginaId || B.paginaAtual() || "inicio";
    nomePag = info.pagina || nomeDaPagina(pag);
    info = {
      item: info.item || "Assunto geral (fora de um item específico)",
      tipo: info.tipo || "",
      contexto: info.contexto || "",
      pagina: nomePag,
      url: info.url || (urlBase() + "#" + (info.hash || pag))
    };
    tx = montarTexto(info);
    atual = tx;

    campoItem.textContent = info.item;
    campoTipo.textContent = info.tipo;
    campoTipo.parentNode.hidden = !info.tipo;
    campoPag.textContent = nomePag;
    btnGit.href = tx.github;
    if (c.email) { btnMail.href = tx.email; btnMail.hidden = false; } else { btnMail.removeAttribute("href"); btnMail.hidden = true; }
    areaTexto.value = tx.corpo;
    areaTexto.parentNode.open = false;
    msg.textContent = "";

    gatilho = info.gatilho || D.activeElement;
    fundo.hidden = false;
    D.documentElement.classList.add("cr-trava");
    aberto = true;
    D.addEventListener("keydown", aoTeclar, true);
    D.addEventListener("focus", aoFocar, true);
    dlg.scrollTop = 0;
    dlg.focus();
  }

  function fechar(semFoco) {
    if (!aberto) { return; }
    aberto = false;
    fundo.hidden = true;
    D.documentElement.classList.remove("cr-trava");
    D.removeEventListener("keydown", aoTeclar, true);
    D.removeEventListener("focus", aoFocar, true);
    if (!semFoco && gatilho && gatilho.focus && D.body.contains(gatilho)) {
      try { gatilho.focus({ preventScroll: true }); } catch (e) { gatilho.focus(); }
    } else if (!semFoco) {
      var m = D.getElementById("conteudo");
      if (m) { m.focus({ preventScroll: true }); }
    }
    gatilho = null;
  }

  /* ---------- clique no botão "Corrigir" (delegação) ---------- */
  function aoClicar(e) {
    var t = e.target, btn, bar, host, item, alvo, nome, ctx, tipo, pagId;
    btn = t && t.closest ? t.closest(".cr-btn") : null;
    if (!btn) { return; }
    e.preventDefault();
    bar = btn.parentNode;
    host = bar ? bar.parentNode : null;
    item = host;
    alvo = item ? alvoDe(item) : null;
    if (!alvo && host && host.closest) {   // o botão está dentro de .case-body ou .rp-r-b
      item = host.closest(SEL_TODOS);
      alvo = item ? alvoDe(item) : null;
    }
    if (!alvo) { abrir({ gatilho: btn }); return; }
    nome = nomeDoItem(item, alvo);
    try { ctx = limpar(alvo.ctx(item)); } catch (er) { ctx = ""; }
    tipo = typeof alvo.tipo === "function" ? alvo.tipo(item) : alvo.tipo;
    pagId = paginaDoElemento(item) || B.paginaAtual();
    abrir({
      item: nome, tipo: tipo, contexto: ctx, paginaId: pagId,
      hash: item.id ? item.id : pagId,
      gatilho: btn
    });
  }

  /* ---------- início ---------- */
  function iniciar() {
    var alvoObs = D.getElementById("conteudo") || D.body, obs;
    varrer(D);
    D.addEventListener("click", aoClicar);
    W.addEventListener("hashchange", function () { if (aberto) { fechar(true); } });
    if (W.MutationObserver) {
      obs = new W.MutationObserver(function (muts) { if (!soBotoes(muts)) { agendar(); } });
      obs.observe(alvoObs, { childList: true, subtree: true });
    }
    if (typeof B.on === "function") {
      B.on("page", function () { agendar(); });
      B.on("update", function () { agendar(); });
    }
    W.BEA_CORRECOES = { abrir: abrir, fechar: fechar };
  }

  if (D.readyState === "loading") { D.addEventListener("DOMContentLoaded", iniciar); } else { iniciar(); }
})();
