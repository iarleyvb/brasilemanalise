# Régua política 0–100: documento técnico

**Site:** Brasil em Análise · **Data de referência:** 8/10/2026 · **Versão:** 1.1 (revisada após três revisões) · **Escopo:** 19 partidos, o Centrão, 6 governos (1995–2026) e 8 famílias ideológicas. Dados em `regua-politica.json`.

## Resumo

- **Escala:** 0 = esquerda máxima, 50 = ponto médio, 100 = direita máxima. Sete faixas simétricas, com centro estreito (45–55). A largura do centro é decisão de design do site, não achado de nenhum autor.
- **Réguas:** uma por autor. Entram na média, por padrão, **seis**: Bobbio, Sartori, Singer e Nicolau (os quatro pedidos), Bolognesi, Ribeiro e Codato (pesquisa com especialistas; única fonte com números publicados, ainda não conferidos na tabela primária) e Votações nominais (método do site). Ficam **fora** da média: a régua "Estimativa do site (referência: Power e Zucco)", provisória, que o visitante pode ligar; e a régua de extremos (auxiliar), que reaproveita o critério de Bobbio.
- **Honestidade acadêmica:** nenhum dos quatro autores pedidos publicou notas de 0 a 100. Nas seis réguas da média há 198 notas (33 atores por régua, sem a âncora "centro"): 17 (8,6%) são publicadas, todas da régua de Bolognesi et al. e não conferidas na tabela; 62 (31,3%) são derivadas; 119 (60,1%) são estimadas. A regra de rotulagem é objetiva (seção 7.1).
- **Resultado (média das seis réguas; casas decimais só para auditoria, a interface exibe inteiros):** PT 26,6 (20–30), PL 81,0 (77–88), Centrão 65,8 (62–76,9). Com a régua provisória ligada, o PT vai a 24,8 (14–30), o Centrão a 65,7 e o PL não muda (a provisória não tem nota para ele).
- **Ordem x magnitude:** a ordem entre atores é estável (correlação de postos média de 0,98 entre as seis réguas), mas isso mede a **coerência interna** do analista (cinco das seis réguas são operacionalizações do site, com evidências em parte comuns), não concordância independente. A magnitude depende do critério: viés médio de −3,7 a +6,2 pontos por régua.
- **Zonas de regime** (comunismo, socialismo real, fascismo, nazismo e marcadores de distância) aparecem só nas réguas de autor, como marcadores de referência com limiares espelhados; **não classificam** nenhum ator. A régua-média tem apenas faixas neutras.
- **Eixo 2 (liberdade):** fica fora da nota e **sem selo por ator** nesta versão; há uma rubrica única, igual para os dois lados, e uma lista de fatos candidatos a registro, tudo em conferência (seção 4.5).

---

## 1. Definição base: esquerda, centro e direita

### 1.1 O que cada autor define

| Autor | Obras de base | Critério | O que ele não diz |
|---|---|---|---|
| **Bobbio** | *Destra e sinistra* (1994; ed. brasileira *Direita e Esquerda*, UNESP, 1995) | Atitude diante da **igualdade**: a esquerda vê as desigualdades como em grande parte sociais e corrigíveis; a direita, em maior grau, como resultado de diferenças ou como custo de outros valores. O critério é relativo (igualdade entre quem, em quê, com base em qual critério) e histórico. Um segundo eixo, a **liberdade**, separa moderados de extremistas. | Não deu números nem tratou do Brasil (morreu em 2004). |
| **Sartori** | *Parties and Party Systems* (1976); *The Theory of Democracy Revisited* (1987; edição brasileira com título e editora a conferir) | Esquerda-direita como **espaço ordinal**: contam a **ordem** entre atores relevantes (relevância por potencial de coalizão e de chantagem), a relação com o regime (leal ou antissistema) e a mentalidade (ideológica ou pragmática). A distância em pontos é leitura do site (polarização), não conceito do autor. O centro é espaço, não ponto. | Não posiciona partidos brasileiros. O pluralismo polarizado foi formulado a partir de casos como Weimar, a Quarta República francesa, a Itália e o Chile; a aplicação ao Brasil é por analogia. |
| **Singer** | *Esquerda e Direita no Eleitorado Brasileiro* (EdUSP, 2000; alguns catálogos dizem 1999); *Os Sentidos do Lulismo* (2012); *A reativação da direita no Brasil* (Opinião Pública, 27(3), 2021) | **Identificação ideológica do eleitorado brasileiro**, ancorada em Sartori e na literatura de identificação. Resumos secundários do livro de 2000 apontam a atitude diante da autoridade estatal, mais que a igualdade, como a diferença decisiva; outras fontes apontam o ideal igualitário no eleitorado e o uso da distinção de Bobbio em 2016 (**não conferido no texto**). Nas obras sobre o lulismo pesa a **prática** (reformismo fraco, pacto conservador) mais que o discurso. | Não publica notas; o livro de 2000 não foi lido na íntegra; pacto conservador significa aversão à ruptura, não posição à direita; o artigo de 2021 é anterior à filiação de Bolsonaro ao PL e não analisa o partido. |
| **Nicolau** | *Multipartidarismo e Democracia* (1996); *Eleições no Brasil* (2012); *O Brasil Dobrou à Direita* (Zahar, 2020) | **Estrutura eleitoral**: regras (lista aberta, coligações proporcionais até 2018 e vedadas desde 2020, cláusula de desempenho) geram fragmentação (NEP de 16,5 em 2019, segundo Nicolau citado pela imprensa). Para a régua, o site usa o autoposicionamento 0–10 do eleitorado e o lado em que o ator se coliga e governa: **operacionalização do site**, não critério do autor. | Não é autor de escala partidária; não mede doutrina. |

**Perfil dos autores e críticas aos critérios** (dados biográficos a conferir; incluídos para o leitor julgar a origem de cada critério):

| Autor | Perfil | Críticas ao critério |
|---|---|---|
| Bobbio | Filósofo do direito e cientista político italiano (1909-2004), professor em Turim, senador vitalício desde 1984; associado à tradição liberal-socialista. Dados biográficos a conferir. | O critério da igualdade é contestado: parte da literatura propõe a liberdade, a ordem ou a dimensão cultural como eixo primário, e vê na igualdade uma escolha que favorece a leitura da esquerda. O site mantém o critério de Bobbio e registra o eixo 2 (liberdade) à parte. |
| Sartori | Cientista político italiano (1924-2017), professor em Florença e na Universidade Columbia; associado à tradição liberal-democrática. Dados biográficos a conferir. | A leitura ordinal do eixo é contestada por quem trata esquerda-direita como escala de intervalo (como fazem as pesquisas com deputados e especialistas). O site usa a ordem como dado mais robusto e a distância em pontos como aproximação. |
| Singer | Cientista político brasileiro, professor da USP; foi porta-voz da Presidência da República no primeiro governo Lula (2003-2007), segundo informação a conferir. Autor da tese do lulismo. | A tese do lulismo (reformismo fraco e pacto conservador) é contestada na literatura, tanto por quem vê o período como ruptura maior quanto por quem o vê como continuidade liberal. O site usa a tese só como critério de prática efetiva, sem adotá-la como verdade. |
| Nicolau | Cientista político brasileiro, professor de ciência política (UFRJ), especialista em sistemas eleitorais e partidários. Dados institucionais a conferir. | O autoposicionamento 0-10 é criticado por misturar significados de esquerda e direita entre eleitores; a leitura do site por coalizões herda essa limitação e acrescenta a do governismo, que não é ideologia. |

**Referenciais acrescentados.** Como os quatro autores não publicam números, entram levantamentos que medem o mesmo eixo de outro modo: Bolognesi, Ribeiro e Codato (especialistas da ABCP, 0 a 10; **única fonte com números publicados**, copiados de trechos de busca e não conferidos na tabela), as votações nominais (método do site, apoiado em Zucco, 2009, e Zucco e Lauderdale, 2011; Figueiredo e Limongi e Abranches entram só como contexto do presidencialismo de coalizão, pois não estimam posições esquerda-direita) e Power e Zucco (deputados posicionam partidos de 1 a 10), cuja régua é **provisória**: Zucco e Power (2024) publicam estimativas revisadas de partidos e das posições de todos os presidentes desde 1985, ainda não incorporadas porque a tabela primária não pôde ser aberta. Para os extremos, a base é Bobbio (eixo da liberdade), Linz e Arendt (regimes), Paxton, Griffin, Payne, Sternhell, Gentile e Eco (fascismo) e Mudde e March (radicalismo).

**Cobertura de tradições.** Dos quatro autores pedidos, nenhum é identificado com a tradição liberal-conservadora brasileira, e só Singer trata do PT no poder como objeto central. O JSON registra como referências complementares, ainda não verificadas (verificado = false), Hunter (2010), Samuels e Zucco (2018), Rodrigues (2002) e Lamounier. Recomenda-se incluir ao menos um autor dessa tradição antes da publicação.

### 1.2 Esquerda, centro e direita: definição operacional

A definição conceitual vem de Bobbio, em síntese do site; a tabela seguinte é outra coisa (tendências empíricas).

- **Esquerda:** orientação igualitária. Vê as desigualdades como em grande parte produzidas por arranjos sociais e reduzíveis por política pública (redistribuição, direitos, intervenção estatal).
- **Direita:** orientação não igualitária (termo de Bobbio para o polo oposto). Vê as desigualdades em maior grau como resultado de diferenças, mérito ou escolhas, ou como custo aceitável de liberdade, eficiência ou ordem, e considera que a redução estatal tem custos.
- **Centro:** posição intermediária. Em Bobbio, o terceiro incluído (expressão a conferir no original); em Sartori, um espaço que, em sistemas polarizados, sofre pressão dos dois lados. **Não é doutrina própria:** a nota 50 é o ponto de equidistância.

**Síntese do site: tendências empíricas** (não é definição de nenhum autor; mistura o critério da igualdade, de Bobbio, com elementos de Sartori e Singer; o vocabulário é o mesmo para os dois lados):

