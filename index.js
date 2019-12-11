import Biscoint from "biscoint-api-node";

const bc = new Biscoint({
  apiKey: "qwerty",
  apiSecret: "qwerty",
  apiUrl: "http://localhost:3000"
});

const parameters = {
  amount: 50,
  base: "BRL",
  initialBuy: true,
  minProfitPercent: 0.1,
  retry: 1
};

setInterval(async () => {
  try {
    const buyOffer = await bc.offer({
      amount: parameters.amount,
      base: parameters.base,
      op: "buy"
    });

    const sellOffer = retry(
      bc.offer,
      {
        amount: parameters.amount,
        base: parameters.base,
        op: "sell"
      },
      parameters.retry
    );
    const profit = percent(buyOffer.quoteamount, sellOffer.quoteamount);
    if (
      profit >
      parameters.minProfitPercent
    ) {
      try {
        if (parameters.initialBuy) {
          const confirmedBuy = await bc.confirmOffer({
            offerId: buyOffer.offerId
          });

          const confirmedSell = await bc.confirmOffer({
            offerId: sellOffer.offerId
          });

        } else {
          const confirmedSell = await bc.confirmOffer({
            offerId: sellOffer.offerId
          });
          const confirmedBuy = await bc.confirmOffer({
            offerId: buyOffer.offerId
          });
        }

        console.log(`Success, profit: + ${profit}`);
      } catch (error) {
        console.log("Error on confirm offer");
        console.log(error);
      }
    }
  } catch (error) {
    console.log("Error on get offer");
    console.error(error);
  }
}, 5 * 1000);

function percent(value1, value2) {
  return (percent = Number(value2) / Number(value1) - 1);
}

function retry(cb, config, tryes) {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i <= tryes; i++) {
      try {
        resolve(cb(config));
      } catch (error) {
        if (i >= tryes) reject(error);
        await sleep(500);
      }
    }
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve(), ms));
}
