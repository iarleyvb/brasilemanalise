/* Módulo novidades: página "Novidades" (#novidades) (prefixo nv-).
   Mostra o histórico de versões e mudanças do site, do mais novo ao mais antigo, com data, versão, título,
   o que mudou e o impacto na nota quando houver. Entradas dos últimos 14 dias levam o marcador "novo".
   As entradas abaixo vieram do histórico do git (git log) e das seções de revisão do próprio index.html.
   Sem rede, sem rastreamento, sem cookies. Guarda só qual entrada você já viu (localStorage), para o aviso
   "novo" no rodapé sumir depois que você abre a página.
   Sintaxe segura para iOS 13+: sem "?.", sem "??", sem lookbehind. */
(function () {
  "use strict";

  /* ============================================================
     HISTÓRICO: o dono acrescenta entradas aqui, no começo da lista.
     Modelo de uma entrada (todos os campos, menos id, data, titulo e itens, são opcionais):
       {
         id: "nome-curto-sem-espaco",           // vira o link #nv-nome-curto-sem-espaco
         data: "AAAA-MM-DD",                    // dia da mudança
         tipo: "Modelo" | "Página" | "Qualidade" | "Site",
         versao: "2.2",                         // só para mudanças no cálculo da Nota geral; ou null
         titulo: "Título curto",
         resumo: "Uma ou duas frases.",
         itens: ["Cada mudança em uma frase.", "..."],
         impacto: {                             // só quando a nota muda (ou para dizer que não muda)
           texto: "Frase sobre o efeito.",
           tabela: { legenda: "...", cab: ["", "Antes", "Depois"], linhas: [["PT, todos", "6,9", "6,6"]] }
         },
         links: [{ href: "#metodo", texto: "Ver como calculamos" }]
       }
     A lista é ordenada pela data (a mais nova primeiro); datas iguais ficam na ordem em que estão aqui.
     ============================================================ */
  var DIAS_NOVO = 14;

  var ENTRADAS = [
    {
      id: "empate-tecnico",
      data: "2026-10-14",
      tipo: "Site",
      versao: null,
      titulo: "Empate técnico e faixa de incerteza no placar",
      resumo: "Cada nota do placar ganhou uma linha fina com a faixa onde ela fica quando pesos, pisos e metas variam um pouco, e o sinal “=” marca governos em empate técnico.",
      itens: [
        "200 sorteios em torno da régua em uso (pesos ±35%, pisos e metas ±25% da faixa), com semente fixa: o resultado é sempre o mesmo para a mesma régua.",
        "Empate técnico: a ordem entre dois vizinhos se inverte em mais de 10% dos sorteios.",
        "No padrão atual, Lula 1, Bolsonaro e Lula 3 estão em empate técnico, e Dilma 1 e Dilma 2 também."
      ],
      impacto: { texto: "Não muda nenhuma nota." },
      links: [{ href: "#hist", texto: "Ver o placar" }]
    },
    {
      id: "revisao-cega",
      data: "2026-10-14",
      tipo: "Modelo",
      versao: "7.1",
      titulo: "Revisão cega dos catálogos e regra para mudar regras",
      resumo: "Casos, promessas, feitos e medidas foram reclassificados por revisores que não sabiam de que governo era cada item. Não apareceu viés forte; as divergências foram resolvidas por uma regra igual para todos.",
      itens: [
        "Concordância exata: 13 de 18 no grau de prova, 39 de 42 nas promessas, 19 de 27 nas estrelas dos feitos, 53 de 89 nas estrelas das medidas.",
        "Desempate: estrelas e mérito pela média; grau e etapa pelo menos grave; promessas em “em parte”; situação em 2026 conta 75%.",
        "Nova seção “Como mudamos as regras”, com o protocolo e o teste de cada mudança desta semana.",
        "Nova seção “Revisão cega dos catálogos”, com a contagem de itens por governo."
      ],
      impacto: { texto: "Bolsonaro 6,51 → 6,48; Lula 3 6,37 → 6,39; Dilma 1 5,15 → 5,19; os demais mudam menos de 0,02." },
      links: [{ href: "#revisao-cega", texto: "Ver a revisão cega" }, { href: "#regras-mudanca", texto: "Ver o protocolo" }]
    },
    {
      id: "pesos-da-populacao",
      data: "2026-10-14",
      tipo: "Modelo",
      versao: "7.0",
      titulo: "Pesos padrão vindos das prioridades da população",
      resumo: "O peso de cada tema deixa de ser escolha do site: metade vem das pesquisas sobre o principal problema do país (Datafolha, mar/2026, e Quaest/Pax, set/2026) e metade é igual para os dez temas, para nenhum ficar zerado.",
      itens: [
        "Pesos: Segurança 18, Economia 16, Saúde 16, Integridade 14, Educação 9, Pobreza 7; Direitos, Meio ambiente, Contas para o futuro e Feitos e promessas 5 cada.",
        "Corrige um defeito da versão 5: o peso de cada tema dependia de quantos pedaços ele tinha (Direitos com 20% e Segurança com 3%).",
        "A regra (metade pesquisas, metade igual) foi definida antes de calcular o efeito nas notas.",
        "“Cada tema igual” e “Cada indicador igual” continuam como opções no Início e em A conta completa."
      ],
      impacto: { texto: "Nota geral: Lula 2 7,2; Lula 1 6,9; Bolsonaro 6,5; Lula 3 6,4; Dilma 1 5,2; Dilma 2 4,8; PT, todos 6,3. Com cada tema igual: Bolsonaro 6,2 e Lula 3 6,1." },
      links: [{ href: "#a-formula", texto: "Ver a origem dos pesos" }]
    },
    {
      id: "visual-placar",
      data: "2026-10-14",
      tipo: "Site",
      versao: null,
      titulo: "Visual novo: placar no topo, menu numa linha e blocos com seta",
      resumo: "O placar virou um ranking em linhas finas, com posição e barras que crescem ao aparecer; no computador ele fica ao lado do título.",
      itens: [
        "Placar inspirado no componente “Rank Bars” da 21st.dev: rótulo, barra e nota, sem moldura; a linha aberta fica destacada.",
        "Menu do computador numa linha só; páginas secundárias em “Mais”. Se a tela for estreita, os últimos itens passam para o “Mais” sozinhos.",
        "Barra de baixo do celular com a página atual marcada por uma pílula.",
        "Blocos recolhidos com seta e abertura suave; “Ler mais” com seta.",
        "No celular, o topo mostra só “Ver o placar” e o “Guia”: Régua e Quiz já estão na barra de baixo.",
        "Animações desligadas para quem pede menos movimento no sistema."
      ],
      impacto: { texto: "Não muda nenhuma nota." },
      links: [{ href: "#inicio", texto: "Ver o Início" }]
    },
    {
      id: "mare-saude-seguranca-emprego",
      data: "2026-10-14",
      tipo: "Modelo",
      versao: "6.1",
      titulo: "A maré da região chega à saúde, à segurança e ao emprego",
      resumo: "Mortalidade infantil, expectativa de vida, homicídios e desemprego também passam a descontar o quanto os vizinhos melhoraram ou pioraram acima do normal no mesmo ano.",
      itens: [
        "Mortalidade infantil: a queda desacelerou em toda a região nos últimos anos, então os governos recentes deixam de perder pontos só por terem pegado uma taxa já baixa. Saúde de Bolsonaro vai de 3,4 para 6,1; de Lula 3, de 3,3 para 5,3.",
        "Homicídios: em 2007–2010 a violência subiu na região (México, América Central) e em 2011–2018 caiu. Segurança de Lula 2 vai de 3,4 para 5,3; de Dilma 1, de 1,1 para 0.",
        "Desemprego: mesma regra, em pontos por ano.",
        "Fonte: Banco Mundial (SP.DYN.IMRT.IN, SP.DYN.LE00.IN, VC.IHR.PSRC.P5, SL.UEM.TOTL.ZS), mediana de 17 países da América Latina sem o Brasil. Homicídios têm de 11 a 17 países por ano e vão até 2023.",
        "Dá para desligar em Ajuste os pesos: “Sorte e azar de fora”."
      ],
      impacto: { texto: "Nota geral: Bolsonaro 5,57 → 5,86; Lula 3 5,93 → 6,08; Lula 1 6,75 → 6,66; Dilma 1 5,76 → 5,68; Dilma 2 3,59 → 3,67; Lula 2 6,88 → 6,88." },
      links: [{ href: "#nota-servicos", texto: "Ver saúde, segurança e educação" }]
    },
    {
      id: "mare-da-regiao",
      data: "2026-10-14",
      tipo: "Modelo",
      versao: "6.0",
      titulo: "Sorte e azar de fora: a maré da América Latina",
      resumo: "O crescimento do PIB por pessoa e da renda passa a ser medido descontando o quanto os vizinhos cresceram acima ou abaixo do normal no mesmo ano. A regra tira o vento a favor do boom das commodities e devolve o vento contra das crises mundiais, igual para todos.",
      itens: [
        "Maré = mediana do crescimento do PIB por pessoa de 17 países da América Latina, sem o Brasil (Banco Mundial). Normal = média dessa mediana de 1995 a 2025 (2,1% ao ano).",
        "Vento a favor, em pontos por ano: Lula 1 +1,1, Lula 2 +1,6, Dilma 1 +1,0. Vento contra: FHC −0,6, Bolsonaro −0,4, Temer −0,2.",
        "Crescimento do PIB por pessoa, sem e com o desconto: Lula 1 2,4% → 1,2%; Lula 2 4,6% → 2,9%; Bolsonaro 1,6% → 2,0%; FHC 0,7% → 1,3%.",
        "Os anos de crise (2009–10 e pandemia) continuam fora da conta, como antes.",
        "Dá para desligar em Ajuste os pesos, no painel da economia."
      ],
      impacto: { texto: "Nota geral: Lula 1 6,75 → 6,66; Lula 2 6,88 → 6,83; Dilma 1 5,76 → 5,69; Bolsonaro 5,57 → 5,64; Lula 3 5,93 → 5,94. A diferença é pequena porque PIB e renda são 2 dos 30 indicadores; no pilar Economia ela é maior." },
      links: [{ href: "#regua", texto: "Ligar ou desligar" }]
    },
    {
      id: "neutra-por-indicador",
      data: "2026-10-14",
      tipo: "Modelo",
      versao: "5.0",
      titulo: "Régua neutra por indicador e a fórmula completa à vista",
      resumo: "Cada um dos 30 indicadores passa a valer o mesmo na nota final (3,3%). Controles que estavam em zero ou perto disso subiram. A expressão inteira da nota, com todas as variáveis, ganhou uma seção própria.",
      itens: [
        "Antes, com os dez temas de peso igual, inflação, desemprego e PIB valiam 1,7% cada e homicídios valia 10%. Agora todos valem 3,3%.",
        "Peso padrão de cada pilar = 3 × número de indicadores: Economia 18, Direitos 18, Contas para o futuro 12, Meio ambiente 9, Pobreza, Saúde, Educação, Feitos e promessas e Integridade 6, Segurança 3.",
        "Vidas impactadas por um caso de corrupção: de 0 para 1 ponto por milhão de pessoas lesadas.",
        "Força política: Câmara, Senado e STF com o mesmo peso (o STF tinha 0,25) e multiplicador com expoente 0,5 (era 0,25).",
        "Regra de efeito: medida sem efeito verificável passa a valer metade (era um quarto).",
        "Nova seção “A fórmula completa”, em Como calculamos, com a nota inteira numa expressão e uma tabela de todas as variáveis, com o padrão e o valor na sua régua."
      ],
      impacto: { texto: "No padrão novo: Lula 2 6,9; Lula 1 6,8; Lula 3 5,9; Dilma 1 5,8; Bolsonaro 5,6; Dilma 2 3,6; PT, todos 6,1." },
      links: [{ href: "#a-formula", texto: "Ver a fórmula completa" }]
    },
    {
      id: "saude-seguranca-educacao",
      data: "2026-10-14",
      tipo: "Modelo",
      versao: "4.0",
      titulo: "Saúde, Segurança e Educação viram pilares separados",
      resumo: "O pilar Serviços públicos foi dividido em três, cada um com o seu peso. A nota geral passa a ter dez pilares, todos com o mesmo peso no padrão.",
      itens: [
        "Saúde: mortalidade infantil e expectativa de vida. Segurança: homicídios. Educação: Ideb e Pisa.",
        "Na régua neutra, cada pilar vale 10% da nota. Antes, os três temas juntos valiam 12,5%; agora valem 30%.",
        "Links de régua antigos (com 8 pesos) continuam funcionando: o peso de Serviços públicos é dividido entre os três.",
        "Quem tinha pesos próprios salvos mantém os seus; o peso de Serviços públicos foi dividido por três."
      ],
      impacto: { texto: "No padrão novo: Lula 2 6,8; Lula 1 6,6; Lula 3 5,9; Bolsonaro 5,7; Dilma 1 5,5; Dilma 2 4,1; PT, todos 6,0." },
      links: [{ href: "#nota-servicos", texto: "Ver Saúde, segurança e educação" }]
    },
    {
      id: "queimadas",
      data: "2026-10-14",
      tipo: "Modelo",
      versao: "3.1",
      titulo: "Queimadas entram no pilar Meio ambiente",
      resumo: "O pilar Meio ambiente passa a ter três indicadores com o mesmo peso: desmatamento médio na Amazônia, tendência do desmatamento e focos de queimada no Brasil.",
      itens: [
        "Queimadas: média anual de focos de calor no Brasil, todos os biomas, pelo satélite de referência do Inpe. A série comparável começa em 2003, então FHC fica sem esse dado.",
        "Nota 0 com 400 mil focos por ano (acima do pior ano, 2007) e nota 10 com 100 mil (abaixo do melhor, 2013).",
        "Médias por governo: Lula 1 333 mil; Lula 2 270 mil; Dilma 1 170 mil; Dilma 2 217 mil; Temer 175 mil; Bolsonaro 201 mil; Lula 3 202 mil (2023 a 2025; 2024 teve 278 mil, o maior número desde 2010).",
        "Dívida bruta e dívida líquida passam a valer um ponto cada, como os demais indicadores.",
        "Gráfico ano a ano das queimadas na página Serviços e ambiente."
      ],
      impacto: { texto: "No padrão novo: Lula 2 6,7; Lula 1 6,7; Lula 3 6,0; Dilma 1 5,9; Bolsonaro 5,5; Dilma 2 3,5; PT, todos 6,1." },
      links: [{ href: "#nota-ambiente", texto: "Ver o Meio ambiente" }]
    },
    {
      id: "regua-neutra",
      data: "2026-10-14",
      tipo: "Modelo",
      versao: "3.0",
      titulo: "Régua padrão neutra: todos os pilares valem o mesmo",
      resumo: "A nota geral padrão passa a ser a média simples dos oito pilares. Dentro de cada pilar, todos os indicadores também valem o mesmo.",
      itens: [
        "Os oito pilares têm peso 10 cada (12,5% da nota). Antes, Economia e Serviços públicos pesavam 19, Contas para o futuro 14, Pobreza e Integridade 12, e os outros três 8.",
        "Renda, carga tributária, mortalidade infantil e expectativa de vida deixam de valer meio ponto e passam a valer um, como os demais indicadores.",
        "A regra de efeito das medidas continua ligada, e a corrupção continua pesada pelo grau de prova.",
        "Quem já tinha mudado os pesos mantém os seus. Quem estava no padrão antigo passa para o novo."
      ],
      impacto: { texto: "No padrão novo: Lula 2 6,9; Lula 1 6,8; Lula 3 6,2; Dilma 1 5,9; Bolsonaro 5,4; Dilma 2 3,6; PT, todos 6,2." },
      links: [{ href: "#regua", texto: "Ajustar os pesos" }]
    },
    {
      id: "inicio-simples",
      data: "2026-10-14",
      tipo: "Site",
      versao: null,
      titulo: "Início mais simples e navegação nova no celular",
      resumo: "O Início virou um placar visual, e os detalhes ficam recolhidos para quem quiser ler.",
      itens: [
        "Placar em 10 segundos: a nota de cada governo em barras; toque para ver o ponto forte e o ponto fraco.",
        "Ênfases em um toque (Meu bolso, Honestidade, Saúde e escola…), com a mesma régua para todos.",
        "No celular, uma barra fixa embaixo com Início, Temas, Régua, Quiz e Mais.",
        "Textos longos ficam recolhidos com “+ Ler mais”."
      ],
      impacto: { texto: "Não muda nenhuma nota." },
      links: [{ href: "#inicio", texto: "Ver o Início" }]
    },
    {
      id: "dados-abertos",
      data: "2026-10-08",
      tipo: "Site",
      versao: null,
      titulo: "Dados abertos e página Novidades",
      resumo: "Duas páginas novas: uma para baixar os números do site e esta, com o histórico de mudanças.",
      itens: [
        "Dados abertos: baixe as notas por governo, os indicadores (valores, notas, pisos e metas) e os pesos do modelo em CSV, e tudo em JSON.",
        "Os arquivos são gerados no seu navegador, com os pesos que você estiver usando, e levam esses pesos dentro.",
        "Formato brasileiro (ponto e vírgula, vírgula decimal) ou internacional, prévia das primeiras linhas, dicionário de colunas e texto pronto para citar.",
        "Novidades: esta lista, do mais novo ao mais antigo."
      ],
      impacto: { texto: "Não muda nenhuma nota." },
      links: [{ href: "#dados", texto: "Abrir Dados abertos" }]
    },
    {
      id: "v2-1",
      data: "2026-10-08",
      tipo: "Modelo",
      versao: "2.1",
      titulo: "Nota geral v2.1: ajustes da revisão independente",
      resumo: "Três revisões independentes (neutralidade, matemática e validade dos indicadores) apontaram problemas, e os ajustes foram aplicados.",
      itens: [
        "Faixas (piso e meta) mais largas para pobreza extrema, tendência do desmatamento, Gini e Pisa: as células com nota 0 ou 10 caíram de 29% para 13%.",
        "Inflação com meta de 4,5%, a vigente de 2005 a 2018, no lugar de 3% retroativo. Desmatamento com a meta legal.",
        "Mortalidade infantil e expectativa de vida passam a pesar meio ponto cada. Dívida bruta e líquida, renda e carga tributária também ficaram com peso reduzido.",
        "Governo sem item no catálogo de contas deixadas fica sem dado nesse indicador.",
        "Integridade: casos de corrupção e índice externo pesam igual, e o piso acompanha as suas opções de valoração.",
        "Multiplicador de força política como expoente, sem teto.",
        "Direitos e minorias e Feitos e promessas passam a ter o mesmo peso (8).",
        "Cada âncora diz de que tipo é: referência externa, aritmética, convenção do site ou calibrada na série observada.",
        "A conta completa ganhou o peso efetivo de cada indicador, a contagem de células saturadas, as linhas de agregação do PT e notas sobre viés de época e mandatos curtos."
      ],
      impacto: {
        texto: "No padrão do site, a diferença entre “PT, todos” e Bolsonaro vai de 1,3 para 0,8. A ordem entre governos com diferença menor que 0,5 não é conclusiva. Com pesos próprios, os números mudam.",
        tabela: {
          legenda: "Nota geral no padrão do site, de 0 a 10",
          cab: ["", "v2.0", "v2.1"],
          linhas: [["PT, todos", "6,9", "6,6"], ["Bolsonaro", "5,6", "5,8"], ["Diferença", "1,3", "0,8"]]
        }
      },
      links: [{ href: "#conta-completa", texto: "Ver A conta completa" }]
    },
    {
      id: "v2-0",
      data: "2026-10-08",
      tipo: "Modelo",
      versao: "2.0",
      titulo: "Nota geral v2.0: pesos e âncoras fixas, corrupção vira o pilar Integridade",
      resumo: "A conta da Nota geral foi refeita para que cada nota diga quão perto de uma meta o governo ficou, e não só quem foi melhor ou pior entre os comparados.",
      itens: [
        "Cada indicador passa a valer de 0 a 10 entre um piso e uma meta fixos. Antes, 0 e 10 eram o pior e o melhor da amostra, então sempre havia zeros e dezes.",
        "A corrupção deixa de ser um desconto subtraído da média e vira o pilar Integridade, com peso próprio e visível.",
        "Os pesos dos pilares passam a ser pontos (soma 100), editáveis em Ajuste os pesos. Os pesos antigos salvos são migrados.",
        "Nova seção pública A conta completa, em Como calculamos: fórmulas, variáveis, pesos, pisos e metas, valores usados, um exemplo passo a passo, a tabela “E se fosse diferente?” e um teste de robustez."
      ],
      impacto: {
        texto: "No padrão do site, a diferença cai porque o desconto subtrativo foi trocado por um pilar com peso de 12 em 100. Com pesos próprios, os números mudam.",
        tabela: {
          legenda: "Nota geral no padrão do site, de 0 a 10",
          cab: ["", "v1", "v2.0"],
          linhas: [["PT, todos", "4,7", "6,9"], ["Bolsonaro", "1,8", "5,6"], ["Diferença", "2,9", "1,3"]]
        }
      },
      links: [{ href: "#conta-completa", texto: "Ver A conta completa" }]
    },
    {
      id: "regua-politica",
      data: "2026-10-08",
      tipo: "Página",
      versao: null,
      titulo: "Nova página: Régua política (0 a 100)",
      resumo: "Uma régua por autor e uma régua-média, para ver onde cada partido ou ator fica em cada critério.",
      itens: [
        "Uma régua por autor, com zonas de referência numeradas, legenda por toque e linhas que abrem para mostrar a justificativa de cada nota.",
        "Régua-média sem nenhuma zona de extremo: média simples com mínimo de 3 réguas, intervalo do menor ao maior valor e medida de dispersão.",
        "Seletor de até 8 atores e réguas que podem ser ligadas e desligadas.",
        "Cada nota diz se é publicada, derivada ou estimada, e a página mostra o método e os avisos.",
        "Layout para celular sem rolagem lateral, modo escuro, cores neutras e preferências salvas só neste navegador."
      ],
      links: [{ href: "#regua-politica", texto: "Abrir a Régua política" }]
    },
    {
      id: "celular-tablet",
      data: "2026-10-08",
      tipo: "Qualidade",
      versao: null,
      titulo: "Revisão completa para celular e tablet",
      resumo: "O site foi revisado em telas de 320 a 768 px, com ajustes de leitura, toque, acessibilidade e busca.",
      itens: [
        "Sem rolagem lateral na página de 320 a 768 px. Textos menores que 11 px passaram de 964 para 14.",
        "Dicas e linha do tempo funcionam por toque. Tabelas rolam dentro da própria caixa. O menu do computador não corta mais itens, e a barra Saldo foi corrigida depois do botão Voltar.",
        "O estado salvo no navegador é validado antes de ser usado. A rolagem é restaurada ao voltar, e cada página recebe foco e título próprios.",
        "Arredondamentos de moeda e concordâncias em português corrigidos.",
        "Informações para busca e compartilhamento (descrição, Open Graph, endereço canônico, dados estruturados), ícones, manifest, robots.txt, sitemap.xml e cabeçalhos de segurança."
      ]
    },
    {
      id: "inicio",
      data: "2026-10-08",
      tipo: "Site",
      versao: null,
      titulo: "Início do site",
      resumo: "Primeira versão do Brasil em Análise: os governos do Brasil de 1995 a 2026 comparados com números públicos. Você escolhe a régua, e a régua vale para todos.",
      itens: [
        "Páginas de abertura: Placar PT × PL, Economia, Serviços e ambiente, Direitos e minorias, Falas e gastos, Três Poderes e Eleição 2026.",
        "Ajuste os pesos, Como calculamos e Fontes, para refazer a conta do seu jeito e conferir de onde vem cada número.",
        "Já nasceu com a revisão de imparcialidade de outubro de 2026: regras que puxavam o resultado para um lado foram corrigidas, e a regra de cada correção vale para todos os governos.",
        "Entre elas: casos sem valor em reais passaram a entrar pela mesma escala de estrelas para os dois lados; a correção pela inflação passou a partir do meio do período em que o dinheiro saiu em cada governo; resultados contados duas vezes deixaram de somar em Feitos e promessas; e o multiplicador de força política ficou moderado."
      ],
      links: [{ href: "#imparcialidade", texto: "Ler a revisão de imparcialidade" }]
    }
  ];

  var B = window.BEA;
  var D = document, W = window;
  if (!B || typeof B.on !== "function") { return; }

  var NOME_PAGINA = "Novidades";
  var K_VISTO = "bea_nv_visto";      // id da entrada mais nova que a pessoa já viu
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var construida = false;

  /* ---------- utilidades de DOM ---------- */
  function el(tag, cls, txt) {
    var e = D.createElement(tag);
    if (cls) { e.className = cls; }
    if (txt != null) { e.textContent = txt; }
    return e;
  }
  function link(href, txt) {
    var a = el("a", null, txt);
    a.href = href;
    return a;
  }

  /* ---------- armazenamento (opcional) ---------- */
  function lerVisto() {
    try { return W.localStorage.getItem(K_VISTO) || ""; } catch (e) { return ""; }
  }
  function gravarVisto(v) {
    try { W.localStorage.setItem(K_VISTO, v); } catch (e) { /* sem armazenamento: segue sem lembrar */ }
  }

  /* ---------- datas ---------- */
  function lerData(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ""));
    if (!m) { return null; }
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  function dataLonga(d) { return d.getDate() + " de " + MESES[d.getMonth()] + " de " + d.getFullYear(); }
  function ehNovo(e) {
    var d = lerData(e.data), hoje = new Date(), dias;
    if (!d) { return false; }
    hoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    dias = Math.round((hoje.getTime() - d.getTime()) / 86400000);
    return dias >= 0 && dias <= DIAS_NOVO;
  }

  /* ---------- lista ordenada ---------- */
  function ordenadas() {
    var v = [], i;
    for (i = 0; i < ENTRADAS.length; i++) {
      if (ENTRADAS[i] && ENTRADAS[i].id && ENTRADAS[i].titulo && lerData(ENTRADAS[i].data)) { v.push({ e: ENTRADAS[i], i: i }); }
    }
    v.sort(function (a, b) {
      var x = a.e.data, y = b.e.data;
      if (x === y) { return a.i - b.i; }
      return x < y ? 1 : -1;
    });
    return v.map(function (o) { return o.e; });
  }

  /* ---------- peças da página ---------- */
  function tabelaImpacto(t) {
    var wrap = el("div", "nv-tw"), tb = el("table", "nv-tab"), cap = el("caption", null, t.legenda || "Antes e depois"), th = el("thead"), tr = el("tr"), tbd = el("tbody"), i, j, c, lin;
    wrap.tabIndex = 0;
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", t.legenda || "Antes e depois");
    tb.appendChild(cap);
    for (j = 0; j < t.cab.length; j++) {
      c = el("th", j === 0 ? null : "n", t.cab[j] || (j === 0 ? "Nota" : ""));
      c.setAttribute("scope", "col");
      tr.appendChild(c);
    }
    th.appendChild(tr);
    tb.appendChild(th);
    for (i = 0; i < t.linhas.length; i++) {
      lin = t.linhas[i];
      tr = el("tr");
      for (j = 0; j < lin.length; j++) {
        if (j === 0) {
          c = el("th", null, lin[j]);
          c.setAttribute("scope", "row");
        } else {
          c = el("td", "n", lin[j]);
        }
        tr.appendChild(c);
      }
      tbd.appendChild(tr);
    }
    tb.appendChild(tbd);
    wrap.appendChild(tb);
    return wrap;
  }

  function entrada(e) {
    var li = el("li"), art = el("article", "nv-item"), cab = el("div", "nv-cab"), d = lerData(e.data), tm = el("time", "nv-data", dataLonga(d)),
      h = el("h2"), a = link("#nv-" + e.id, e.titulo), ul, i, imp, ln, lk;
    art.id = "nv-" + e.id;
    h.id = "nv-t-" + e.id;
    art.setAttribute("aria-labelledby", h.id);
    tm.setAttribute("datetime", e.data);
    cab.appendChild(tm);
    if (e.versao) { cab.appendChild(el("span", "nv-ver", "Modelo v" + e.versao)); }
    if (e.tipo && !(e.versao && e.tipo === "Modelo")) { cab.appendChild(el("span", "nv-tag", e.tipo)); }
    if (ehNovo(e)) { cab.appendChild(el("span", "nv-novo", "novo")); }
    h.appendChild(a);
    art.appendChild(cab);
    art.appendChild(h);
    if (e.resumo) { art.appendChild(el("p", "nv-resumo", e.resumo)); }
    if (e.itens && e.itens.length) {
      art.appendChild(el("p", "nv-sub", "O que mudou"));
      ul = el("ul", "nv-itens");
      for (i = 0; i < e.itens.length; i++) { ul.appendChild(el("li", null, e.itens[i])); }
      art.appendChild(ul);
    }
    if (e.impacto) {
      imp = el("div", "nv-imp");
      imp.appendChild(el("p", "nv-sub", "Impacto na nota"));
      if (e.impacto.texto) { imp.appendChild(el("p", null, e.impacto.texto)); }
      if (e.impacto.tabela && e.impacto.tabela.cab && e.impacto.tabela.linhas) { imp.appendChild(tabelaImpacto(e.impacto.tabela)); }
      art.appendChild(imp);
    }
    if (e.links && e.links.length) {
      ln = el("div", "nv-links");
      for (i = 0; i < e.links.length; i++) {
        lk = link(e.links[i].href, e.links[i].texto);
        ln.appendChild(lk);
      }
      art.appendChild(ln);
    }
    li.appendChild(art);
    return li;
  }

  function montar() {
    var host = D.getElementById("modNovidades"), cab, nav, sec, ol, lista, i, ver, atual;
    if (!host || construida) { return; }
    construida = true;
    lista = ordenadas();
    cab = el("header", "wrap page-head");
    cab.appendChild(el("p", "eyebrow", "Novidades"));
    cab.appendChild(el("h1", null, "O que mudou no site"));
    cab.appendChild(el("p", "dek", "O histórico de mudanças do Brasil em Análise, do mais novo ao mais antigo. Quando uma mudança altera a Nota geral, o efeito aparece junto."));
    ver = seguro(function () { return B.versao; }, "");
    if (ver) {
      atual = el("p", "nv-atual");
      atual.appendChild(D.createTextNode("Versão atual do modelo de notas: "));
      atual.appendChild(el("b", null, String(ver)));
      atual.appendChild(D.createTextNode(". "));
      atual.appendChild(link("#conta-completa", "Ver A conta completa"));
      atual.appendChild(D.createTextNode("."));
      cab.appendChild(atual);
    }
    nav = el("nav", "chips nv-chips");
    nav.setAttribute("aria-label", "Páginas relacionadas");
    nav.appendChild(link("#dados", "Dados abertos"));
    nav.appendChild(link("#metodo", "Como calculamos"));
    cab.appendChild(nav);
    host.appendChild(cab);

    sec = el("section", "wrap");
    sec.setAttribute("aria-label", "Lista de novidades");
    if (!lista.length) {
      sec.appendChild(el("p", "nv-vazio", "Ainda não há novidades registradas."));
    } else {
      ol = el("ol", "nv-lista");
      for (i = 0; i < lista.length; i++) { ol.appendChild(entrada(lista[i])); }
      sec.appendChild(ol);
    }
    sec.appendChild(el("p", "nv-nota", "O marcador “novo” aparece nas mudanças dos últimos " + DIAS_NOVO + " dias."));
    host.appendChild(sec);
    host.setAttribute("data-nv", "1");
  }
  function seguro(fn, padrao) { try { return fn(); } catch (e) { return padrao; } }

  /* ---------- link no rodapé ---------- */
  function linkNoRodape() {
    var slot = D.getElementById("slotRodape"), nav, a, lista, topo, novo, pt;
    if (!slot || D.getElementById("nv-foot-link")) { return; }
    nav = D.getElementById("rodapeExtra");
    if (!nav) {
      nav = D.createElement("nav");
      nav.id = "rodapeExtra";
      nav.className = "foot-extra";
      nav.setAttribute("aria-label", "Mais");
      slot.appendChild(nav);
    }
    a = D.createElement("a");
    a.id = "nv-foot-link";
    a.className = "nv-foot-link";
    a.href = "#novidades";
    a.textContent = NOME_PAGINA;
    lista = ordenadas();
    topo = lista.length ? lista[0] : null;
    novo = topo && ehNovo(topo) && lerVisto() !== topo.id;
    if (novo) {
      pt = el("span", "nv-pt", "novo");
      pt.id = "nv-foot-novo";
      a.appendChild(pt);
    }
    nav.appendChild(a);
  }
  function marcarVisto() {
    var lista = ordenadas(), pt = D.getElementById("nv-foot-novo");
    if (lista.length) { gravarVisto(lista[0].id); }
    if (pt && pt.parentNode) { pt.parentNode.removeChild(pt); }
  }

  /* ---------- ganchos ---------- */
  function aoMudarPagina(nome) {
    if (nome === "novidades") {
      montar();
      D.title = NOME_PAGINA + " | Brasil em Análise";
      marcarVisto();
    }
  }

  function iniciar() {
    linkNoRodape();
    B.on("page", aoMudarPagina);
    if (typeof B.paginaAtual === "function" && B.paginaAtual() === "novidades") {
      aoMudarPagina("novidades");
    } else if (/^#nv-/.test(W.location.hash)) {
      // link direto para uma entrada: monta e pede ao roteador do site para ir até lá
      montar();
      try { W.dispatchEvent(new Event("hashchange")); } catch (e) { /* sem rolagem automática */ }
    }
  }

  if (D.readyState === "loading") { D.addEventListener("DOMContentLoaded", iniciar); } else { iniciar(); }
})();