| Dimensão | Esquerda | Centro | Direita |
|---|---|---|---|
| Papel do Estado | Maior intervenção e provisão pública; no limite, propriedade social ou planejamento | Intermediário; mercado com regulação; pragmatismo | Mercado como alocador principal; Estado mais limitado; privatização |
| Distribuição e tributação | Redistribuição, tributação progressiva, transferências | Redistribuição moderada; ênfase em estabilidade e equilíbrio fiscal | Menor redistribuição estatal; menor carga tributária; disciplina fiscal |
| Trabalho | Proteção legal e negociação coletiva | Flexibilização com proteções | Flexibilização e liberdade contratual |
| Serviços | Universais e públicos | Mistos | Maior espaço para provisão privada e escolha |
| Questões sociais | Ênfase na ampliação de direitos de grupos (raça, gênero) | Variável conforme a pauta | Ênfase em tradição, família, religião, ordem e segurança |
| Leitura da desigualdade (Bobbio, em síntese) | Produto de arranjos sociais, reduzível por política pública | Corrigível em parte | Resultado de diferenças, mérito ou escolhas, ou custo aceitável de liberdade, eficiência ou ordem; a redução estatal tem custos |

Cautelas: (1) o conteúdo de esquerda e direita muda com o contexto histórico (Bobbio); um centro brasileiro não é um centro europeu; (2) a agenda de valores e a de ordem e autoridade entram na posição em Sartori e Singer, mas não na nota de Bobbio, que mede só a igualdade; (3) o Centrão é um bloco de coalizão, não o centro ideológico; (4) o critério da igualdade é contestado (ver críticas na seção 1.1).

### 1.3 As duas dimensões

|  | Libertário / democrático | Autoritário / antiliberal |
|---|---|---|
| **Igualitário** | Centro-esquerda: socialismo liberal ou democrático, social-democracia | Extrema-esquerda: jacobinismo, comunismo de partido único |
| **Não igualitário** | Centro-direita: conservadores e liberais democráticos | Extrema-direita: fascismo, nazismo |

- **Eixo 1, igualdade** gera a nota 0–100.
- **Eixo 2, liberdade** (democrático x antidemocrático) **não entra na nota** e **não é exibido como selo por ator** nesta versão. Para atores nas pontas, é ele que decide se um rótulo histórico (comunismo, fascismo) pode ser usado. A rubrica única e os fatos candidatos a registro estão na seção 4.5 e no campo `eixo2` do JSON.
- Outras dimensões ficam fora da nota: costumes e valores; governo x oposição (dimensão concorrente nas votações, a conferir em Zucco e Lauderdale); meio ambiente. Por isso Rede e PV têm confiança baixa.

---

## 2. Estrutura da régua

### 2.1 Sete faixas simétricas, centro estreito

A mesma grade serve a todas as réguas. A faixa é decidida sobre a **média não arredondada**, que se arredonda ao inteiro **em direção ao centro** (14,5 vai para Esquerda; 85,5 para Direita), de modo que `faixaDe(x)` e `faixaDe(100 - x)` são sempre espelhos. Bordas contínuas para desenho: 0, 14,5, 29,5, 44,5, 55,5, 70,5, 85,5 e 100 (campos `inicio` e `fim` no JSON).

| # | Faixa | Intervalo | Atores, pela média das seis réguas |
|---|---|---|---|
| 1 | Esquerda de alta intensidade | 0–14 | Comunismo ML 4,3; PSTU 5,2; PCO 5,4; PSOL 13,0; Socialismo democrático 14,2 |
| 2 | Esquerda | 15–29 | PCdoB 16,5; PT 26,6 |
| 3 | Centro-esquerda | 30–44 | Social-democracia 30,3; Rede 33,3; PSB 33,9; Lula 3 34,6; PDT 35,2; Lula 1 e 2 35,2; Dilma 35,9; PV 38,5; Liberalismo social 42,3 |
| 4 | Centro | 45–55 | Centro (âncora) 50,0; Cidadania 51,5 |
| 5 | Centro-direita | 56–70 | MDB 57,0; PSDB 57,4; PSD 59,3; FHC 60,5; Podemos 62,4; Temer 63,7; Centrão 65,8; União Brasil 69,4 |
| 6 | Direita | 71–85 | PP 71,8; Republicanos 71,8; Conservadorismo 72,8; Liberalismo econômico 73,8; Bolsonaro 77,1; PL 81,0; Novo 81,4 |
| 7 | Direita de alta intensidade | 86–100 | Direita radical 89,5 |

**Alta intensidade** mede a distância ao centro no eixo da igualdade. Não significa extremismo, que é definido pelo eixo 2.

**Lados para rótulos rápidos:** esquerda 0–44, centro 45–55, direita 56–100. Quem preferir três blocos largos pode agrupar as faixas 1–2 (0–29), 3–5 (30–70) e 6–7 (71–100).

### 2.2 Por que o esquema em terços (0–33, 34–66, 67–100) distorce

1. **O centro de um terço é arbitrário.** Nenhum dos quatro autores fixa limites numéricos para o centro: os terços e o 40–60 das fichas de Sartori e Singer são **convenções do site**. Na pesquisa de Bolognesi et al., só os cortes de 1,5 e 8,5 foram reportados em trechos (a conferir); a faixa de centro de 4,5 a 5,5 é mencionada em texto de divulgação de coautor, e os demais cortes são reconstruídos. O centro estreito de 45–55 é decisão de design do site.
2. **O centro empírico está quase vazio.** Evidência independente: na onda de 2022 de Bolognesi et al., nenhum partido ocupa a faixa de 4,5 a 5,5 (informação de texto de divulgação de coautor, a conferir). Nas médias do site, que refletem a calibração do próprio site, só 1 dos 33 atores medidos (sem a âncora) fica entre 45 e 55: Cidadania 51,5.
3. **O terço central engole a distinção principal.** Ele reúne 15 dos 33 atores (45%), de PSB (33,9) a Centrão (65,8): Lula 1 e 2 (35,2), Dilma (35,9), Lula 3 (34,6) e PDT (35,2) ficam no mesmo "centro" de Temer (63,7), do Centrão (65,8), do MDB (57,0) e do PSDB (57,4). Lula 1 e 2 e Temer, a 28,5 pontos um do outro, recebem o mesmo rótulo.
4. **Os cortes 33/34 e 66/67 caem sobre aglomerados.** Rede (33,3) e PSB (33,9), a 0,6 ponto, mudam de terço. Em 16 dos 33 atores as seis réguas discordam sobre o terço; no esquema de lados com centro estreito discordam em 6 (MDB, PSD, PSDB, Cidadania, FHC, Liberalismo social), todos perto das fronteiras 44/45 e 55/56.
5. **Resolução desigual nas pontas.** Em terços, PSTU, PCO, PSOL, PCdoB e PT são todos "esquerda"; em sete faixas, PSTU, PCO, PSOL ficam na faixa de alta intensidade e PCdoB e PT na faixa seguinte.

**Limite honesto do esquema proposto:** faixas mais estreitas fazem mais intervalos cruzarem uma fronteira (26 dos 33 atores com sete faixas; 16 com terços; 6 com lados). Isso não é defeito, é a incerteza (de 5 a 8 pontos por nota) comparável à largura de uma faixa. Por isso:

- o rótulo de faixa vale **só para a média**;
- o intervalo mínimo–máximo aparece sempre;
- atores a até 1,5 ponto de uma borda recebem a marca "no limite" (5 casos: União Brasil, PP, Republicanos, Socialismo democrático, Social-democracia).

---

## 3. Classificação prática

### 3.1 Como ler a tabela

Cada célula traz a nota e o método: **P** publicada (número em pesquisa, convertido para 0–100; aqui, **não conferida** na tabela primária), **D** derivada (critério explícito do autor, ou fórmula sobre valores publicados, mais ao menos um item documental citado), **E** estimada (julgamento do site) e **A** âncora (o ator "centro" vale 50 por construção). Bolognesi et al. usa a onda de 2022 para PL, PV, Cidadania e Rede e a de 2018 para os demais. **Média** é a média simples das seis réguas da média; **Mín–Máx** é a dispersão entre elas. A última coluna traz a régua **provisória** (estimativa do site com referência em Power e Zucco), que não entra na média; "–" é ator sem cobertura.

