# Nota geral v2: modelo de pesos com âncoras fixas

Versão de trabalho (8/10/2026). Substitui o cálculo anterior da Nota geral (hexágono da página Início).

## 1. Por que mudar

O modelo anterior tinha dois problemas que o dono do site apontou ("quase tudo zerado" e "tanto desconto"):

1. **Normalização relativa.** Cada indicador era convertido para 0–10 entre o pior e o melhor dos 8 governos da amostra: `s = 10·(x − min)/(max − min)`. Por construção, sempre havia um governo com 0 e outro com 10 em cada indicador, mesmo quando o resultado absoluto era razoável. A nota não dizia "quão bom", só "melhor ou pior que os outros sete". Exemplo: Direitos e minorias dava 0 a FHC, Lula 2, Dilma 2 e Temer em Mulheres, e 10 a Lula 1/Lula 3 em cinco dos seis grupos.
2. **Corrupção como desconto subtrativo.** `nota = max(0, média dos pilares − desconto)`, com `desconto = 0,3·corr + 1,5·max(0,50−WGI)/50` (até 10 pontos). Governos com muitos casos caíam a perto de zero (Bolsonaro: 5,29 → 1,83; Dilma 2: 2,74 → 1,57), e o desconto não tinha peso editável, só um coeficiente.

## 2. O modelo

Notação: governo `g`, indicador `i`, pilar `k`.

### 2.1 Nota de indicador (0 a 10), âncoras fixas
```
z_gi = (x_gi − piso_i) / (meta_i − piso_i)
s_gi = 10 · min(1, max(0, z_gi))
```
`piso_i` é o valor que vale 0; `meta_i` o que vale 10. Se o indicador é "quanto menor, melhor", `meta < piso` e a mesma fórmula serve. Âncoras vêm de referências externas (metas legais, ODS, histórico) e **não dependem dos governos comparados**. Indicador sem dado sai do pilar (os pesos dos demais são renormalizados), nunca entra como 0.

### 2.2 Nota de pilar (0 a 10)
```
P_gk = Σ_i v_ki · s_gi / Σ_i v_ki      (somente indicadores com dado)
```
`v_ki`: peso do indicador dentro do pilar (padrão 1 para todos; editável nas páginas de cada pilar).

### 2.3 Pilar Direitos e minorias
`pts_g,grupo` = soma dos pontos das medidas do catálogo (mulheres, população negra, indígenas e quilombolas, PcD, LGBT+, idosos/crianças), já com os fatores do site (origem da medida, o que ainda vale hoje, retrocessos).
```
s_g,grupo = 10 · clamp( (pts − (−meta_grupo/2)) / (meta_grupo − (−meta_grupo/2)) )
P_soc = Σ_grupo v_grupo · s / Σ v_grupo
```
Sem medida registrada (0 pontos) vale 3,33, não zero: ausência de registro não prova retrocesso. `meta_grupo` = 1,25 × melhor valor do catálogo, arredondado a 0,5 (única âncora sem referência externa; declarada como tal).
Depois entra o multiplicador de força (2.6): `P_soc' = min(10, m_g · P_soc)`.

### 2.4 Pilar Integridade (novo; substitui o desconto)
```
c_g = corr_g / dur_g                    (pontos por ano de governo; 1 ponto = R$ 1 bi ponderado pela prova, mais casos sem valor em R$ por gravidade)
S_c = 10 · (1 − min(1, c_g / c_piso))   c_piso = 4 pontos por ano
S_w = âncora(WGI_g; piso 25, meta 75)   (controle da corrupção, Banco Mundial, média dos anos de governo, escala 0–100)
P_int = (u_c · S_c + u_w · S_w) / (u_c + u_w)     u_c = 0,7 ; u_w = 0,3
```
A duração entra para que mandatos curtos (Dilma 2, 1,36 ano) e longos (4 anos) sejam comparáveis. A corrupção deixa de subtrair da nota geral: passa a ser um pilar com peso próprio, visível, editável e que nunca zera sozinho a nota.

### 2.5 Pilar Feitos e promessas
```
S_leg = âncora(L_g; piso 0, meta 12)    (L_g = soma dos 5 maiores feitos que seguem valendo, em pontos de estrela)
S_pro = 5 · (1 + net_g / n_g)           (0 a 10; net = soma dos fatores das promessas: cumprida +1, em parte 0 ou +0,5, não cumprida −1, conforme PST)
P_prl = min(10, m_g · (S_leg + S_pro)/2)
```

### 2.6 Multiplicador de força política (já existia; agora exposto como fórmula)
```
F_g = (w_cam·cam_g/100 + w_sen·sen_g/100 + w_stf·stf_g/11) / (w_cam + w_sen + w_stf)
m_g = (F̄ / F_g)^κ          κ = 0,25 ; F̄ = média de F entre os governos
```
Vale só para Direitos e minorias e Feitos e promessas. Com κ = 0,25, m varia de 0,97 a 1,13.

### 2.7 Nota geral
```
N_g = Σ_k W_k · P_gk / Σ_k W_k          (pilares com dado)
```
Sem desconto, sem piso extra, sem teto. Escala 0–10.
`PT, todos` = média dos governos do PT ponderada pela duração (`dur`).

