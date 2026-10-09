/* Módulo dados: página "Dados abertos" (#dados) (prefixo dd-).
   Gera, no navegador, arquivos para baixar a partir de BEA.dataset(): três CSV (notas por governo; indicadores
   com valores, notas, pisos e metas; pesos e variáveis do modelo) e um JSON com tudo. Mostra uma prévia das
   primeiras linhas, o dicionário de colunas, o texto pronto de "Como citar" e os avisos de uso.
   Os arquivos levam dentro a configuração de pesos que estava ativa (padrão do site ou a do visitante).
   Sem rede, sem rastreamento, sem cookies. Guarda só uma preferência (formato dos números) em localStorage.
   Sintaxe segura para iOS 13+: sem "?.", sem "??", sem lookbehind. */
(function () {
  "use strict";

  /* ============================================================
     CONFIGURAÇÃO DO DONO
       LICENCA:  licença de reutilização dos dados. Deixe null enquanto não decidir: a página então mostra só a
                 orientação de citar a fonte. Para definir, troque por, por exemplo:
                 { nome: "CC BY 4.0", url: "https://creativecommons.org/licenses/by/4.0/deed.pt-br" }
       ENDERECO: endereço do site usado no texto de citação (se a página tiver link canonical, ele vale).
     ============================================================ */
  var LICENCA = null;
  var ENDERECO = "https://www.brasilemanalise.com/";

  var B = window.BEA;
  var D = document, W = window;
  if (!B || typeof B.on !== "function") { return; }

  var NOME_PAGINA = "Dados abertos";
  var K_FMT = "bea_dd_formato";      // "br" (padrão) ou "int"
  var construida = false;
  var fmt = "br";
  var ref = {};                      // referências a elementos da página
  var MESES_AB = ["jan.", "fev.", "mar.", "abr.", "maio", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

  /* ---------- utilidades de DOM ---------- */
  function el(tag, cls, txt) {
    var e = D.createElement(tag);
    if (cls) { e.className = cls; }
    if (txt != null) { e.textContent = txt; }
    return e;
  }
  function add(pai) {
    var i, f;
    for (i = 1; i < arguments.length; i++) {
      f = arguments[i];
      if (f == null || f === false) { continue; }
      pai.appendChild(typeof f === "string" ? D.createTextNode(f) : f);
    }
    return pai;
  }
  function p(cls) {
    var e = el("p", cls || null), i;
    for (i = 1; i < arguments.length; i++) { add(e, arguments[i]); }
    return e;
  }
  function link(href, txt) {
    var a = el("a", null, txt);
    a.href = href;
    return a;
  }
  function lista(itens, cls) {
    var ul = el("ul", cls || null), i, li, it;
    for (i = 0; i < itens.length; i++) {
      it = itens[i];
      li = el("li");
      if (Array.isArray(it)) { add.apply(null, [li].concat(it)); } else { add(li, it); }
      ul.appendChild(li);
    }
    return ul;
  }
  function limpar(e) { while (e.firstChild) { e.removeChild(e.firstChild); } }
  function secao(id, tit, lead) {
    var s = el("section", "wrap dd-sec"), cab = el("div", "sec-head"), h = el("h2", null, tit);
    s.id = id;
    h.id = id + "-h";
    s.setAttribute("aria-labelledby", h.id);
    cab.appendChild(h);
    if (lead) { cab.appendChild(el("p", "lead", lead)); }
    s.appendChild(cab);
    return s;
  }

  /* ---------- armazenamento (opcional) ---------- */
  function lerPref() {
    try { var v = W.localStorage.getItem(K_FMT); return v === "int" ? "int" : "br"; } catch (e) { return "br"; }
  }
  function gravarPref(v) {
    try { W.localStorage.setItem(K_FMT, v); } catch (e) { /* sem armazenamento: segue sem lembrar */ }
  }

  /* ---------- datas e números ---------- */
  function dois(n) { return (n < 10 ? "0" : "") + n; }
  function isoHoje(d) { return d.getFullYear() + "-" + dois(d.getMonth() + 1) + "-" + dois(d.getDate()); }
  function dataAbnt(d) { return d.getDate() + " " + MESES_AB[d.getMonth()] + " " + d.getFullYear(); }
  function vazio(v) { return v === null || v === undefined || v === "" || (typeof v === "number" && !isFinite(v)); }
  // até 4 casas decimais, sem notação científica; vírgula decimal no formato brasileiro
  function numTxt(n, f) {
    var s;
    if (vazio(n)) { return ""; }
    if (typeof n === "number") {
      s = String(Math.round(n * 10000) / 10000);
      if (s.indexOf("e") >= 0) { s = n.toFixed(4); }
      return f === "br" ? s.replace(".", ",") : s;
    }
    if (typeof n === "boolean") { return n ? "sim" : "não"; }
    return String(n);
  }
  // número para frases na tela (sempre vírgula decimal)
  function nBR(n) { return numTxt(n, "br"); }

  /* ---------- leitura dos dados do site ---------- */
  function seguro(fn, padrao) { try { return fn(); } catch (e) { return padrao; } }
  function versaoModelo(d) {
    var v = seguro(function () { return B.versao; }, null);
    if (vazio(v) && d) { v = d.versao; }
    return vazio(v) ? "" : String(v);
  }
  function contexto() {
    var d = seguro(function () { return B.dataset(); }, null), gs, i, c, pil, pers, mapa = {};
    if (!d || !Array.isArray(d.notas) || !Array.isArray(d.indicadores) || !Array.isArray(d.pilares)) { return null; }
    gs = seguro(function () { return B.governos() || []; }, []);
    for (i = 0; i < gs.length; i++) { mapa[gs[i].nome] = gs[i]; }
    pil = d.pilares;
    pers = false;
    for (i = 0; i < pil.length; i++) { if (pil[i].peso !== pil[i].peso_padrao) { pers = true; } }
    c = { d: d, hoje: new Date(), versao: versaoModelo(d), gov: mapa, pil: pil, pers: pers };
    c.iso = isoHoje(c.hoje);
    c.conf = pers ? "personalizada" : "padrao";
    return c;
  }
  function pesosTxt(ctx) {
    var i, o = [];
    for (i = 0; i < ctx.pil.length; i++) { o.push(ctx.pil[i].nome + " " + ctx.pil[i].peso); }
    return o.join(", ");
  }
  // "8/10/2026" vira "2026-10-08", que nenhuma planilha lê como outra data
  function dataIsoModelo(t) {
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(t || ""));
    return m ? m[3] + "-" + dois(Number(m[2])) + "-" + dois(Number(m[1])) : (vazio(t) ? "" : String(t));
  }
  function endereco() {
    var c = D.querySelector('link[rel="canonical"]'), h = c && c.getAttribute("href");
    return h ? h : ENDERECO;
  }

  /* ============================================================
     DEFINIÇÃO DOS ARQUIVOS
     Cada arquivo tem: id, título, descrição, tipo, nome curto e uma função montar(ctx) que devolve
     { cab: [{k, d, u}], linhas: [[valores]] }. O mesmo "cab" gera o CSV e o dicionário de colunas.
     ============================================================ */
  function colComum(ctx) {
    return [
      { k: "versao_modelo", d: "Versão do modelo de cálculo da Nota geral usada no arquivo (com o v na frente, para a planilha não ler como data).", u: "texto", v: function () { return ctx.versao ? "v" + ctx.versao : ""; } },
      { k: "data_do_modelo", d: "Data do modelo, como o site informa.", u: "data AAAA-MM-DD", v: function () { return dataIsoModelo(ctx.d.gerado_em); } },
      { k: "exportado_em", d: "Dia em que o arquivo foi baixado.", u: "data AAAA-MM-DD", v: function () { return ctx.iso; } },
      { k: "configuracao_pesos", d: "padrao: os pesos dos pilares são os do padrão do site. personalizada: ao menos um peso de pilar foi alterado por quem baixou.", u: "texto", v: function () { return ctx.conf; } }
    ];
  }

  function montarNotas(ctx) {
    var d = ctx.d, cab = [], i, linhas = [], r, k;
    function peg(fn) { return fn; }
    cab.push(
      { k: "id", d: "Código do governo no site (por exemplo, lula1). ptall é “PT, todos”.", u: "texto", v: peg(function (r2) { return r2.id; }) },
      { k: "governo", d: "Nome do governo ou do conjunto de governos.", u: "texto", v: peg(function (r2) { return r2.governo; }) },
      { k: "partido", d: "Partido do governo.", u: "texto", v: peg(function (r2) { return r2.partido; }) },
      { k: "anos", d: "Anos do governo.", u: "texto", v: peg(function (r2) { return r2.anos; }) },
      { k: "nota_geral", d: "Nota geral: média das notas dos pilares ponderada pelos pesos das colunas peso_*.", u: "número de 0 a 10", v: peg(function (r2) { return r2.nota_geral; }) }
    );
    function notaPilar(pk) { return function (r2) { return r2.pilares ? r2.pilares[pk] : null; }; }
    for (i = 0; i < ctx.pil.length; i++) {
      k = ctx.pil[i].pilar;
      cab.push({ k: "nota_" + k, d: "Nota do pilar " + ctx.pil[i].nome + ".", u: "número de 0 a 10", v: notaPilar(k) });
    }
    cab.push(
      { k: "pontos_corrupcao_por_ano", d: "Pontos de casos de corrupção por ano de governo, usados no pilar Integridade. Quanto menor, melhor. O critério está em A conta completa, na página Como calculamos.", u: "número", v: peg(function (r2) { return r2.pontos_corrupcao_por_ano; }) },
      { k: "wgi", d: "Índice externo de controle da corrupção (WGI, Banco Mundial), média dos anos do governo.", u: "número de 0 a 100", v: peg(function (r2) { return r2.wgi; }) },
      { k: "multiplicador_forca", d: "Multiplicador de força política aplicado aos pilares Direitos e minorias e Feitos e promessas. Acima de 1 aumenta a nota desses dois pilares e abaixo de 1 reduz.", u: "número", v: peg(function (r2) { return r2.multiplicador; }) }
    );
    function pesoPilar(idx) { return function () { return ctx.pil[idx].peso; }; }
    for (i = 0; i < ctx.pil.length; i++) {
      cab.push({ k: "peso_" + ctx.pil[i].pilar, d: "Peso do pilar " + ctx.pil[i].nome + " na Nota geral.", u: "pontos de 0 a 40", v: pesoPilar(i) });
    }
    cab.push(
      { k: "peso_integridade_casos", d: "Peso dos casos de corrupção dentro do pilar Integridade.", u: "número de 0 a 1", v: function () { return d.integridade ? d.integridade.peso_casos : null; } },
      { k: "peso_integridade_indice", d: "Peso do índice externo (WGI) dentro do pilar Integridade.", u: "número de 0 a 1", v: function () { return d.integridade ? d.integridade.peso_wgi : null; } },
      { k: "kappa_forca", d: "Expoente (kappa) do multiplicador de força política.", u: "número de 0 a 1", v: function () { return d.forca ? d.forca.kappa : null; } }
    );
    cab = cab.concat(colComum(ctx));
    for (r = 0; r < d.notas.length; r++) {
      linhas.push(linhaDe(cab, d.notas[r]));
    }
    return { cab: cab, linhas: linhas };
  }

  function linhaDe(cab, reg) {
    var out = [], i;
    for (i = 0; i < cab.length; i++) { out.push(cab[i].v(reg)); }
    return out;
  }

  function montarIndicadores(ctx) {
    var d = ctx.d, cab = [], linhas = [], i, chaves, j, ind, g, gv, gi;
    cab.push(
      { k: "pilar", d: "Código do pilar (eco, pov, soc, ser, amb, fut).", u: "texto", v: function (r) { return r.ind.pilar; } },
      { k: "pilar_nome", d: "Nome do pilar.", u: "texto", v: function (r) { return r.ind.pilarNome; } },
      { k: "indicador", d: "Código do indicador dentro do pilar.", u: "texto", v: function (r) { return r.ind.indicador; } },
      { k: "titulo", d: "Nome do indicador.", u: "texto", v: function (r) { return r.ind.titulo; } },
      { k: "unidade", d: "Unidade do valor, do piso e da meta. Em geral é a variação média por ano de governo.", u: "texto", v: function (r) { return r.ind.unidade; } },
      { k: "piso", d: "Valor que vale nota 0. É fixo e não depende dos governos comparados.", u: "número, na unidade", v: function (r) { return r.ind.piso; } },
      { k: "meta", d: "Valor que vale nota 10. É fixo e não depende dos governos comparados.", u: "número, na unidade", v: function (r) { return r.ind.meta; } },
      { k: "governo_id", d: "Código do governo no site (FHC e Temer têm o nome como código).", u: "texto", v: function (r) { return r.chave; } },
      { k: "governo", d: "Nome do governo.", u: "texto", v: function (r) { return r.g.governo; } },
      { k: "partido", d: "Partido do governo.", u: "texto", v: function (r) { return r.gv ? r.gv.partido : ""; } },
      { k: "ano_inicio", d: "Primeiro ano do governo.", u: "ano", v: function (r) { return r.gv && r.gv.anos ? r.gv.anos[0] : null; } },
      { k: "ano_fim", d: "Último ano do governo (2026 é o ano em curso).", u: "ano", v: function (r) { return r.gv && r.gv.anos ? r.gv.anos[1] : null; } },
      { k: "valor", d: "Valor medido do indicador no governo, na unidade da coluna unidade. Vazio quando não há dado.", u: "número, na unidade", v: function (r) { return r.g.valor; } },
      { k: "nota", d: "Nota do indicador: 0 no piso, 10 na meta, proporcional entre os dois. Vazia quando não há dado.", u: "número de 0 a 10", v: function (r) { return r.g.nota; } },
      { k: "referencia", d: "Por que o piso e a meta foram escolhidos assim.", u: "texto", v: function (r) { return r.ind.referencia; } }
    );
    cab = cab.concat(colComum(ctx));
    for (i = 0; i < d.indicadores.length; i++) {
      ind = d.indicadores[i];
      chaves = Object.keys(ind.governos || {});
      for (j = 0; j < chaves.length; j++) {
        g = ind.governos[chaves[j]];
        gv = ctx.gov[g.governo] || null;
        gi = { ind: ind, chave: chaves[j], g: g, gv: gv };
        linhas.push(linhaDe(cab, gi));
      }
    }
    return { cab: cab, linhas: linhas };
  }

  function montarVariaveis(ctx) {
    var d = ctx.d, cab = [], linhas = [], i, pk, extra, grupos, a, b2;
    cab.push(
      { k: "secao", d: "Grupo da variável: modelo, peso_pilar, parte_pilar, integridade, forca (e peso_indicador ou opcao, quando o site os informar).", u: "texto", v: function (r) { return r[0]; } },
      { k: "chave", d: "Nome da variável.", u: "texto", v: function (r) { return r[1]; } },
      { k: "descricao", d: "O que a variável é.", u: "texto", v: function (r) { return r[2]; } },
      { k: "valor", d: "Valor em uso quando o arquivo foi gerado.", u: "número ou texto", v: function (r) { return r[3]; } },
      { k: "padrao", d: "Valor do padrão do site, quando o site informa. Vazio quando não informa.", u: "número", v: function (r) { return r[4]; } },
      { k: "unidade", d: "Unidade ou escala do valor.", u: "texto", v: function (r) { return r[5]; } }
    );
    cab = cab.concat(colComum(ctx));
    function reg(r) { linhas.push(linhaDe(cab, r)); }
    reg(["modelo", "versao", "Versão do modelo de cálculo da Nota geral.", ctx.versao ? "v" + ctx.versao : "", "", "texto"]);
    reg(["modelo", "escala", "Escala das notas.", d.escala || "", "", "texto"]);
    for (i = 0; i < ctx.pil.length; i++) {
      pk = ctx.pil[i];
      reg(["peso_pilar", pk.pilar, "Peso do pilar " + pk.nome + " na Nota geral.", pk.peso, pk.peso_padrao, "pontos de 0 a 40"]);
    }
    for (i = 0; i < ctx.pil.length; i++) {
      pk = ctx.pil[i];
      reg(["parte_pilar", pk.pilar, "Parte da Nota geral que o pilar " + pk.nome + " responde (peso do pilar dividido pela soma dos pesos).", vazio(pk.parte) ? "" : pk.parte * 100, "", "%"]);
    }
    if (d.integridade) {
      reg(["integridade", "peso_casos", "Peso dos casos de corrupção dentro do pilar Integridade.", d.integridade.peso_casos, "", "número de 0 a 1"]);
      reg(["integridade", "peso_wgi", "Peso do índice externo (WGI, Banco Mundial) dentro do pilar Integridade.", d.integridade.peso_wgi, "", "número de 0 a 1"]);
      reg(["integridade", "piso_pontos_por_ano", "Pontos de corrupção por ano de governo que valem nota 0 nos casos.", d.integridade.piso_pontos_por_ano, "", "pontos por ano"]);
      reg(["integridade", "wgi_piso", "Valor do índice externo (WGI) que vale nota 0.", d.integridade.wgi_piso, "", "percentil de 0 a 100"]);
      reg(["integridade", "wgi_meta", "Valor do índice externo (WGI) que vale nota 10.", d.integridade.wgi_meta, "", "percentil de 0 a 100"]);
    }
    if (d.forca) {
      reg(["forca", "kappa", "Expoente (kappa) do multiplicador de força política.", d.forca.kappa, "", "número de 0 a 1"]);
      if (d.forca.pesos) {
        reg(["forca", "peso_cam", "Peso da bancada na Câmara na força política.", d.forca.pesos.cam, "", "número"]);
        reg(["forca", "peso_sen", "Peso da bancada no Senado na força política.", d.forca.pesos.sen, "", "número"]);
        reg(["forca", "peso_stf", "Peso dos ministros do STF indicados na força política.", d.forca.pesos.stf, "", "número"]);
      }
    }
    // se o site passar a informar pesos de indicadores e opções, eles entram aqui sem mudar o código
    extra = d.pesos_indicadores;
    if (extra && typeof extra === "object") {
      grupos = Object.keys(extra);
      for (i = 0; i < grupos.length; i++) {
        if (extra[grupos[i]] && typeof extra[grupos[i]] === "object") {
          a = Object.keys(extra[grupos[i]]);
          for (b2 = 0; b2 < a.length; b2++) { reg(["peso_indicador", grupos[i] + "." + a[b2], "Peso do indicador " + a[b2] + " dentro do grupo " + grupos[i] + ".", extra[grupos[i]][a[b2]], "", "número"]); }
        }
      }
    }
    extra = d.opcoes;
    if (extra && typeof extra === "object") {
      grupos = Object.keys(extra);
      for (i = 0; i < grupos.length; i++) {
        if (!vazio(extra[grupos[i]]) && typeof extra[grupos[i]] !== "object") { reg(["opcao", grupos[i], "Opção de valoração ativa no site.", extra[grupos[i]], "", "texto ou número"]); }
      }
    }
    return { cab: cab, linhas: linhas };
  }

  function objetoJson(ctx) {
    return {
      formato: "brasilemanalise-dados",
      site: "Brasil em Análise",
      endereco: endereco(),
      versao_modelo: ctx.versao,
      data_do_modelo: dataIsoModelo(ctx.d.gerado_em),
      exportado_em: ctx.hoje.toISOString(),
      configuracao_pesos: ctx.conf,
      pesos_dos_pilares: pesosTxt(ctx),
      licenca: LICENCA ? LICENCA.nome : null,
      como_citar: textoCitacao(ctx),
      aviso: "As notas dependem dos pesos e das escolhas ativas quando o arquivo foi gerado. Os números têm ponto decimal. Veja a página Dados abertos do site para o dicionário de colunas e os avisos de uso.",
      dados: ctx.d
    };
  }

  var ARQUIVOS = [
    { id: "notas", titulo: "Notas por governo (CSV)", slug: "notas", ext: "csv", montar: montarNotas,
      desc: "Uma linha por governo (e uma para “PT, todos”): Nota geral, nota de cada pilar, dados de integridade e força política, e os pesos usados." },
    { id: "indicadores", titulo: "Indicadores: valores, notas, pisos e metas (CSV)", slug: "indicadores", ext: "csv", montar: montarIndicadores,
      desc: "Uma linha por indicador e governo: o valor medido, a nota de 0 a 10, o piso e a meta de cada indicador." },
    { id: "pesos", titulo: "Pesos e variáveis do modelo (CSV)", slug: "pesos", ext: "csv", montar: montarVariaveis,
      desc: "Os pesos dos pilares, os parâmetros da Integridade e da força política, e a versão do modelo." },
    { id: "tudo", titulo: "Tudo (JSON)", slug: "tudo", ext: "json", montar: null,
      desc: "A cópia mais completa, com notas, indicadores, pesos e a citação pronta, em um só arquivo para programas." }
  ];

  /* ---------- CSV ---------- */
  function guardaFormula(s) {
    // evita que uma planilha trate texto como fórmula (= + @ ou controle no começo)
    return /^[=+@\t\r]/.test(s) ? "'" + s : s;
  }
  function celulaCsv(v, f, sep) {
    var s = typeof v === "string" ? guardaFormula(v) : numTxt(v, f);
    if (s.indexOf(sep) >= 0 || s.indexOf('"') >= 0 || s.indexOf("\n") >= 0 || s.indexOf("\r") >= 0) {
      s = '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }
  function paraCsv(m, f) {
    var sep = f === "br" ? ";" : ",", out = [], i, j, lin, cab = [];
    for (j = 0; j < m.cab.length; j++) { cab.push(m.cab[j].k); }
    out.push(cab.join(sep));
    for (i = 0; i < m.linhas.length; i++) {
      lin = [];
      for (j = 0; j < m.linhas[i].length; j++) { lin.push(celulaCsv(m.linhas[i][j], f, sep)); }
      out.push(lin.join(sep));
    }
    return out.join("\r\n") + "\r\n";
  }

  function nomeArquivo(a, ctx) {
    var v = String(ctx.versao || "").replace(/[^0-9A-Za-z.\-]/g, "");
    var n = "brasilemanalise-" + a.slug + (v ? "-v" + v : "") + "-" + ctx.iso;
    if (ctx.pers) { n += "-pesos-proprios"; }
    if (a.ext === "csv" && fmt === "int") { n += "-internacional"; }
    return n + "." + a.ext;
  }

  /* ---------- entrega do arquivo ---------- */
  function entregar(blob, nome) {
    var url = W.URL.createObjectURL(blob), a = D.createElement("a");
    if (typeof a.download === "undefined") {
      W.open(url, "_blank");
      setTimeout(function () { W.URL.revokeObjectURL(url); }, 60000);
      return;
    }
    a.href = url;
    a.download = nome;
    a.rel = "noopener";
    a.style.display = "none";
    D.body.appendChild(a);
    a.click();
    setTimeout(function () {
      if (a.parentNode) { a.parentNode.removeChild(a); }
      W.URL.revokeObjectURL(url);
    }, 4000);
  }

  function avisar(msg, erro) {
    if (!ref.status) { return; }
    ref.status.textContent = msg;
    ref.status.className = "dd-status" + (erro ? " dd-erro" : "");
  }

  function baixar(a) {
    var ctx = contexto(), nome, conteudo, mime, blob, m, linhas = "";
    if (!ctx) { avisar("Não foi possível ler os dados do site agora. Recarregue a página e tente de novo.", true); return; }
    try {
      nome = nomeArquivo(a, ctx);
      if (a.ext === "csv") {
        m = a.montar(ctx);
        conteudo = "﻿" + paraCsv(m, fmt);
        mime = "text/csv;charset=utf-8";
        linhas = " (" + m.linhas.length + " linhas, " + m.cab.length + " colunas)";
      } else {
        conteudo = JSON.stringify(objetoJson(ctx), null, 2);
        mime = "application/json;charset=utf-8";
      }
      blob = new W.Blob([conteudo], { type: mime });
      entregar(blob, nome);
      avisar("Arquivo gerado: " + nome + linhas + ". Pesos dos pilares: " + (ctx.pers ? "personalizados (" + pesosTxt(ctx) + ")" : "padrão do site") + ".", false);
    } catch (e) {
      avisar("Não foi possível gerar o arquivo neste navegador. Tente em outro navegador ou atualize o aparelho.", true);
    }
  }

  /* ---------- prévia ---------- */
  function cabCol(txt) {
    var th = el("th", null, txt);
    th.setAttribute("scope", "col");
    return th;
  }
  function previaCsv(a, ctx) {
    var m = a.montar(ctx), box = el("div", "tblwrap dd-tw"), tb = el("table", "gt dd-tab"), th = el("thead"), tr = el("tr"), tbd = el("tbody"), i, j, td, n = Math.min(5, m.linhas.length);
    box.tabIndex = 0;
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", "Prévia de " + a.titulo + ", com rolagem lateral");
    for (j = 0; j < m.cab.length; j++) { tr.appendChild(cabCol(m.cab[j].k)); }
    th.appendChild(tr);
    tb.appendChild(th);
    for (i = 0; i < n; i++) {
      tr = el("tr");
      for (j = 0; j < m.cab.length; j++) {
        td = el("td", typeof m.linhas[i][j] === "number" ? "n" : null, numTxt(m.linhas[i][j], fmt));
        tr.appendChild(td);
      }
      tbd.appendChild(tr);
    }
    tb.appendChild(tbd);
    box.appendChild(tb);
    return { no: box, info: "Mostrando " + n + " de " + m.linhas.length + " linhas e " + m.cab.length + " colunas." };
  }
  function previaJson(ctx) {
    var txt = JSON.stringify(objetoJson(ctx), null, 2).split("\n"), pre = el("pre", "dd-pre gl-skip"), n = 28;
    pre.tabIndex = 0;
    pre.setAttribute("aria-label", "Começo do arquivo JSON, com rolagem");
    pre.textContent = txt.slice(0, n).join("\n") + (txt.length > n ? "\n…" : "");
    return { no: pre, info: "Mostrando as primeiras " + Math.min(n, txt.length) + " de " + txt.length + " linhas." };
  }
  function desenharPrevia(a) {
    var c = ref.cards[a.id], ctx, r;
    if (!c || !c.det.open) { return; }
    ctx = contexto();
    limpar(c.corpo);
    if (!ctx) { c.corpo.appendChild(p("dd-nota", "Os dados não estão disponíveis agora.")); return; }
    try {
      r = a.ext === "csv" ? previaCsv(a, ctx) : previaJson(ctx);
      add(c.corpo, p("dd-nota", r.info), r.no);
    } catch (e) {
      c.corpo.appendChild(p("dd-nota", "Não foi possível montar a prévia."));
    }
  }

  /* ---------- citação ---------- */
  function textoCitacao(ctx) {
    var t = "BRASIL EM ANÁLISE. Notas e indicadores dos governos do Brasil (1995–2026): dados abertos. Versão " + ctx.versao + " do modelo" +
      (ctx.d.gerado_em ? " (" + ctx.d.gerado_em + ")" : "") + ". Disponível em: " + endereco() + "#dados. Acesso em: " + dataAbnt(ctx.hoje) + ".";
    t += ctx.pers ? " Pesos dos pilares ajustados por quem usou: " + pesosTxt(ctx) + "." : " Pesos dos pilares: padrão do site.";
    return t;
  }

  function copiarTexto(txt, ok, falha) {
    function reserva() {
      var ta = D.createElement("textarea"), certo = false;
      ta.value = txt;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "0";
      ta.style.left = "-9999px";
      D.body.appendChild(ta);
      ta.select();
      try { ta.setSelectionRange(0, txt.length); } catch (e) { /* segue */ }
      try { certo = D.execCommand("copy"); } catch (e2) { certo = false; }
      D.body.removeChild(ta);
      if (certo) { ok(); } else { falha(); }
    }
    if (W.navigator.clipboard && W.navigator.clipboard.writeText) {
      W.navigator.clipboard.writeText(txt).then(ok, reserva);
    } else {
      reserva();
    }
  }

  /* ---------- partes que mudam com os pesos ---------- */
  function desenharConfig(ctx) {
    var box = ref.cfg, ul, i, pk, it, li, d = ctx ? ctx.d : null;
    limpar(box);
    add(box, el("h3", null, "O que será exportado agora"));
    if (!ctx) { box.appendChild(p("dd-nota", "Os dados do site não estão disponíveis agora. Recarregue a página.")); return; }
    ul = el("ul", "dd-pesos");
    for (i = 0; i < ctx.pil.length; i++) {
      pk = ctx.pil[i];
      it = el("li", pk.peso !== pk.peso_padrao ? "dd-mudou" : null);
      add(it, pk.nome + " ", el("b", null, String(pk.peso)));
      if (pk.peso !== pk.peso_padrao) { add(it, el("span", "dd-pad", " (padrão " + pk.peso_padrao + ")")); }
      ul.appendChild(it);
    }
    add(box,
      lista([
        [el("b", null, "Modelo: "), "versão " + ctx.versao + (d.gerado_em ? ", de " + d.gerado_em : "") + "."],
        [el("b", null, "Pesos dos pilares: "), ctx.pers ? "os seus, diferentes do padrão do site." : "os do padrão do site."]
      ], "dd-lista")
    );
    box.appendChild(ul);
    li = lista([
      "Integridade: casos de corrupção " + nBR(d.integridade ? d.integridade.peso_casos : "") + " e índice externo (WGI) " + nBR(d.integridade ? d.integridade.peso_wgi : "") + ".",
      "Força política: expoente " + nBR(d.forca ? d.forca.kappa : "") + "."
    ], "dd-lista");
    box.appendChild(li);
    add(box, p("dd-nota",
      "Esses pesos vão dentro de cada arquivo. Para exportar o padrão do site, restaure os pesos em ",
      link("#regua", "Ajuste os pesos"),
      " e volte aqui. Outras escolhas do site (pesos dos indicadores dentro de cada pilar e opções como a correção pela inflação) também mudam as notas. Leia os ",
      link("#dd-avisos", "avisos"), "."));
  }

  function desenharCitacao(ctx) {
    if (!ref.cita) { return; }
    ref.cita.textContent = ctx ? textoCitacao(ctx) : "Os dados do site não estão disponíveis agora.";
  }

  function atualizar() {
    var ctx, i, a, c, nome, m;
    // só refaz quando a página está aberta: o site avisa "update" a cada ajuste de peso em qualquer página
    if (!construida || (typeof B.paginaAtual === "function" && B.paginaAtual() !== "dados")) { return; }
    ctx = contexto();
    desenharConfig(ctx);
    desenharCitacao(ctx);
    for (i = 0; i < ARQUIVOS.length; i++) {
      a = ARQUIVOS[i];
      c = ref.cards[a.id];
      if (!ctx) { c.meta.textContent = ""; continue; }
      nome = nomeArquivo(a, ctx);
      m = null;
      if (a.ext === "csv") { try { m = a.montar(ctx); } catch (e) { m = null; } }
      c.meta.textContent = nome + (m ? " · " + m.linhas.length + " linhas · " + m.cab.length + " colunas" : "");
      desenharPrevia(a);
    }
  }

  /* ============================================================
     MONTAGEM DA PÁGINA
     ============================================================ */
  function cabecalho() {
    var h = el("header", "wrap page-head"), nav = el("nav", "chips dd-chips"), itens = [
      ["#dd-baixar", "Baixar"], ["#dd-usar", "Como usar"], ["#dd-dicionario", "Colunas"], ["#dd-avisos", "Avisos"], ["#dd-citar", "Como citar"]
    ], i;
    nav.setAttribute("aria-label", "Nesta página");
    for (i = 0; i < itens.length; i++) { nav.appendChild(link(itens[i][0], itens[i][1])); }
    add(h,
      el("p", "eyebrow", "Dados abertos"),
      el("h1", null, "Baixe os números do site"),
      el("p", "dek", "Os mesmos números que formam as notas, em arquivos que abrem no Excel, no Google Planilhas e em programas de análise. Os arquivos são gerados no seu aparelho, a partir dos pesos que você estiver usando."),
      nav
    );
    return h;
  }

  function blocoFormato() {
    var f = el("fieldset", "dd-fmt"), lg = el("legend", null, "Formato dos números nos arquivos CSV"), op = [
      ["br", "Brasileiro: ponto e vírgula entre as colunas e vírgula nos decimais (abre direto no Excel em português)"],
      ["int", "Internacional: vírgula entre as colunas e ponto nos decimais"]
    ], i, lab, inp, tx;
    f.appendChild(lg);
    for (i = 0; i < op.length; i++) {
      lab = el("label", "dd-op");
      inp = D.createElement("input");
      inp.type = "radio";
      inp.name = "dd-formato";
      inp.value = op[i][0];
      inp.checked = op[i][0] === fmt;
      inp.addEventListener("change", aoMudarFormato);
      tx = el("span", null, op[i][1]);
      add(lab, inp, tx);
      f.appendChild(lab);
    }
    f.appendChild(p("dd-nota", "O arquivo JSON usa sempre ponto decimal. Os CSV começam com a marca UTF-8 (BOM), para os acentos aparecerem certos."));
    return f;
  }
  function aoMudarFormato(ev) {
    var v = ev.target.value === "int" ? "int" : "br";
    fmt = v;
    gravarPref(v);
    atualizar();
  }

  function cartao(a) {
    var c = el("article", "dd-card"), h = el("h3", null, a.titulo), meta = el("p", "dd-arq gl-skip"), ac = el("div", "dd-acoes"),
      btn = el("button", "btn primary dd-btn", a.ext === "csv" ? "Baixar CSV" : "Baixar JSON"),
      det = el("details", "dd-prev"), sm = el("summary", null, a.ext === "csv" ? "Ver as primeiras linhas" : "Ver o começo do arquivo"), corpo = el("div", "dd-prev-corpo");
    h.id = "dd-t-" + a.id;
    btn.type = "button";
    btn.id = "dd-b-" + a.id;
    btn.setAttribute("aria-labelledby", btn.id + " " + h.id);
    btn.addEventListener("click", function () { baixar(a); });
    ac.appendChild(btn);
    det.appendChild(sm);
    det.appendChild(corpo);
    det.addEventListener("toggle", function () { desenharPrevia(a); });
    add(c, h, p(null, a.desc), meta, ac, det);
    ref.cards[a.id] = { meta: meta, det: det, corpo: corpo };
    return c;
  }

  function secBaixar() {
    var s = secao("dd-baixar", "Baixar os arquivos", "Escolha o formato dos números e baixe o arquivo que precisa. Nada é enviado para fora: o arquivo é montado aqui, no seu navegador."), g = el("div", "dd-cards"), i;
    ref.cfg = el("div", "dd-cfg");
    s.appendChild(ref.cfg);
    s.appendChild(blocoFormato());
    ref.cards = {};
    for (i = 0; i < ARQUIVOS.length; i++) { g.appendChild(cartao(ARQUIVOS[i])); }
    s.appendChild(g);
    ref.status = el("p", "dd-status");
    ref.status.setAttribute("role", "status");
    ref.status.setAttribute("aria-live", "polite");
    s.appendChild(ref.status);
    return s;
  }

  function secUsar() {
    var s = secao("dd-usar", "Como usar", "Cada arquivo CSV tem uma linha de títulos e depois os dados. Células vazias querem dizer “sem dado”."), g = el("div", "dd-cards dd-usos"), c1 = el("div", "dd-card"), c2 = el("div", "dd-card"), pre1 = el("pre", "dd-pre gl-skip"), pre2 = el("pre", "dd-pre gl-skip");
    pre1.tabIndex = 0;
    pre2.tabIndex = 0;
    pre1.textContent = 'Python (pandas)\nimport pandas as pd\ndf = pd.read_csv("arquivo.csv", sep=";", decimal=",", encoding="utf-8-sig")';
    pre2.textContent = 'R\ndf <- read.csv2("arquivo.csv", fileEncoding = "UTF-8-BOM")';
    add(c1,
      el("h3", null, "Em planilhas"),
      lista([
        [el("b", null, "Excel em português: "), "baixe no formato brasileiro e abra o arquivo. Acentos e vírgulas decimais aparecem certos."],
        [el("b", null, "Google Planilhas: "), "em Arquivo, Importar, Enviar. Em “Tipo de separador”, deixe “Detectar automaticamente” ou escolha “Ponto e vírgula”. Se os números virarem texto, confira a configuração regional da planilha."],
        [el("b", null, "Formato internacional: "), "use quando o seu programa espera vírgula entre colunas e ponto nos decimais."]
      ])
    );
    add(c2,
      el("h3", null, "Em programas de análise"),
      p("dd-nota", "Formato brasileiro (ponto e vírgula, vírgula decimal):"),
      pre1, pre2,
      p("dd-nota", "No formato internacional, leia como CSV comum: pd.read_csv(\"arquivo.csv\", encoding=\"utf-8-sig\") ou read.csv(\"arquivo.csv\", fileEncoding = \"UTF-8-BOM\"). O JSON abre com qualquer linguagem."));
    add(g, c1, c2);
    s.appendChild(g);
    return s;
  }

  function secDicionario() {
    var s = secao("dd-dicionario", "Dicionário de colunas", "O que cada coluna quer dizer. A lista vem da mesma definição que gera os arquivos, por isso sempre bate com o que você baixa."), ctx = contexto(), i, a, det, dl, m, j, c;
    if (!ctx) { s.appendChild(p("dd-nota", "Os dados do site não estão disponíveis agora.")); return s; }
    for (i = 0; i < ARQUIVOS.length; i++) {
      a = ARQUIVOS[i];
      det = el("details", "dd-dic");
      add(det, el("summary", null, a.ext === "csv" ? a.titulo : "Tudo (JSON): campos"));
      if (a.ext === "csv") {
        m = a.montar(ctx);
        dl = el("dl", "dd-dl");
        for (j = 0; j < m.cab.length; j++) {
          c = m.cab[j];
          dl.appendChild(el("dt", "gl-skip", c.k));
          dl.appendChild(el("dd", null, c.d + " (" + c.u + ")"));
        }
        det.appendChild(dl);
      } else {
        dl = el("dl", "dd-dl");
        [["formato, site, endereco", "Identificação do arquivo e do site."],
         ["versao_modelo, data_do_modelo, exportado_em", "Versão e data do modelo e momento em que o arquivo foi gerado."],
         ["configuracao_pesos, pesos_dos_pilares", "Se os pesos dos pilares são os do padrão ou os do visitante, e quais são."],
         ["licenca, como_citar", "Licença dos dados (vazia enquanto o site não definir uma) e texto pronto de citação."],
         ["aviso", "Resumo dos cuidados de uso."],
         ["dados.pilares", "Pilares com peso em uso, parte da nota geral e peso padrão."],
         ["dados.integridade, dados.forca", "Pesos e parâmetros da Integridade e da força política."],
         ["dados.indicadores", "Cada indicador, com piso, meta, referência e, por governo, valor e nota."],
         ["dados.notas", "Nota geral e nota de cada pilar por governo, com os campos de corrupção e de força política."]
        ].forEach(function (par) { dl.appendChild(el("dt", "gl-skip", par[0])); dl.appendChild(el("dd", null, par[1])); });
        det.appendChild(dl);
      }
      s.appendChild(det);
    }
    return s;
  }

  function secAvisos() {
    var s = secao("dd-avisos", "Antes de usar", "Quatro cuidados para ler os números do jeito certo."), g = el("div", "dd-cards"), c1 = el("div", "dd-card"), c2 = el("div", "dd-card"), c3 = el("div", "dd-card"), c4 = el("div", "dd-card");
    add(c1, el("h3", null, "Três tipos de número"), lista([
      [el("b", null, "Valor medido: "), "vem de uma fonte pública, citada na página ", link("#fontes", "Fontes"), "."],
      [el("b", null, "Nota calculada: "), "o site converte o valor em nota de 0 a 10 com o piso e a meta de cada indicador. As notas dos pilares e a Nota geral são médias ponderadas. Nenhum instituto publica essas notas."],
      [el("b", null, "Estimativa ou critério do site: "), "alguns insumos, como os valores de força política, a pontuação do catálogo de Direitos e minorias e os pontos de corrupção, seguem critérios do próprio site. Eles estão descritos em ", link("#metodo", "Como calculamos"), "."]
    ]));
    add(c2, el("h3", null, "As notas dependem dos pesos"), lista([
      "Mudar os pesos muda as notas. Cada arquivo diz se os pesos dos pilares são os do padrão ou os seus e traz os valores.",
      "Os pesos dos indicadores dentro de cada pilar e as opções de valoração (como a correção pela inflação) também mudam as notas, mas por ora não vêm listados nos arquivos.",
      "O nome do arquivo ganha “pesos-proprios” quando você mudou os pesos dos pilares."
    ]));
    add(c3, el("h3", null, "Compare com cuidado"), lista([
      "Os valores são, em geral, variações médias por ano de governo. Governos têm durações diferentes.",
      "Diferenças menores que 0,5 ponto entre governos não permitem concluir qual é maior.",
      "A mesma régua, os mesmos pisos e as mesmas metas valem para todos os governos.",
      "O arquivo de notas traz seis governos e “PT, todos”. FHC e Temer aparecem no arquivo de indicadores."
    ]));
    add(c4, el("h3", null, "Fontes originais e erros"), lista([
      ["Os números originais pertencem às fontes citadas em ", link("#fontes", "Fontes"), ". Confira as condições de uso de cada fonte antes de reutilizar os valores originais."],
      "A Régua política (notas rotuladas como publicada, derivada ou estimada) não está nestes arquivos.",
      ["Viu um erro? Use o botão Corrigir no próprio item ou a página ", link("#sobre", "Sobre e correções"), "."]
    ]));
    add(g, c1, c2, c3, c4);
    s.appendChild(g);
    return s;
  }

  function secCitar() {
    var s = secao("dd-citar", "Como citar", "Ao usar estes dados, cite o Brasil em Análise, a versão do modelo e a data em que você acessou. O texto abaixo já vem pronto e muda com os seus pesos."), q = el("p", "dd-cita gl-skip"), ac = el("div", "dd-acoes"), btn = el("button", "btn dd-btn", "Copiar texto"), ctx = contexto();
    q.id = "dd-cita";
    q.tabIndex = 0;
    ref.cita = q;
    btn.type = "button";
    btn.addEventListener("click", function () {
      var c = contexto();
      if (!c) { avisar("Não foi possível ler os dados do site agora.", true); return; }
      copiarTexto(textoCitacao(c), function () { avisarCopia("Texto copiado."); }, function () {
        avisarCopia("Não foi possível copiar sozinho. O texto está selecionado: use o copiar do seu aparelho.", true);
        selecionar(q);
      });
    });
    ac.appendChild(btn);
    ref.copia = el("p", "dd-status");
    ref.copia.setAttribute("role", "status");
    ref.copia.setAttribute("aria-live", "polite");
    add(s, q, ac, ref.copia);
    if (LICENCA && LICENCA.nome) {
      s.appendChild(p("dd-nota", "Licença dos dados: ", LICENCA.url ? link(LICENCA.url, LICENCA.nome) : LICENCA.nome, "."));
    }
    ref.cita.textContent = ctx ? textoCitacao(ctx) : "Os dados do site não estão disponíveis agora.";
    return s;
  }
  function avisarCopia(msg, erro) {
    if (!ref.copia) { return; }
    ref.copia.textContent = msg;
    ref.copia.className = "dd-status" + (erro ? " dd-erro" : "");
  }
  function selecionar(no) {
    var r, sel;
    try {
      r = D.createRange();
      r.selectNodeContents(no);
      sel = W.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    } catch (e) { /* sem seleção */ }
  }

  function montar() {
    var host = D.getElementById("modDados");
    if (!host || construida) { return; }
    construida = true;
    fmt = lerPref();
    add(host, cabecalho(), secBaixar(), secUsar(), secDicionario(), secAvisos(), secCitar());
    host.setAttribute("data-dd", "1");
  }

  /* ---------- link no rodapé ---------- */
  function linkNoRodape() {
    var slot = D.getElementById("slotRodape"), nav, a;
    if (!slot || D.getElementById("dd-foot-link")) { return; }
    nav = D.getElementById("rodapeExtra");
    if (!nav) {
      nav = D.createElement("nav");
      nav.id = "rodapeExtra";
      nav.className = "foot-extra";
      nav.setAttribute("aria-label", "Mais");
      slot.appendChild(nav);
    }
    a = D.createElement("a");
    a.id = "dd-foot-link";
    a.className = "dd-foot-link";
    a.href = "#dados";
    a.textContent = NOME_PAGINA;
    nav.appendChild(a);
  }

  /* ---------- ganchos ---------- */
  function aoMudarPagina(nome) {
    if (nome === "dados") {
      montar();
      atualizar();
      D.title = NOME_PAGINA + " | Brasil em Análise";
    }
  }

  function iniciar() {
    linkNoRodape();
    B.on("page", aoMudarPagina);
    B.on("update", atualizar);
    if (typeof B.paginaAtual === "function" && B.paginaAtual() === "dados") {
      aoMudarPagina("dados");
    } else if (/^#dd-/.test(W.location.hash)) {
      // link direto para uma parte desta página: monta e pede ao roteador do site para ir até lá
      montar();
      try { W.dispatchEvent(new Event("hashchange")); } catch (e) { /* sem rolagem automática */ }
    }
  }

  if (D.readyState === "loading") { D.addEventListener("DOMContentLoaded", iniciar); } else { iniciar(); }
})();