| Ator | Bobbio | Sartori | Singer | Nicolau | Bolognesi et al. | Votações (site) | **Média** | Mín–Máx | Faixa | Prov. |
|---|---|---|---|---|---|---|---|---|---|---|
| **Partidos** |  |  |  |  |  |  |  |  |  |  |
| PSTU | 6 D | 8 D | 3 E | 4 E | 5,1 P | 5 E | **5,2** | 3–8 | Esq. alta int. | – |
| PCO | 5 D | 7 D | 5 E | 5 E | 6,1 P | 4 E | **5,4** | 4–7 | Esq. alta int. | – |
| PSOL | 14 D | 18 E | 13 D | 13 E | 12,8 P | 7 E | **13,0** | 7–18 | Esq. alta int. | 6 E |
| PCdoB | 17 D | 14 E | 19 D | 17 E | 19,2 P | 13 E | **16,5** | 13–19,2 | Esquerda | 8 E |
| PT | 25 D | 26 E | 29 D | 30 E | 29,7 P | 20 E | **26,6** | 20–30 | Esquerda | 14 E |
| PSB | 31 D | 36 E | 34 E | 36 E | 40,5 P | 26 E | **33,9** | 26–40,5 | Centro-esq. | 28 E |
| PDT | 33 D | 37 E | 35 E | 37 E | 39,2 P | 30 E | **35,2** | 30–39,2 | Centro-esq. | 30 E |
| Rede | 37 E | 37 E | 33 E | 32 E | 36,9 P | 24 E | **33,3** | 24–37 | Centro-esq. | 34 E |
| PV | 40 E | 42 E | 40 E | 40 E | 41,2 P | 28 E | **38,5** | 28–42 | Centro-esq. | 38 E |
| MDB | 52 D | 55 D | 55 D | 56 E | 70,1 P | 54 E | **57,0** | 52–70,1 | Centro-dir. | 53 E |
| PSD | 55 D | 57 E | 58 E | 58 E | 70,9 P | 57 E | **59,3** | 55–70,9 | Centro-dir. | 60 E |
| PSDB | 56 D | 50 E | 58 D | 60 E | 71,1 P | 49 E | **57,4** | 49–71,1 | Centro-dir. | 56 E |
| Cidadania | 51 E | 47 E | 51 E | 52 E | 61,7 P | 46 E | **51,5** | 46–61,7 | Centro | 46 E |
| Podemos | 62 E | 60 E | 60 E | 60 E | 72,4 P | 60 E | **62,4** | 60–72,4 | Centro-dir. | 54 E |
| União Brasil | 65 E | 68 E | 66 E | 67 E | 83,4 D | 67 E | **69,4** | 65–83,4 | Centro-dir. | – |
| PP | 69 D | 72 E | 67 E | 71 E | 82 P | 70 E | **71,8** | 67–82 | Direita | 75 E |
| Republicanos | 70 D | 73 E | 69 E | 73 E | 78 E | 68 E | **71,8** | 68–78 | Direita | 70 E |
| PL | 77 D | 80 E | 80 E | 80 E | 88 P | 81 E | **81,0** | 77–88 | Direita | – |
| Novo | 86 D | 78 E | 76 E | 83 E | 81,3 P | 84 E | **81,4** | 76–86 | Direita | – |
| **Bloco** |  |  |  |  |  |  |  |  |  |  |
| **Centrão** | 62 D | 65 D | 63 D | 65 E | 76,9 D | 63 E | **65,8** | 62–76,9 | Centro-dir. | 65 E |
| **Governos** |  |  |  |  |  |  |  |  |  |  |
| FHC | 57 D | 58 D | 62 D | 58 E | 74,8 D | 53 E | **60,5** | 53–74,8 | Centro-dir. | 56 E |
| Lula 1 e 2 | 29 D | 38 D | 36 D | 39 E | 40 D | 29 E | **35,2** | 29–40 | Centro-esq. | 28 E |
| Dilma | 31 D | 36 D | 35 D | 37 E | 43,4 D | 33 E | **35,9** | 31–43,4 | Centro-esq. | 29 E |
| Temer | 62 D | 63 D | 63 D | 65 E | 72,3 D | 57 E | **63,7** | 57–72,3 | Centro-dir. | 62 E |
| Bolsonaro | 75 D | 78 D | 77 D | 78 E | 82,4 D | 72 E | **77,1** | 72–82,4 | Direita | – |
| Lula 3 | 32 D | 35 D | 37 E | 35 E | 39,7 D | 29 E | **34,6** | 29–39,7 | Centro-esq. | – |
| **Famílias ideológicas** |  |  |  |  |  |  |  |  |  |  |
| Comunismo ML | 4 D | 5 D | 3 E | 3 E | 7 D | 4 E | **4,3** | 3–7 | Esq. alta int. | – |
| Socialismo democrático | 15 D | 16 E | 14 E | 15 E | 15 D | 10 E | **14,2** | 10–16 | Esq. alta int. | 10 E |
| Social-democracia | 30 D | 30 E | 28 E | 30 E | 36,5 D | 27 E | **30,3** | 27–36,5 | Centro-esq. | 28 E |
| Liberalismo social | 43 E | 42 E | 40 E | 42 E | 47 E | 40 E | **42,3** | 40–47 | Centro-esq. | 42 E |
| Centro (âncora) | 50 A | 50 A | 50 A | 50 A | 50 A | 50 A | **50,0** | 50–50 | Centro | 50 A |
| Liberalismo econômico | 74 D | 74 E | 70 E | 68 E | 81 D | 76 E | **73,8** | 68–81 | Direita | – |
| Conservadorismo | 75 D | 70 E | 68 E | 74 E | 78 E | 72 E | **72,8** | 68–78 | Direita | 72 E |
| Direita radical | 88 D | 90 D | 88 E | 90 E | 90 E | 91 E | **89,5** | 88–91 | Dir. alta int. | – |

Notas sobre a tabela: os pesos de cadeiras e fatos de 2023–2026 vêm de memória e devem ser conferidos; o ator "centro" vale 50 por construção (âncora, não medida); a régua provisória é inteiramente estimada porque as tabelas primárias não puderam ser abertas; os governos seguem a regra única da seção 3.5.

### 3.2 PT

**Média 26,6 (20–30), faixa Esquerda.** Em todas as seis réguas o PT fica à direita do PCdoB e à esquerda de PSB e PDT. A amplitude de 10 pontos vem de Votações (20, que mede o voto da bancada em pautas de mercado) e de Nicolau e Bolognesi (30 e 29,7, partido que governa em coalizão e é percebido mais ao centro). A régua provisória (Power e Zucco, 14) levaria a média a 24,8, mas não entra na média.

- **Diretrizes:** programa histórico de socialismo democrático; a "primeira alma" do partido (Singer, 2010) designa o programa socialista fundador.
- **Votações:** bancada contra o teto de gastos (EC 95/2016), a reforma trabalhista (2017) e a reforma da Previdência (2019); oposição às privatizações dos anos 1990 (a conferir nos dados abertos).
- **Políticas de governo (2003–2016, 2023–):** Bolsa Família, valorização do salário mínimo, ProUni, Lei de Cotas (12.711/2012), Mais Médicos.
- **Contrapesos:** metas de superávit primário, reforma previdenciária do funcionalismo (EC 41/2003), ajuste fiscal de 2015, arcabouço fiscal (LC 200/2023) e coalizão com MDB e PP.
- **Leitura de Singer:** prática mais moderada que o programa e a base (partido 29, governos 35 a 37).
- **Eixo 2:** nenhum selo nesta versão. A rubrica da seção 4.5 vale para o PT como para qualquer partido; entre os fatos candidatos a registro estão declarações de solidariedade a governos de partido dominante no exterior (Cuba, Venezuela, Nicarágua) e a caracterização do impeachment de 2016 como "golpe", ambos a conferir.

### 3.3 PL

**Média 81,0 (77–88), faixa Direita.** Dispersão moderada (11 pontos), próxima à do Novo (10) e à do Republicanos (10). Novo (81,4) fica ao lado: a diferença de 0,4 ponto não é conclusiva (o Novo supera o PL em 3 das 6 réguas).

- **Diretrizes:** programa liberal-conservador (privatizações, menos impostos e regulação, costumes conservadores, flexibilização do acesso a armas).
- **Votações:** bancada a favor das reformas trabalhista (2017) e da Previdência (2019) e da privatização da Eletrobras (2021); oposição a Lula 3 em pautas fiscais e de costumes (a conferir nos dados abertos).
- **Fases:** desde 2021 (filiação de Bolsonaro), polo da direita e maior bancada em 2022 (99 deputados, dado de memória). Antes, como PL/PR, era sigla de Centrão e base de governos do PT (José Alencar, vice de Lula): Singer põe a fase anterior perto de 65; Votações, perto de 70. **A nota refere-se à fase atual**, e a régua provisória não tem nota para o PL.
- **Eixo 2:** nenhum selo nesta versão, pelas mesmas razões do PT. Entre os fatos candidatos a registro (seção 4.5, todos a conferir e sujeitos a revisão jurídica): decisão do STF de 2025 que condenou o ex-presidente por crimes ligados à tentativa de abolição violenta do Estado democrático de direito (a defesa e aliados contestam); contestação pública do sistema eletrônico de votação por lideranças em 2021–2022; atos de 8/1/2023, cuja atribuição ao partido como instituição não está estabelecida. O mesmo tratamento vale para os fatos do outro lado. A zona "direita distante" mede distância no eixo da igualdade, não fascismo nem "direita radical".

### 3.4 Centrão

- **Composição adotada (regra única, aplicada às seis réguas):** núcleo de cinco partidos com peso igual: MDB, PSD, PP, Republicanos e União Brasil (inteiro). O PL fica fora e entra só como teste de sensibilidade (fases de 2019–2022). PTB, Solidariedade, Avante e outros menores ficam fora por instabilidade. A definição é do site; o termo nasce no período da Constituinte de 1987–88 (a conferir na literatura).
- **Média 65,8 (62–76,9), faixa Centro-direita.** Verificação cruzada: a média das médias dos cinco partidos do núcleo é 65,9; com o PL a peso pleno, 68,4.
- **Dispersão interna:** MDB 57,0, PSD 59,3, União Brasil 69,4, PP 71,8, Republicanos 71,8.
- **Ponto fora da curva:** Bolognesi et al. (76,9) posiciona os cinco partidos entre 70,1 e 83,4. As demais cinco réguas ficam em 62–65.
- **Natureza:** é tática de governo, não doutrina. O bloco apoiou FHC, Lula, Dilma, Temer, Bolsonaro e Lula 3; a nota mede a posição média nas pautas, não o papel de pivô. Na régua provisória o núcleo tem só quatro partidos (União Brasil sem nota).

### 3.5 Governos

**Regra única e pública para todos os governos:** `nota = 0,5 x partido do presidente + 0,5 x média simples da base + ajuste de políticas`. A base é uma lista pública de atores desta lista (`bases_governo` no JSON); o ajuste de políticas é o desvio entre o julgamento do autor (coalizão e políticas documentadas) e a fórmula, **limitado a ±5 pontos, igual para os dois lados**, e registrado em cada justificativa. Nas réguas Bolognesi e Votações (posicionais) o ajuste é zero. A nota descreve a coalizão e as políticas do período, não a pessoa do presidente.

Base: FHC = União Brasil (herdeiro de PFL/DEM), MDB, PP; Lula 1 e 2 = PSB, PDT, PCdoB, MDB, PP; Dilma = PSB, PDT, PCdoB, MDB, PP, PSD, Republicanos; Temer = PSDB, União Brasil, PP, PSD, Republicanos, Cidadania; Bolsonaro = PP, Republicanos, MDB, PSD, União Brasil; Lula 3 = PSB, PDT, PCdoB, PSOL, Rede, PV, MDB, PSD, União Brasil, PP. Partido do presidente: PSDB, PT, PT, MDB, PL, PT. O PL de 2019–2020 era Centrão, de modo que a nota do partido refere-se à fase atual e acentua a distância do governo Bolsonaro ao centro.

