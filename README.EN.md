# biscoint-arbitrage-bot

Reference implementation using the Biscoint library for NodeJS.

## How it works?

Biscoint connects you to several brokerages. It is normal that during natural market movements, the price in one broker is cheaper than in another, thus arbitrage.

Arbitrage is the action of buying cheaper at a brokerage and selling at another whose price is better, discounting the fees, this movement should have some profit.

In view of the ease of connecting to several brokers and together with the Biscoint trading API we wrote this small code to exemplify how the use of our wrapper for NodeJS would work together with a simple algorithm and **only for arbitrage testing** .

It is important to note that this code should not be used with high values because it is just an example of how to use our library for NodeJS.

## How to configure the robot

To configure you must change the file `config.js` as we will show below:

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

Explaining each configuration item:

- **apiKey** - here you must fill in your api key generated in Biscoint
- **apiSecret** - here you must fill in your secret key generated in Biscoint
- **amount** - here you must enter the amount you want to arbitrate, by default you will arbitrate 0.015 BTC to win reais
- **profitCurrency** - by default here will be BRL, that is, you will arbitrate to increase your balance in reais
- **initialBuy** - in the example the robot always starts buying because it is set here to "true"
- **minProfitPercent** - here is the minimum that the arbitrage must provide profit for the robot to execute it

Leaving everything as it is, just replacing your key and your secret, the robot will try to make any arbitrage that goes above 0.01% profit, trying to increase your balance in brazilian real and always starting with a buy offer of 0.015 BTC.