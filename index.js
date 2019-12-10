import Biscoint from "biscoint-api-node";

const bc = new Biscoint({
  apiKey: "qwerty",
  apiSecret: "qwerty"
});

const parameters = {
  amount: 50,
  base: "BRL",
  initialBuy: true
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
    if (buyOffer.quote < sellOffer.quote) {
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