Cada célula: **nota (partido; base; ajuste de políticas)**.

| Governo | Bobbio | Sartori | Singer | Nicolau | Bolognesi et al. | Votações | **Média** |
|---|---|---|---|---|---|---|---|
| FHC | 57 (56; 62; −2) | 58 (50; 65; +0,5) | 62 (58; 62,7; +1,7) | 58 (60; 64,7; −4,3) | 74,8 (71,1; 78,5) | 53 (42; 63,7) | **60,5** |
| Lula 1 e 2 | 29 (25; 40,4; −3,7) | 38 (26; 42,8; +3,6) | 36 (29; 42; +0,5) | 39 (30; 43,4; +2,3) | 40 (29,7; 50,2) | 29 (20; 38,6) | **35,2** |
| Dilma | 31 (25; 46,7; −4,9) | 36 (26; 49,1; −1,6) | 35 (29; 48,1; −3,6) | 37 (30; 49,7; −2,9) | 43,4 (29,7; 57,1) | 33 (20; 45,4) | **35,9** |
| Temer | 62 (52; 61; +5) | 63 (55; 61,2; +5) | 63 (55; 61,5; +5) | 65 (56; 63,5; +5) | 72,3 (70,1; 74,5) | 57 (54; 59,5) | **63,7** |
| Bolsonaro | 75 (77; 62,2; +5) | 78 (80; 65; +5) | 77 (80; 63; +5) | 78 (80; 65; +5) | 82,4 (88; 76,9) | 72 (81; 63,2) | **77,1** |
| Lula 3 | 32 (25; 41,3; −1,1) | 35 (26; 43,6; +0,2) | 37 (29; 42; +1,5) | 35 (30; 42,7; −1,4) | 39,7 (29,7; 49,6) | 29 (20; 37,6) | **34,6** |

**Teste de simetria dos ajustes** (quatro réguas de autor): média do ajuste nos governos de esquerda (Lula 1 e 2, Dilma, Lula 3) −0,9; nos de direita (FHC, Temer, Bolsonaro) +3,0. O desvio bruto entre o julgamento anterior e a fórmula passa do teto de 5 pontos em 8 de 12 casos à direita (Temer e Bolsonaro nas quatro réguas, de 6,3 a 11,5) e em 0 de 12 casos à esquerda (máximo em módulo 4,9). Ou seja, os julgamentos anteriores colocavam as políticas documentadas de Temer e Bolsonaro mais distantes do centro que suas coalizões. Essa assimetria pode ser real ou viés do analista; por isso o teto, igual para os dois lados, corta o excedente. O termo de políticas continua julgamento do analista em cada régua, e um critério mais explícito (lista de medidas com peso) fica como pendência.

- **FHC 60,5 (dispersão alta; 53–74,8):** Plano Real, privatizações (Vale, 1997; Telebras, 1998), metas de inflação, Lei de Responsabilidade Fiscal, EC 20/1998, com Fundef, Bolsa Escola e genéricos. Bolognesi (74,8) usa percepções de 2018 aplicadas ao período; Votações (53) usa o PSDB dos anos 1990 (cerca de 42, estimativa do site).
- **Lula 1 e 2 (35,2), Dilma (35,9) e Lula 3 (34,6):** indistinguíveis dentro da margem (1,3 ponto entre os extremos). Combinam transferências, salário mínimo e crédito com macroeconomia convencional. Lula 3 está em curso: nota provisória.
- **Temer 63,7 (57–72,3):** teto de gastos, reforma trabalhista, terceirização, reforma do Ensino Médio; reforma da Previdência não aprovada. Fica a 2,1 pontos do Centrão (65,8).
- **Bolsonaro 77,1 (72–82,4):** Previdência (EC 103/2019), Liberdade Econômica, Eletrobras, armas; contrapeso: Auxílio Emergencial e Auxílio Brasil de R$ 600. Com a regra única, fica a 27,1 pontos do centro e o Lula 3 a 15,4 pontos: a diferença vem da posição do PL (81,0) frente à do PT (26,6) e das bases, não de uma regra diferente para cada lado.

### 3.6 Onde as réguas divergem

- **Maiores amplitudes:** PSDB (22,1); FHC (21,8); União Brasil (18,4); MDB (18,1); PSD (15,9).
- **Causa principal:** diferença de calibração. Em relação à média geral (33 atores, sem a âncora), os vieses médios são: Bobbio −1,3; Sartori −0,2; Singer −1,1; Nicolau +0,1; Bolognesi et al. +6,2; Votações −3,7; a régua provisória, −3,7.
- **A régua de Bolognesi et al. e o centro:** os especialistas posicionam o centro e a centro-esquerda mais à direita que as demais réguas, e o efeito é pequeno nos polos (diferença da régua menos a média das outras cinco: PSOL −0,2, Novo −0,1; MDB +15,7, PSDB +16,5). Como a faixa de MDB, PSDB, PP e social-democracia depende dessa única pesquisa (de 2018, pós-impeachment, ainda não conferida), a interface deve mostrar a faixa **com e sem** essa régua para esses atores:

| Ator | Média (6) | Faixa | Sem Bolognesi (5) | Faixa | Bolognesi menos as outras cinco |
|---|---|---|---|---|---|
| MDB | 57,0 | Centro-dir. | 54,4 | Centro | +15,7 |
| PSDB | 57,4 | Centro-dir. | 54,6 | Centro | +16,5 |
| PSD | 59,3 | Centro-dir. | 57,0 | Centro-dir. | +13,9 |
| PSB | 33,9 | Centro-esq. | 32,6 | Centro-esq. | +7,9 |
| PT | 26,6 | Esquerda | 26,0 | Esquerda | +3,7 |
| PL | 81,0 | Direita | 79,6 | Direita | +8,4 |
| PSOL | 13,0 | Esq. alta int. | 13,0 | Esq. alta int. | −0,2 |
| Novo | 81,4 | Direita | 81,4 | Direita | −0,1 |

- **Ordem x magnitude:** correlação de postos entre pares de réguas de 0,970 (Bobbio x Bolognesi et al.) a 0,991 (Singer x Nicolau), calculada sem a âncora. O valor mede coerência do analista e é inflado em parte porque o conjunto inclui atores muito distantes; entre atores próximos (MDB, PSD, PSDB, Podemos) a ordem muda de régua para régua.

---

## 4. Os extremos

### 4.1 Princípios

1. **Extremo não é nota extrema.** Em Bobbio, extremismo é definido pelo eixo da liberdade. A nota perto de 0 ou 100 indica intensidade no eixo da igualdade; o rótulo histórico só vale com o eixo 2 autoritário.
2. **0 e 100 são limites teóricos**, não pontos empíricos (por isso o comunismo doutrinário fica em 3–7 e a direita radical em 88–91 nas réguas de autor).
3. **Descrever com o mesmo rigor os dois lados.** O que se escreve sobre uma zona de esquerda tem contrapartida na de direita. Os limiares são **espelhados por regra de desenho** (direita = 100 menos esquerda): isso iguala a distância ao centro, não a natureza histórica das categorias nem sua equivalência moral.
4. **Radical x extremo:** a distinção vem de Mudde (2000; 2007) para a direita (a extrema direita rejeita a soberania popular e a regra da maioria; a direita radical aceita o jogo eleitoral e contesta o liberalismo constitucional) e de March (2011) para a esquerda; March e Mudde (2005) tratam da esquerda radical.
5. **A historiografia documenta repressão política em massa em regimes de partido único dos dois lados;** isso pertence ao eixo 2 e à tipologia de regimes (Linz, Arendt), não à posição no eixo da igualdade.

### 4.2 Limiares por régua

Cada par é espelhado: esquerda **menor ou igual** a x e direita **maior ou igual** a 100 - x. Todos os limiares são convenções do site; o único corte que vem de uma fonte é o do survey de Bolognesi et al. (*, reportado em trechos do artigo, a conferir). Os marcadores históricos (comunismo, fascismo, socialismo real, nazismo) **não classificam** ator algum pelo número: exigem o eixo 2 autoritário e os traços do conceito (seção 4.3).

| Par | Bobbio | Sartori | Singer | Nicolau | Bolognesi | Votações | Prov. | Extremos (aux.) |
|---|---|---|---|---|---|---|---|---|
| A: socialismo / direita distante | ≤20 / ≥80 | ≤20 / ≥80 | ≤20 / ≥80 | ≤20 / ≥80 | ≤20 / ≥80 | ≤12 / ≥88 | ≤12 / ≥88 | ≤22 / ≥78 |
| B: comunismo / fascismo | ≤10 / ≥90 | ≤8 / ≥92 | ≤8 / ≥92 | ≤8 / ≥92 | ≤8 / ≥92 | ≤7 / ≥93 | ≤7 / ≥93 | ≤8 / ≥92 |
| C: socialismo real / nazismo | ≤2 / ≥98 | ≤2 / ≥98 | ≤2 / ≥98 | ≤2 / ≥98 | ≤2 / ≥98 | ≤2 / ≥98 | ≤2 / ≥98 | ≤3 / ≥97 |
| Corte nativo do survey |  |  |  |  | ≤15* / ≥85* |  |  |  |
| Social-democracia / direita democrática |  |  |  |  |  |  |  | ≤40 / ≥60 |
| Esquerda radical / direita radical (categorias da literatura) |  |  |  |  |  |  |  | ≤16 / ≥84 |

**Atores dentro de cada marcador, pela nota da própria régua** (descritivo; não é classificação):

