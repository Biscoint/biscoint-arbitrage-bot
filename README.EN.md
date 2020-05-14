# biscoint-arbitrage-bot

Reference implementation using the Biscoint library for NodeJS.

## How it works?

Biscoint connects you to several brokerages. It is normal that during natural market movements, the price in one broker is cheaper than in another, thus arbitrage.

Arbitrage is the action of buying cheaper at a brokerage and selling at another whose price is better, discounting the fees, this movement should have some profit.

In view of the ease of connecting to several brokers and together with the Biscoint trading API we wrote this small code to exemplify how the use of our wrapper for NodeJS would work together with a simple algorithm and **only for arbitrage testing** .

It is important to note that this code should not be used with high values because it is just an example of how to use our library for NodeJS.

## How to configure the robot


### Requirements

* You'll need to install [docker](https://docs.docker.com/). To install you can follow the official [documentation](https://docs.docker.com/engine/install/ubuntu/).
* You must have a verifed account in the [Biscoint](https://biscoint.io/quick-register)  to create the credentials to be able to interacte with the API.
* Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if don't have it.

### Git clone

Clone the project running the following command:

`git clone https://github.com/Biscoint/biscoint-arbitrage-bot.git`

### Create the access keys

Access the [interface  to obtain the keys of Biscoint](https://biscoint.io/dashboard/API). In case the menu "API" doesn't show, ask to the [support](https://biscoint.io/support) to activate the creation of the keys to your account.

To configure you'll need to provide the values below using  environment variables:


Explaining each configuration item:

- **apiKey** - here you must fill in your api key generated in Biscoint
- **apiSecret** - here you must fill in your secret key generated in Biscoint
- **amount** - here you must enter the amount you want to arbitrate, by default you will arbitrate 0.015 BTC to win reais
- **amountCurrency** - opcional - provide the currency, `'BRL'` or `'BTC'`,  which is defined the parameter `amount`.
- **initialBuy** - in the example the robot always starts buying because it is set here to "true"
- **minProfitPercent** - here is the minimum that the arbitrage must provide profit for the robot to execute it
Example, using  `0.01` so the robot execute arbitrage is equal o greater than 0,01%.
Default value: `0.02`.
- **intervalSeconds** - opcional -The interval in seconds between check of opportunities.
Use `null` to the robot use the less available time allowed by the API.
Default value: `null`. 
- **playSound** - opcional - Use `true` to  play a sound each time happen an arbitrage.
Default value: `false`.
- **simulation** - opcional - Use `true` to run as check mode.
Default value: `false`.
- **executeMissedSecondLeg** - opcional - Use `true` so the robot try again the arbitrage even with loss when the first step run and fail in the second.
 Default value: `true`.

You can leave everything as it is and just provide your key and your secret and the robot will try to make any arbitrage that goes above 0.01% profit, trying to increase your balance in brazilian real and always start with a buy offer of 0.015 BTC.

### Running

Inside the the project folder build the image with the command below:

`docker build -t bistcoin:latest .`

Replace the values below with your keys and execute it:

`docker run -itd  -e apiKey=XXXXXX -e apiSecret=XXXXXX bistcoin:latest`
