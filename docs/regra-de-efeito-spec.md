# Regra de efeito das medidas (nota geral v3)

Pedido do dono (8/10/2026): "uma medida econômica foi feita, mas a economia não melhorou: os pontos daquela medida caem pela metade; se piorou, é anulada. Isso vale para todas as medidas de todas as vertentes. Medidas que não podem ser verificadas caem para 1/4 do valor total."

## 1. Onde a regra entra
Em tudo que pontua uma **medida** adotada por um governo:
- **Feitos** (catálogo LEG): ledger do Placar (Legado) e pilar Feitos e promessas da nota geral (soma dos 5 maiores).
- **Direitos e minorias** (catálogo SOC, 89 medidas, 79 avanços e 10 retrocessos): pilar Direitos e minorias.
Não se aplica a promessas (já são medidas de cumprimento), casos de corrupção, nem a indicadores de resultado.

## 2. Fórmula
Para cada medida `i` de um governo `g`, depois dos fatores que já existiam (estrelas × mérito × "ainda vale hoje" × crédito):

```
pts_efetivo(i, g) = pts(i) · e(i, g)

se a medida foi classificada como não verificável:
    e = F_naoverif                 (padrão 0,25)
senão se tem resultados ligados R(i) com dado em g:
    e = média, sobre r em R(i), de f(status(r, g))
        f(melhorou) = F_melhorou   (padrão 1)
        f(parado)   = F_parado     (padrão 0,5)
        f(piorou)   = F_piorou     (padrão 0)
senão se é verificável por fonte independente:
    e = 1
senão (implementada, mas efeito não medido):
    e = F_naoverif                 (padrão 0,25)
```

`status(r, g)` compara o resultado do indicador `r` no governo `g` com uma referência:
```
d = (x − ref) · (+1 se mais é melhor, −1 se menos é melhor)
tol = 0,10 · |meta − piso|        (10% da largura da faixa de âncoras do indicador)
melhorou: d > tol      parado: |d| ≤ tol      piorou: d < −tol
```
`x` é o valor medido do indicador no governo (o mesmo da nota geral). `ref` = 0 para indicadores de variação; para indicadores de nível (inflação média, desmatamento médio, resultado primário) `ref` = ponto médio entre piso e meta.

Retrocessos (medidas que tiram direitos) recebem o mesmo fator, para a regra ser simétrica: um retrocesso que não se consegue verificar também vale 1/4.

## 3. Classificação das medidas
Cada medida recebe: lista de resultados que ela pretende mover diretamente (0 a 3 dos 18 indicadores do site) e verificabilidade. A classificação foi feita por dois classificadores independentes, cegos a governo e partido, e um juiz que, na dúvida, adota o nível mais conservador igual para todos. O mapa completo é público em "A conta completa".

## 4. Controles do visitante
Interruptor "Regra de efeito" (padrão ligado) e quatro controles de 0 a 1: F_melhorou, F_parado, F_piorou, F_naoverif. Com o interruptor desligado, o site volta a contar as medidas pelo que foram.

## 5. Consequências que o site precisa dizer
- Direitos e minorias: o site não mede resultados por grupo (feminicídio, homicídio por raça etc.), então quase todas as medidas caem para 1/4 ("efeito não medido"). A nota do pilar cai para todos os governos. A saída é acrescentar séries de resultado por grupo.
- A regra mede associação temporal, não causalidade: resultado que melhora no governo pode vir de outros fatores (boom de commodities, ciclo global). O site já divide mérito (campo `m`) e mantém esse ajuste separado.
- Um resultado que piora por choque externo anula a medida mesmo que a medida tenha ajudado. A opção de tirar anos de choque (crise de 2009 e pandemia) continua valendo para o cálculo do resultado.
