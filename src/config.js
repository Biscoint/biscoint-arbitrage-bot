import fs from 'fs';
import _ from 'lodash';


const config = {
  apiKey: null,
  apiSecret: null,
  amount: 100,
  amountCurrency: 'BRL',
  initialBuy: true,
  minProfitPercent: 0.02,
  // specify null to let the bot calculate the minimum allowed interval
  intervalSeconds: null,
  playSound: false,
  simulation: false,
  executeMissedSecondLeg: true,
};

try {
  _.merge(config, JSON.parse(fs.readFileSync(
    `./config.json`,
  )));
} catch (err) {
  console.log('[INFO] Could not read config.json file.', err);
}

export default config;
