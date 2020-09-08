# biscoint-arbitrage-bot

Implementação de referência que exemplifica o uso da biblioteca do Biscoint para NodeJS, [biscoint-api-node](https://github.com/Biscoint/biscoint-api-node), para verificar a existência de oportunidades de arbitragem e executá-las.

_**Não utilize esse código em produção para valores significativos!!**_

## Como funciona?

O Biscoint conecta você a várias corretoras. É normal que durante movimentos naturais do mercado o preço de compra em uma corretora seja mais barato que o preço de venda em outra, gerando assim uma oportunidade de fazer o que chamamos de arbitragem.

Arbitragem é a ação de comprar mais barato em uma corretora e vender mais caro outra. Descontando as taxas essa movimentação deve resultar em lucro para o operador.

Tendo em vista a facilidade em se conectar a várias corretoras e utilizando a API de negociações do Biscoint, escrevemos esse pequeno código para exemplificar o uso de nosso wrapper para NodeJS junto com um algorítmo simples e **somente para testes** de arbitragem.

É importante ressaltar que este código não deve ser usado com valores altos, já que se trata meramente de um exemplo de como usar a biblioteca para NodeJS do Biscoint.

## Rodando

### Pré-requisitos
* Você precisa ter o [docker](https://docs.docker.com/) instalado. Para instalar, recomendamos usar a documentação [oficial](https://docs.docker.com/engine/install/ubuntu/).
* Será necessária uma conta verificada no [Biscoint](https://biscoint.io/quick-register) para gerar as chaves de API.
* Instale o [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

### Git clone

Clone o projeto com comabaixo abaixo:

`git clone https://github.com/Biscoint/biscoint-arbitrage-bot.git`

### Gere as chaves de API

Acesse a [interface para geração de chaves do Biscoint](https://biscoint.io/dashboard/API). Caso o menu "API" não apareça, solicite ao [suporte](https://biscoint.io/support) que ative a geração de chaves para sua conta.

Não feche o popup com a chave e o segredo, eles não serão exibidos novamente. Você os informará no arquivo de configuração descrito no próximo passo.

### Configure

Informe suas configurações passando como variaveis de ambiente.

Explicando cada item da configuração:

- **apiKey** - obrigatório - informe sua chave de api gerada no Biscoint.
- **apiSecret** - obrigatório - informe sua chave secreta gerada no Biscoint.
- **amount** - opcional - informe o valor das operações individuais de compra e venda, na moeda especificada no parâmetro `amountCurrency`.
 Por exemplo, se quer que as operações sejam de 100 reais, especifique `amount: 100` e `amountCurrency: 'BRL'`.
 Valor padrão: 100.
- **amountCurrency** - opcional - informe a moeda, `'BRL'` ou `'BTC'`, em que está especificada a quantidade (parâmetro `amount`).
Observe que o seu eventual lucro de arbitragem será acumulado na moeda oposta, ou seja, se especificar `'BRL'`, seu lucro
será acumulado em BTC, e se especificar `'BTC'`, seu lucro será acumulado em BRL.
Valor padrão: `'BRL'`. 
- **initialBuy** - opcional - informe `true` para que o robô execute primeiro compra e depois venda, `false` para que execute
primeiro venda depois compra. Se o seu saldo inicial está em reais, use `true`, se está em BTC, use `false`.
Valor padrão: `true`.
- **minProfitPercent** - informe o lucro mínimo potencial, em percentual, para que o robô tente executar a arbitragem.
Por exemplo, informe `0.01` para que o robô execute arbitragem sempre que o lucro potencial seja igual ou maior a 0,01%.
Valor padrão: `0.02`.
- **intervalSeconds** - opcional - o intervalo, em segundos, entre verificações de oportunidade de arbitragem.
Informe `null` para que o robô calcule o menor intervalo permitido pela API.
Valor padrão: `null`. 
- **playSound** - opcional - informe `true` para que o robô toque um som sempre que uma arbitragem for executada.
- **simulation** - opcional - informe `true` para rodar em modo simulação, em que as operações de compra e venda não são de fato executadas.
Valor padrão: `false`.
- **executeMissedSecondLeg** - opcional - informe `true` para que o robô tente executar a segunda perna da arbitragem
mesmo com prejuízo, quando ocorrer da primeira perna ser executada e a segunda falhar. Valor padrão: `true`.

Deixando tudo como está, apenas substituindo sua chave e seu secret, o robô tentará executar toda arbitragem que resultar
em lucro maior que 0,02%, tentando aumentar seu saldo em bitcoins e sempre começando com uma oferta de compra de R$100,00.

### Rode

Dentro da pasta raiz do projeto `builde` a imagem com o comando abaixo:

`docker build -t bistcoin:latest .`

No terminal (ou prompt de comando, se estiver no Windows), substitua os valores abaixo com suas respectivas credenciais e execute:

`docker run -itd  -e apiKey=XXXXXX -e apiSecret=XXXXXX bistcoin:latest`