| Régua | Socialismo | Direita distante | Comunismo | Fascismo | Socialismo real | Nazismo |
|---|---|---|---|---|---|---|
| Bobbio | PSTU, PCO, PSOL, PCdoB, Comunismo ML, Socialismo democrático | Novo, Direita radical | PSTU, PCO, Comunismo ML | nenhum | nenhum | nenhum |
| Sartori | PSTU, PCO, PSOL, PCdoB, Comunismo ML, Socialismo democrático | PL, Direita radical | PSTU, PCO, Comunismo ML | nenhum | nenhum | nenhum |
| Singer | PSTU, PCO, PSOL, PCdoB, Comunismo ML, Socialismo democrático | PL, Direita radical | PSTU, PCO, Comunismo ML | nenhum | nenhum | nenhum |
| Nicolau | PSTU, PCO, PSOL, PCdoB, Comunismo ML, Socialismo democrático | PL, Novo, Direita radical | PSTU, PCO, Comunismo ML | nenhum | nenhum | nenhum |
| Bolognesi et al. | PSTU, PCO, PSOL, PCdoB, Comunismo ML, Socialismo democrático | União Brasil, PP, PL, Novo, Bolsonaro, Liberalismo econômico, Direita radical | PSTU, PCO, Comunismo ML | nenhum | nenhum | nenhum |
| Votações | PSTU, PCO, PSOL, Comunismo ML, Socialismo democrático | Direita radical | PSTU, PCO, PSOL, Comunismo ML | nenhum | nenhum | nenhum |

Convergência: comunismo entre 7 e 10, fascismo entre 90 e 93 e nazismo em 98, nas réguas de autor. Cada régua mostra as zonas dela. Separação mínima entre marcadores vizinhos na mesma régua: 5 pontos, ou cerca de 16 px em 360 px, o que obriga a legenda numerada a ser o controle de toque (seção 6.3).

### 4.3 Como posicionar cada conceito

| Conceito | Referência na régua | Marcador | Condição para usar o rótulo |
|---|---|---|---|
| Comunismo (doutrina marxista-leninista) | Família: 4,3 (3–7) | Comunismo (≤ 7 a 10) | Eixo 2 autoritário (partido único) e objetivo de abolir a propriedade privada dos meios de produção |
| Socialismo real (regimes) | Zona de regime, sem ator | ≤ 2 | Estado de partido único com economia planificada; não se pontua partido de democracia competitiva aqui |
| Socialismo democrático | Família: 14,2 (10–16) | Socialismo (≤ 12 a 22) | Propriedade social ampliada por vias eleitorais e pluralistas |
| Social-democracia | Família: 30,3 (27–36,5) | Fora do marcador de socialismo | Mercado regulado, bem-estar, pluralismo pleno |
| Conservadorismo / liberalismo econômico | 72,8 e 73,8 | Direita democrática | Aceita pluralismo e eleições |
| Direita radical (que disputa eleições) | Família: 89,5 (88–91) | Direita distante (≥ 78 a 88) | Evidência de nativismo, autoritarismo e populismo (Mudde); o número só sinaliza onde procurar |
| Fascismo | Zona de regime, sem ator | Fascismo (≥ 90 a 93) | Partido único, ultranacionalismo, culto ao líder, violência contra o pluralismo, ruptura com a democracia |
| Nazismo | Caso histórico, sem ator | ≥ 98 | Hierarquia racial biológica, antissemitismo exterminista, expansionismo, genocídio; natureza distinta, não grau maior que o fascismo |

A família "direita radical" fica abaixo do marcador de fascismo nas seis réguas. A lista de famílias pedida não traz "fascismo": o espelho de "comunismo" é o marcador de fascismo, e o de "direita radical" que disputa eleições é a esquerda radical que disputa eleições (PSTU, PCO, PSOL), não o regime.

### 4.4 Erros conceituais a evitar

- **Fascismo não é "extremo liberal econômico".** O fascismo italiano (1922–1943) combinou corporativismo, economia mista e forte intervenção estatal; o que o define é ultranacionalismo, partido único, culto ao líder, violência contra o pluralismo e ambição totalitária (Paxton, Griffin, Payne, Sternhell, que definem por um núcleo de traços). **Eco** (*Ur-fascismo*, 1995) propõe uma lista de catorze traços que não formam sistema e afirma que um único traço pode bastar para o fascismo se cristalizar em torno dele; por isso o site usa Eco como alerta cultural, não como definição operacional, e exige vários traços (Paxton, Griffin) antes de aplicar o rótulo. Paxton descreve um partido de massas de militantes nacionalistas comprometidos; "partido-milícia" é termo de Gentile. Para Arendt, a Itália fascista não foi plenamente totalitária. A passagem de Eco foi reencontrada em cópias secundárias do ensaio e deve ser conferida no texto original (NYRB, 22/6/1995).
- **Fascismo e nazismo não são sinônimos.** O nazismo (1933–1945) acrescenta hierarquia racial biológica, antissemitismo exterminista e Lebensraum. Paxton o trata como variante do fascismo; outros autores, como categoria própria. Estar acima do fascismo na régua é notação de posição, não grau: a diferença é de natureza.
- **Nacional-socialismo não é socialismo.** O regime reprimiu sindicatos e partidos de esquerda desde 1933 e manteve a propriedade privada sob direção estatal.
- **Comunismo tem três sentidos:** horizonte teórico (sociedade sem classes e sem Estado), doutrina marxista-leninista e regimes que se declararam comunistas. Os regimes diferem entre si e no tempo (Linz: totalitário, pós-totalitário; URSS estalinista, China maoísta, Europa Oriental tardia, Cuba). Trotskistas (PSTU, PCO) rejeitam o estalinismo. O nome do partido não define a nota.
- **Não usar zona como acusação, nota moral ou medida de democracia.** Classificar adversário como fascista ou comunista sem os traços é erro conceitual, dos dois lados.
- **Bolsonarismo:** a literatura debate se é direita radical populista, extrema direita ou outra coisa; a régua mede intensidade no eixo 1 e não decide o debate. O artigo de Singer (2021) é anterior à filiação de Bolsonaro ao PL.
- **Ferradura:** descreve convergência de método antiliberal e totalitário, não de fins (igualdade x hierarquia). Comparar não equivale a igualar; o espelhamento dos limiares é só de desenho.

### 4.5 Eixo 2 (liberdade): rubrica única e fatos em conferência

**Status: em conferência.** Indicador do site, separado da nota e fora da régua de Bobbio: Bobbio define moderados e extremistas por doutrinas e orientações, não por conduta partidária. Nenhum selo por partido ou governo é exibido nesta versão.

**Regra de publicação.** Um selo por ator só é exibido quando a rubrica abaixo estiver preenchida para os 19 partidos e os 6 governos, com data, fonte e checagem de cada item, no mesmo registro verbal para os dois lados, e depois de revisão jurídica das frases que citam decisões judiciais (atenção ao período eleitoral de 2026).

| Item | Critério (igual para todos os atores) | Evidência aceita |
|---|---|---|
| r1 | Eleições competitivas e alternância no poder | Participação em eleições competitivas e aceitação da alternância (registros do TSE). |
| r2 | Reconhecimento de resultados eleitorais | Atos do ator como instituição (nota oficial do diretório nacional, ação judicial, voto de bancada) ou decisão judicial definitiva. A contestação por via jurídica (por exemplo, pedido ao TSE) é distinguida da ruptura extrainstitucional. |
| r3 | Estado de direito e liberdades civis | Atos de governo ou de bancada documentados e decisões judiciais definitivas que envolvam o ator como instituição; condutas de pessoas não são atribuídas ao partido sem ato do partido. |

**Famílias ideológicas:** critério único, o da **doutrina** (e não o de conduta), aplicado aos dois lados: Comunismo ML: autoritária na doutrina clássica (partido de vanguarda e partido único); Socialismo democrático: democrática na doutrina (pluralismo e eleições); Social-democracia: democrática na doutrina; Liberalismo social: democrática na doutrina; Centro (âncora): não determinado (âncora, sem doutrina própria); Liberalismo econômico: democrática na doutrina; Conservadorismo: democrática na doutrina; Direita radical: autoritária na definição de Mudde (nativismo, autoritarismo e populismo), mas aceita eleições.

**Fatos candidatos a registro** (todos a conferir; data e fonte pendentes; o mesmo registro verbal para os dois lados; nenhum implica conclusão):

| Lado | Ator | Fato | Critério |
|---|---|---|---|
| direita | PL, Bolsonaro | Decisão do STF de 2025 que condenou o ex-presidente por crimes ligados à tentativa de abolição violenta do Estado democrático de direito (a defesa e aliados contestam). | r3 |
| direita | PL, Bolsonaro | Contestação pública do sistema eletrônico de votação por lideranças em 2021 e 2022 (quem, quando e se ato do partido: a conferir). | r2 |
| direita | PL | Atos de 8 de janeiro de 2023: fato público; a atribuição ao partido como instituição não está estabelecida. | r3 |
| centro-direita | PSDB | Pedido de auditoria do resultado eleitoral de 2014 ao TSE (via jurídica). | r2 |
| esquerda | PT, PCdoB | Caracterização do impeachment de 2016 como 'golpe' em notas e discursos (questão contestada no debate público). | r3 |
| esquerda | PT, PCdoB, PCO, PSTU | Declarações de solidariedade a governos de partido dominante no exterior (Cuba, Venezuela, Nicarágua), registradas como posição de política externa (texto, data e autoria a conferir). | r1, r3 |
| esquerda | PCdoB | Tradição marxista-leninista declarada no programa partidário (a conferir). | r3 |

Partidos e governos: `sem_registro_publicado`. Até a tabela de evidências estar completa para os 19 partidos e os 6 governos, e revisada juridicamente, **nenhum selo é exibido**. O eixo 2 não altera nenhuma nota.

---

## 5. Método da média

**Decisão:** média aritmética **simples**, peso igual, sobre as seis réguas incluídas que têm nota válida para o ator, sem reescalonar. Mínimo e máximo entre as mesmas réguas formam o intervalo (incerteza). A faixa é calculada uma só vez, sobre a média não arredondada; a média é guardada com uma casa decimal e **exibida como inteiro**. Mediana e média ponderada por método (publicada 1,0; derivada 0,75; estimada 0,5) ficam como teste de sensibilidade, sem exibição.

