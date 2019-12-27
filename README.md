# biscoint-arbitrage-bot

Reference implementation of an arbitrage bot using Biscoint Buy.

## Como isso funciona?

O Biscoint conecta você a várias corretoras. É normal que durante movimentos naturais do mercado o preço em uma corretora seja mais barato do que em outro, assim acontecendo arbitragem.

Arbitragem é a ação de comprar mais barato em uma corretora e vender em outra cuja o preço esteja melhor, descontando as taxas essa movimentação deve ter algum lucro.

Tento em vista a facilidade em se conectar a várias corretoras e junto com a API de negociações do Biscoint escrevemos esse pequeno código para exemplificar como funcionaria o uso de nosso wrapper para NodeJS junto com um algorítimo simples e **somente para testes** de arbitragem.

É importante ressaltar que este código não deve ser usado com valores altos devido ser somente um exemplo de como usar a nossa biblioteca para NodeJS.

## Como configurar o robô

Para configurar você deve alterar o arquivo `config.js` conforme vamos mostrar abaixo:

```JavaScript
export default {
  apiKey: "qw8e4q6",
  apiSecret: "d8fg9d",
  amount: 0.1,
  base: "BTC",
  initialBuy: true,
  minProfitPercent: 0.01
};
```
