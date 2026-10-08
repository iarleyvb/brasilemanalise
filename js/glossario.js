/* Módulo glossario: glossário tocável (prefixo gl-).
   - Banco de 35 termos com definição, exemplo e link para onde aparece no site (mesmas palavras que o site usa).
   - Percorre o texto das páginas visíveis e marca a primeira ocorrência de cada termo por seção.
   - Toque: folha inferior no celular (menos de 700 px) e popover ancorado no tablet e no computador.
   - Expõe BEA.glossario = {termos, abrir(chave), ...} e preenche #glLista, se existir.
   Sem bibliotecas, sem rede, sem rastreamento. Única preferência: localStorage "bea_gl_marcar". */
(function(){
"use strict";
var B = window.BEA;
if(!B || B.glossario) return;

var NS_HTML = "http://www.w3.org/1999/xhtml";
var LIM_BLOCO = 4;          /* no máximo 4 termos marcados por parágrafo, para o texto não virar um tapete de sublinhados */
var PREF_CHAVE = "bea_gl_marcar";

/* ============================================================
   1. Banco de termos
   k chave · t título · p padrões do texto · cs maiúsculas importam · esc "pagina" = só a 1ª vez na página
   ctx/naoDepois: testes de contexto · d definição · e exemplo · s no site · l links [rótulo, #hash]
   e e s podem ser função (lê a API do site, para nunca ficar diferente dele)
   ============================================================ */
function nf(n){
  if(typeof n !== "number" || isNaN(n)) return "";
  var r = Math.round(n * 100) / 100;
  return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ",");
}
function pilaresApi(){ try{ return B.pilares() || []; }catch(e){ return []; } }
function estadoApi(){ try{ return B.estado() || null; }catch(e){ return null; } }
function indicadorApi(pilar, ind){
  try{
    var d = B.dataset(), l = (d && d.indicadores) || [];
    for(var i = 0; i < l.length; i++){ if(l[i].pilar === pilar && l[i].indicador === ind) return l[i]; }
  }catch(e){}
  return null;
}
function integridadeApi(){ try{ var d = B.dataset(); return d && d.integridade ? d.integridade : null; }catch(e){ return null; } }

var TERMOS = [
  {k:"gini", t:"Gini", p:["índice de Gini","Gini"], cs:true,
   d:"Índice que mede a desigualdade de renda, numa escala de 0 a 100. Quanto maior o número, mais desigual é a distribuição da renda.",
   e:"Se todos ganhassem o mesmo, o Gini seria 0. Se uma só pessoa ficasse com toda a renda, seria 100.",
   s:"Entra na nota de Pobreza e desigualdade: o site mede quantos pontos o Gini subiu ou caiu por ano de governo. Fonte: Banco Mundial.",
   l:[["Pobreza e desigualdade","#pobreza"]]},

  {k:"ipca", t:"IPCA e inflação", p:["IPCA","inflação"],
   d:"Inflação é o aumento geral dos preços: com ela, o mesmo dinheiro compra menos. O IPCA, calculado pelo IBGE, é o índice oficial que mede a inflação no Brasil.",
   e:"Se um produto custava R$ 100 e o IPCA do ano foi de 5%, ele passa a custar cerca de R$ 105.",
   s:"O site mede a inflação de cada governo pela média do IPCA nos anos de mandato e usa o IPCA para corrigir valores antigos até agosto de 2026.",
   l:[["Nota da economia","#nota-economia"],["Correção pela inflação","#pesos"]]},

  {k:"pib", t:"PIB e PIB por pessoa", p:["PIB por pessoa","PIB"], cs:true,
   d:"O PIB (Produto Interno Bruto) é o valor de tudo o que o país produz em um ano. O PIB por pessoa divide esse valor pelo número de habitantes.",
   e:"Se o PIB cresce 2% e a população cresce 1%, o PIB por pessoa cresce cerca de 1%.",
   s:"O site usa o PIB por pessoa a preços constantes, ou seja, sem o efeito da inflação (Banco Mundial). A dívida e a carga tributária são medidas em pontos do PIB.",
   l:[["Nota da economia","#nota-economia"]]},

  {k:"salario-minimo-real", t:"Salário mínimo real", p:["salário mínimo real","ganho real do salário mínimo","salário mínimo"],
   d:"É o salário mínimo depois de descontar a inflação. Mostra quanto ele compra de fato, e não só o número que aparece no papel.",
   e:"Se o mínimo sobe 6% num ano em que a inflação foi de 4%, o ganho real é de cerca de 2%.",
   s:"Na nota da economia entra o ganho real médio por ano, com o mínimo corrigido pelo IPCA (DIEESE e IBGE).",
   l:[["Nota da economia","#nota-economia"]]},

  {k:"desemprego", t:"Taxa de desemprego", p:["taxa de desemprego","desemprego"],
   d:"Parcela das pessoas que querem trabalhar e procuram emprego, mas não encontram, dentro do total de quem está na força de trabalho.",
   e:"Taxa de 8%: de cada 100 pessoas na força de trabalho, 8 procuram vaga e não encontram.",
   s:"O site mede a variação da taxa, em pontos por ano. Não há dado em 2010, ano de censo. Fonte: IBGE, via Banco Mundial.",
   l:[["Nota da economia","#nota-economia"]]},

  {k:"carga-tributaria", t:"Carga tributária", p:["carga tributária"],
   d:"É o total de impostos, taxas e contribuições que a população e as empresas pagam ao governo, medido como parte do PIB.",
   e:"Carga de 30% do PIB: de tudo o que o país produz em um ano, 30% vai para o governo em tributos.",
   s:"No site, carga menor é melhor. É uma escolha de valor: você pode mudar o peso desse indicador ou zerá-lo.",
   l:[["Nota da economia","#nota-economia"],["Mudar o peso","#pesos-eco"]]},

  {k:"divida-bruta", t:"Dívida bruta", p:["dívida bruta"],
   d:"É tudo o que o governo geral (União, estados e municípios) deve, medido em porcentagem do PIB.",
   e:"Dívida bruta de 70% do PIB: o total devido equivale a 70% de tudo o que o país produz em um ano.",
   s:"Entra em Contas para o futuro: o site mede quantos pontos do PIB a dívida subiu ou caiu por ano de governo. Fonte: Banco Central.",
   l:[["Contas para o futuro","#contas-futuro"]]},

  {k:"divida-liquida", t:"Dívida líquida", p:["dívida líquida"],
   d:"É a dívida do setor público depois de descontar o que ele tem em caixa e a receber, como as reservas internacionais. Também é medida em porcentagem do PIB.",
   e:"Se o setor público deve R$ 100 e tem R$ 30 em ativos, a dívida líquida é de R$ 70.",
   s:"Entra em Contas para o futuro, ao lado da dívida bruta. A série do Banco Central começa em 2001.",
   l:[["Contas para o futuro","#contas-futuro"]]},

  {k:"resultado-primario", t:"Resultado primário", p:["resultado primário","superávit primário","déficit primário"],
   d:"É a diferença entre o que o governo arrecada e o que gasta, sem contar os juros da dívida. Se sobra dinheiro, é superávit; se falta, é déficit.",
   e:"Se o governo arrecada R$ 100 e gasta R$ 95 sem contar os juros, o resultado primário é um superávit de R$ 5.",
   s:"Entra em Contas para o futuro: quanto maior o superávit, maior a nota. O piso e a meta estão em “A conta completa”. Fonte: Banco Central.",
   l:[["Contas para o futuro","#contas-futuro"],["A conta completa","#conta-completa"]]},

  {k:"wgi", t:"WGI e controle da corrupção", p:["índice de controle da corrupção","controle da corrupção","WGI"],
   d:"O WGI é um conjunto de indicadores de governança do Banco Mundial. O de controle da corrupção dá a cada país uma posição de 0 a 100 entre os países, a partir de percepções colhidas em pesquisas.",
   e:function(){
     var i = integridadeApi(), a = i && typeof i.wgi_piso === "number" ? i.wgi_piso : 25, b = i && typeof i.wgi_meta === "number" ? i.wgi_meta : 75;
     return "Na nota do site, " + nf(a) + " pontos valem nota 0 e " + nf(b) + " pontos valem nota 10.";
   },
   s:function(){
     var st = estadoApi(), c = st && st.intW ? st.intW.c : 0.7, w = st && st.intW ? st.intW.w : 0.3, tot = c + w, base = "Compõe o pilar Integridade. ";
     if(tot > 0) base += "Na sua régua, os casos do placar pesam " + Math.round(c / tot * 100) + "% e este índice, " + Math.round(w / tot * 100) + "%. ";
     return base + "É medido de fora e não pode ser atribuído a um só governo.";
   },
   l:[["Integridade na nota geral","#governos-hex"],["Mudar a combinação","#pesos-geral"]]},

  {k:"percentil", t:"Percentil", p:["percentis","percentil"],
   d:"É a posição numa fila de 0 a 100. Estar no percentil 40 quer dizer que o país está à frente de cerca de 40% dos países da lista.",
   e:"No controle da corrupção, o percentil 75 indica uma posição melhor do que a de cerca de três em cada quatro países.",
   s:"O índice de controle da corrupção do Banco Mundial é um percentil. Por construção, o país do meio da lista fica perto de 50.",
   l:[["Integridade na nota geral","#governos-hex"]]},

  {k:"ideb", t:"Ideb", p:["Ideb"], cs:true,
   d:"Índice de Desenvolvimento da Educação Básica, calculado pelo Inep. Junta o aprendizado dos alunos nas provas e a aprovação, numa nota de 0 a 10.",
   e:"Se o Ideb sobe de 5,0 para 5,2 em dois anos, o ganho é de 0,1 ponto por ano.",
   s:"Entra em Serviços públicos pelo ganho médio por ano. Como sai a cada dois anos, cada governo é medido do último resultado antes da posse ao último do mandato.",
   l:[["Serviços públicos","#nota-servicos"]]},

  {k:"pisa", t:"Pisa", p:["Pisa"], cs:true,
   d:"Programa Internacional de Avaliação de Estudantes, da OCDE. Testa jovens de 15 anos em leitura, matemática e ciências, a cada três anos.",
   e:"O site usa a média das três provas. Se ela sobe 9 pontos em três anos, o ganho é de 3 pontos por ano.",
   s:"Entra em Serviços públicos pela variação média por ano da nota.",
   l:[["Serviços públicos","#nota-servicos"]]},

  {k:"mortalidade-infantil", t:"Mortalidade infantil", p:["mortalidade infantil"],
   d:"É o número de bebês que morrem antes de completar 1 ano de vida, para cada mil nascidos vivos.",
   e:"Taxa de 12: de cada 1.000 bebês que nascem vivos, 12 morrem antes de completar 1 ano.",
   s:"Entra em Serviços públicos pela variação percentual da taxa por ano. Quanto menor a taxa de partida, mais difícil manter a queda percentual. Fonte: Banco Mundial.",
   l:[["Serviços públicos","#nota-servicos"]]},

  {k:"expectativa-de-vida", t:"Expectativa de vida", p:["expectativa de vida"],
   d:"É quantos anos, em média, um bebê que nasce hoje viveria se as condições de vida e de saúde de hoje continuassem as mesmas.",
   e:"Expectativa de 75 anos não quer dizer que todos vivem até os 75: é uma média de toda a população.",
   s:"Entra em Serviços públicos pelo ganho médio de anos de vida por ano de governo. Os anos da pandemia ficam fora da conta no padrão. Fonte: Banco Mundial.",
   l:[["Serviços públicos","#nota-servicos"]]},

  {k:"prodes", t:"Prodes e desmatamento", p:["Prodes","desmatamento"],
   d:"O Prodes é o sistema do Inpe que mede, por satélite, o desmatamento por corte raso na Amazônia. O ano do Prodes vai de agosto a julho.",
   e:"Um ano do Prodes vai de agosto de um ano até julho do seguinte, e não de janeiro a dezembro.",
   s:"Entra em Meio ambiente: o nível médio (km² por ano) e a tendência do desmatamento, do ano anterior à posse até o fim do mandato.",
   l:[["Meio ambiente","#nota-ambiente"]]},

  {k:"piso-meta", t:"Piso e meta", p:["pisos e metas","piso e uma meta","piso e meta","pisos","piso","metas","meta"], esc:"pagina",
   ctx:/\bpisos?\b[\s\S]{0,70}\bmetas?\b|\bmetas?\b[\s\S]{0,70}\bpisos?\b|vale 0|vale 10|\bfixos?\b|âncora/i,
   d:"Em cada indicador, o piso é o valor que vale nota 0 e a meta é o valor que vale nota 10. Quem passa da meta fica em 10, e quem passa do piso fica em 0.",
   e:function(){
     var i = indicadorApi("eco", "pib");
     if(!i || typeof i.piso !== "number" || typeof i.meta !== "number") return "Com piso −5 e meta 3, um resultado de −1 fica no meio do caminho e recebe nota 5.";
     return "Em " + i.titulo + ", o piso é " + nf(i.piso) + " e a meta é " + nf(i.meta) + " (" + i.unidade + "). Um resultado de " + nf((i.piso + i.meta) / 2) + " fica no meio do caminho e recebe nota 5.";
   },
   s:"Piso e meta são fixos e não dependem dos outros governos. Todos estão em “A conta completa”, na página Como calculamos.",
   l:[["A conta completa","#conta-completa"]]},

  {k:"pilar", t:"Pilar", p:["pilares","pilar"], esc:"pagina",
   d:"Cada um dos oito grandes temas da nota geral. Todo pilar recebe uma nota de 0 a 10 e tem um peso.",
   e:function(){
     var l = pilaresApi();
     if(!l.length) return "Os oito pilares são: Economia, Pobreza e desigualdade, Direitos e minorias, Serviços públicos, Meio ambiente, Contas para o futuro, Feitos e promessas e Integridade.";
     var n = l.map(function(p){ return p.t; });
     return "Os " + n.length + " pilares são: " + n.slice(0, -1).join(", ") + " e " + n[n.length - 1] + ".";
   },
   s:"A nota geral é a média ponderada dos oito pilares, com os pesos da sua régua.",
   l:[["Nota geral de cada governo","#governos-hex"],["Mudar os pesos","#pesos-geral"]]},

  {k:"peso", t:"Peso e régua", p:["sua régua","pesos","peso"], a:["regua"], esc:"pagina", semPagina:{"regua-politica":1}, naoDepois:/^\s+pol[ií]tica/i,
   d:"Peso é quanto cada pilar conta na nota geral. Ele é relativo: vale a sua parte na soma de todos os pesos. O conjunto de pesos que você escolhe é a sua régua e vale igual para todos.",
   e:function(){
     var txt = "Na média ponderada, quem pesa mais influi mais: notas 8 (peso 3) e 4 (peso 1) dão (8 × 3 + 4 × 1) ÷ 4 = 7.";
     var st = estadoApi(), pl = pilaresApi();
     if(st && st.pilW && pl.length){
       var tot = 0, k;
       for(k in st.pilW){ if(Object.prototype.hasOwnProperty.call(st.pilW, k)) tot += st.pilW[k]; }
       if(tot > 0 && pl[0] && typeof st.pilW[pl[0].k] === "number") txt += " Na sua régua de agora, " + pl[0].t + " pesa " + st.pilW[pl[0].k] + " de um total de " + tot + ".";
     }
     return txt;
   },
   s:"Os pesos dos pilares ficam na página Ajuste os pesos. Peso zero tira o item da conta.",
   l:[["Ajuste os pesos","#pesos-geral"]]},

  {k:"multiplicador", t:"Multiplicador de força", p:["multiplicador de força","força política","multiplicador"],
   d:"Número perto de 1 que ajusta as notas de Direitos e minorias e de Feitos e promessas conforme o apoio do governo no Congresso e no STF. A ideia é que quem tinha mais força precisava entregar mais.",
   e:function(){
     var st = estadoApi(), kappa = st && typeof st.forK === "number" ? st.forK : 0.25;
     if(kappa <= 0) return "Com o expoente em 0, a força não conta e o multiplicador é sempre ×1.";
     return "Com o expoente em " + nf(kappa) + ", um governo com metade da força média tem multiplicador de cerca de ×" + nf(Math.pow(2, kappa)) + ".";
   },
   s:"A força combina a base do governo na Câmara e no Senado (partidos com ministérios) e os ministros do STF indicados pelo grupo. O padrão é moderado, porque a base formal mede mal o apoio real.",
   l:[["Apoio no Congresso e no STF","#forca"],["Ajustar a força","#pesos-geral"]]},

  {k:"legado", t:"Legado", p:["legado"],
   d:"É o que um governo deixou de duradouro, medido pelos seus feitos. Cada feito recebe de 0 a 5 estrelas e conta conforme o mérito do governo e se ainda vale em 2026.",
   e:"Um programa criado pelo governo e que ainda existe em 2026 conta por inteiro; um que foi extinto não conta.",
   s:"No pilar Feitos e promessas entram os cinco maiores feitos de cada governo que ainda valem.",
   l:[["Legado dos governos","#legado"],["Feitos e promessas","#promessas"]]},

  {k:"estrela", t:"Estrela de legado e de gravidade", p:["estrelas de gravidade","estrela de gravidade","gravidade em estrelas","estrelas de legado","estrela de legado","estrelas","estrela"], a:["gravidade","estrela-de-gravidade"],
   d:"É uma nota de até 5 que o site dá quando não há um valor em reais para medir. Nos feitos de governo, mostra o tamanho do efeito (legado); nos escândalos sem valor em R$, mostra a gravidade.",
   e:"Gravidade: 5 estrelas é crime contra a democracia com condenação definitiva; 1 estrela é caso arquivado ou acusação rejeitada. Legado: 5 estrelas é mudança estrutural com efeito medido em dezenas de milhões de pessoas; 1 é medida pontual.",
   s:"As estrelas são julgamentos editoriais, com critérios abertos na página Como calculamos. Você pode mudar as estrelas de cada feito.",
   l:[["Critérios das estrelas","#metodo-placar"],["Casos do placar","#casos"]]},

  {k:"ponto-de-corrupcao", t:"Ponto de corrupção", p:["pontos de corrupção","ponto de corrupção"],
   d:"É a unidade do pilar Integridade. Um ponto equivale a R$ 1 bilhão desviado (corrigido pela inflação e ponderado pela prova) ou a uma estrela de gravidade nos casos sem valor em reais.",
   e:"Um caso de R$ 2 bi com grau de comprovação B (75%) soma 1,5 ponto, sem contar a correção pela inflação.",
   s:"Para comparar mandatos de durações diferentes, o site divide os pontos pelos anos de governo.",
   l:[["Como a conta é feita","#metodo-placar"],["A conta completa","#conta-completa"]]},

  {k:"valor-central", t:"Valor central", p:["valor central"],
   d:"É o valor de um escândalo reconhecido pela Justiça, pelo TCU ou pela CGU, pela própria vítima ou em transferências que a investigação identificou.",
   e:"Se só uma estimativa de procuradores aponta o valor, ela não entra no valor central: vai para a estimativa máxima.",
   s:"É o padrão do site. Nos pesos você pode trocar por “Mínima” (só o que já foi reconhecido) ou por “Máxima”.",
   l:[["Escolher a estimativa","#pesos"],["O que mudou","#imparcialidade"]]},

  {k:"estimativa-maxima", t:"Estimativa máxima", p:["estimativa máxima"],
   d:"É a maior estimativa apontada por um órgão público, ou o valor sob suspeita. Estimativas de procuradores, policiais e imprensa entram aqui, e não no valor central.",
   e:"Um mesmo caso pode ter um valor no centro e outro, maior, na estimativa máxima. Escolher “Máxima” nos pesos recalcula tudo, para todos os governos.",
   s:"O padrão do site é o valor central. A tabela “E se fosse diferente?” mostra quanto a nota geral muda com a estimativa máxima de cada escândalo.",
   l:[["Escolher a estimativa","#pesos"],["A conta completa","#conta-completa"]]},

  {k:"ponderado-pela-prova", t:"Ponderado pela prova", p:["ponderado pela prova","ponderada pela prova","ponderados pela prova","peso da comprovação","graus de comprovação","grau de comprovação"],
   d:"O valor de cada caso é multiplicado por um peso que depende de quanto o desvio está comprovado. Quanto mais firme a prova, maior o peso.",
   e:"No padrão do site, o grau A conta 100%, o B conta 75%, o C conta 50% e o D conta 25%. Um caso de R$ 10 bi no grau C entra como R$ 5 bi, antes da correção pela inflação.",
   s:"O grau diz quanto o desvio de dinheiro está comprovado, não a culpa de uma pessoa específica. Você pode escolher “Só o julgado” ou “Tudo igual”.",
   l:[["Graus de comprovação","#metodo-placar"],["Mudar o peso da prova","#pesos"]]},

  {k:"centrao", t:"Centrão", p:["Centrão"], cs:true,
   d:"Nome dado a um grupo de partidos de centro e centro-direita que costuma participar de governos de vários campos. No site, é tratado como tática de governo, não como doutrina.",
   e:"Na Régua política, o site conta como Centrão o MDB, o PSD, o PP, o Republicanos e o União Brasil. A lista varia conforme o período e a fonte.",
   s:"Aparece na Régua política e nos textos sobre a força dos governos no Congresso.",
   l:[["Régua política","#regua-politica"],["Apoio no Congresso e no STF","#forca"]]},

  {k:"presidencialismo-de-coalizao", t:"Presidencialismo de coalizão", p:["presidencialismo de coalizão"],
   d:"Sistema em que o presidente, sem maioria própria, forma uma base de vários partidos no Congresso, em geral dividindo ministérios e cargos, para aprovar suas propostas.",
   e:"A Câmara tem 513 deputados e a maioria absoluta é de 257 votos. Um presidente sem essa base precisa se aliar a outros partidos.",
   s:"O site mede a base de cada governo pelos partidos com ministérios, em porcentagem das cadeiras, na média do mandato.",
   l:[["Apoio no Congresso e no STF","#forca"]]},

  {k:"stf", t:"STF", p:["Supremo Tribunal Federal","STF"], cs:true,
   d:"Supremo Tribunal Federal, o tribunal mais alto do país e guardião da Constituição. Tem 11 ministros, indicados pelo presidente da República e aprovados pelo Senado.",
   e:"Quando surge uma vaga, o presidente indica um nome e o Senado vota para aprovar ou rejeitar.",
   s:"Na força política, o STF pesa um quarto da Câmara por padrão, porque ministro indicado não vota como bloco.",
   l:[["As cadeiras do STF","#stf"],["Apoio no Congresso e no STF","#forca"]]},

  {k:"congresso", t:"Congresso", p:["Congresso Nacional","Congresso"], cs:true,
   d:"O Congresso Nacional reúne a Câmara dos Deputados (513 deputados) e o Senado Federal (81 senadores). Faz as leis, aprova o Orçamento e fiscaliza o Executivo.",
   e:"Muitas leis nascem de projetos de deputados e senadores; o presidente só sanciona ou veta.",
   s:"Os deputados têm mandato de 4 anos e os senadores, de 8.",
   l:[["Congresso eleito","#congresso-2027"],["Organograma","#organograma"]]},

  {k:"orcamento-secreto", t:"Orçamento secreto e emendas", p:["orçamento secreto","emendas Pix","emendas de comissão","emendas parlamentares","emendas"], naoDepois:/^\s+constitucion/i,
   d:"Emendas são verbas do Orçamento da União que deputados e senadores indicam para obras e serviços. O “orçamento secreto” foi um arranjo de 2020 a 2022 em que não se sabia quem indicava o dinheiro; o STF o derrubou.",
   e:"As “emendas Pix” são transferências diretas a prefeituras, com pouca rastreabilidade.",
   s:"No placar, os casos de emendas aparecem como escândalos, cada um com o seu grau de comprovação.",
   l:[["Casos do placar","#casos"]]},

  {k:"tcu-cgu", t:"TCU e CGU", p:["TCU","CGU"], cs:true,
   d:"O TCU (Tribunal de Contas da União) ajuda o Congresso a fiscalizar o dinheiro público federal e dá parecer sobre as contas do presidente. A CGU (Controladoria-Geral da União) é o órgão do governo federal que faz auditorias e o controle interno.",
   e:"Quando o TCU ou a CGU reconhecem que houve dano aos cofres públicos, o site conta o caso no grau B (75%), de auditoria oficial.",
   s:"",
   l:[["Graus de comprovação","#metodo-placar"]]},

  {k:"choques-externos", t:"Choques externos", p:["choques externos","choque externo","anos de choque"],
   d:"São anos em que um evento fora do controle do governo derrubou a economia de todos: a crise global de 2009–10 e a pandemia de 2020–21. Na régua padrão, esses anos ficam fora da conta da economia e da pobreza, para todos os governos.",
   e:"Com a opção “Tirar da conta”, os anos de choque e de recuperação saem da média e o ano anterior se liga ao seguinte.",
   s:"O boom das commodities (cerca de 2003–2011) também foi um fator externo, mas a favor. Como durou quase uma década, não é descontado.",
   l:[["Mudar a regra dos choques","#pesos-eco"]]},

  {k:"merito", t:"Mérito", p:["mérito"],
   d:"É a parte do crédito de um feito que cabe ao governo que o apresenta: 100% se ele criou, 75% se criou sobre uma base anterior, 50% se dividiu o mérito com outros e 25% se só renomeou ou herdou.",
   e:"Um feito que o governo criou, mas que também dependeu do Congresso, divide o mérito e conta 50%.",
   s:"O desconto de mérito vem ligado por padrão e pode ser desligado nos pesos.",
   l:[["Descontar o mérito","#pesos"]]},

  {k:"otica-2026", t:"Ótica de 2026", p:["ótica de 2026"],
   d:"É a regra que conta um feito pelo que ainda existe em 2026. Se continua de pé, conta 100%; se existe em parte, 50%; se acabou ou foi revertido, não conta.",
   e:"O Auxílio Emergencial, feito para durar pouco e encerrado como previsto, conta por inteiro. Um programa revertido antes do previsto não conta.",
   s:"A regra pode ser desligada nos pesos.",
   l:[["Contar só o que existe em 2026","#pesos"]]}
];

/* ============================================================
   2. Utilidades
   ============================================================ */
function norm(s){
  s = String(s == null ? "" : s).toLowerCase();
  try{ s = s.normalize("NFD").replace(/[̀-ͯ]/g, ""); }catch(e){}
  return s;
}
function slug(s){ return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
function escRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function agora(){ return (window.performance && performance.now) ? performance.now() : Date.now(); }
function h(tag, cls, txt){
  var e = document.createElement(tag);
  if(cls) e.className = cls;
  if(txt != null) e.textContent = txt;
  return e;
}
function reduzMovimento(){ try{ return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } }
function larguraPopover(){ try{ return window.matchMedia("(min-width:700px)").matches; }catch(e){ return window.innerWidth >= 700; } }
function lerPref(){ try{ return window.localStorage.getItem(PREF_CHAVE) !== "0"; }catch(e){ return true; } }
function gravarPref(v){ try{ window.localStorage.setItem(PREF_CHAVE, v ? "1" : "0"); }catch(e){} }
function texto(v){
  if(typeof v === "function"){ try{ return String(v() || ""); }catch(e){ return ""; } }
  return v ? String(v) : "";
}

/* índice de chaves: chave própria, apelidos e cada padrão (para abrir("Prodes"), abrir("piso")...) */
var POR_CHAVE = {};
TERMOS.forEach(function(t){
  POR_CHAVE[t.k] = t;
  (t.a || []).forEach(function(a){ POR_CHAVE[slug(a)] = t; });
});
TERMOS.forEach(function(t){
  t.p.forEach(function(p){ var c = slug(p); if(!POR_CHAVE[c]) POR_CHAVE[c] = t; });
});
function achar(ch){
  if(ch && typeof ch === "object" && ch.k) return POR_CHAVE[ch.k] || null;
  return POR_CHAVE[slug(ch)] || null;
}

/* expressão única com todos os padrões, do mais longo para o mais curto (sem lookbehind: iOS 13) */
var PADROES = [], POR_BAIXA = {};
TERMOS.forEach(function(t){
  t.p.forEach(function(p){ var o = {txt:p, t:t}; PADROES.push(o); var b = p.toLowerCase(); (POR_BAIXA[b] = POR_BAIXA[b] || []).push(o); });
});
PADROES.sort(function(a, b){ return b.txt.length - a.txt.length; });
var FONTE_RE = PADROES.map(function(o){ return escRe(o.txt); }).join("|");
var RE = new RegExp(FONTE_RE, "gi");      /* com estado (lastIndex): usar só em marcarNo */
var TESTE = new RegExp(FONTE_RE, "i");    /* sem estado: filtro rápido */
var LETRA = /[A-Za-z0-9_À-ɏ]/;
function antesOk(s, i){ return i === 0 || !LETRA.test(s.charAt(i - 1)); }
function depoisOk(s, j){ return j >= s.length || !LETRA.test(s.charAt(j)); }
function acharPadrao(txt){
  var l = POR_BAIXA[txt.toLowerCase()];
  if(!l) return null;
  for(var i = 0; i < l.length; i++){ if(!l[i].t.cs || l[i].txt === txt) return l[i]; }
  return null;
}

/* ============================================================
   3. Varredura do texto
   ============================================================ */
var IGN_TAG = {A:1,BUTTON:1,INPUT:1,SELECT:1,TEXTAREA:1,LABEL:1,SUMMARY:1,CODE:1,PRE:1,KBD:1,SAMP:1,SCRIPT:1,STYLE:1,NOSCRIPT:1,TEMPLATE:1,
  H1:1,H2:1,H3:1,H4:1,H5:1,H6:1,TABLE:1,OPTION:1,OPTGROUP:1,DATALIST:1,CANVAS:1,IFRAME:1,OBJECT:1,EMBED:1,VIDEO:1,AUDIO:1,NAV:1,SVG:1,MATH:1};
var IGN_ID = {glLista:1,glBox:1,glAviso:1,tip:1,navbar:1,rodapeExtra:1,heroAcoes:1};
var IGN_CLS = / (gl-box|gl-fundo|gl-t|gl-lista|gl-skip|tblwrap|tip|sitenav|stick|navbar|site|skip|totop|foot-nav|foot-extra|stag|si-tags|chip|pty|eyebrow|kicker|formula) /;
var IGN_ROLE = {dialog:1,alertdialog:1,tooltip:1,status:1,alert:1,log:1,tab:1,tablist:1,button:1,link:1,menu:1,menuitem:1,option:1,listbox:1,combobox:1,textbox:1,searchbox:1,slider:1,switch:1,checkbox:1,radio:1,img:1,progressbar:1,meter:1};
var BLOCO = {P:1,LI:1,DD:1,DT:1,DIV:1,FIGCAPTION:1,BLOCKQUOTE:1,SECTION:1,ARTICLE:1,DETAILS:1,TD:1,TH:1,MAIN:1,FOOTER:1,HEADER:1,BODY:1};

function ignorar(el){
  if(el.namespaceURI !== NS_HTML) return true;               /* svg, math */
  if(IGN_TAG[el.nodeName]) return true;
  if(el.hidden) return true;
  if(el.id && IGN_ID[el.id]) return true;
  var cn = el.className;
  if(typeof cn === "string" && cn && IGN_CLS.test(" " + cn + " ")) return true;
  if(el.attributes && el.attributes.length){
    if(el.getAttribute("aria-hidden") === "true") return true;
    if(el.hasAttribute("aria-live") || el.hasAttribute("data-gl-ignore") || el.hasAttribute("contenteditable")) return true;
    var r = el.getAttribute("role");
    if(r && IGN_ROLE[r]) return true;
  }
  return false;
}
function raizOk(raiz){
  var e = raiz.nodeType === 1 ? raiz : raiz.parentNode;
  while(e && e.nodeType === 1 && e !== document.body){ if(ignorar(e)) return false; e = e.parentNode; }
  return !!e;
}
function aceita(n){
  if(n.nodeType === 3){
    var v = n.nodeValue;
    return (v.length > 2 && TESTE.test(v)) ? 1 : 3;           /* ACCEPT : SKIP */
  }
  return ignorar(n) ? 2 : 3;                                  /* REJECT (poda o ramo) : SKIP (entra) */
}
function coletar(raiz){
  var lista = [];
  if(raiz.nodeType === 3){ if(raiz.nodeValue.length > 2 && TESTE.test(raiz.nodeValue)) lista.push(raiz); return lista; }
  var w = document.createTreeWalker(raiz, 1 | 4, {acceptNode: aceita}, false);
  var n;
  while((n = w.nextNode())) lista.push(n);
  return lista;
}

var CACHE_DISPLAY = null;
function paiOk(pai){
  if(CACHE_DISPLAY && CACHE_DISPLAY.has(pai)) return CACHE_DISPLAY.get(pai);
  var r = true;
  try{ r = !/flex|grid|table|contents/.test(window.getComputedStyle(pai).display); }catch(e){}
  if(CACHE_DISPLAY) CACHE_DISPLAY.set(pai, r);
  return r;
}
/* a seção de verdade é a mais externa: o site aninha <section> dentro de <section> (um cartão por governo) */
function secaoExterna(el){
  var sec = null;
  while(el && el !== document.body){ if(el.nodeName === "SECTION") sec = el; el = el.parentElement; }
  return sec;
}
/* mapa de termos já marcados na seção (ou na página, para os termos muito comuns) */
function vistoDe(M, t, pai){
  var pag = t.esc === "pagina";
  var raiz = pag ? (pai.closest(".page") || document.body) : (secaoExterna(pai) || pai.closest(".page") || document.body);
  var mapa = pag ? M.pag : M.sec;
  var o = mapa.get(raiz);
  if(!o){
    o = {};
    var bs = raiz.querySelectorAll("button.gl-t");
    for(var i = 0; i < bs.length; i++) o[bs[i].getAttribute("data-gl")] = 1;
    mapa.set(raiz, o);
  }
  return o;
}
function blocoDe(M, pai){
  var p = pai;
  while(p && !BLOCO[p.nodeName]) p = p.parentElement;
  if(!p) p = document.body;
  var o = M.blo.get(p);
  if(!o){ o = {n: p.querySelectorAll("button.gl-t").length}; M.blo.set(p, o); }
  return o;
}
function criarBotao(txt, t){
  var b = document.createElement("button");
  b.type = "button";
  b.className = "gl-t";
  b.setAttribute("data-gl", t.k);
  b.setAttribute("aria-haspopup", "dialog");
  b.setAttribute("aria-expanded", "false");
  b.setAttribute("aria-label", txt + ", ver definição");
  b.appendChild(document.createTextNode(txt));
  return b;
}
function marcarNo(no, M, planos){
  var s = no.nodeValue, pai = no.parentNode;
  if(!pai || pai.nodeType !== 1) return 0;
  RE.lastIndex = 0;
  var m, ult = 0, frag = null, fez = 0, ok = null;
  while((m = RE.exec(s)) !== null){
    var i = m.index, txt = m[0], j = i + txt.length;
    if(!antesOk(s, i) || !depoisOk(s, j)){ RE.lastIndex = i + 1; continue; }
    var pat = acharPadrao(txt);
    if(!pat){ RE.lastIndex = i + 1; continue; }
    var t = pat.t;
    if(t.ctx && !t.ctx.test(s.slice(i > 70 ? i - 70 : 0, j + 70))){ RE.lastIndex = i + 1; continue; }
    if(t.naoDepois && t.naoDepois.test(s.slice(j, j + 24))) continue;
    if(t.semPagina){ var pg = pai.closest(".page"); if(pg && t.semPagina[pg.getAttribute("data-page")]) continue; }
    if(ok === null) ok = paiOk(pai);
    if(!ok) return 0;
    var vistos = vistoDe(M, t, pai);
    if(vistos[t.k]) continue;
    var bl = blocoDe(M, pai);
    if(bl.n >= LIM_BLOCO) continue;
    vistos[t.k] = 1; bl.n++;
    if(!frag) frag = document.createDocumentFragment();
    if(i > ult) frag.appendChild(document.createTextNode(s.slice(ult, i)));
    frag.appendChild(criarBotao(txt, t));
    ult = j; fez++;
  }
  if(!fez) return 0;
  if(ult < s.length) frag.appendChild(document.createTextNode(s.slice(ult)));
  planos.push({no:no, pai:pai, frag:frag});   /* aplicado depois: ler o estilo e mexer no DOM misturados forçam layout a cada nó */
  return fez;
}

var ativo = lerPref();
var obs = null, timer = null, sujos = [], excedeu = false;
var STATS = {passes:0, ultimaMs:0, maxMs:0, ultimosNos:0, ultimasMarcas:0, totalMarcas:0};

function conectar(){ if(obs && document.body) obs.observe(document.body, {childList:true, subtree:true, characterData:true}); }
function desconectar(){ if(obs) obs.disconnect(); }
function raizesPadrao(){
  var r = [], m = document.getElementById("conteudo"), f = document.querySelector(".site-foot");
  r.push(m || document.body);
  if(f) r.push(f);
  return r;
}
function processar(raizes){
  if(!ativo) return 0;
  var t0 = agora(), nos = 0, marcas = 0;
  var M = {sec:new Map(), pag:new Map(), blo:new Map()}, planos = [];
  CACHE_DISPLAY = new Map();
  desconectar();                       /* o que eu mesmo altero não pode acordar o observador (sem laço) */
  try{
    for(var r = 0; r < raizes.length; r++){
      var raiz = raizes[r];
      if(!raiz || !document.documentElement.contains(raiz) || !raizOk(raiz)) continue;
      var lista = coletar(raiz);
      nos += lista.length;
      for(var i = 0; i < lista.length; i++){
        if(lista[i].parentNode) marcas += marcarNo(lista[i], M, planos);
      }
    }
    for(var k = 0; k < planos.length; k++){
      if(planos[k].no.parentNode === planos[k].pai) planos[k].pai.replaceChild(planos[k].frag, planos[k].no);
    }
  }catch(e){
    /* uma falha aqui nunca pode quebrar o site */
  }finally{
    CACHE_DISPLAY = null;
    conectar();
  }
  var ms = agora() - t0;
  STATS.passes++; STATS.ultimaMs = ms; if(ms > STATS.maxMs) STATS.maxMs = ms;
  STATS.ultimosNos = nos; STATS.ultimasMarcas = marcas; STATS.totalMarcas += marcas;
  return marcas;
}
function reduzir(l){
  var u = [], i, j;
  for(i = 0; i < l.length; i++){ if(u.indexOf(l[i]) < 0 && document.documentElement.contains(l[i])) u.push(l[i]); }
  var r = [];
  for(i = 0; i < u.length; i++){
    var dentro = false;
    for(j = 0; j < u.length; j++){ if(i !== j && u[j] !== u[i] && u[j].contains(u[i])){ dentro = true; break; } }
    if(!dentro) r.push(u[i]);
  }
  return r;
}
function descarregar(){
  timer = null;
  var l = sujos, grande = excedeu;
  sujos = []; excedeu = false;
  if(!ativo) return;
  processar(grande ? raizesPadrao() : reduzir(l));
}
function agendar(ms){
  if(timer) return;
  timer = setTimeout(descarregar, ms == null ? 140 : ms);
}
function observar(muts){
  for(var i = 0; i < muts.length; i++){
    var m = muts[i], alvo = m.type === "characterData" ? m.target.parentNode : m.target;
    if(!alvo || alvo.nodeType !== 1) continue;
    if(m.type === "childList" && !m.addedNodes.length) continue;
    if(sujos.length && sujos[sujos.length - 1] === alvo) continue;
    if(alvo.closest && alvo.closest(".gl-box,.gl-fundo,#glLista,#glAviso,button.gl-t")) continue;
    if(sujos.length >= 250){ excedeu = true; continue; }
    sujos.push(alvo);
  }
  if(sujos.length || excedeu) agendar();
}
function desmarcarTudo(){
  desconectar();
  try{
    var bs = document.querySelectorAll("button.gl-t"), pais = [], i;
    for(i = 0; i < bs.length; i++){
      var p = bs[i].parentNode;
      if(!p) continue;
      p.replaceChild(document.createTextNode(bs[i].textContent), bs[i]);
      if(pais.indexOf(p) < 0) pais.push(p);
    }
    for(i = 0; i < pais.length; i++){ try{ pais[i].normalize(); }catch(e){} }
  }finally{
    if(ativo) conectar();
  }
}

/* ============================================================
   4. Caixa: folha inferior (celular) e popover (tablet e computador)
   ============================================================ */
var box = null, fundo = null, aviso = null, tituloEl = null, corpoEl = null, headEl = null, btnX = null;
var est = {aberto:false, k:null, gatilho:null, tok:0, dinamicos:[]};

function anunciar(msg){
  if(!aviso) return;
  aviso.textContent = "";
  setTimeout(function(){ aviso.textContent = msg; }, 30);
}
function listaExiste(){ return !!document.getElementById("glLista"); }

/* escreve a definição, o exemplo, o texto "No site" e os links dentro de um contêiner */
function preencherTermo(t, dest, comLista){
  while(dest.firstChild) dest.removeChild(dest.firstChild);
  var dinamicos = [];
  dest.appendChild(h("p", "gl-def", t.d));
  function campo(cls, rot, v){
    if(!v) return;
    var p = h("p", cls), b = h("b", null, rot), sp = h("span", "gl-v", texto(v));
    p.appendChild(b); p.appendChild(document.createTextNode(" ")); p.appendChild(sp);
    dest.appendChild(p);
    if(typeof v === "function") dinamicos.push({no:sp, fn:v});
  }
  campo("gl-ex", "Exemplo.", t.e);
  campo("gl-st", "No site.", t.s);
  var ln = h("p", "gl-ln");
  (t.l || []).forEach(function(l){
    var a = h("a", "gl-lk", l[0]);
    a.href = l[1];
    ln.appendChild(a);
  });
  if(comLista && listaExiste()){
    var a2 = h("a", "gl-lk gl-lk-lista", "Ver na lista completa");
    a2.href = "#gl-item-" + t.k;
    ln.appendChild(a2);
  }
  if(ln.firstChild) dest.appendChild(ln);
  return dinamicos;
}
function atualizarDinamicos(){
  var l = est.dinamicos;
  for(var i = 0; i < l.length; i++){ if(l[i].no) l[i].no.textContent = texto(l[i].fn); }
  var d = listaDin;
  for(var j = 0; j < d.length; j++){ if(d[j].no) d[j].no.textContent = texto(d[j].fn); }
}

function montarCaixa(){
  if(box || !document.body) return;
  fundo = h("div", "gl-fundo");
  fundo.hidden = true;
  fundo.setAttribute("aria-hidden", "true");

  box = h("div", "gl-box");
  box.id = "glBox";
  box.hidden = true;
  box.tabIndex = -1;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-labelledby", "glTitulo");

  var grab = h("div", "gl-grab");
  grab.setAttribute("aria-hidden", "true");
  headEl = h("div", "gl-head");
  var tit = h("div", "gl-tit");
  tit.appendChild(h("p", "gl-kick", "Glossário"));
  tituloEl = h("h2", "gl-titulo");
  tituloEl.id = "glTitulo";
  tit.appendChild(tituloEl);
  btnX = h("button", "gl-x");
  btnX.type = "button";
  btnX.setAttribute("aria-label", "Fechar glossário");
  btnX.innerHTML = '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M2 2L12 12M12 2L2 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Fechar</span>';
  headEl.appendChild(tit);
  headEl.appendChild(btnX);
  corpoEl = h("div", "gl-corpo");

  box.appendChild(grab);
  box.appendChild(headEl);
  box.appendChild(corpoEl);

  aviso = h("div", "gl-sr");
  aviso.id = "glAviso";
  aviso.setAttribute("role", "status");
  aviso.setAttribute("aria-live", "polite");

  document.body.appendChild(fundo);
  document.body.appendChild(box);
  document.body.appendChild(aviso);

  btnX.addEventListener("click", function(){ fechar(true); });
  fundo.addEventListener("click", function(){ fechar(false); });
  box.addEventListener("click", function(e){
    var a = e.target.closest ? e.target.closest("a") : null;
    if(a) fechar(false);              /* link para outra parte do site: fecha sem puxar o foco de volta */
  });
  box.addEventListener("keydown", prender);

  /* arrastar o topo da folha para baixo fecha (só no celular) */
  var arr = {on:false, y0:0, dy:0};
  headEl.addEventListener("touchstart", function(e){
    if(larguraPopover() || !est.aberto || (e.target.closest && e.target.closest("button")) || !e.touches.length) return;
    arr.on = true; arr.y0 = e.touches[0].clientY; arr.dy = 0;
    box.style.transition = "none";
  }, {passive:true});
  headEl.addEventListener("touchmove", function(e){
    if(!arr.on || !e.touches.length) return;
    var dy = e.touches[0].clientY - arr.y0;
    arr.dy = dy > 0 ? dy : 0;
    box.style.transform = "translateY(" + arr.dy + "px)";
  }, {passive:true});
  function soltar(){
    if(!arr.on) return;
    arr.on = false;
    box.style.transition = "";
    box.style.transform = "";
    if(arr.dy > 70) fechar(true);
  }
  headEl.addEventListener("touchend", soltar, {passive:true});
  headEl.addEventListener("touchcancel", soltar, {passive:true});
}

function focaveis(){
  var l = box.querySelectorAll("button, a[href]"), r = [];
  for(var i = 0; i < l.length; i++){ if(l[i].offsetWidth || l[i].offsetHeight) r.push(l[i]); }
  return r;
}
function prender(e){
  if(e.key !== "Tab" && e.keyCode !== 9) return;
  var f = focaveis();
  if(!f.length){ e.preventDefault(); box.focus(); return; }
  var a = document.activeElement, primeiro = f[0], ultimo = f[f.length - 1];
  if(e.shiftKey && (a === primeiro || a === box)){ e.preventDefault(); ultimo.focus(); }
  else if(!e.shiftKey && a === ultimo){ e.preventDefault(); primeiro.focus(); }
}

function posicionar(){
  if(!est.aberto || !box) return;
  if(!larguraPopover()){
    box.style.left = box.style.top = box.style.width = "";
    box.classList.remove("gl-seta", "gl-abaixo", "gl-acima");
    return;
  }
  var vw = document.documentElement.clientWidth, vh = window.innerHeight;
  var sx = window.pageXOffset || 0, sy = window.pageYOffset || 0;
  var larg = Math.min(380, vw - 24);
  box.style.width = larg + "px";
  var alt = box.offsetHeight, g = est.gatilho;
  if(g && document.documentElement.contains(g)){
    var rs = g.getClientRects(), r = rs.length ? rs[0] : g.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var left = Math.max(12, Math.min(cx - larg / 2, vw - larg - 12));
    var abaixo = vh - r.bottom, acima = r.top;
    var emBaixo = abaixo >= alt + 16 || abaixo >= acima;
    var top = emBaixo ? r.bottom + 10 : r.top - alt - 10;
    top = Math.max(8, Math.min(top, vh - alt - 8));
    box.style.left = (left + sx) + "px";
    box.style.top = (top + sy) + "px";
    box.style.setProperty("--gl-seta-x", Math.max(22, Math.min(cx - left, larg - 22)) + "px");
    box.classList.add("gl-seta");
    box.classList.toggle("gl-abaixo", emBaixo);
    box.classList.toggle("gl-acima", !emBaixo);
  }else{
    box.classList.remove("gl-seta", "gl-abaixo", "gl-acima");
    box.style.left = ((vw - larg) / 2 + sx) + "px";
    box.style.top = (Math.max(16, (vh - alt) / 2) + sy) + "px";
  }
}

function marcarGatilho(g, on){
  if(g && g.setAttribute) g.setAttribute("aria-expanded", on ? "true" : "false");
}
function abrir(ch, ancora){
  var t = achar(ch);
  if(!t) return false;
  montarCaixa();
  if(!box) return false;
  var g = ancora && ancora.nodeType === 1 ? ancora : null;
  if(est.aberto && g && g === est.gatilho && est.k === t.k){ fechar(true); return true; }
  marcarGatilho(est.gatilho, false);
  est.k = t.k; est.gatilho = g;
  tituloEl.textContent = t.t;
  est.dinamicos = preencherTermo(t, corpoEl, true);
  corpoEl.scrollTop = 0;
  marcarGatilho(g, true);
  var popover = larguraPopover();
  var comFundo = !popover || !g;
  est.tok++;
  var jaAberto = est.aberto;
  est.aberto = true;
  box.hidden = false;
  fundo.hidden = !comFundo;
  fundo.classList.toggle("gl-modal", comFundo);
  if(!jaAberto){
    box.classList.remove("gl-aberto"); fundo.classList.remove("gl-aberto");
    posicionar();
    void box.offsetHeight;             /* força o layout para a animação de entrada acontecer */
  }else{
    posicionar();
  }
  box.classList.add("gl-aberto");
  if(comFundo) fundo.classList.add("gl-aberto"); else fundo.classList.remove("gl-aberto");
  try{ box.focus({preventScroll:true}); }catch(e){ box.focus(); }
  return true;
}
function fechar(devolverFoco){
  if(!est.aberto || !box) return;
  est.aberto = false;
  var tok = ++est.tok, g = est.gatilho;
  marcarGatilho(g, false);
  box.classList.remove("gl-aberto");
  fundo.classList.remove("gl-aberto");
  function fim(){
    if(est.tok !== tok) return;       /* abriu de novo no meio do caminho */
    box.hidden = true; fundo.hidden = true;
    box.style.transform = ""; box.style.transition = "";
  }
  if(reduzMovimento() || larguraPopover()) fim(); else setTimeout(fim, 230);
  if(devolverFoco !== false){
    var alvo = g && document.documentElement.contains(g) ? g : document.getElementById("conteudo");
    if(alvo && alvo.focus){ try{ alvo.focus({preventScroll:true}); }catch(e){ alvo.focus(); } }
  }
  est.gatilho = null;
  anunciar("Definição fechada.");
}

/* ============================================================
   5. Lista completa (#glLista)
   ============================================================ */
var listaDin = [];
var listaRef = {itens:[], grupos:[], contagem:null, vazio:null, busca:null, tudo:null, marcar:null};

function montarLista(){
  var raiz = document.getElementById("glLista");
  if(!raiz || raiz.getAttribute("data-gl-pronto") === "1") return;
  raiz.setAttribute("data-gl-pronto", "1");
  while(raiz.firstChild) raiz.removeChild(raiz.firstChild);
  listaDin = []; listaRef = {itens:[], grupos:[], contagem:null, vazio:null, busca:null, tudo:null, marcar:null};

  var wrap = h("div", "gl-lista");
  var barra = h("div", "gl-barra");
  var busca = h("div", "gl-busca");
  var lab = h("label", null, "Buscar um termo");
  lab.setAttribute("for", "glBusca");
  var inp = h("input");
  inp.id = "glBusca"; inp.type = "search"; inp.autocomplete = "off"; inp.placeholder = "Ex.: Gini, piso, STF";
  inp.setAttribute("autocapitalize", "off"); inp.setAttribute("spellcheck", "false");
  busca.appendChild(lab); busca.appendChild(inp);
  barra.appendChild(busca);

  var acoes = h("div", "gl-acoes");
  var tudo = h("button", "btn", "Abrir todos");
  tudo.type = "button"; tudo.setAttribute("aria-pressed", "false");
  var pref = h("label", "gl-pref");
  var cb = h("input"); cb.type = "checkbox"; cb.id = "glMarcar"; cb.checked = ativo;
  pref.appendChild(cb);
  pref.appendChild(h("span", null, "Sublinhar no texto os termos que têm explicação"));
  acoes.appendChild(tudo); acoes.appendChild(pref);
  barra.appendChild(acoes);
  wrap.appendChild(barra);

  wrap.appendChild(h("p", "gl-ajuda", "No texto do site, as palavras com sublinhado pontilhado abrem uma explicação curta. Aqui está a lista completa, em ordem alfabética."));
  var cont = h("p", "gl-contagem");
  cont.id = "glContagem"; cont.setAttribute("role", "status"); cont.setAttribute("aria-live", "polite");
  wrap.appendChild(cont);

  var ordem = TERMOS.slice().sort(function(a, b){ var x = norm(a.t), y = norm(b.t); return x < y ? -1 : x > y ? 1 : 0; });
  var letraAtual = "", ul = null;
  var grupos = h("div", "gl-grupos");
  ordem.forEach(function(t){
    var letra = norm(t.t).charAt(0).toUpperCase();
    if(letra !== letraAtual){
      letraAtual = letra;
      var g = h("div", "gl-grupo");
      var hh = h("h3", "gl-letra", letra);
      ul = h("ul", "gl-itens");
      g.appendChild(hh); g.appendChild(ul);
      grupos.appendChild(g);
      listaRef.grupos.push(g);
    }
    var li = h("li", "gl-item");
    var det = h("details", "gl-det");
    det.id = "gl-item-" + t.k;
    var sm = h("summary", null, t.t);
    var c = h("div", "gl-det-c");
    var din = preencherTermo(t, c, false);
    din.forEach(function(d){ listaDin.push(d); });
    det.appendChild(sm); det.appendChild(c);
    li.appendChild(det);
    li._gl = norm(t.t + " " + t.p.join(" ") + " " + t.d + " " + texto(t.e));
    ul.appendChild(li);
    listaRef.itens.push(li);
  });
  wrap.appendChild(grupos);
  var vazio = h("p", "gl-vazio", "Nenhum termo encontrado. Tente outra palavra.");
  vazio.hidden = true;
  wrap.appendChild(vazio);
  raiz.appendChild(wrap);
  listaRef.contagem = cont; listaRef.vazio = vazio; listaRef.busca = inp; listaRef.tudo = tudo; listaRef.marcar = cb;
  cont.textContent = ordem.length + " termos.";

  function filtrar(){
    var q = norm(inp.value).replace(/\s+/g, " ").trim(), achados = 0;
    listaRef.itens.forEach(function(li){
      var ok = !q || li._gl.indexOf(q) >= 0;
      li.hidden = !ok;
      if(ok) achados++;
    });
    listaRef.grupos.forEach(function(g){
      var algum = false, its = g.querySelectorAll(".gl-item");
      for(var i = 0; i < its.length; i++){ if(!its[i].hidden){ algum = true; break; } }
      g.hidden = !algum;
    });
    vazio.hidden = achados > 0;
    cont.textContent = !q ? ordem.length + " termos."
      : achados === 0 ? "Nenhum termo encontrado."
      : achados === 1 ? "1 termo encontrado." : achados + " termos encontrados.";
  }
  inp.addEventListener("input", filtrar);
  inp.addEventListener("keydown", function(e){ if(e.key === "Escape" && inp.value){ inp.value = ""; filtrar(); e.stopPropagation(); } });

  tudo.addEventListener("click", function(){
    var abrirTodos = tudo.getAttribute("aria-pressed") !== "true";
    listaRef.itens.forEach(function(li){ if(!li.hidden){ var d = li.querySelector("details"); if(d) d.open = abrirTodos; } });
    tudo.setAttribute("aria-pressed", abrirTodos ? "true" : "false");
    tudo.textContent = abrirTodos ? "Fechar todos" : "Abrir todos";
  });
  cb.addEventListener("change", function(){ marcar(cb.checked); });

  /* abriu o site já apontando para um termo (#gl-item-gini): o roteador do site não achava o elemento, agora acha */
  if(/^#gl-item-/.test(location.hash) || location.hash === "#glLista"){
    try{ window.dispatchEvent(new Event("hashchange")); }catch(e){}
  }
}

/* ============================================================
   6. Preferência, rodapé e ganchos
   ============================================================ */
function marcar(on){
  on = !!on;
  var mudou = on !== ativo;
  ativo = on;
  gravarPref(on);
  if(listaRef.marcar) listaRef.marcar.checked = on;
  if(!on){
    fechar(false);
    desmarcarTudo();
  }else{
    processar(raizesPadrao());
  }
  if(mudou) anunciar(on ? "Termos sublinhados no texto." : "Termos sem sublinhado no texto. A lista continua disponível.");
  return ativo;
}
function rodape(){
  if(!listaExiste() || document.getElementById("glRodapeLink")) return;
  var slot = document.getElementById("slotRodape");
  if(!slot) return;
  var nav = document.getElementById("rodapeExtra");
  if(!nav){
    nav = document.createElement("nav");
    nav.id = "rodapeExtra"; nav.className = "foot-extra";
    nav.setAttribute("aria-label", "Mais");
    slot.appendChild(nav);
  }
  var a = h("a", null, "Glossário");
  a.id = "glRodapeLink"; a.href = "#glLista";
  nav.appendChild(a);
}

/* clique em termo (captura: não deixa o clique chegar a contêineres clicáveis do site) e clique fora */
document.addEventListener("click", function(e){
  var alvo = e.target;
  if(!alvo || !alvo.closest) return;
  var t = alvo.closest("button.gl-t");
  if(t){
    e.preventDefault(); e.stopPropagation();
    abrir(t.getAttribute("data-gl"), t);
    return;
  }
  if(est.aberto && box && !box.contains(alvo)) fechar(false);
}, true);
document.addEventListener("keydown", function(e){
  if((e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) && est.aberto){
    e.preventDefault(); e.stopPropagation();
    fechar(true);
  }
}, true);
var rt = null;
window.addEventListener("resize", function(){
  if(!est.aberto) return;
  clearTimeout(rt);
  rt = setTimeout(function(){
    /* troca entre folha e popover quando o aparelho gira */
    var popover = larguraPopover(), g = est.gatilho;
    fundo.hidden = !( !popover || !g );
    fundo.classList.toggle("gl-modal", !popover || !g);
    fundo.classList.toggle("gl-aberto", !popover || !g);
    posicionar();
  }, 100);
});
window.addEventListener("hashchange", function(){ fechar(false); });

/* ============================================================
   7. API pública e início
   ============================================================ */
function snapshot(t){
  var o = {chave:t.k, termo:t.t, definicao:t.d, padroes:t.p.slice(),
           onde:(t.l || []).map(function(l){ return {t:l[0], href:l[1]}; })};
  try{
    Object.defineProperty(o, "exemplo", {enumerable:true, get:function(){ return texto(t.e); }});
    Object.defineProperty(o, "noSite", {enumerable:true, get:function(){ return texto(t.s); }});
  }catch(e){ o.exemplo = texto(t.e); o.noSite = texto(t.s); }
  return o;
}
B.glossario = {
  versao: "1.0",
  termos: TERMOS.map(snapshot),
  abrir: function(chave){ return abrir(chave, null); },
  fechar: function(){ fechar(true); },
  termo: function(chave){ var t = achar(chave); return t ? snapshot(t) : null; },
  marcar: marcar,
  reprocessar: function(){ return processar(raizesPadrao()); },
  estatisticas: function(){ return {passes:STATS.passes, ultimaMs:STATS.ultimaMs, maxMs:STATS.maxMs, nos:STATS.ultimosNos, marcas:STATS.ultimasMarcas, totalMarcas:STATS.totalMarcas, ativo:ativo}; }
};

function iniciar(){
  try{
    obs = new MutationObserver(observar);
    montarCaixa();
    montarLista();
    rodape();
    if(ativo) processar(raizesPadrao());      /* processar já conecta o observador */
    B.on("page", function(){
      fechar(false);
      try{ montarLista(); rodape(); }catch(e){}
      if(ativo) processar(raizesPadrao());
    });
    B.on("update", function(){
      try{ atualizarDinamicos(); }catch(e){}
      if(ativo) agendar();
    });
  }catch(e){
    /* sem glossário, o site continua igual */
  }
}
iniciar();
})();