**Por que não ponderar por método:**

1. O rótulo não é uniforme entre as fichas (o mesmo tipo de trabalho recebeu rótulos diferentes em réguas diferentes antes da regra objetiva da seção 7.1); ponderar premiaria convenção de rotulagem.
2. Só 17 das 198 notas são publicadas, todas de uma régua (Bolognesi et al., deslocada em +6,2 pontos e não conferida na tabela primária). Ponderar por método daria mais peso, na prática, a um único levantamento.
3. Os pesos seriam um parâmetro subjetivo a mais.
4. O teste mostra que o ganho seria pequeno: com pesos 1,0/0,75/0,5 a maior diferença é de 1,6 ponto (PSDB) e **nenhum ator muda de faixa**. Com a mediana, a maior diferença é de 2,5 pontos (FHC) e mudam de faixa MDB, PP, Socialismo democrático, todos a até 1,5 ponto de uma borda.

**Robustez por régua** (retirar uma régua por vez; 33 atores):

| Régua retirada | Maior mudança na média | Atores que mudam de faixa |
|---|---|---|
| Bobbio | 1,2 (Lula 1 e 2) | nenhum |
| Sartori | 1,4 (PSDB) | nenhum |
| Singer | 1,1 (Novo) | nenhum |
| Nicolau | 1,2 (Liberalismo econômico) | nenhum |
| Bolognesi et al. | 2,9 (FHC) | MDB, PSDB, PP, Social-democracia |
| Votações | 2,1 (PV) | Socialismo democrático |

Retirar Bolognesi et al. é o que mais altera a média e a faixa. Com a régua provisória incluída, o PT vai de 26,6 a 24,8; o PL não muda, porque a provisória não tem nota para ele.

**Régua sem dado para o ator:**

- Exclui a régua **daquele ator** (nunca imputa 0 ou 50) e avisa "média de n autores". Na régua provisória, por exemplo, PSTU, PCO, Novo, União Brasil e PL ficam sem nota, e com ela ligada a média desses atores tem n = 6.
- n ≥ 5: normal. n entre 3 e 4: exibe com aviso. n < 3: não exibe média; mostra só as notas disponíveis.
- A mesma regra vale quando o visitante desliga réguas na interface (mínimo de 3 ligadas).

**Por que a régua de extremos não entra:** reaproveita o critério de Bobbio; contaria a igualdade duas vezes. **Por que a régua provisória não entra por padrão:** suas notas são estimativas do site, não valores de Power e Zucco, e faltam atores sem cobertura; deve ser refeita com Zucco e Power (2024).

**O que a média é e não é:** é um consenso aproximado de critérios diferentes, não a medida de um traço único. As réguas não são independentes: cinco das seis são operacionalizações do site, com evidências em parte comuns, e a correlação de postos de 0,98 mede coerência do analista. Os números de médias refletem a calibração do site. **O intervalo, não a média, é o dado mais honesto sobre incerteza.**

---

## 6. Especificação de programação e design

### 6.1 Estrutura de dados (arquivo JSON entregue junto)

```ts
type Metodo = 'publicada' | 'derivada' | 'estimada' | 'ancora' | 'sem_dado';
type Confianca = 'alta' | 'media' | 'baixa' | null;
type Natureza = 'marcador_de_distancia' | 'marcador_historico' | 'marcador_de_regime'
              | 'familia_democratica' | 'categoria_da_literatura' | 'corte_nativo_a_conferir';
interface Decomposicao {                 // governos e Centrão
  partido?: string; nota_partido?: number; base?: string[]; base_sem_nota?: string[];
  centroide_base?: number; formula_50_50?: number; ajuste_politicas?: number;
  julgamento_anterior_do_analista?: number; residuo_bruto?: number; observacao?: string;
  composicao?: string[]; media?: number; sensibilidade_com_pl?: number | null;
}
interface Posicao {
  nota: number | null; metodo: Metodo; confianca: Confianca; justificativa: string;
  verificacao?: 'fonte_secundaria' | 'trecho_de_busca' | 'derivada_de_valores_nao_conferidos';  // Bolognesi
  onda?: '2018' | '2022'; valor_onda_alternativa?: { onda: string; nota: number };
  decomposicao?: Decomposicao;
}
interface Zona {
  tipo: string; rotulo: string; lado: 'esquerda' | 'direita'; par: string;
  a_partir_de: number; comparador: '<=' | '>='; natureza: Natureza; classifica_ator: false;
  exige_eixo2?: string; espelho_de?: string; aviso: string;
}
interface Obra { titulo: string; ano: string; verificado: boolean; origem_verificacao: 'busca_rodada_atual' | 'memoria' }
interface Autor {
  id: string; nome: string; papel: 'base' | 'complementar' | 'complementar_provisoria' | 'auxiliar';
  entra_na_media: boolean; provisoria?: boolean; ligavel_pelo_usuario?: boolean;
  motivo_provisoria?: string; motivo_fora_da_media?: string; status_notas_publicadas?: string; cobertura?: string;
  obras: Obra[]; criterio: string; escala_original: string; cortes_nativos: string;
  vinculos_e_perfil: string; criticas_ao_criterio: string;
  contagem_metodo: Record<'publicada' | 'derivada' | 'estimada', number>; contagem_ancora: number; contagem_sem_dado: number;
  posicoes: Record<string, Posicao>;     // chave = id do ator; nota null = sem dado
  zonas_nota: string; zonas_limiares?: Record<string, number>; zonas: Zona[]; limites: string[];
}
interface Faixa { id: string; rotulo: string; de: number; ate: number; inicio: number; fim: number; lado: string; numero: number }
// raiz: { versao, data_referencia, escala, faixas, faixas_regra, lados, lados_uso, margem_por_metodo, regra_metodo,
//         atores, bases_governo, autores, zonas_tipos, eixo2, referencias_complementares,
//         media: { metodo, autores_incluidos, autores_fora_da_media_por_padrao, regras, sensibilidade,
//                  posicoes: Record<string, { media, min, max, n, faixa, dispersao, no_limite, ancora, sensibilidade }> },
//         avisos, historico_revisao }
```

`verificado = true` significa obra localizada por busca (catálogo, resenha ou fonte secundária) nas rodadas de verificação; `origem_verificacao` registra "busca_rodada_atual" ou "memoria". `zonas_tipos[tipo]` guarda o texto conceitual compartilhado; `zonas[].aviso` traz a nuance de cada tipo e `zonas_nota` a de cada autor. A régua auxiliar (`extremos`) tem `posicoes` só para as 8 famílias. A régua `power_zucco` tem `nota: null` e `metodo: "sem_dado"` onde a fonte não cobre o ator. O campo `lados` serve aos rótulos rápidos (esquerda, centro, direita) da tela de resumo. Os ids de faixa e de lado têm prefixo (`faixa_`, `lado_`) para não colidir com os ids de ator `centro` e `centrao`.

### 6.2 Fórmulas

```js
const FAIXAS = dados.faixas;                                   // 7 itens: de, ate, inicio, fim
const paraCentro = n => (n < 50 ? Math.floor(n + 0.5) : Math.ceil(n - 0.5));   // meio ponto vai para o lado do centro
const faixaDe = n => FAIXAS.find(f => paraCentro(n) >= f.de && paraCentro(n) <= f.ate).id;
const x = (nota, W) => (nota / 100) * W;                        // posição em px
const zonaAtiva = (z, n) => (z.comparador === '<=' ? n <= z.a_partir_de : n >= z.a_partir_de);

function mediaDe(atorId, autores, incluidos) {                  // incluidos: ids de réguas ligadas
  const v = autores.filter(a => incluidos.includes(a.id))
                   .map(a => a.posicoes[atorId]?.nota).filter(Number.isFinite);
  if (v.length < 3) return { status: 'dados_insuficientes', n: v.length, notas: v };
  const media = v.reduce((s, n) => s + n, 0) / v.length;
  const min = Math.min(...v), max = Math.max(...v);
  return { media, min, max, n: v.length, faixa: faixaDe(media),
           status: v.length < 5 ? 'n_baixo' : 'ok',
           dispersao: max - min <= 10 ? 'baixa' : max - min <= 20 ? 'media' : 'alta',
           noLimite: FAIXAS.slice(1).some(f => Math.abs(media - f.inicio) <= 1.5) };
}

// teste: faixaDe(x) e faixaDe(100 - x) são espelhos (índices somam 6) para todo x de 0 a 100
```

**Colisão de marcadores (alvo de toque de 44 px):** ordenar por nota; para cada marcador, usar a primeira raia cujo último centro esteja a pelo menos 44 px; no máximo 6 raias; excedentes viram agrupamento com contador, que abre a lista ao toque.

```js
function raias(marcadores, W, toque = 44, maxRaias = 6) {
  const ord = [...marcadores].sort((a, b) => a.nota - b.nota);
  const fim = [], grupos = [];
  for (const m of ord) {
    const cx = x(m.nota, W);
    const i = fim.findIndex(c => cx - c >= toque);
    if (i >= 0) { fim[i] = cx; m.raia = i; }
    else if (fim.length < maxRaias) { fim.push(cx); m.raia = fim.length - 1; }
    else grupos.push(m);               // excedente: agrupamento com contador, abre a lista ao toque
  }
  return { raias: fim.length, grupos };
}
```

Simulação com os dados finais (trilho de 328 px, toque de 44 px, três grupos por régua: partidos e bloco, 20 atores; governos, 6; famílias, 8): o pior caso é "partidos e bloco" na régua Bolognesi et al., com 9 raias; com o limite de 6 raias, no máximo 3 marcador(es) por grupo vão para agrupamento. Governos e famílias cabem em até 3 raias. Cada grupo é uma aba do cartão da régua.

### 6.3 Régua por autor (com indicadores de zona)

