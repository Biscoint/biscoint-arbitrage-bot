import Biscoint from 'biscoint-api-node';
import _ from 'lodash';
import config from './config.js';

// read the configurations
let {
  apiKey, apiSecret, amount, amountCurrency, initialBuy, minProfitPercent, intervalSeconds,
} = _.merge({
  amount: 0.01,
  amountCurrency: 'BRL',
  initialBuy: true,
  minProfitPercent: 0.01,
  intervalSeconds: null,
}, config);

let bc, lastTrade = 0, isQuote;

const init = () => {
  if (!apiKey) {
    handleMessage('You must specify "apiKey" in config.js', 'error', true);
  }
  if (!apiSecret) {
    handleMessage('You must specify "apiSecret" in config.js', 'error', true);
  }

  amountCurrency = _.toUpper(amountCurrency);
  if (!['BRL', 'BTC'].includes(amountCurrency)) {
    handleMessage('"amountCurrency" must be either "BRL" or "BTC". Check your config.js file.', 'error', true);
  }

  if (isNaN(amount)) {
    handleMessage(`Invalid amount "${amount}. Please specify a valid amount in config.js`, 'error', true);
  }

  isQuote = amountCurrency === 'BRL';

  bc = new Biscoint({
    apiKey: config.apiKey,
    apiSecret: config.apiSecret
  });
};

const checkBalances = async () => {
  const { BRL, BTC } = await bc.balance();

  handleMessage(`Balances:  BRL: ${BRL} - BTC: ${BTC} `);

  const nAmount = Number(amount);
  let amountBalance = initialBuy ? BRL : BTC;
  if (nAmount > Number(amountBalance)) {
    handleMessage(
      `Amount ${amount} is greater than the user's ${initialBuy ? 'BRL' : 'BTC'} balance of ${amountBalance}`,
      'error',
      true,
    );
  }
};

const checkInterval = async () => {
  const { endpoints } = await bc.meta();
  const { windowMs, maxRequests } = endpoints.offer.get.rateLimit;
  handleMessage(`Offer Rate limits: ${maxRequests} request per ${windowMs}ms.`);
  let minInterval = 2 * windowMs / maxRequests / 1000;

  if (!intervalSeconds) {
    intervalSeconds = minInterval;
    handleMessage(`Setting interval to ${intervalSeconds}s`);
  } else if (intervalSeconds < minInterval) {
    handleMessage(`Interval too small (${intervalSeconds}s). Must be higher than ${minInterval.toFixed(1)}s`, 'error', true);
  }
};

async function tradeCycle() {
  try {
    const buyOffer = await bc.offer({
      amount,
      isQuote,
      op: 'buy',
    });

    await sleep(200);

    const sellOffer = await bc.offer({
      amount,
      isQuote,
      op: 'sell',
    });

    const profit = percent(buyOffer.efPrice, sellOffer.efPrice);
    handleMessage(`Calculated profit: ${profit.toFixed(3)}%`);
    if (
      profit >= minProfitPercent
    ) {
      try {
        let firstOffer, secondOffer;

        if (initialBuy) {
          firstOffer = buyOffer;
          secondOffer = sellOffer;
        } else {
          firstOffer = sellOffer;
          secondOffer = buyOffer;
        }

        await bc.confirmOffer({
          offerId: firstOffer.offerId,
        });

        await sleep(500);

        await bc.confirmOffer({
          offerId: secondOffer.offerId,
        });

        lastTrade = Date.now();

        handleMessage(`Success, profit: + ${profit.toFixed(3)}%`);
      } catch (error) {
        handleMessage('Error on confirm offer', 'error');
        console.error(error);
      }
    }
  } catch (error) {
    handleMessage('Error on get offer', 'error');
    console.error(error);
  }
}

const startTrading = async () => {
  handleMessage('Starting trades');
  await tradeCycle();
  setInterval(tradeCycle, intervalSeconds * 1000);
};

// -- UTILITY FUNCTIONS --

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve(), ms));
}

function percent(value1, value2) {
  return Number(value2) / Number(value1) - 1;
}

function handleMessage(message, level = 'info', throwError = false) {
  console.log(`[Biscoint BOT] [${level}] - ${message}`);
  if (throwError) {
    throw new Error(message);
  }
}

async function start() {
  handleMessage('initing');
  init();
  handleMessage('checking balances');
  await checkBalances();
  handleMessage('checking interval');
  await checkInterval();
  handleMessage('start trading');
  await startTrading();
}

start();
