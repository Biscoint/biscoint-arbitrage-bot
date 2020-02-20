import Biscoint from 'biscoint-api-node';
import _ from 'lodash';
import player from 'play-sound';
import config from './config.js';

// read the configurations
let {
  apiKey, apiSecret, amount, amountCurrency, initialBuy, minProfitPercent, intervalSeconds, playSound, simulation,
} = config;

// global variables
let bc, lastTrade = 0, isQuote, balances;

// Initializes the Biscoint API connector object.
const init = () => {
  if (!apiKey) {
    handleMessage('You must specify "apiKey" in config.json', 'error', true);
  }
  if (!apiSecret) {
    handleMessage('You must specify "apiSecret" in config.json', 'error', true);
  }

  amountCurrency = _.toUpper(amountCurrency);
  if (!['BRL', 'BTC'].includes(amountCurrency)) {
    handleMessage('"amountCurrency" must be either "BRL" or "BTC". Check your config.json file.', 'error', true);
  }

  if (isNaN(amount)) {
    handleMessage(`Invalid amount "${amount}. Please specify a valid amount in config.json`, 'error', true);
  }

  isQuote = amountCurrency === 'BRL';

  bc = new Biscoint({
    apiKey: config.apiKey,
    apiSecret: config.apiSecret
  });
};

// Checks that the balance necessary for the first operation is sufficient for the configured 'amount'.
const checkBalances = async () => {
  balances = await bc.balance();
  const { BRL, BTC } = balances;

  handleMessage(`Balances:  BRL: ${BRL} - BTC: ${BTC} `);

  const nAmount = Number(amount);
  let amountBalance = isQuote ? BRL : BTC;
  if (nAmount > Number(amountBalance)) {
    handleMessage(
      `Amount ${amount} is greater than the user's ${isQuote ? 'BRL' : 'BTC'} balance of ${amountBalance}`,
      'error',
      true,
    );
  }
};

// Checks that the configured interval is within the allowed rate limit.
const checkInterval = async () => {
  const { endpoints } = await bc.meta();
  const { windowMs, maxRequests } = endpoints.offer.post.rateLimit;
  handleMessage(`Offer Rate limits: ${maxRequests} request per ${windowMs}ms.`);
  let minInterval = 2 * windowMs / maxRequests / 1000;

  if (!intervalSeconds) {
    intervalSeconds = minInterval;
    handleMessage(`Setting interval to ${intervalSeconds}s`);
  } else if (intervalSeconds < minInterval) {
    handleMessage(`Interval too small (${intervalSeconds}s). Must be higher than ${minInterval.toFixed(1)}s`, 'error', true);
  }
};

// Executes an arbitrage cycle
async function tradeCycle() {
  try {
    const buyOffer = await bc.offer({
      amount,
      isQuote,
      op: 'buy',
    });

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
      let firstOffer, secondOffer, firstLeg, secondLeg;
      try {
        if (initialBuy) {
          firstOffer = buyOffer;
          secondOffer = sellOffer;
        } else {
          firstOffer = sellOffer;
          secondOffer = buyOffer;
        }

        if (simulation) {
          handleMessage('Would execute arbitrage if simulation mode was not enabled');
        } else {
          firstLeg = await bc.confirmOffer({
            offerId: firstOffer.offerId,
          });

          secondLeg = await bc.confirmOffer({
            offerId: secondOffer.offerId,
          });
        }

        lastTrade = Date.now();

        handleMessage(`Success, profit: + ${profit.toFixed(3)}%`);
        play();
      } catch (error) {
        handleMessage('Error on confirm offer', 'error');
        console.error(error);

        if (firstLeg && !secondLeg) {
          // probably only one leg of the arbitrage got executed, we have to accept loss and rebalance funds.
          try {
            // first we ensure the leg was not actually executed
            let secondOp = initialBuy ? 'sell' : 'buy';
            const trades = await bc.trades({ op: secondOp });
            if (_.find(trades, t => t.offerId === secondOffer.offerId)) {
              handleMessage('The second leg was executed despite of the error. Good!');
              return;
            } else {
              handleMessage(
                'Only the first leg of the arbitrage was executed. Trying to execute it at a possible loss.');
            }
            secondLeg = await bc.offer({
              amount,
              isQuote,
              op: secondOp,
            });
            await bc.confirmOffer({
              offerId: secondLeg.offerId,
            });
            handleMessage('The second leg was executed and the balance was normalized');
          } catch (error) {
            handleMessage('Fatal error. Unable to recover from incomplete arbitrage. Exiting.', 'fatal');
            await sleep(500);
            process.exit(1);
          }
        }
      }
    }
  } catch (error) {
    handleMessage('Error on get offer', 'error');
    console.error(error);
  }
}

// Starts trading, scheduling trades to happen every 'intervalSeconds' seconds.
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
  return (Number(value2) / Number(value1) - 1) * 100;
}

function handleMessage(message, level = 'info', throwError = false) {
  console.log(`[Biscoint BOT] [${level}] - ${message}`);
  if (throwError) {
    throw new Error(message);
  }
}

const sound = playSound && player();

const play = () => {
  if (playSound) {
    sound.play('./tone.mp3', (err) => {
      if (err) console.log(`Could not play sound: ${err}`);
    });
  }
};

// performs initialization, checks and starts the trading cycles.
async function start() {
  init();
  await checkBalances();
  await checkInterval();
  await startTrading();
}

start().catch(e => handleMessage(JSON.stringify(e), 'error'));