- Um cartão por autor, empilhados na vertical, cada um com nome, critério em uma linha, **legenda de método (P/D/E/A)** e a régua. Três abas por cartão: partidos e bloco; governos; famílias.
- Trilho com as 7 faixas comuns, bordas marcadas por tick e número (contraste ≥ 3:1 com o fundo). Sobre ele, as zonas do autor: marca vertical no valor `a_partir_de`, hachura neutra do valor até a ponta (esquerda: `<=`; direita: `>=`) e bandeira numerada.
- **Bandeiras:** tamanho mínimo de 24 px de largura, escalonadas em raias verticais quando a separação for menor que 24 px (a menor separação entre marcadores vizinhos é de 5 pontos, cerca de 16 px em 360 px). A bandeira apenas destaca; o **controle de toque é a legenda numerada** sob a régua (ex.: "1 Socialismo, nota ≤ 20"; "1 Direita distante, nota ≥ 80"). Hachuras aninhadas (socialismo contém comunismo contém socialismo real) usam densidades crescentes de traço, nunca cor.
- Texto da zona (`zonas_tipos[tipo]` + `aviso`) aberto por toque na legenda. Nota de rodapé do cartão: "Zonas de extremo são convenções desta régua, não medidas; estar numa zona não classifica o ator."
- **Sem selo de eixo 2 ao lado das notas** nesta versão. O eixo 2 vive na página de metodologia (seção 4.5).
- Opção "ver cortes nativos do autor" (`cortes_nativos`) como marcas finas.
- A régua provisória traz faixa fixa "provisória: estimativa do site, fora da média" e um interruptor "incluir na média". A régua auxiliar de extremos fica em seção separada, rotulada "não entra na média".

### 6.4 Régua-média (sem indicadores de zona)

- Mesmo trilho de 7 faixas, com **nomes neutros** (Esquerda de alta intensidade, Esquerda, Centro-esquerda, Centro, Centro-direita, Direita, Direita de alta intensidade) e uma marca em 50.
- **Proibido** nesta régua: qualquer elemento ou texto de **zona** (bandeira, hachura, tick de zona, legenda numerada de zona, aviso de zona) e qualquer leitura de `autores[].zonas` e de `zonas_tipos`. Os **nomes das famílias** ("Comunismo marxista-leninista", "Direita radical" e as demais) continuam permitidos como atores, porque são atores da lista; o que é proibido é apresentá-los como marcador de regime.
- Cada ator: marcador na média (forma por tipo: círculo, quadrado, losango, triângulo) + barra clara de mínimo a máximo, com contorno em `--intervalo-borda` (≥ 3:1) + etiqueta "média de n autores" + selo de dispersão (baixa, média, alta) + marca "no limite" quando couber. `aria-label`: "PT, média 27 de 6 réguas, intervalo 20 a 30, dispersão baixa".
- **Quais atores aparecem:** o seletor tem os 34 atores em lista com três abas; padrão PT, PL e Centrão; máximo 8 na régua ao mesmo tempo. O teste de dados exige os 34 atores em todas as réguas; o de interface exige que todo ator seja alcançável por marcador, agrupamento ou lista.
- Interação: caixas para ligar e desligar réguas (recalcula pela mesma fórmula; mínimo de 3 ligadas; a provisória começa desligada), e tabela completa em `<details>` abaixo. Para MDB, PSDB, PP, PSD e social-democracia, mostrar a faixa **com e sem** a régua de Bolognesi et al. (seção 3.6).
- Aviso fixo acima da régua (texto do item 6.7).

### 6.5 Cores e símbolos

- **Neutras, sem cor de partido.** Faixas em **zebra de dois cinzas** puros (saturação HSL ≤ 8%, sem matiz). Nada de vermelho, azul, verde, amarelo ou laranja, nem combinações de bandeira ou de partido. A zebra (1,1:1) é só decoração: o que separa as faixas é o tick com número em `--linha`.
- Atores distinguidos por **forma**: círculo (partido), quadrado (governo), losango (ideologia), triângulo (bloco). Método da nota distinguido por **símbolo e texto** (P, D, E, A; contorno cheio, tracejado, pontilhado, duplo), nunca só por cor.
- Tokens em `:root`, redefinidos para modo escuro. Contrastes verificados: texto `--fg` 16,3:1 e `--fg-2` 8,1:1 sobre o fundo claro (15,7:1 e 8,0:1 no escuro); `--linha` 4,5:1 sobre o fundo e 3,7:1 sobre a faixa mais escura no claro (5,5:1 e 4,3:1 no escuro), todos acima de 3:1 para elementos gráficos.

```css
:root{ --bg:#FAFAFA; --fg:#1C1C1C; --fg-2:#4D4D4D; --linha:#737373;
       --faixa-a:#F0F0F0; --faixa-b:#E3E3E3; --intervalo:rgba(28,28,28,.18); --intervalo-borda:#4D4D4D; --marcador:#1C1C1C; }
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){
  --bg:#141414; --fg:#EDEDED; --fg-2:#ABABAB; --linha:#8C8C8C;
  --faixa-a:#1E1E1E; --faixa-b:#2A2A2A; --intervalo:rgba(237,237,237,.22); --intervalo-borda:#ABABAB; --marcador:#EDEDED; } }
:root[data-theme="dark"]{
  --bg:#141414; --fg:#EDEDED; --fg-2:#ABABAB; --linha:#8C8C8C;
  --faixa-a:#1E1E1E; --faixa-b:#2A2A2A; --intervalo:rgba(237,237,237,.22); --intervalo-borda:#ABABAB; --marcador:#EDEDED; }
body{ background:var(--bg); color:var(--fg); }
```

### 6.6 Mobile (360 px)

- Gutter lateral de 16 px; trilho com 100% da largura útil (328 px). **Sem rolagem horizontal:** nenhum contêiner com `overflow-x:auto`; réguas empilhadas na vertical; tabelas viram cartões abaixo de 480 px; `overflow-wrap:anywhere` nos textos.
- Alvo de toque mínimo de 44 x 44 px, com separação entre áreas de toque de 44 px (raias); rótulos só ao toque (cartão do ator abre em folha inferior com nota, método, confiança, justificativa e as demais réguas); nunca depender de hover.
- Em 360 px, 1 ponto vale 3,3 px. O pior caso de marcadores de zona vizinhos (5 pontos) fica a cerca de 16 px; por isso as zonas usam **bandeiras numeradas com legenda abaixo** como controle de toque, e os nomes das faixas viram números de 1 a 7 com legenda.
- Corpo de texto ≥ 16 px, rótulos ≥ 14 px, contraste de texto ≥ 4,5:1, contraste de elementos gráficos ≥ 3:1, foco visível, setas do teclado percorrem os marcadores, `prefers-reduced-motion` respeitado.
- Preferências do visitante (réguas ligadas, atores escolhidos) em `localStorage` com `try/catch`; a página funciona sem isso.

### 6.7 Textos de aviso visíveis (sem depender de tooltip)

A fonte única é `avisos[]` no JSON; a interface exibe o texto exato.

- **Faixa fixa no topo** (`nao_publicadas`): "Nenhum dos cientistas políticos citados publicou notas de 0 a 100 para partidos, governos ou ideologias do Brasil. As notas são conversões, derivações ou estimativas do site, conforme o método indicado em cada ponto."
- **Sob cada régua de autor** (`legenda_metodo`, `margem`, `zonas_convencao`): "Método da nota. Publicada: há número em pesquisa ou obra, convertido para 0-100. Derivada: critério explícito do autor aplicado a ao menos um item documental citado (votação, programa, política, coalizão). Estimada: julgamento do site que operacionaliza o conceito. Âncora: o ator centro vale 50 por construção e não é medido." "A margem de cada nota é de cerca de 5 pontos (publicada), 6 (derivada) e 8 (estimada): diferenças menores que isso entre atores não são conclusivas. A confiança indica a solidez da ordem e da zona, não a precisão do número. A posição não mede qualidade, desempenho, honestidade nem grau de democracia." "Zonas de extremo são convenções gráficas de cada régua, não medidas. Valem nota menor ou igual ao valor (lado esquerdo) ou maior ou igual a 100 menos o valor (lado direito). Rótulos históricos só se aplicam a regimes e movimentos com os traços que os definem; estar numa zona ou perto dela não classifica nenhum ator atual."
- **Acima da régua-média** (`media`): "Média simples das réguas dos autores. A barra clara vai do menor ao maior valor entre eles e indica incerteza, não erro: ator com barra larga é situado de modo diferente conforme o critério."
- **Régua provisória** (`provisoria_pz`): "Régua provisória, fora da média por padrão: as notas são estimativas do site, não valores de Power e Zucco, e faltam atores sem cobertura. O visitante pode incluí-la."
- **Rodapé de todas as páginas** (`rodape`): texto do item 7.4.

### 6.8 Testes de aceite

1. Em 360 px, `document.documentElement.scrollWidth <= window.innerWidth`.
2. O contêiner `.regua--media` não contém elemento de zona (`[data-zona]`, bandeira, hachura, legenda numerada de zona) e o código da régua-média não lê `autores[].zonas` nem `zonas_tipos`. O teste é por DOM e por código, não por busca de palavras: nomes de famílias permanecem permitidos como atores.
3. Todo marcador de régua de autor tem forma por tipo, símbolo de método (P, D, E ou A) e `aria-label` do tipo "PT, nota 25, derivada, confiança alta". Todo marcador da média tem forma por tipo e `aria-label` com média, número de réguas, intervalo e dispersão.
4. Nenhum token de cor de faixa tem saturação HSL acima de 8%; contraste não textual (tick, borda de faixa, contorno da barra mín–máx) ≥ 3:1 contra o fundo e contra as duas faixas, nos dois temas.
5. Com a régua provisória ligada, ator sem nota nela (PSTU, PCO, Novo, União Brasil, PL, Bolsonaro, Lula 3, comunismo, liberalismo econômico, direita radical) tem a média calculada com n = 6, mostra "média de 6 autores" e nunca usa 0 como valor.
6. Com menos de 3 réguas ligadas (fixture: desligar 4 das 6), a média não é exibida e as notas disponíveis são listadas.
7. Teste de dados: os 34 atores aparecem em todas as sete réguas de autor (com `nota: null` onde não há dado) e a régua `extremos` mostra só as 8 famílias. Teste de interface: todo ator é alcançável por marcador, agrupamento ou lista em cada régua e na média.
8. `faixaDe(x)` e `faixaDe(100 - x)` são espelhos para todo x de 0 a 100 em passos de 0,1; em cada régua, os pares de zonas somam 100 (`a_partir_de` da esquerda + `a_partir_de` da direita).
9. Os textos de aviso exibidos são idênticos a `avisos[].texto`.

