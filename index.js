import Biscoint from "biscoint-api-node";
import config from "./config.js";

function percent(value1, value2) {
  return Number(value2) / Number(value1) - 1;
}
const bc = new Biscoint({
  apiKey: config.apiKey,
  apiSecret: config.apiSecret
});

const parameters = {
  amount: config.amount,
  base: config.base,
  initialBuy: config.initialBuy,
  minProfitPercent: config.minProfitPercent
};

let lastTrade = 0;

setInterval(async () => {
  try {
    const buyOffer = await bc.offer({
      amount: parameters.amount,
      isQuote: parameters.profitCurrency === "BTC",
      op: "buy"
    });

    await sleep(200);

    const sellOffer = await bc.offer({
      amount: parameters.amount,
      isQuote: parameters.profitCurrency === "BTC",
      op: "sell"
    });

    const profit = percent(buyOffer.efPrice, sellOffer.efPrice);
    handleMessage(`Calculated profit: ${profit.toFixed(2)}%`);
    if (
      profit > parameters.minProfitPercent &&
      Date.now() - 15 * 1000 >= lastTrade
    ) {
      try {
        if (parameters.initialBuy) {
          const confirmedBuy = await bc.confirmOffer({
            offerId: buyOffer.offerId
          });

          await sleep(500);

          const confirmedSell = await bc.confirmOffer({
            offerId: sellOffer.offerId
          });
        } else {
          const confirmedSell = await bc.confirmOffer({
            offerId: sellOffer.offerId
          });

          await sleep(500);

          const confirmedBuy = await bc.confirmOffer({
            offerId: buyOffer.offerId
          });
        }
        lastTrade = Date.now();
        handleMessage(`Success, profit: + ${profit.toFixed(2)}%`);
      } catch (error) {
        handleMessage("Error on confirm offer", "error");
        console.log(error);
      }
    }
  } catch (error) {
    handleMessage("Error on get offer", "error");
    console.error(error);
  }
}, 5 * 1000);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve(), ms));
}

function handleMessage(message, level = "info") {
  console.log(`[Biscoint BOT] [${level}] - ${message}`);
}
