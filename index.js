import Biscoint from "biscoint-api-node";

function percent(value1, value2) {
  return Number(value2) / Number(value1) - 1;
}
const bc = new Biscoint({
  apiKey: "c59989c1318c3d93140ceddc596d3fe04c5d24e67d30e31b443c778321ba0b8c",
  apiSecret: "57a45ee483891e19f63d468d00b688fa476978ca3160dcdf3ee49f7cb19b3f0d",
  apiUrl: "http://localhost:3000"
});

const parameters = {
  amount: 500,
  base: "BRL",
  initialBuy: true,
  minProfitPercent: 0.01,
  retry: 1
};

setInterval(async () => {
  try {
    const buyOffer = await bc.offer({
      amount: parameters.amount,
      base: parameters.base,
      op: "buy"
    });

    const sellOffer = await bc.offer({
      amount: parameters.amount,
      base: parameters.base,
      op: "sell"
    });

    const profit = percent(buyOffer.efPrice, sellOffer.efPrice);
    console.log(profit);
    if (profit > parameters.minProfitPercent) {
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

        console.log(`Success, profit: + ${profit.toFixed(2)}%`);
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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve(), ms));
}