---

## 7. Limites e transparência

### 7.1 O que é publicado, derivado e estimado

**Regra objetiva de rotulagem** (aplicada a todas as fichas de uma vez): **publicada** = há número em pesquisa ou obra, convertido; **derivada** = critério explícito do autor (ou fórmula sobre valores publicados) mais ao menos um item documental citado na justificativa; atores que o autor não analisa e réguas cujo critério não é do autor são **estimadas**; o ator "centro" é **âncora** e fica fora das contagens. Por isso Nicolau, Votações e a régua provisória são 100% estimadas, e o PL em Singer e o PSD em Sartori passaram a estimadas. Os itens documentais citados (votações, programas) não foram reconferidos nos dados abertos. A rotulagem é aproximada: percentuais indicam ordem de grandeza.

| Régua (33 atores, sem a âncora) | Publicada | Derivada | Estimada |
|---|---|---|---|
| Bobbio | 0 | 27 | 6 |
| Sartori | 0 | 12 | 21 |
| Singer | 0 | 11 | 22 |
| Nicolau | 0 | 0 | 33 |
| Bolognesi et al. | 17 | 12 | 4 |
| Votações | 0 | 0 | 33 |
| **Soma (6 réguas da média)** | **17 (8,6%)** | **62 (31,3%)** | **119 (60,1%)** |
| Prov. (fora da média) | 0 | 0 | 23 (+ 10 sem nota) |

As 17 publicadas são partidos da pesquisa de Bolognesi et al. (PSTU, PCO, PSOL, PCdoB, PT, PSB, PDT, Rede, PV, MDB, PSD, PSDB, Cidadania, Podemos, PP, PL, Novo), **copiadas de trechos de busca e de texto de divulgação de coautor, não conferidas na tabela primária**; a confiança fica limitada a "média" ou "baixa". Os valores de PV, Rede, Cidadania e PL são da onda de 2022. Governos, Centrão e famílias não são medidos por nenhum levantamento incorporado (Zucco e Power, 2024, publicam posições de presidentes, ainda não incorporadas).

### 7.2 O que os autores não dizem

- **Bobbio** não deu números nem analisou o Brasil; a nota é a aplicação do critério da igualdade a evidências documentais.
- **Sartori** não posicionou ator algum da lista; o eixo é ordinal; a aplicação ao Brasil é por analogia; "antissistema" é conduta, não posição.
- **Singer** não analisa PSTU, PCO, PV, Rede, Cidadania, Podemos, União, PP, Republicanos, Novo nem PSD em separado; Lula 3 é posterior às análises conferidas; a tese sobre a autoridade estatal vem de resumos secundários e é contraposta por outras fontes; o artigo de 2021 não analisa o PL.
- **Nicolau** não propõe escala partidária; trata de eleitorado e regras eleitorais; os números de contexto (ESEB 27% a 43%; NEP 16,5) vêm de terceiros e não foram conferidos na origem; o dado de 45% em 2018 aparece no resumo do artigo de Singer.
- **Power e Zucco, Bolognesi et al. e votações** medem percepção ou voto, não programa nem políticas públicas.
- **Nenhum autor** autoriza concluir que um lado seja mais democrático, melhor ou pior que o outro; no esquema de Bobbio há moderados e extremistas dos dois lados.

### 7.3 Pendências de verificação antes de publicar

- **Conferido por busca (fontes secundárias):** edição UNESP de *Direita e Esquerda* (1995) e a igualdade como critério ([Univates](https://univates.br/revistas/index.php/destaques/article/download/471/463/478); [Congresso em Foco](https://congressoemfoco.com.br/coluna/6577/precisamos-de-uma-nova-direita)); *O Brasil Dobrou à Direita*, Zahar, lançamento em 5/10/2020 ([Companhia das Letras](https://www.companhiadasletras.com.br/livro/9788537818886/o-brasil-dobrou-a-direita)); livro de Singer na EdUSP, com o ano de 1999 ou 2000 conforme o catálogo ([resenha na Revista Cronos](https://periodicos.ufrn.br/cronos/article/view/10889)); artigo de Bolognesi, Ribeiro e Codato, *Dados* 66(2), método (ABCP, julho de 2018, 0 a 10), médias do PV (5,29 em 2018; 4,12 em 2022) e do Cidadania/PPS em 2018 (4,93) ([texto de Codato](https://adrianocodato.substack.com/p/o-banquete-de-macbeth-conversando)); Singer, *Opinião Pública* 27(3), p. 705–729; Zucco e Power (2024), *LAPS* 66(1), p. 178–188, DOI 10.1017/lap.2023.24; a passagem de Eco sobre o traço único, em cópias online do ensaio (conferir no texto da NYRB).
- **Não conferido (acesso bloqueado pelo proxy de rede nesta rodada):** a tabela de médias por partido de Bolognesi et al. ([SciELO](https://scielo.br/j/dados/a/zzyM3gzHD4P45WWdytXjZWg/?format=pdf) e o preprint) e o Dataverse (doi 10.7910/DVN/MFIXKW); a Tabela C1 de Zucco e Power (2024) e as tabelas de Power e Zucco; os pontos ideais de Zucco e Lauderdale. Com esses valores, a régua provisória deve ser refeita e a de Bolognesi et al. conferida.
- **Obras citadas de memória (verificado = false no JSON):** todas as não listadas acima, incluindo *Destra e sinistra*, *Quale socialismo?*, *Teoria generale della politica*, a edição brasileira de Sartori (título provável *A Teoria da Democracia Revisitada*), Mainwaring e Scully (1995), Mainwaring (1999), Laakso e Taagepera (1979), *Os quatro fundamentos...* e *Dados Eleitorais do Brasil* (Nicolau), Zucco (2009), Figueiredo e Limongi, Abranches, Hunter e Power (2019), Hunter (2010), Samuels e Zucco (2018) e o Manifesto Project. Cada obra traz `origem_verificacao` ("busca_rodada_atual" ou "memoria").
- **Fatos a conferir:** a condenação do ex-presidente pelo STF (2025); os atos de 8/1/2023; a saída de União Brasil e PP da base de Lula 3 e a federação "União Progressista" (2025); os 99 deputados do PL em 2022; os dados biográficos dos autores (perfis); votações nominais nos dados abertos da Câmara e do Senado (EC 95/2016, Lei 13.467/2017, EC 103/2019, Lei 14.182/2021). Frases sobre decisões judiciais exigem revisão jurídica, com atenção ao período eleitoral de 2026.

### 7.4 Texto sugerido para o rodapé

> Como ler as réguas. Nenhum dos cientistas políticos citados publicou notas de 0 a 100 para partidos, governos ou ideologias brasileiros. As notas são conversões de escalas publicadas (quando indicadas como publicada), aplicações dos critérios de cada autor a votações, programas e políticas (derivada) ou julgamento do site (estimada). A régua-média é a média simples de seis réguas; a barra clara mostra o menor e o maior valor entre os autores e indica incerteza. A posição mede apenas onde cada ator se situa no eixo esquerda-direita segundo o critério de cada autor: não mede qualidade, desempenho nem grau de democracia. Diferenças menores que 5 a 8 pontos não são conclusivas. O governo Lula 3 está em curso. [Veja o método completo.]

### 7.5 Escopo e assimetria da lista de atores

A lista de atores foi definida no pedido do site e deixa a cauda esquerda povoada (PSTU, PCO e PSOL na faixa de alta intensidade, os dois primeiros sem bancada) e a cauda direita sem partido de pequeno porte equivalente (por exemplo PRTB, DC, PMB e Agir). Há a família "direita radical" e não há "esquerda radical" não comunista; a faixa "Direita de alta intensidade" tem por isso uma única ideologia na régua-média. A assimetria é de escopo, não achado empírico. Se o escopo permitir, acrescentar partidos pequenos da direita ou tirar PSTU e PCO da média; a esquerda radical (March e Mudde) existe como categoria de referência na régua de extremos, sem pontuação própria.

### 7.6 Histórico da revisão (v1.1)

- v1.1 (8/10/2026): aplicadas as correções de três revisões (rigor acadêmico, neutralidade, especificação).
- Eco corrigido (um único traço pode bastar para cristalizar o fascismo); critérios de Sartori e cortes de Bolognesi reatribuídos; Paxton/Gentile e Mudde/March reatribuídos.
- Régua de Power e Zucco renomeada como estimativa provisória do site, sem valores brutos, com atores sem cobertura em branco e fora da média por padrão; a média passa a ter seis réguas.
- Rótulos de método reclassificados por regra objetiva (Nicolau, Votações e Power-Zucco 100% estimadas; PL em Singer e PSD em Sartori estimadas); âncora criada para o centro.
- Notas de Bolognesi marcadas como publicadas não conferidas, com confiança limitada, onda e valor da outra onda; Cidadania 2018 corrigido para 4,93.
- Zonas refeitas: limiares espelhados (100 - x) em todas as réguas, mesmo vocabulário nos dois lados, "direita radical" retirada das zonas numéricas, socialismo real e nazismo em todas as réguas.
- Eixo 2 retirado da ficha de Bobbio e tratado como indicador separado, com rubrica única e sem selo por ator até a conferência.
- Governos: regra única (0,5 partido + 0,5 base + ajuste de políticas limitado a 5 pontos), decomposição exibida; Centrão com composição única.
- Faixas com ids próprios e limites numéricos; arredondamento em direção ao centro; margem por método; textos de aviso unificados.