### 2.8 Pesos padrão dos pilares (W_k, soma 100)
| Pilar | W | Razão |
|---|---|---|
| Economia | 18 | efeito direto na renda e no emprego |
| Serviços públicos | 18 | saúde, segurança, educação: efeito direto na vida |
| Pobreza e desigualdade | 14 | resultado social central |
| Contas para o futuro | 14 | sustentabilidade fiscal e dívida herdada (antes pesava o dobro de cada outro pilar) |
| Integridade | 12 | substitui o desconto de corrupção: peso explícito |
| Direitos e minorias | 10 | cobertura de dados menor (catálogo de medidas) |
| Meio ambiente | 8 | um indicador-chave (desmatamento) |
| Feitos e promessas | 6 | componente mais subjetivo, parcialmente contado nos outros pilares |

## 3. Âncoras (piso → 0, meta → 10)
Os valores dos indicadores são variações médias por ano de governo (exceto onde indicado), como já calculados pelo site.

| Pilar | Indicador | Unidade | Piso | Meta | Referência da âncora |
|---|---|---|---|---|---|
| Economia | PIB por pessoa | % ao ano | −5 | +3 | meta: ritmo que dobra a renda em ~24 anos; piso: abaixo da pior recessão do período (2015–16, −4,3) |
| Economia | Renda das famílias | % ao ano | −5 | +4 | idem, com meta maior por ser renda medida em pesquisa |
| Economia | Salário mínimo real | % ao ano | −1 | +5 | meta: dobra em ~14 anos; piso: perda real |
| Economia | Inflação | % ao ano | 12 | 3 | meta: centro da meta do CMN (3%); piso: quase 3× o teto da banda |
| Economia | Desemprego | pontos por ano | +2 | −1 | meta: queda de 1 ponto ao ano |
| Economia | Carga tributária | pontos do PIB por ano | +0,6 | −0,1 | direção "menor é melhor" é posição do site; peso editável (declarado) |
| Pobreza | Gini | pontos por ano | +0,4 | −0,8 | meta: ritmo máximo sustentado do período 2003–2010 |
| Pobreza | Pobreza extrema | % ao ano (variação relativa) | +10 | −10 | simétrica |
| Serviços | Homicídios | por 100 mil, por ano | +1,0 | −1,5 | meta: queda compatível com a meta 16.1 dos ODS |
| Serviços | Mortalidade infantil | % ao ano | 0 | −5 | meta: queda de 5% ao ano; piso: sem melhora |
| Serviços | Expectativa de vida | anos por ano | 0 | +0,4 | meta: ritmo de países que convergem |
| Serviços | Ideb | pontos por ano | 0 | +0,15 | meta: acima do ritmo do PNE |
| Serviços | Pisa | pontos por ano | −3 | +3 | simétrica |
| Ambiente | Desmatamento médio (Amazônia) | km² por ano | 30 000 | 4 000 | meta: piso histórico recente (2012: 4,6 mil); piso: máximo da série (1995/2004) |
| Ambiente | Tendência do desmatamento | % ao ano | +10 | −10 | simétrica |
| Futuro | Dívida bruta | pontos do PIB por ano | +4 | −2 | |
| Futuro | Dívida líquida | pontos do PIB por ano | +3 | −3 | |
| Futuro | Resultado primário | % do PIB (média) | −2 | +2,5 | meta: superávit que estabiliza a dívida |
| Futuro | Contas deixadas aos sucessores | R$ bi de 2026 | 500 | 0 | piso: acima do maior valor observado (422) |
| Integridade | Pontos de corrupção por ano | R$ bi ponderados por ano | 4 | 0 | piso: ~1,5× o pior observado (2,6) |
| Integridade | WGI controle da corrupção | percentil 0–100 | 25 | 75 | faixa interquartil em torno da mediana |
| Direitos | Pontos por grupo | pontos | −meta/2 | meta (2,5 a 8) | 1,25× melhor do catálogo; sem referência externa |
| Feitos | Pontos de legado (5 maiores) | pontos | 0 | 12 | |

## 4. Resultado do protótipo (pesos padrão; Python em `docs/` não, em scratchpad)
| Governo | Nota v1 | Nota v2 |
|---|---|---|
| Lula 1 | 5,03 | 7,45 |
| Lula 2 | 5,50 | 7,82 |
| Dilma 1 | 4,01 | 6,40 |
| Dilma 2 | 1,57 | 3,40 |
| Bolsonaro | 1,83 | 5,49 |
| Lula 3 | 5,31 | 6,82 |
| PT, todos | 4,69 | 6,83 |

A diferença PT (todos) − Bolsonaro cai de 2,86 para 1,34. Isso vem de trocar o desconto subtrativo por um pilar com peso de 12%: é uma consequência do desenho e precisa ficar explícita para o público.

## 5. O que o dono do site pediu
- "Esquema com pesos": pesos explícitos em todos os níveis (indicador, pilar, componentes da integridade, multiplicador).
- "Hoje está quase tudo zerado e tanto desconto": âncoras fixas (sem 0 e 10 forçados) e fim do desconto subtrativo.
- "Cálculo matemático exposto no final com todas as variáveis": seção pública "A conta completa" na página Como calculamos, gerada a partir das mesmas constantes que o site usa no cálculo.
