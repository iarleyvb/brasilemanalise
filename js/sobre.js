/* Módulo sobre: página "Sobre e correções" (#sobre) (prefixo sb-).
   Seções: o que é o site, como funciona, imparcialidade, fontes e checagem, privacidade, política de correções,
   quem faz e contato. Os números (pilares, pesos, versão do modelo) vêm de window.BEA; o resto é texto
   escrito a partir do que está em index.html (Como calculamos, Régua política, rodapé).
   Também põe o link "Sobre e correções" no rodapé.
   Sem rede, sem rastreamento, sem cookies. Não guarda nada no navegador, só LÊ e APAGA as chaves do site
   quando a pessoa pede (botão "Apagar as minhas escolhas salvas").
   Sintaxe segura para iOS 13+: sem "?.", sem "??", sem lookbehind. */
(function () {
  "use strict";

  /* ============================================================
     DADOS DE CONTATO: o dono preenche aqui.
       nome:   nome (pessoa ou grupo) que aparece em "Quem faz" e em "Contato". Deixe null se não quiser mostrar.
       email:  e-mail para correções. Deixe null para não mostrar. Se preencher, o diálogo "Enviar correção"
               ganha o botão "Enviar por e-mail".
       github: "dono/repositório" do GitHub. O canal principal é abrir um pedido (issue) nele.
     ============================================================ */
  var CONTATO = { nome: null, email: null, github: "iarleyvb/brasilemanalise" };

  var B = window.BEA;
  var D = document, W = window;

  // os outros arquivos leem daqui (js/correcoes.js)
  W.BEA_CONTATO = CONTATO;

  if (!B || typeof B.on !== "function") { return; }

  var NOME_PAGINA = "Sobre e correções";
  var K_PLACAR = "placar-pt-pl-v3";            // pesos, filtros e notas do site (index.html)
  var K_REGUA = "brasilemanalise_rp_v1";       // escolhas da Régua política (index.html)
  var K_AVISO = "bea_sb_apagado";              // sessionStorage: mostra "apagado" depois de recarregar
  var construida = false;

  /* ---------- utilidades ---------- */
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
  function b(txt) { return el("b", null, txt); }
  function link(href, txt, externo) {
    var a = el("a", null, txt);
    a.href = href;
    if (externo) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
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
  function secao(id, tit, lead) {
    var s = el("section", "wrap sb-sec"), cab = el("div", "sec-head"), h = el("h2", null, tit);
    s.id = id;
    h.id = id + "-h";
    s.setAttribute("aria-labelledby", h.id);
    cab.appendChild(h);
    if (lead) { cab.appendChild(el("p", "lead", lead)); }
    s.appendChild(cab);
    return s;
  }
  function caixa(titulo) {
    var c = el("div", "mbox sb-box");
    if (titulo) { c.appendChild(el("h3", null, titulo)); }
    return c;
  }
  function trechoSeguro(fn, padrao) {
    try { return fn(); } catch (e) { return padrao; }
  }
  function urlRepo() { return "https://github.com/" + CONTATO.github; }
  function emailValido(s) { return typeof s === "string" && /^[^\s@<>"?&]+@[^\s@<>"?&]+\.[^\s@<>"?&]+$/.test(s); }

  /* ---------- dados do site ---------- */
  function pilares() { return trechoSeguro(function () { return B.pilares() || []; }, []); }
  function pesosPadrao() { return trechoSeguro(function () { return B.estado().pilW_padrao || {}; }, {}); }
  function versaoModelo() {
    var v = trechoSeguro(function () { return B.versao || ""; }, "");
    var d = trechoSeguro(function () { return (B.dataset() || {}).gerado_em || ""; }, "");
    return { v: String(v || ""), d: String(d || "") };
  }
  function textoDoSite(sel) {
    var e = D.querySelector(sel);
    return e ? e.textContent.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "") : "";
  }
  function paginasDoSite() {
    // nome e frase de cada página, lidos dos cartões da página inicial (assim acompanham o texto do site)
    var cards = D.querySelectorAll(".hcard"), out = [], i, c, nome, desc, href;
    for (i = 0; i < cards.length; i++) {
      c = cards[i];
      href = c.getAttribute("href");
      nome = c.querySelector(".eyebrow");
      desc = c.querySelector("p");
      if (href && nome && desc) { out.push({ href: href, nome: nome.textContent.trim(), desc: desc.textContent.trim() }); }
    }
    return out;
  }

  /* ---------- as seções ---------- */
  function cabecalho() {
    var h = el("header", "wrap page-head"), nav = el("nav", "chips"), i, a, itens = [
      ["#sb-oque", "O que é"], ["#sb-metodo", "Como funciona"], ["#sb-imparcial", "Imparcialidade"],
      ["#sb-fontes", "Fontes e checagem"], ["#sb-privacidade", "Privacidade"], ["#sb-correcoes", "Correções"],
      ["#sb-contato", "Contato"]
    ];
    add(h, el("p", "eyebrow", "Sobre"), el("h1", null, NOME_PAGINA),
      el("p", "dek", "O que é este site, como ele calcula, de onde vêm os números, o que ele guarda no seu aparelho e como pedir uma correção."));
    nav.setAttribute("aria-label", "Nesta página");
    for (i = 0; i < itens.length; i++) {
      a = link(itens[i][0], itens[i][1]);
      if (i === itens.length - 2) { a.className = "go"; }
      nav.appendChild(a);
    }
    h.appendChild(nav);
    return h;
  }

  function secOQue() {
    var s = secao("sb-oque", "O que é o site",
      "O Brasil em Análise compara os governos do Brasil de 1995 a 2026 com números públicos. Cada número, caso, feito e promessa leva o link da fonte."),
      c = caixa(), pgs = paginasDoSite(), ul, i, li, a;
    add(c,
      p(null, "O lema do site é “Você escolhe a régua. A régua vale para todos.” Você decide quanto pesa cada tema. O site aplica o mesmo peso a todos os governos e a todos os partidos."),
      p(null, "O site não recomenda voto. Ele mostra fatos, contas e fontes. Esta é uma página informativa e apartidária. A nota que você der aos candidatos, se der, é sua."));
    s.appendChild(c);
    if (pgs.length) {
      ul = el("ul", "sb-pgs");
      ul.setAttribute("aria-label", "Páginas do site");
      for (i = 0; i < pgs.length; i++) {
        li = el("li");
        a = link(pgs[i].href, "");
        a.className = "sb-pg";
        add(a, b(pgs[i].nome), el("span", null, pgs[i].desc));
        li.appendChild(a);
        ul.appendChild(li);
      }
      s.appendChild(ul);
    }
    return s;
  }

  function listaPesos() {
    var pil = pilares(), pad = pesosPadrao(), ul, i, li, topo, v;
    if (!pil.length) { return null; }
    ul = el("ul", "sb-pesos");
    ul.setAttribute("aria-label", "Os oito pilares da Nota geral e o peso de cada um no padrão");
    for (i = 0; i < pil.length; i++) {
      v = pad[pil[i].k];
      li = el("li");
      topo = el("div", "sb-pesos-topo");
      add(topo, b(pil[i].t), el("span", "sb-num", (typeof v === "number" ? "peso " + v : "")));
      add(li, topo, el("p", null, pil[i].d));
      ul.appendChild(li);
    }
    return ul;
  }

  function secMetodo() {
    var s = secao("sb-metodo", "Como funciona",
      "Um resumo do método. A conta inteira está aberta no site, com fórmulas, valores e exemplos."),
      g = el("div", "sb-grid"), c1 = caixa("Em quatro passos"), c2 = caixa("O que a conta não consegue medir"), c3 = caixa("Onde ver a conta completa"), ver = versaoModelo(), tab, ol, tx;
    ol = el("ol", "sb-passos");
    add(ol,
      add(el("li"), b("Reunimos os dados. "), "Valores de órgãos como PF, MPF, TCU, CGU, IBGE e Banco Central, com a fonte de cada número."),
      add(el("li"), b("Cada indicador vira uma nota de 0 a 10. "), "Cada um tem um piso (vale 0) e uma meta (vale 10), fixos e iguais para todos os governos."),
      add(el("li"), b("Você ajusta o peso de cada pilar. "), "A Nota geral junta os oito pilares, e cada pilar vale a sua parte na soma. Os pesos são relativos."),
      add(el("li"), b("A régua vale para todos. "), "O peso que você escolher se aplica igual a todos os governos e partidos. Mudou a régua, mudou para todo mundo."));
    c1.appendChild(ol);
    add(c1, p("sb-nota", "A corrupção não é descontada à parte: ela é o pilar Integridade, com peso próprio. A força do presidente no Congresso e no STF entra como um multiplicador moderado em Direitos e minorias e em Feitos e promessas."));
    tab = listaPesos();
    if (tab) { add(c1, el("h4", null, "Os pilares e o peso padrão de cada um"), tab, p("sb-nota", "Cada peso é um número de 0 a 40 que você pode mudar em ", link("#regua", "Ajuste os pesos"), ". Aqui está o padrão do site.")); }

    add(c2, p(null, "Toda nota resume muita coisa em um número. Estes limites estão descritos em Como calculamos:"),
      lista([
        "Direitos e minorias mede medidas de governo, não resultados. Quem discorda dessa agenda pode baixar o peso dele.",
        "Meio ambiente mede um único bioma, a Amazônia.",
        "Lula 3 está em curso. Os casos e as contas deixadas ainda podem mudar.",
        "A integridade depende do que foi investigado e revelado até hoje, e mandatos recentes têm menos casos apurados.",
        "As mesmas metas valem para todos os períodos, o que favorece os mandatos mais antigos. A revisão estimou esse viés em até 0,4 ponto."
      ]),
      p("sb-nota", "A lista completa está em ", link("#imparcialidade", "Como calculamos, Revisão de imparcialidade"), "."));

    add(c3, p(null, "Em ", link("#metodo", "Como calculamos"), " está a explicação por tema. Em ", link("#conta-completa", "A conta completa"),
      " estão as fórmulas, as variáveis, os pesos, os pisos e as metas, os valores usados em cada governo, um exemplo passo a passo, a tabela “E se fosse diferente?” e a análise de robustez. Todos os links usados no site estão em ", link("#fontes", "Fontes"), "."));
    tx = ver.v ? "Versão do modelo: " + ver.v + (ver.d ? " (" + ver.d + ")" : "") + "." : "";
    if (tx) { c3.appendChild(p("sb-mono", tx)); }
    add(g, c1, c2, c3);
    s.appendChild(g);
    return s;
  }

  function secImparcial() {
    var s = secao("sb-imparcial", "Imparcialidade",
      "O site trata todos pela mesma régua. Aqui estão as regras e o que já corrigimos quando não cumpria isso."),
      g = el("div", "sb-grid sb-2"), c1 = caixa("As regras de tratamento igual"), c2 = caixa("Histórico de revisão"), c3 = caixa("Exemplos do que foi corrigido");
    add(c1, lista([
      [b("Mesma régua. "), "O peso que você escolhe vale igual para todos os governos e partidos."],
      [b("Mesmas metas. "), "Pisos e metas dos indicadores são fixos e iguais para todos os períodos."],
      [b("Mesma escala. "), "Os casos de corrupção entram pela mesma escala de estrelas de gravidade para os dois lados."],
      [b("Fonte em cada número. "), "Cada valor, feito e promessa leva o link de onde veio, inclusive críticas e checagens."],
      [b("Investigação não é condenação. "), "Os citados em casos abertos negam irregularidades, e o site mostra a etapa de cada caso na Justiça."],
      [b("Sem voto recomendado. "), "O site mostra fatos e contas. A nota dos candidatos, se houver, é a sua."]
    ]));

    add(c2, p(null, "A conta já passou por várias versões e revisões. Todas estão descritas em ", link("#conta-completa", "A conta completa"), ":"),
      lista([
        [b("Versão 1. "), "Cada indicador valia 0 no pior governo e 10 no melhor da amostra, e a corrupção era subtraída da média dos pilares."],
        [b("Versão 2.0. "), "Pisos e metas fixos. A corrupção virou o pilar Integridade, com peso próprio."],
        [b("Versão 2.1. "), "Três revisões, de neutralidade, de matemática e de validade dos indicadores, apontaram problemas, e as correções foram aplicadas."],
        [b("Revisão de imparcialidade, outubro de 2026. "), "Revisamos toda a conta atrás de regras que puxavam o resultado para um lado. A regra de cada correção é a mesma para todos os governos."]
      ]),
      p("sb-nota", "O texto completo está em ", link("#imparcialidade", "Como calculamos, Revisão de imparcialidade"), ". Lá também está a tabela de quanto cada escolha muda a nota geral."));

    add(c3, p(null, "A revisão achou regras que puxavam para os dois lados. Alguns exemplos, em resumo:"),
      el("h4", null, "Puxavam para o PL"),
      lista([
        "Casos sem valor em reais ficavam fora da conta por padrão. Agora entram, pela mesma escala de estrelas dos dois lados.",
        "A conta dos anos de choque dobrava as taxas de Bolsonaro. Agora os anos de crise e de recuperação saem da média para todos.",
        "O multiplicador de força dava vantagem a Bolsonaro. Agora é moderado, e o STF pesa um quarto da Câmara."
      ]),
      el("h4", null, "Puxavam para o PT"),
      lista([
        "O Petrolão era corrigido pela inflação desde 2015, embora o dinheiro tenha saído de 2004 a 2014. Agora cada governo é corrigido a partir do meio do período em que o dinheiro saiu nele.",
        "Resultados como queda do desemprego, saída do Mapa da Fome e queda do desmatamento contavam duas vezes. Agora contam só nos pilares deles.",
        "A escala do índice do Banco Mundial era esticada. Agora é fixa."
      ]),
      p("sb-nota", "Também criamos uma regra nova para o valor central dos casos: vale o que foi reconhecido pela Justiça, pelo TCU ou CGU, pela própria vítima ou em transferências identificadas pela investigação. Estimativas de procuradores, policiais e imprensa vão para a estimativa máxima."));

    add(g, c1, c2, c3);
    s.appendChild(g);
    s.appendChild(p("sb-nota sb-pos", "Achou que alguma regra favorece um lado? Diga. Veja ", link("#sb-correcoes", "como pedir uma correção"), "."));
    return s;
  }

  function secFontes() {
    var s = secao("sb-fontes", "Fontes e checagem",
      "Nenhum número fica sem fonte. Quando a fonte é uma estimativa ou uma conversão nossa, o site diz."),
      g = el("div", "sb-grid sb-2"), c1 = caixa("Como cada item cita a fonte"), c2 = caixa("Publicada, derivada ou estimada (Régua política)");
    add(c1, lista([
      "Os dados vêm de órgãos públicos, da imprensa e de agências de checagem, citados em cada item.",
      "Casos, feitos, promessas, falas e gastos trazem os links das fontes, inclusive críticas e checagens.",
      "Cada caso mostra a etapa na Justiça, o grau (de A, “Comprovado na Justiça”, a D, “Suspeita ou caso arquivado”) e como entra na conta. Alguns trazem um bloco “Checagem do número”.",
      "Os links levam aos sites originais e podem mudar ou sair do ar com o tempo."
    ]), p("sb-nota", "Todos os links estão reunidos, por tipo e por site, em ", link("#fontes", "Fontes"), ", com busca."));
    add(c2, p(null, "Nenhum dos cientistas políticos citados publicou notas de 0 a 100 para partidos, governos ou ideologias do Brasil. As notas da ", link("#regua-politica", "Régua política"), " são conversões, derivações ou estimativas do site, e cada nota diz de que tipo é:"),
      lista([
        [b("Publicada: "), "há um número em pesquisa ou obra, convertido para 0 a 100."],
        [b("Derivada: "), "o critério explícito do autor foi aplicado a ao menos um item documental citado, como votação, programa, política ou coalizão."],
        [b("Estimada: "), "é um julgamento do site que aplica o conceito."],
        [b("Âncora: "), "o ator de centro vale 50 por construção e não é medido."]
      ]),
      p("sb-nota", "A margem de cada nota é de cerca de 5 pontos (publicada), 6 (derivada) e 8 (estimada). Diferenças menores que isso entre atores não são conclusivas. A posição no eixo esquerda-direita não mede qualidade, desempenho nem grau de democracia."));
    add(g, c1, c2);
    s.appendChild(g);
    return s;
  }

  /* ---------- privacidade ---------- */
  var elAviso = null, elConf = null, btnApagar = null, btnSim = null, btnNao = null;

  function apagarPrefs() {
    var nomes = ["localStorage", "sessionStorage"], n, st, i, k, chaves;
    for (n = 0; n < nomes.length; n++) {
      try {
        st = W[nomes[n]];
        chaves = [];
        for (i = 0; i < st.length; i++) {
          k = st.key(i);
          if (k && (k.indexOf("bea_") === 0 || k === K_PLACAR || k === K_REGUA)) { chaves.push(k); }
        }
        for (i = 0; i < chaves.length; i++) { st.removeItem(chaves[i]); }
      } catch (e) { /* armazenamento bloqueado: não há o que apagar */ }
    }
    try { W.sessionStorage.setItem(K_AVISO, "1"); } catch (e2) { /* sem aviso depois de recarregar */ }
    // recarrega para o site voltar ao padrão (ele guarda as escolhas na memória enquanto está aberto)
    try { W.location.reload(); } catch (e3) { /* nada */ }
  }
  function mostrarConf(sim) {
    elConf.hidden = !sim;
    btnApagar.hidden = sim;
    btnApagar.setAttribute("aria-expanded", sim ? "true" : "false");
    if (sim) { btnNao.focus(); } else { btnApagar.focus(); }
  }

  function secPrivacidade() {
    var s = secao("sb-privacidade", "Privacidade",
      "O site não tem anúncios, contas nem cookies de rastreamento. O que ele guarda no seu aparelho são só as suas escolhas."),
      g = el("div", "sb-grid sb-2"), c1 = caixa("O que o site não faz"), c2 = caixa("O que fica no seu aparelho"), c3 = caixa("O que sai do seu aparelho"), c4 = caixa("Apagar as minhas escolhas"), acoes, aviso;
    add(c1, lista([
      "Não tem anúncios.",
      "Não pede cadastro nem tem contas ou senhas.",
      "O código do site não cria cookies.",
      "O código do site não tem estatística de visitas, pixel de rastreamento nem outra ferramenta que registre o que você faz.",
      "O código do site não envia o que você escolhe para nenhum servidor. As contas e os gráficos são feitos no seu navegador."
    ]));
    add(c2, p(null, "O navegador guarda só as suas escolhas, no armazenamento do próprio navegador (localStorage e sessionStorage): os pesos e filtros que você ajusta, as notas que você dá aos candidatos, as réguas que você liga na Régua política e avisos como “o guia já foi mostrado”."),
      p("sb-nota", "Isso fica só neste navegador e neste aparelho. Se você limpar os dados do site, tudo volta ao padrão."));
    add(c3, lista([
      [b("Fontes de letra. "), "Para desenhar as letras, a página pede arquivos de fonte aos servidores do Google (fonts.googleapis.com e fonts.gstatic.com). Como em qualquer pedido na internet, esses servidores recebem dados técnicos do pedido, como o endereço IP. Se o pedido falhar, o site usa as letras do seu aparelho."],
      [b("Hospedagem. "), "O site é só um conjunto de arquivos, sem servidor próprio nem banco de dados. Como em qualquer site, o serviço de hospedagem recebe o pedido da página e pode manter registros técnicos, segundo as regras dele."],
      [b("Links para fora. "), "Os sites das fontes só abrem se você tocar no link. Cada um tem as suas próprias regras."],
      [b("Pedidos de correção. "), "O botão Corrigir só monta o texto. Ele sai do site apenas quando você abre o GitHub ou o e-mail e envia. No GitHub, o pedido fica público, com o seu nome de usuário."]
    ]));

    acoes = el("div", "sb-acoes");
    btnApagar = el("button", "btn sb-btn", "Apagar as minhas escolhas salvas");
    btnApagar.type = "button";
    btnApagar.setAttribute("aria-expanded", "false");
    btnApagar.setAttribute("aria-controls", "sb-conf");
    elConf = el("div", "sb-conf");
    elConf.id = "sb-conf";
    elConf.hidden = true;
    elConf.setAttribute("role", "group");
    elConf.setAttribute("aria-label", "Confirmar");
    btnSim = el("button", "btn primary sb-btn", "Sim, apagar e recarregar");
    btnSim.type = "button";
    btnNao = el("button", "btn sb-btn", "Cancelar");
    btnNao.type = "button";
    add(elConf, p("sb-nota", "Isto apaga os pesos, filtros e notas salvos neste navegador e recarrega a página."), add(el("div", "sb-acoes"), btnSim, btnNao));
    aviso = el("p", "sb-aviso");
    aviso.setAttribute("role", "status");
    aviso.setAttribute("aria-live", "polite");
    elAviso = aviso;
    add(acoes, btnApagar);
    add(c4, p(null, "Você pode apagar tudo o que o site guardou neste navegador: pesos, filtros, notas e avisos."), acoes, elConf, aviso);
    btnApagar.addEventListener("click", function () { mostrarConf(true); });
    btnNao.addEventListener("click", function () { mostrarConf(false); });
    btnSim.addEventListener("click", apagarPrefs);
    elConf.addEventListener("keydown", function (e) { if (e.key === "Escape" || e.key === "Esc") { e.stopPropagation(); mostrarConf(false); } });
    try {
      if (W.sessionStorage.getItem(K_AVISO) === "1") {
        W.sessionStorage.removeItem(K_AVISO);
        aviso.textContent = "As suas escolhas salvas foram apagadas.";
      }
    } catch (e) { /* sem aviso */ }

    add(g, c1, c2, c3, c4);
    s.appendChild(g);
    return s;
  }

  /* ---------- correções ---------- */
  function secCorrecoes() {
    var s = secao("sb-correcoes", "Política de correções",
      "Errar é possível, e corrigir faz parte do trabalho. Se você achar um erro, diga."),
      g = el("div", "sb-grid sb-2"), c1 = caixa("Como pedir"), c2 = caixa("O que o pedido precisa ter"), c3 = caixa("O que fazemos com o pedido"), acoes, bt, ol;
    ol = el("ol", "sb-passos");
    add(ol,
      add(el("li"), "Toque em ", b("Corrigir"), " no item. O botão aparece em casos do placar, feitos de governo, promessas, falas, gastos, contas deixadas, medidas de direitos e minorias, fichas de candidatos e notas da Régua política."),
      add(el("li"), "No diálogo, escolha ", b("Abrir no GitHub"), CONTATO.email ? " ou " : null, CONTATO.email ? b("Enviar por e-mail") : null, ". O texto já vem com o item, a página e a versão do modelo."),
      add(el("li"), "Preencha o que está errado, a fonte e o que deveria estar, e envie."));
    c1.appendChild(ol);
    add(c1, p("sb-nota", "O GitHub exige uma conta gratuita para abrir um pedido. No GitHub, o pedido fica público, com o seu nome de usuário. Não escreva dados pessoais."));
    acoes = el("div", "sb-acoes");
    bt = el("a", "btn primary sb-btn", "Enviar correção sobre outro assunto");
    bt.href = urlRepo() + "/issues/new";
    bt.target = "_blank";
    bt.rel = "noopener noreferrer";
    bt.addEventListener("click", function (e) {
      if (W.BEA_CORRECOES && typeof W.BEA_CORRECOES.abrir === "function") {
        e.preventDefault();
        W.BEA_CORRECOES.abrir({ item: "Assunto geral (fora de um item específico)", pagina: NOME_PAGINA, paginaId: "sobre", hash: "sb-correcoes", gatilho: bt });
      }
    });
    acoes.appendChild(bt);
    c1.appendChild(acoes);

    add(c2, lista([
      [b("O item e a página. "), "O botão Corrigir já preenche."],
      [b("O que está errado. "), "Diga o trecho ou o número e por que está errado."],
      [b("A fonte, com link. "), "De preferência um documento oficial, uma base de dados pública ou uma checagem. Sem fonte, é muito mais difícil verificar."],
      [b("O que deveria estar. "), "O texto ou o valor que você propõe."]
    ]), p("sb-nota", "Pedidos para mudar o método, os pesos ou as metas são bem-vindos, mas valem como sugestão, não como correção de um fato."));

    add(c3, lista([
      "Lemos o pedido e conferimos a fonte. O mesmo teste vale para pedidos sobre qualquer governo, partido ou candidato.",
      "Tentamos responder o quanto antes. Não prometemos prazo.",
      ["Se a correção for aceita, o site muda e a mudança vira uma entrada em ", link("#novidades", "Novidades"), ", com o que mudou."],
      "Se não for aceita, tentamos explicar o motivo."
    ]));
    c3.appendChild(p("sb-nota", "Erro técnico, como página quebrada ou texto cortado, também pode ser avisado pelo mesmo canal."));
    add(g, c1, c2, c3);
    s.appendChild(g);
    return s;
  }

  /* ---------- quem faz e contato ---------- */
  function secContato() {
    var s = secao("sb-contato", "Quem faz e contato", null), g = el("div", "sb-grid sb-2"), c1 = caixa("Quem faz"), c2 = caixa("Contato"), dl, linha, acoes, a, rod;
    if (CONTATO.nome) {
      add(c1, p(null, "O Brasil em Análise é mantido por ", b(CONTATO.nome), "."),
        p(null, "O código do site está publicado no GitHub, o histórico de mudanças é público, os números têm fonte citada em cada item e o site não tem anúncios."));
    } else {
      add(c1, p(null, "O código do site está publicado no GitHub, e o histórico de mudanças é público. Os números têm fonte citada em cada item. O site não tem anúncios."));
    }
    add(c1, p("sb-nota", "Código do site: ", link(urlRepo(), CONTATO.github, true), "."));

    dl = el("dl", "sb-dl");
    linha = el("div");
    add(linha, el("dt", null, "Canal principal"), add(el("dd"), link(urlRepo() + "/issues/new", "Abrir um pedido (issue) no GitHub", true)));
    dl.appendChild(linha);
    linha = el("div");
    add(linha, el("dt", null, "Pedidos já abertos"), add(el("dd"), link(urlRepo() + "/issues", "Ver a lista no GitHub", true)));
    dl.appendChild(linha);
    if (CONTATO.nome) {
      linha = el("div");
      add(linha, el("dt", null, "Nome"), el("dd", null, CONTATO.nome));
      dl.appendChild(linha);
    }
    if (emailValido(CONTATO.email)) {
      linha = el("div");
      add(linha, el("dt", null, "E-mail"), add(el("dd"), link("mailto:" + CONTATO.email, CONTATO.email)));
      dl.appendChild(linha);
    }
    c2.appendChild(dl);
    acoes = el("div", "sb-acoes");
    a = link(urlRepo() + "/issues/new", "Abrir um pedido no GitHub", true);
    a.className = "btn primary sb-btn";
    acoes.appendChild(a);
    c2.appendChild(acoes);
    add(c2, p("sb-nota", "Para corrigir um item, use o botão Corrigir no próprio item: ele já preenche o pedido."));
    add(g, c1, c2);
    s.appendChild(g);
    rod = p("sb-nota sb-pos", textoDoSite(".upd"), textoDoSite(".upd") && textoDoSite(".foot-base span:last-child") ? " · " : "", textoDoSite(".foot-base span:last-child"), ".");
    if (textoDoSite(".upd") || textoDoSite(".foot-base span:last-child")) { s.appendChild(rod); }
    return s;
  }

  /* ---------- montar a página ---------- */
  function montar() {
    var host = D.getElementById("modSobre");
    if (!host || construida) { return; }
    construida = true;
    add(host, cabecalho(), secOQue(), secMetodo(), secImparcial(), secFontes(), secPrivacidade(), secCorrecoes(), secContato());
    host.setAttribute("data-sb", "1");
  }

  /* ---------- link no rodapé ---------- */
  function linkNoRodape() {
    var slot = D.getElementById("slotRodape"), nav, a;
    if (!slot || D.getElementById("sb-foot-link")) { return; }
    nav = D.getElementById("rodapeExtra");
    if (!nav) {
      nav = D.createElement("nav");
      nav.id = "rodapeExtra";
      nav.className = "foot-extra";
      nav.setAttribute("aria-label", "Mais");
      slot.appendChild(nav);
    }
    a = D.createElement("a");
    a.id = "sb-foot-link";
    a.className = "sb-foot-link";
    a.href = "#sobre";
    a.textContent = NOME_PAGINA;
    nav.appendChild(a);
  }

  /* ---------- ganchos ---------- */
  function aoMudarPagina(nome) {
    if (nome === "sobre") {
      montar();
      D.title = NOME_PAGINA + " | Brasil em Análise";
    }
  }

  function iniciar() {
    linkNoRodape();
    montar();   // monta já na carga: assim os links #sb-... funcionam de qualquer página (também o do diálogo Corrigir)
    B.on("page", aoMudarPagina);
    if (typeof B.paginaAtual === "function" && B.paginaAtual() === "sobre") {
      aoMudarPagina("sobre");
    } else if (/^#sb-/.test(W.location.hash)) {
      // link direto para uma parte desta página: pede ao roteador do site para ir até lá
      try { W.dispatchEvent(new Event("hashchange")); } catch (e) { /* sem rolagem automática */ }
    }
  }

  if (D.readyState === "loading") { D.addEventListener("DOMContentLoaded", iniciar); } else { iniciar(); }
})();
