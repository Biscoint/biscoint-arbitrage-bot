# biscoint-arbitrage-bot

Implementação de referência usando a biblioteca do Biscoint para NodeJS.

_Não utilize esse código em produção para valores significativos!!_

## Como isso funciona?

O Biscoint conecta você a várias corretoras. É normal que durante movimentos naturais do mercado o preço de compra em uma corretora seja mais barato que o preço de venda em outra, gerando assim uma oportunidade de fazer o que chamamos de arbitragem.

Arbitragem é a ação de comprar mais barato em uma corretora e vender mais caro outra. Descontando as taxas essa movimentação deve resultar em lucro para o operador.

Tendo em vista a facilidade em se conectar a várias corretoras e utilizando a API de negociações do Biscoint, escrevemos esse pequeno código para exemplificar o uso de nosso wrapper para NodeJS junto com um algorítmo simples e **somente para testes** de arbitragem.

É importante ressaltar que este código não deve ser usado com valores altos, já que se trata meramente de um exemplo de como usar a biblioteca para NodeJS do Biscoint.

## Rodando

### Pré-requisitos
Você precisa ter o NodeJS e o NPM instalados. Para instalá-los, recomendamos usar o [nvm](https://github.com/nvm-sh/nvm) no Linux/MacOS ou o [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) no Windows. Recomendamos NodeJS 12 ou superior.

### Baixe o projeto

##### Método 1: Baixe e extraia

Baixe o [arquivo compactado](https://github.com/Biscoint/biscoint-arbitrage-bot/archive/master.zip) deste projeto, e extraia-o em uma pasta à sua escolha.

##### Método 2: Git clone

Se você tem o git instalado, baixe o projeto com o comando abaixo:

`git clone https://github.com/Biscoint/biscoint-arbitrage-bot.git`

### Configure

Para configurar você deve alterar o arquivo `config.js` conforme vamos mostrar abaixo:

```JavaScript
export default {
  apiKey: "qw8e4q6",
  apiSecret: "d8fg9d",
  amount: 0.015,
  profitCurrency: "BRL",
  initialBuy: true,
  minProfitPercent: 0.01
};
```

Explicando cada ítem de configuração:

- **apiKey** - aqui você deve preencher com sua chave de api gerada no Biscoint
- **apiSecret** - aqui você deve preencher com sua chave secreta gerada no Biscoint
- **amount** - aqui você deverá colocar o valor que quer arbitrar, como padrão você irá arbitrar 0.015 BTC para ganhar reais
- **profitCurrency** - por padrão aqui será BRL, ou seja, você irá arbitrar para aumentar seu saldo em reais
- **initialBuy** - no exemplo o robô sempre começa comprando por causa que aqui está definido como "true"
- **minProfitPercent** - aqui é o mínimo que a arbitragem deve fornecer de lucro para que o robô a execute

Deixando tudo como está, apenas substituindo sua chave e seu secret o robô tentará fazer toda arbitragem que der acima de 0.01 % de lucro, tentando aumentar seu saldo em reais e sempre começando com uma oferta de compra de 0.015 BTC.

### Rode

No terminal (ou prompt de comando, se estiver no Windows), vá até pasta raiz do projeto.

Antes de executar pela primeira vez, e sempre que atualizar o projeto, execute:

`npm install`

Para executar o robô, execute o comando abaixo:

`npm start`
