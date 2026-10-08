/* Módulo comoler: "Como ler este gráfico" (prefixo cl-).
   Põe um botão "Como ler" ao lado do título de cada gráfico ou tabela visual do site. O botão abre um painel com
   quatro blocos curtos: O que mostra, Como ler, O que seria um bom resultado e Cuidado.
   Os pisos e as metas vêm de window.BEA.dataset(), então o texto acompanha a conta do site.
   Os gráficos são redesenhados quando a pessoa muda os pesos: um MutationObserver recoloca o botão sem duplicar.
   Sem rede, sem rastreamento, sem cookies. Estado aberto/fechado só na sessão (sessionStorage, com try/catch).
   Sintaxe segura para iOS 13+: sem "?.", sem "??", sem lookbehind. */
(function () {
  "use strict";

  var B = window.BEA;
  if (!B || typeof B.dataset !== "function") { return; }

  var D = document, W = window;
  var K_ABERTOS = "bea_cl_abertos";

  /* ---------- armazenamento (nunca quebra se estiver bloqueado) ---------- */
  var memAbertos = {};
  function lerSS() {
    try {
      var v = W.sessionStorage.getItem(K_ABERTOS);
      if (v) { var o = JSON.parse(v); if (o && typeof o === "object") { return o; } }
    } catch (e) { }
    return null;
  }
  function gravarSS() {
    try { W.sessionStorage.setItem(K_ABERTOS, JSON.stringify(memAbertos)); } catch (e) { }
  }
  (function () { var o = lerSS(); if (o) { memAbertos = o; } })();

  /* ---------- utilidades ---------- */
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  var NF = null;
  try { NF = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }); } catch (e) { NF = null; }
  function n(v) {
    var a = Math.abs(v), s = NF ? NF.format(a) : String(a).replace(".", ",");
    return (v < 0 ? "−" : "") + s;
  }
  function sg(v) { return (v > 0 ? "+" : "") + n(v); }

  /* ---------- dados do site (BEA.dataset), com cache até a próxima atualização ---------- */
  var cacheDs = null, cacheGeral = null;
  function ds() {
    if (cacheDs === null) {
      try { cacheDs = B.dataset() || false; } catch (e) { cacheDs = false; }
    }
    return cacheDs || null;
  }
  function pilarNome(k) {
    var d = ds(), i;
    if (d && d.pilares) { for (i = 0; i < d.pilares.length; i++) { if (d.pilares[i].pilar === k) { return d.pilares[i].nome; } } }
    return k;
  }
  function indicador(chave) {
    var d = ds(), i, partes = chave.split(".");
    if (!d || !d.indicadores) { return null; }
    for (i = 0; i < d.indicadores.length; i++) {
      if (d.indicadores[i].pilar === partes[0] && d.indicadores[i].indicador === partes[1]) { return d.indicadores[i]; }
    }
    return null;
  }
  /* indicadores que são nível (e não variação): sem sinal "+" */
  var NIVEL = { "eco.inf": 1, "fut.prim": 1, "fut.contas": 1, "amb.niv": 1 };
  function valor(i, chave, v) {
    var un = i.unidade || "", s = (NIVEL[chave] || chave.indexOf("soc.") === 0) ? n(v) : sg(v);
    if (un.indexOf("R$") === 0) { return "R$ " + n(v) + " bi de 2026"; }
    if (un.charAt(0) === "%") { return s + un; }
    return s + " " + un;
  }
  function linhaAncora(chave) {
    var i = indicador(chave);
    if (!i || typeof i.piso !== "number" || typeof i.meta !== "number") { return ""; }
    var menos = i.meta < i.piso;
    return "<li><b>" + esc(i.titulo) + ":</b> meta de " + valor(i, chave, i.meta) + " (nota 10); piso de " +
      valor(i, chave, i.piso) + " (nota 0)" + (menos ? ". Aqui menos é melhor" : "") + ".</li>";
  }
  function lista(chaves) {
    var itens = "", i, l;
    for (i = 0; i < chaves.length; i++) { l = linhaAncora(chaves[i]); if (l) { itens += l; } }
    return itens ? "<ul>" + itens + "</ul>" : "";
  }
  var LINK_CONTA = '<a href="#conta-completa">A conta completa</a>';
  var REGRA_NOTA = "Cada indicador vira uma nota de 0 a 10 entre um piso (vale 0) e uma meta (vale 10) fixos, que não dependem dos outros governos. " +
    "Quem passa da meta fica em 10 e quem passa do piso fica em 0.";
  function P(t) { return "<p>" + t + "</p>"; }
  function ancoras(chaves, extra) {
    var l = lista(chaves);
    return P(REGRA_NOTA) + (l || "") + (extra ? P(extra) : "") +
      P("Todos os pisos e metas estão em " + LINK_CONTA + ", na página Como calculamos.");
  }
  function governosHex() {
    var nomes = [], i, g;
    try {
      g = B.geral();
      for (i = 0; i < g.length; i++) { if (g[i].id !== "ptall") { nomes.push(g[i].nome); } }
    } catch (e) { }
    return nomes;
  }
  function nomesPilares() {
    var nomes = [], i, p;
    try { p = B.pilares(); for (i = 0; i < p.length; i++) { nomes.push(p[i].t); } } catch (e) { }
    return nomes;
  }
  function pesosPadrao() {
    var d = ds(), i, partes = [];
    if (d && d.pilares) {
      for (i = 0; i < d.pilares.length; i++) { partes.push(esc(d.pilares[i].nome) + " " + d.pilares[i].peso_padrao); }
    }
    return partes.join(", ");
  }
  function kappa() {
    var k = null;
    try { k = B.estado().forK; } catch (e) { }
    return typeof k === "number" ? n(k) : null;
  }

  /* ---------- textos comuns ---------- */
  var BARRAS = "Cada barra é um governo, de FHC (1995) a Lula 3, na cor do partido. A barra vai de 0 a 10 e o número no fim é a nota. " +
    "Passe o mouse, toque ou use a tecla Tab numa barra para ver os números de cada indicador.";
  var ORDEM = " A ordem segue o botão “Por data” ou “Por nota” da página Economia.";
  var FAIXAS = "As faixas de cor atrás das linhas mostram quem governava: vermelho, PT; azul, Bolsonaro (PL). Sem faixa: FHC (PSDB) e Temer (MDB).";

  /* ---------- as explicações ----------
     Cada item: id, titulo, find() e os quatro blocos (texto HTML ou função que devolve HTML).
     find() devolve {el, modo:"inline"|"antes"|"depois", depois} ou null:
       inline: o botão fica ao lado do título (el); o painel entra depois de "depois" (ou do botão);
       antes/depois: o botão fica numa linha própria antes/depois de el. */
  function porId(id, comPai) {
    return function () {
      var h = D.getElementById(id);
      if (!h) { return null; }
      if (comPai !== false && h.parentNode && /(^|\s)sec-head(\s|$)/.test(h.parentNode.className)) {
        return { el: h, modo: "inline", depois: h.parentNode };
      }
      return { el: h, modo: "depois" };
    };
  }
  function tituloCartao(secId, idx) {
    return function () {
      var s = D.getElementById(secId), h, ch;
      if (!s) { return null; }
      h = s.querySelectorAll("figure.chart .chart-head .t h3")[idx || 0];
      if (!h) { return null; }
      ch = h.parentNode.parentNode;
      return { el: h, modo: "inline", depois: ch };
    };
  }
  function tituloComTexto(prefixo) {
    return function () {
      var cc = D.getElementById("conta-completa"), hs, i;
      if (!cc) { return null; }
      hs = cc.querySelectorAll("h3");
      for (i = 0; i < hs.length; i++) {
        if (hs[i].textContent.indexOf(prefixo) === 0) { return { el: hs[i], modo: "depois" }; }
      }
      return null;
    };
  }

  var ITENS = [

    /* ===== Início ===== */
    {
      id: "hexagono", titulo: "Hexágono da nota geral",
      find: function () { var c = D.getElementById("hx-cap"); return c ? { el: c, modo: "depois" } : null; },
      mostra: function () {
        var p = nomesPilares();
        return "A nota geral de dois governos lado a lado, de 0 a 10. Cada uma das oito pontas é um pilar" +
          (p.length ? " (" + esc(p.join(", ")) + ")" : "") + ".";
      },
      ler: "O centro vale 0 e a borda vale 10; os anéis marcam 2,5, 5 e 7,5. A linha cheia é um governo e a tracejada é o outro: troque nos dois menus ou toque num cartão logo abaixo. " +
        "O número grande de cada lado é a nota geral, a média dos oito pilares com os pesos da sua régua. A tabela embaixo do desenho traz a nota exata e o peso de cada pilar. “PT, todos” é a média dos governos do PT, ponderada pelo tempo de mandato.",
      bom: function () {
        var pp = pesosPadrao();
        return "Quanto mais perto da borda, maior a nota daquele pilar. 10 quer dizer que o governo atingiu ou passou da meta fixa do pilar; 0, que chegou ou passou do piso. " +
          "As metas e os pisos valem igual para todos (veja " + LINK_CONTA + ")." +
          (pp ? " Pesos padrão dos pilares: " + pp + "." : "");
      },
      cuidado: "Um desenho maior não é “melhor em tudo”: a nota final depende dos pesos que você escolheu, e pilar com peso zero aparece apagado. " +
        "A nota geral cobre só os governos do PT e do PL, os únicos com dados nos oito pilares. Direitos e minorias mede medidas adotadas, não resultados. " +
        "Dilma 2 (1,4 ano) e Lula 3 (em curso) têm menos tempo de mandato."
    },
    {
      id: "seis-governos", titulo: "Os seis governos do PT e do PL",
      find: porId("hg-h"),
      mostra: function () {
        var g = governosHex();
        return "A nota geral de cada governo, com o hexágono em miniatura" + (g.length ? ": " + esc(g.join(", ")) : "") + ".";
      },
      ler: "Cada cartão traz o nome, o partido, o período, a nota geral e o desenho do hexágono. Toque num cartão para colocá-lo no hexágono do topo: ele entra como a linha tracejada, e a que estava tracejada passa a ser a linha cheia. Os cartões já escolhidos aparecem marcados.",
      bom: "Nota maior é melhor, na escala de 0 a 10, e vale a mesma regra para todos. Não existe nota de corte. Compare também o formato: pontas mais perto da borda são pilares mais perto da meta.",
      cuidado: "Notas próximas podem trocar de ordem quando você muda os pesos; a seção Robustez, em " + LINK_CONTA + ", mostra quantas vezes isso acontece nos sorteios do site. " +
        "FHC e Temer ficam fora da nota geral porque o placar não reúne corrupção, promessas e legado dos dois."
    },
    {
      id: "forca", titulo: "Apoio no Congresso e no STF",
      find: porId("fo-h"),
      mostra: "Quanto apoio cada presidente tinha na Câmara, no Senado e no STF, e quanto isso mexe na nota de Direitos e minorias e na de Feitos e promessas.",
      ler: function () {
        var d = ds(), p = d && d.forca && d.forca.pesos ? d.forca.pesos : null;
        return "Cada linha é um governo. Câmara e Senado: percentual das cadeiras dos partidos com ministérios, na média do mandato. STF: ministros indicados pelo presidente ou por presidentes do mesmo partido (de 11). " +
          "Força (0 a 100) junta os três" + (p ? ", com pesos " + n(p.cam) + " para a Câmara, " + n(p.sen) + " para o Senado e " + n(p.stf) + " para o STF" : "") + ". " +
          "O multiplicador compara a força do governo com a média dos oito: ×1,00 é a média, acima de 1 é base mais fraca e abaixo de 1 é base mais forte.";
      },
      bom: function () {
        var k = kappa();
        return "Não existe força melhor ou pior: a tabela dá contexto. A regra é igual para todos: quem tinha base maior precisava entregar mais, então a nota daqueles dois pilares é multiplicada por um número menor que 1; quem tinha base menor recebe um número maior que 1. " +
          "O ajuste é moderado: a força entra elevada a " + (k ? k : "0,25") + " na sua régua (0,25 no padrão).";
      },
      cuidado: "Vários números do Senado e dos fins de mandato são estimativas, com margem de 5 a 10 pontos. A base formal não mede tudo: governos com ministérios entregues ao Centrão também perderam votações, " +
        "e governos com base pequena conseguiram apoio com emendas. Ser indicado ao STF por um presidente não quer dizer votar com ele."
    },

    /* ===== Placar PT x PL ===== */
    {
      id: "placar", titulo: "Placar PT × PL",
      find: function () { var l = D.getElementById("ledger"); return l ? { el: l, modo: "antes" } : null; },
      mostra: "O saldo de cada lado em pontos: corrupção, legado e promessas. Um ponto equivale a R$ 1 bilhão desviado, corrigido pela inflação quando a correção está ligada.",
      ler: "Há uma coluna para o PT e outra para o PL. Corrupção: desvios ponderados pelo grau de prova, mais as pessoas lesadas. “Sem valor em R$” (quando ligado): casos contados pela gravidade, em estrelas. " +
        "Legado: estrelas dos feitos que ainda valem em 2026. Promessas: cumpridas somam e não cumpridas subtraem. <b>Saldo = Legado + Promessas − Corrupção.</b> O texto pequeno compara o valor com o Bolsa Família de 2026 (cerca de R$ 158 bi por ano).",
      bom: "Saldo maior é melhor, mas não há meta fixa: o placar compara os dois lados na régua que você escolheu (página Ajuste os pesos). Saldo zero é o ponto em que legado e promessas empatam com a corrupção.",
      cuidado: "Não é sentença judicial: o placar organiza estimativas públicas. Os totais somam tempos diferentes (o PT governou cerca de 17 anos no período e Bolsonaro, 4); para comparar o ritmo, use “Por ano de mandato” no gráfico abaixo. " +
        "Valor desconhecido conta como zero, e casos muito investigados aparecem mais completos."
    },
    {
      id: "placar-governo", titulo: "Placar por governo",
      find: tituloCartao("graficos", 0),
      mostra: "O mesmo placar desenhado por bloco e por governo: corrupção de um lado, legado do outro e o saldo na coluna final.",
      ler: "Cada linha tem barras para os dois lados do centro. À esquerda: corrupção (cor cheia) e promessas descumpridas (listras). À direita: legado (cor suave) e promessas cumpridas (listras). A coluna “saldo” é a conta final. " +
        "“Total” soma o mandato inteiro; “Por ano de mandato” divide pelos anos de governo. Passe o mouse ou toque numa linha para ver cada parcela. “Ver como tabela” traz os mesmos números.",
      bom: "Barra menor à esquerda e maior à direita dão um saldo maior. A escala é em pontos (1 ponto = R$ 1 bilhão); não há meta fixa.",
      cuidado: "Mandatos de duração diferente só se comparam no modo “Por ano de mandato” (Dilma 2 tem 1,4 ano; Lula 3, 3,8 anos até out/2026). Nesse modo, casos de partido fora do Planalto não entram. " +
        "As listras de promessas medem palavra cumprida, não impacto."
    },
    {
      id: "escandalos", titulo: "Quanto custou cada escândalo",
      find: tituloCartao("graficos", 1),
      mostra: "O valor estimado, em reais, de cada escândalo que tem valor em dinheiro.",
      ler: "Cada linha é um caso. O ponto é a estimativa escolhida nos pesos (mínima, central ou máxima); a linha vai da mínima à máxima; círculo vazio quer dizer estimativa zero. " +
        "Vermelho é ligado ao PT, azul ao PL ou a Bolsonaro, e o círculo dividido é caso dividido entre os dois governos. A escala é logarítmica, de R$ 1 milhão a R$ 100 bilhões: cada marca vale 10 vezes a anterior. Toque numa linha para abrir o caso.",
      bom: "Quanto mais à esquerda, menor o valor estimado. Não há meta: o gráfico mostra o tamanho estimado de cada caso, não a culpa de ninguém.",
      cuidado: "Na escala logarítmica, um passo para a direita é 10 vezes mais dinheiro, e não um passo igual. Linha comprida quer dizer estimativas muito diferentes entre si. " +
        "Valor desconhecido conta como zero, e esquemas opacos tendem a ficar subestimados. Investigação não é condenação: os citados em casos abertos negam irregularidades. Casos desligados nos pesos aparecem apagados."
    },
    {
      id: "corrupcao-externa", titulo: "Índice do Banco Mundial",
      find: porId("ce-h"),
      mostra: "Duas notas de fora do site sobre o controle da corrupção no Brasil, de 0 a 100: o índice de controle da corrupção do Banco Mundial e o Índice de Percepção da Corrupção, da Transparência Internacional.",
      ler: function () {
        return "Cada gráfico é uma linha com um valor por ano. " + FAIXAS + " Só o índice do Banco Mundial entra na nota geral (no pilar Integridade); o IPC aparece para comparação e só existe a partir de 2012, quando a escala mudou.";
      },
      bom: function () {
        var d = ds(), t = d && d.integridade ? d.integridade : null;
        return "Quanto maior, melhor. Na nota de Integridade, o índice do Banco Mundial (média dos anos de governo) vale 0 em " +
          (t ? n(t.wgi_piso) : "30") + " e 10 em " + (t ? n(t.wgi_meta) : "60") + "; fora dessa faixa a nota trava em 0 ou 10.";
      },
      cuidado: "Os dois medem a percepção de especialistas e empresas, não valores desviados, e reagem a escândalos revelados: a queda de 2014 a 2018 reflete em parte a Lava Jato, que investigou desvios de anos anteriores. O Banco Mundial revisou toda a série em 2025."
    },

    /* ===== Economia ===== */
    {
      id: "nota-economia", titulo: "Nota da economia",
      find: porId("eco-h"),
      mostra: "A nota de 0 a 10 da economia de cada um dos oito governos desde 1995, a partir de seis indicadores: PIB por pessoa, renda das famílias, salário mínimo, inflação, desemprego e carga tributária.",
      ler: function () { return BARRAS + ORDEM + " A nota final é a média dos seis, com os pesos da página Ajuste os pesos (a linha abaixo do gráfico mostra os pesos em uso). “Os números por trás de cada nota” traz a tabela."; },
      bom: function () {
        return ancoras(["eco.pib", "eco.renda", "eco.sm", "eco.inf", "eco.des", "eco.carga"],
          "Carga tributária: o site trata a carga menor como melhor, é um juízo de valor dele, e por isso esse item pesa menos.");
      },
      cuidado: "Cada governo é medido pela variação, do último ano antes da posse ao último ano completo de mandato, e não pelo nível. Na régua padrão, os anos da crise global (2009–10) e da pandemia (2020–21) ficam fora da conta. " +
        "Dilma 2 tem só 2015, Lula 3 usa dados até 2025 e a dívida líquida de FHC só existe desde 2001. Nenhum governo controla sozinho esses números: preços de commodities, crises externas e o Congresso pesam em todos."
    },
    {
      id: "nota-pobreza", titulo: "Pobreza e desigualdade",
      find: porId("pov-h"),
      mostra: "A nota de 0 a 10 de pobreza e desigualdade de cada governo: a queda por ano da pobreza extrema (menos de US$ 3 por dia, Banco Mundial) e a variação por ano do índice de Gini.",
      ler: function () { return BARRAS + ORDEM + " O texto que aparece sobre a barra mostra o Gini e a pobreza no início e no fim do período medido. A nota é a média dos dois."; },
      bom: function () {
        return ancoras(["pov.gini", "pov.pob"], "O Gini mede a desigualdade de renda: quanto menor, menos desigual.");
      },
      cuidado: "A pobreza entra como queda percentual por ano: cair de 20% para 16% não é o mesmo que cair de 7% para 5%. Não há dado em 2000 e 2010 (anos de censo): Lula 2 vai até 2009 e Dilma 1 começa em 2011. Lula 3 usa dados até 2024. " +
        "O Auxílio Emergencial derrubou a pobreza em 2020; na régua padrão, 2009–10 e 2020–21 ficam fora da conta. Transferências de renda, salário mínimo, emprego e fatores externos pesam nesses números."
    },
    {
      id: "contas-futuro", titulo: "Contas para o futuro",
      find: porId("fut-h"),
      mostra: "A nota de 0 a 10 do que cada governo fez com a dívida e do que deixou de contas para os sucessores pagarem.",
      ler: function () {
        return BARRAS + ORDEM + " São quatro números: quanto a dívida bruta e a dívida líquida subiram ou caíram por ano de governo, a média do resultado primário e a soma das contas criadas no governo e pagas depois. " +
          "Os cartões abaixo do gráfico listam essas contas, uma a uma.";
      },
      bom: function () { return ancoras(["fut.dbgg", "fut.div", "fut.prim", "fut.contas"]); },
      cuidado: "A dívida também sobe com juros altos, que dependem do Banco Central e do mercado, e não só do governo. Nos anos da crise de 2009 e da pandemia, a variação da dívida sai da conta (padrão). " +
        "FHC fica sem resultado primário, porque a série do Banco Central começa em 2002. Lula 3 usa a projeção de mercado para dezembro de 2026. Governo sem item no catálogo de contas deixadas fica sem dado nesse indicador; a ausência no catálogo não prova que não houve conta."
    },
    {
      id: "series-economia", titulo: "Renda das famílias e contas públicas",
      find: porId("se-h"),
      mostra: "Três séries anuais que entram na nota da economia: a renda média por pessoa (US$ por dia, PPC de 2021), o resultado primário do governo (% do PIB) e a carga tributária (% do PIB).",
      ler: function () {
        return "Cada gráfico é uma linha com um valor por ano, de 1995 a 2026. " + FAIXAS + " No resultado primário, acima de zero é superávit (o governo gastou menos do que arrecadou, sem contar os juros) e abaixo de zero é déficit.";
      },
      bom: function () {
        return P("Renda: mais é melhor. Resultado primário: mais é melhor, até a meta. Carga tributária: o site considera a carga menor como melhor (juízo de valor, com peso reduzido). Metas da nota:") +
          lista(["eco.renda", "fut.prim", "eco.carga"]) + P("Atenção: na nota, a renda e a carga entram como variação por ano, e o resultado primário como média; as linhas mostram o valor de cada ano.");
      },
      cuidado: "A renda vem das pesquisas do IBGE (Banco Mundial), sem 2000 e 2010 e só até 2023. O resultado primário começa em 2002 (FHC fica sem esse item). A carga tributária usa o Tesouro de 2010 a 2025 e, antes, uma série ajustada ao nível do Tesouro em 2010."
    },
    {
      id: "linha-tempo", titulo: "Linha do tempo",
      find: porId("tl-h"),
      mostra: "Oito painéis ano a ano, de 1995 a 2026, com o mesmo eixo de tempo: quem governava, salário mínimo, PIB por pessoa, dívida, inflação, crescimento do PIB, desemprego e escândalos do placar.",
      ler: function () {
        return "Como todos os painéis dividem o eixo dos anos, dá para olhar um ano de cima a baixo. Toque em qualquer painel para ver, no quadro acima, todos os números daquele ano; os botões ‹ e › mudam de ano. " +
          "Os dois botões do topo trocam o salário mínimo (dólar ou reais de hoje) e o PIB (dólar ou PIB real). " + FAIXAS +
          " Na faixa de cima, pontos e traços marcam eventos externos, como o racionamento de energia (2001) e a pandemia (2020).";
      },
      bom: function () {
        var i = indicador("eco.inf");
        return "Aqui os números são brutos, sem nota. Mais é melhor para salário mínimo, PIB por pessoa e crescimento; menos é melhor para desemprego e dívida. " +
          "Inflação: o site usa " + (i ? n(i.meta) : "4,5") + "% ao ano (centro da meta de inflação de 2005 a 2018) para todos os governos; abaixo disso a nota já é 10.";
      },
      cuidado: "Comparar não prova causa: crises externas, preços de commodities e decisões do Congresso pesam em todos os governos. O dado de 2026 é parcial (círculo vazado). " +
        "O salário mínimo em dólar sobe e desce também com o câmbio, e não só com o poder de compra. Dívida: as séries do Banco Central começam em 2001 e 2006. " +
        "Desemprego: até 2011 é a Pnad anual e depois a Pnad Contínua, que não são totalmente comparáveis."
    },
    {
      id: "linha-escandalos", titulo: "Escândalos na linha do tempo",
      find: function () {
        var f = D.querySelector("#tlp-esc figcaption");
        return f ? { el: f, modo: "depois" } : null;
      },
      mostra: "O período em que aconteceu cada caso do placar, de 1995 a 2026, no mesmo eixo de tempo dos painéis de cima.",
      ler: "Cada barra horizontal é um caso, do começo ao fim do período, na cor do partido ligado a ele. Alinhe a barra com os painéis acima para ver o que acontecia na economia naquele ano. Toque numa barra para abrir o caso.",
      bom: "Não há resultado melhor ou pior aqui: a barra mostra quando o caso aconteceu, não o tamanho. O valor de cada caso está no gráfico “Quanto custou cada escândalo”.",
      cuidado: "A barra é o período do esquema, e não o da investigação ou do julgamento. Casos muito investigados aparecem mais, e investigação não é condenação."
    },
    {
      id: "governos-numeros", titulo: "Cada governo em números",
      find: porId("tlg-h"),
      mostra: "Uma linha por governo com os dados da linha do tempo resumidos por mandato, mais os pontos de corrupção e de promessas do placar e a nota da economia.",
      ler: "As colunas são: crescimento médio do PIB, PIB por pessoa no período, salário mínimo real no período, salário mínimo em dólar no último ano, inflação média, desemprego e dívida bruta (do ano anterior à posse até o fim do mandato, na forma “antes → fim”), corrupção e promessas (com os pesos da sua régua) e nota da economia. " +
        "No celular, deslize a tabela para os lados; a coluna do governo fica fixa.",
      bom: "Mais é melhor para crescimento, PIB por pessoa, salário mínimo, promessas e nota da economia; menos é melhor para inflação, desemprego, dívida e pontos de corrupção.",
      cuidado: "Dilma 2 aparece só com 2015 nos dados anuais; 2016 fica com Temer. Lula 3 inclui dados parciais de 2026. FHC e Temer aparecem como “fora do placar” em corrupção e promessas. " +
        "As colunas “no período” acumulam todo o mandato, então mandatos de duração diferente não são diretamente comparáveis. Comparar não prova causa."
    },

    /* ===== Direitos e minorias ===== */
    {
      id: "nota-sociedade", titulo: "Nota de direitos e minorias",
      find: porId("soc-h"),
      mostra: "A nota de 0 a 10 de Direitos e minorias de cada governo, em seis grupos: mulheres, população negra, indígenas e quilombolas, pessoas com deficiência, pessoas LGBT+, e idosos, crianças e adolescentes.",
      ler: "Cada linha é um governo e cada coluna, um grupo. Em cada célula aparecem a nota (0 a 10), uma barra e os pontos das medidas (“pt”): estrelas das leis e programas menos os retrocessos. A última coluna é a nota final, com os pesos da sua régua; coluna apagada é grupo com peso zero. No celular, deslize a tabela para os lados.",
      bom: function () {
        return P("Nota 10 quer dizer que o governo chegou à meta de pontos do grupo. Sem nenhuma medida registrada, a nota é 3,3 (e não zero); abaixo disso só com retrocessos. Metas de pontos de cada grupo:") +
          lista(["soc.mul", "soc.neg", "soc.ind", "soc.pcd", "soc.lgb", "soc.ger"]) +
          P("Quanto mais pontos de medidas, maior a nota, sempre limitada a 10.");
      },
      cuidado: "A nota mede medidas adotadas, e não resultados, e é relativa ao catálogo do site: cada meta é cerca de 1,25 vez o melhor valor do catálogo do grupo. As estrelas de cada medida (1 a 3) são escolha editorial, a lista completa está em “Medida por medida”. " +
        "Lei que nasceu no Congresso dá só parte do crédito, decisões do STF ou do CNJ não contam e retrocessos tiram pontos. A nota final já inclui o multiplicador de força (veja “Apoio no Congresso e no STF”). FHC governou oito anos; Dilma 2, um ano e quatro meses."
    },

    /* ===== Serviços e ambiente ===== */
    {
      id: "nota-servicos", titulo: "Serviços públicos",
      find: porId("ser-h"),
      mostra: "A nota de 0 a 10 de Serviços públicos de cada governo, a partir de cinco números: homicídios, mortalidade infantil, expectativa de vida, Ideb e Pisa.",
      ler: function () {
        return BARRAS + ORDEM + " Cada número é a variação por ano, do último resultado antes da posse ao último durante o mandato. A linha abaixo do gráfico mostra os pesos em uso.";
      },
      bom: function () {
        return ancoras(["ser.hom", "ser.mi", "ser.ev", "ser.ideb", "ser.pisa"],
          "Mortalidade infantil e expectativa de vida medem quase o mesmo fenômeno e pesam meio ponto cada.");
      },
      cuidado: "A segurança pública é feita sobretudo pelos estados, e a educação também depende de estados e municípios: o governo federal responde só por uma parte. O Ideb sai a cada dois anos e o Pisa a cada três, então há poucos pontos para cada governo. " +
        "Na régua padrão, 2020–21 ficam fora da educação e, na saúde, 2022 também; Lula 3 é comparado ao nível de 2019."
    },
    {
      id: "nota-ambiente", titulo: "Meio ambiente",
      find: porId("amb-h"),
      mostra: "A nota de 0 a 10 de Meio ambiente de cada governo, a partir de dois números do desmatamento na Amazônia (Prodes, do Inpe): o nível médio por ano e a tendência.",
      ler: function () {
        return BARRAS + ORDEM + " O nível é a média de km² desmatados por ano nos anos de governo. A tendência é a variação por ano, do ano anterior à posse ao fim do mandato. Assim conta tanto quem herdou um desmatamento alto e o reduziu quanto quem deixou subir.";
      },
      bom: function () {
        return ancoras(["amb.niv", "amb.var"]);
      },
      cuidado: "O ano do Prodes vai de agosto a julho. O preço da soja e do gado, o câmbio e a fiscalização dos estados também pesam. Lula 3 usa dados até 2025. A meta do nível vem da Política Nacional sobre Mudança do Clima; o piso e a faixa da tendência são escolhas do site."
    },
    {
      id: "series-servicos", titulo: "Ano a ano: serviços e ambiente",
      find: porId("ss-h"),
      mostra: "Seis séries anuais: homicídios (por 100 mil habitantes), mortalidade infantil (mortes por mil nascidos vivos), expectativa de vida ao nascer (anos), Ideb (0 a 10, rede total), Pisa (nota média do Brasil) e desmatamento na Amazônia (km² por ano, Prodes).",
      ler: function () {
        return "Cada gráfico é uma linha com um valor por ano. " + FAIXAS + " Ideb e Pisa saem a cada dois e três anos, por isso têm poucos pontos.";
      },
      bom: function () {
        return P("Menos é melhor em homicídios, mortalidade infantil e desmatamento; mais é melhor em expectativa de vida, Ideb e Pisa. Metas da nota (por ano de governo; no desmatamento, média por ano):") +
          lista(["ser.hom", "ser.mi", "ser.ev", "ser.ideb", "ser.pisa", "amb.niv"]);
      },
      cuidado: "A pandemia derrubou a expectativa de vida e o aprendizado em 2020–21. A nota usa a variação por ano, e não o nível: um valor alto no gráfico pode vir de um governo que melhorou pouco. Segurança e educação dependem também de estados e municípios."
    },

    /* ===== Falas ===== */
    {
      id: "mapa-falas", titulo: "Mapa das falas",
      find: porId("mf-h"),
      mostra: "Quantas falas da lista caem em cada etiqueta (preconceito, democracia e instituições, ofensa, desinformação) e em cada desfecho (“Deu em quê”), por presidente.",
      ler: "As colunas são os presidentes e as linhas, as etiquetas e os desfechos. Cada número é a quantidade de falas; o ponto (·) quer dizer nenhuma. Toque num número para ver só essas falas na lista abaixo. A última linha traz o total de falas de cada presidente na lista.",
      bom: "Não há nota nem meta: é uma contagem de registros, e não um ranking. Não existe número “bom” para atingir.",
      cuidado: "A contagem não mede quem fala mais: depende do que a imprensa registrou e do que esta pesquisa encontrou, e a lista não é completa. As etiquetas são uma classificação do site, e não uma decisão da Justiça; etiqueta tracejada quer dizer classificação contestada. " +
        "Cada frase tem pelo menos duas fontes."
    },

    /* ===== Três Poderes ===== */
    {
      id: "organograma", titulo: "Organograma dos Poderes",
      find: porId("og-h"),
      mostra: "Os três Poderes (Executivo, Legislativo e Judiciário) e quem os ocupa, a partir do povo que elege o presidente e o Congresso.",
      ler: "O desenho começa no povo, que vota para presidente, deputados e senadores, e desce para as três colunas. Cada cartão traz o cargo, quem o ocupa, o partido e desde quando. Os ministros do STF e de outros tribunais superiores são indicados pelo presidente e aprovados pelo Senado.",
      bom: "Não há resultado melhor ou pior: é um mapa de quem manda em quê.",
      cuidado: "É a situação em outubro de 2026. Ministros e ocupantes de cargos mudam com frequência, então confira a data. Os Poderes são independentes e harmônicos entre si (art. 2º da Constituição)."
    },
    {
      id: "congresso", titulo: "Congresso eleito em 2026",
      find: porId("cg-h"),
      mostra: "As cadeiras da Câmara dos Deputados (513) e do Senado (81) depois da eleição de 4 de outubro de 2026, por partido ou federação.",
      ler: "Cada bolinha é uma cadeira, e a cor é o partido ou a federação. Passe o dedo ou o mouse na legenda para destacar um partido. Os partidos aparecem em ordem de tamanho da bancada, da esquerda para a direita do desenho, e essa ordem não tem relação com posição política. Federações contam como um partido nas votações.",
      bom: "Não há bom ou ruim: é a divisão das cadeiras. A referência é a maioria absoluta: 257 votos na Câmara (de 513) e 41 no Senado (de 81). Nenhum lado tem maioria sozinho.",
      cuidado: "Os eleitos tomam posse em 1º de fevereiro de 2027. A conta do quociente eleitoral ainda estava em conferência em alguns estados. No Senado, só 54 das 81 cadeiras estavam em jogo. Bancada eleita não é o mesmo que base do governo: os outros partidos decidem as votações."
    },
    {
      id: "stf", titulo: "As cadeiras do STF",
      find: porId("stf-h"),
      mostra: "Os 11 lugares do Supremo Tribunal Federal: quem indicou cada ministro em exercício, em que ano chegou e quando se aposenta, mais a cadeira vaga.",
      ler: "Os cartões estão em ordem de chegada ao tribunal. Cada um traz o nome, quem indicou, o ano de chegada e a data prevista da aposentadoria (ministros ficam no cargo até os 75 anos). O resumo acima conta quantos ministros cada presidente indicou.",
      bom: "Não há resultado melhor ou pior: é a composição do tribunal. A informação útil é quantas vagas se abrem no próximo mandato.",
      cuidado: "Ser indicado por um presidente não quer dizer votar com ele: ministros indicados pelo PT condenaram petistas no mensalão e na Lava Jato, e ministros indicados por Bolsonaro votaram contra ele em vários casos."
    },

    /* ===== Régua política ===== */
    {
      id: "regua-media", titulo: "Régua-média",
      find: porId("rpm-h"),
      mostra: "Onde ficam partidos, governos e outros atores numa régua de 0 (esquerda máxima) a 100 (direita máxima), pela média simples das réguas de vários autores.",
      ler: "Escolha até 8 atores e quais réguas entram na média (mínimo de 3 réguas com nota para o ator; sem isso não há média). No gráfico, o marcador é a média e a barra clara vai do menor ao maior valor entre os autores: ela indica incerteza, não erro. " +
        "O fundo tem sete faixas: 0–14, 15–29, 30–44, 45–55, 56–70, 71–85 e 86–100. A tabela completa traz a nota de cada autor (a letra ao lado de cada nota indica o tipo de método; a legenda “Método da nota” explica), a média, o mínimo e o máximo.",
      bom: "Nenhuma posição é melhor do que outra: a régua não mede qualidade, desempenho, honestidade nem grau de democracia. Barra estreita quer dizer que os autores situam o ator de modo parecido; barra larga, que discordam.",
      cuidado: "Nenhum dos autores publicou notas de 0 a 100 para partidos ou governos do Brasil: as notas são conversões, derivações ou estimativas do site, e cada uma diz de que tipo é. A margem é de cerca de 5 pontos (publicada), 6 (derivada) e 8 (estimada): diferenças menores não são conclusivas. " +
        "A largura do centro (45 a 55) é decisão de design do site. A concordância entre réguas mede a coerência do analista e não equivale a várias confirmações independentes."
    },
    {
      id: "regua-autores", titulo: "Uma régua por autor",
      find: porId("rpa-h"),
      mostra: "Uma régua de 0 a 100 para cada cientista político ou levantamento, com o critério do autor aplicado aos mesmos atores.",
      ler: "Cada cartão traz o critério do autor, um selo que diz se a régua entra na média e a régua com os atores. As zonas de referência (socialismo, comunismo, fascismo, nazismo e outras) aparecem só aqui e valem só para a régua daquele autor. Toque numa linha para ver a justificativa da nota.",
      bom: "Nenhuma posição é melhor do que outra. O que vale é a justificativa: confira se o critério do autor faz sentido para você.",
      cuidado: "Zonas de extremo são convenções gráficas de cada régua, e não medidas. Estar numa zona ou perto dela não classifica nenhum ator atual. Régua marcada como provisória fica fora da média por padrão."
    },

    /* ===== Como calculamos ===== */
    {
      id: "pisos-metas", titulo: "Pisos e metas de cada indicador",
      find: tituloComTexto("4. Pisos"),
      mostra: "A tabela com a unidade, o piso, a meta e o tipo de cada âncora usada na nota geral.",
      ler: "Cada linha é um indicador. O piso vale nota 0 e a meta vale nota 10; entre os dois, a nota cresce em linha reta. Quem passa da meta fica em 10 e quem passa do piso fica em 0. Quando a meta é menor do que o piso, menos é melhor, e a mesma fórmula serve. Os valores são variações médias por ano de governo, salvo quando a unidade diz outra coisa.",
      bom: "A meta é o resultado que vale 10. Ela é fixa e não depende de como os outros governos foram.",
      cuidado: "Pisos e metas são escolhas do site, e nem todas têm referência externa (por exemplo, Gini, pobreza extrema, Pisa e a tendência do desmatamento usam faixas simétricas). Cada âncora diz de que tipo é. A seção “E se fosse diferente?” mostra o efeito de mudar uma escolha."
    },
    {
      id: "valores-governos", titulo: "Valores usados em cada governo",
      find: tituloComTexto("5. Valores"),
      mostra: "Para cada governo e cada indicador, o valor medido e a nota de 0 a 10 que ele gerou.",
      ler: "Cada célula mostra o valor medido, uma seta e a nota. Nota 10 quer dizer “atingiu ou passou da meta” e 0 quer dizer “chegou ou passou do piso”. Célula sem dado fica fora da média daquele pilar (nunca entra como zero). O parágrafo acima da tabela diz quantas células ficaram em 10 ou em 0.",
      bom: "Valores mais perto da meta dão nota maior. Veja o piso e a meta na tabela de pisos e metas, logo acima.",
      cuidado: "Células em 10 ou em 0 escondem diferenças: dois governos que passaram da meta recebem a mesma nota. Mandatos curtos (Dilma 2, Temer) e anos de crise externa pesam muito em alguns indicadores."
    }
  ];

  /* ---------- estado da interface ---------- */
  var live = null, pendente = 0, observador = null, buscaTimer = 0;

  function el(tag, cls) {
    var e = D.createElement(tag);
    if (cls) { e.className = cls; }
    return e;
  }
  function avisar(msg) {
    if (!live) {
      live = el("div", "cl-sr");
      live.id = "cl-live";
      live.setAttribute("role", "status");
      live.setAttribute("aria-live", "polite");
      (D.body || D.documentElement).appendChild(live);
    }
    live.textContent = "";
    W.setTimeout(function () { live.textContent = msg; }, 30);
  }
  function parte(x) { return typeof x === "function" ? x() : x; }
  function seguro(x) {
    try { return parte(x) || ""; } catch (e) { return ""; }
  }

  function montarConteudo(it, painel) {
    var blocos = [
      ["O que mostra", it.mostra],
      ["Como ler", it.ler],
      ["O que seria um bom resultado", it.bom],
      ["Cuidado", it.cuidado]
    ], html = '<dl class="cl-dl">', i, t;
    for (i = 0; i < blocos.length; i++) {
      t = seguro(blocos[i][1]);
      if (t.indexOf("<p>") !== 0 && t.indexOf("<ul>") !== 0) { t = "<p>" + t + "</p>"; }
      html += '<div class="cl-b' + (i === 3 ? " cl-aviso" : "") + '"><dt>' + blocos[i][0] + "</dt><dd>" + t + "</dd></div>";
    }
    html += "</dl>";
    painel.innerHTML = html;
    var fechar = el("button", "cl-x");
    fechar.type = "button";
    fechar.textContent = "Fechar";
    fechar.setAttribute("data-cl-x", it.id);
    painel.appendChild(fechar);
  }

  function buscaBotao(id) { return D.querySelector('[data-cl-b="' + id + '"]'); }

  function aplicar(it, abrir, avisa) {
    var btn = buscaBotao(it.id), painel = D.getElementById("cl-p-" + it.id);
    if (!btn || !painel) { return; }
    if (abrir) {
      montarConteudo(it, painel);
      painel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      memAbertos[it.id] = 1;
    } else {
      painel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      delete memAbertos[it.id];
    }
    gravarSS();
    if (avisa) { avisar("Explicação " + (abrir ? "aberta" : "fechada") + ": " + it.titulo); }
  }

  function itemPorId(id) {
    var i;
    for (i = 0; i < ITENS.length; i++) { if (ITENS[i].id === id) { return ITENS[i]; } }
    return null;
  }

  function montar(it) {
    var a, btn, painel, linha, ref, pai, velho, ok;
    if (buscaBotao(it.id)) { return; }
    a = it.find();
    if (!a || !a.el || !a.el.parentNode) { return; }

    velho = D.getElementById("cl-p-" + it.id);
    if (velho && velho.parentNode) { velho.parentNode.removeChild(velho); }

    btn = el("button", "cl-btn");
    btn.type = "button";
    btn.id = "cl-b-" + it.id;
    btn.setAttribute("data-cl-b", it.id);
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "cl-p-" + it.id);
    btn.setAttribute("aria-label", "Como ler: " + it.titulo);
    btn.innerHTML = '<span class="cl-i" aria-hidden="true"></span><span class="cl-tx">Como ler</span>';

    painel = el("div", "cl-panel");
    painel.id = "cl-p-" + it.id;
    painel.setAttribute("role", "region");
    painel.setAttribute("aria-label", "Como ler: " + it.titulo);
    painel.hidden = true;

    if (a.modo === "inline") {
      pai = a.el.parentNode;
      pai.className += (pai.className ? " " : "") + "cl-sec";
      a.el.className += (a.el.className ? " " : "") + "cl-h";
      pai.insertBefore(btn, a.el.nextSibling);
      ref = a.depois || btn;
    } else {
      linha = el("div", "cl-row");
      linha.appendChild(btn);
      if (a.modo === "antes") { a.el.parentNode.insertBefore(linha, a.el); }
      else { a.el.parentNode.insertBefore(linha, a.el.nextSibling); }
      ref = linha;
    }
    ref.parentNode.insertBefore(painel, ref.nextSibling);

    ok = !!memAbertos[it.id];
    if (ok) { aplicar(it, true, false); }
  }

  function garantir() {
    var i;
    for (i = 0; i < ITENS.length; i++) {
      try { montar(ITENS[i]); } catch (e) { }
    }
  }
  function agendar() {
    if (buscaTimer) { return; }
    buscaTimer = W.setTimeout(function () { buscaTimer = 0; garantir(); }, 90);
  }

  function atualizarAbertos() {
    var i, id;
    cacheDs = null; cacheGeral = null;
    for (i = 0; i < ITENS.length; i++) {
      id = ITENS[i].id;
      if (memAbertos[id] && buscaBotao(id)) {
        var p = D.getElementById("cl-p-" + id);
        if (p && !p.hidden) { aplicar(ITENS[i], true, false); }
      }
    }
  }
  var atualTimer = 0;
  function agendarAtualizar() {
    cacheDs = null; cacheGeral = null;
    if (atualTimer) { return; }
    atualTimer = W.setTimeout(function () { atualTimer = 0; atualizarAbertos(); }, 200);
  }

  /* ---------- eventos (delegação) ---------- */
  function dentroDeCl(no) {
    return !!(no && no.closest && no.closest(".cl-panel, .cl-row, .cl-btn"));
  }

  D.addEventListener("click", function (ev) {
    var t = ev.target, btn, x, it, aberto;
    if (!t || !t.closest) { return; }
    btn = t.closest("[data-cl-b]");
    if (btn) {
      it = itemPorId(btn.getAttribute("data-cl-b"));
      if (!it) { return; }
      aberto = btn.getAttribute("aria-expanded") === "true";
      aplicar(it, !aberto, true);
      return;
    }
    x = t.closest("[data-cl-x]");
    if (x) {
      it = itemPorId(x.getAttribute("data-cl-x"));
      if (!it) { return; }
      aplicar(it, false, true);
      btn = buscaBotao(it.id);
      if (btn) { btn.focus(); }
    }
  });

  D.addEventListener("keydown", function (ev) {
    var k = ev.key || ev.keyCode, a = D.activeElement, p, id, it, btn;
    if (k !== "Escape" && k !== "Esc" && k !== 27) { return; }
    if (!a) { return; }
    if (a.getAttribute && a.getAttribute("data-cl-b") && a.getAttribute("aria-expanded") === "true") {
      id = a.getAttribute("data-cl-b");
    } else {
      p = a.closest ? a.closest(".cl-panel") : null;
      if (!p) { return; }
      id = p.id.replace(/^cl-p-/, "");
    }
    it = itemPorId(id);
    if (!it) { return; }
    aplicar(it, false, true);
    btn = buscaBotao(id);
    if (btn) { btn.focus(); }
    ev.stopPropagation();
  });

  /* ---------- início ---------- */
  function iniciar() {
    garantir();
    if (typeof W.MutationObserver === "function") {
      observador = new W.MutationObserver(function (muts) {
        var i, m;
        for (i = 0; i < muts.length; i++) {
          m = muts[i];
          if (m.addedNodes && m.addedNodes.length && !dentroDeCl(m.target)) { agendar(); return; }
          if (m.removedNodes && m.removedNodes.length && !dentroDeCl(m.target)) { agendar(); return; }
        }
      });
      observador.observe(D.body, { childList: true, subtree: true });
    }
    if (typeof B.on === "function") {
      B.on("page", function () { agendar(); });
      B.on("update", function () { agendar(); agendarAtualizar(); });
    }
  }

  if (D.readyState === "loading") { D.addEventListener("DOMContentLoaded", iniciar); } else { iniciar(); }
})();
