import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { actionControllers } from "./actionControllers";
import { getDataControllers } from "./getDataControllers";
import { sequelized } from "./databaseconnect";
import { Stock } from "./model/stock";
import { protfolio } from "./model/protfolio";

let newI; /* timeframe represented  */
const app = createExpressServer({
  controllers: [actionControllers, getDataControllers],
  cors: true
});

var server = require('http').createServer(app);
var io = require('socket.io')(server);
const bodyparser = require("body-parser")
const PORT = process.env.PORT || 3001

// generate the stock for first time 
const generate = async function () {
  let result = await Stock.find()
  if (result === null) {
    const amzonStock = new Stock({ sName: 'AMAZON', openPrice: 1970, currentPrice: 1970, changePercent: 0 })
    await amzonStock.save();
    const cscoStock = new Stock({ sName: 'CSCO', openPrice: 48, currentPrice: 48, changePercent: 0 })
    await cscoStock.save();
    const facebookStock = new Stock({ sName: 'FB', openPrice: 163, currentPrice: 163, changePercent: 0 })
    await facebookStock.save();
    const googStock = new Stock({ sName: 'GOOL', openPrice: 1172, currentPrice: 1172, changePercent: 0 })
    await googStock.save();
    const ebayStock = new Stock({ sName: 'EBAY', openPrice: 35, currentPrice: 35, changePercent: 0 })
    await ebayStock.save();
  }
}

//Realization of the updatePrice 
const NewPrice = async function () {
  let stockDate = await Stock.findAll()
  stockDate.forEach(async element => {
    let factor: number = Math.floor(Math.random() * 20) - 10;
    //Keeping valid price
    if (element.currentPrice + factor < 1) {
      factor = factor * -1
    }
    let rnadonPrice: number = element.currentPrice + factor;
    //let randomPrecent: number = (element.currentPrice - element.openPrice) / element.openPrice
    let randomPrecent: number = (rnadonPrice - element.openPrice) / element.openPrice
    let tempProtfolioStock = await protfolio.findOne({ where: { sName: element.sName } })
    await Stock.update({ currentPrice: rnadonPrice, changePercent: randomPrecent }, { where: { sName: element.sName } })
    if (tempProtfolioStock != null) {
      let newHoldinigValue: number = rnadonPrice * tempProtfolioStock.quantity
      //let newProfit: number = (rnadonPrice * tempProtfolioStock.quantity) - (tempProtfolioStock.totalBuyPrice * tempProtfolioStock.quantity   )
      let newProfit = newHoldinigValue - tempProtfolioStock.totalBuyPrice
      await protfolio.update({ currentPrice: rnadonPrice, holdingValue: newHoldinigValue, profit: newProfit }, { where: { sName: element.sName } })
    }
  })

  const newPrices = await Stock.findAll()
  const newProtfolio = await protfolio.findAll()
  io.emit('price-update', newPrices);
  io.emit('protfolio-update', newProtfolio);
}

sequelized.sync({ force: true }).then(() => {
  generate();
  newI = setInterval(NewPrice, 9900);
  app.use(bodyparser.json())
})
server.listen(PORT, () => {
  console.log('server on')
  io.on('connection', function (client) {
    console.log('client connected')
    client.on('disconnect', function () {
      console.log('client disconnected')
    });
    client.on('change-interval', function (inter) {
    clearInterval(newI);
    newI = setInterval(NewPrice, parseInt(inter));
    })
  });
})
