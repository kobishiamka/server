
import "reflect-metadata";
import { Controller, Param, Body, Get, Post, Put, Delete, Res } from "routing-controllers";
import { Response } from 'express'
import { protfolio } from "./model/protfolio";
import { history } from "./model/history";


@Controller()
export class actionControllers {

  //Realization of the buy function
  @Post("/buy")
  async buy(@Body() body: any, @Res() res: Response) {
    let notInProtfolio: boolean = true;
    const tempTotalBuyPrice: number = parseInt(body.currentPrice) * parseInt(body.quantity)
    const tempHoldingValue: number = parseInt(body.quantity) * parseInt(body.currentPrice)
    const tempProfit: number = 0
    //handel strengthening stock scenario
    let result = await protfolio.find({ where: { sName: body.sName } })
    if (result != null) {
      notInProtfolio = false
      let newQuantity: number = (parseInt(body.quantity) + result.quantity)
      let newTotalBuyPrice: number = (result.totalBuyPrice + (parseInt(body.quantity) * parseInt(body.currentPrice)))
      
      let newHoldinigValue: number = newQuantity * parseInt(body.currentPrice)
      let newProfit: number = (newHoldinigValue) - (newTotalBuyPrice)
      protfolio.update({ currentPrice: body.currentPrice, quantity: newQuantity, totalBuyPrice: newTotalBuyPrice, holdingValue: newHoldinigValue, profit: newProfit }, { where: { sName: body.sName } })

    }

    //handel scenario of new stock in protfolio 
    if (notInProtfolio) {
      const newStockinProtfolio = new protfolio({ sName: body.sName, currentPrice: parseInt(body.currentPrice), quantity: parseInt(body.quantity), totalBuyPrice: tempTotalBuyPrice, holdingValue: tempHoldingValue, profit: tempProfit })
      newStockinProtfolio.save();
    }
    //update history table BUY mode
    const newStockinHistoryUpdate = new history({ action: 'BUY', sName: body.sName, totalBuyPrice: tempTotalBuyPrice, quantity: body.quantity, log: body.log })
    await newStockinHistoryUpdate.save();
    return res.send(body)
  }

  @Post("/sell")
  async sell(@Body() body: any, @Res() res: Response) {
    let crossLimit: boolean = false
    const tempTotalBuyPrice: number = parseInt(body.currentPrice) * parseInt(body.quantity)
    let result = await protfolio.find({ where: { sName: body.sName } })
    let profitPerIter: number = ( result.profit / result.quantity) * body.quantity
    
    if (result != null) {
      if (result.quantity === parseInt(body.quantity)) {
        protfolio.destroy({ where: { sName: body.sName } })
        const newStockinHistoryUpdate = new history({ action: 'SELL', sName: body.sName, totalBuyPrice: tempTotalBuyPrice, quantity: body.quantity, log: body.log ,ppi: profitPerIter})
        await newStockinHistoryUpdate.save();
      }
      if (result.quantity > parseInt(body.quantity)) {
        let newCurrentPrice: number = parseInt(body.currentPrice)
        let newQuantity: number = (result.quantity - parseInt(body.quantity))
        let newTotalBuyPrice = ( result.totalBuyPrice / result.quantity ) * newQuantity
        let newHoldinigValue: number = (newQuantity * newCurrentPrice)
        let newProfit: number = newHoldinigValue - newTotalBuyPrice
        protfolio.update({ currentPrice: newCurrentPrice, quantity: newQuantity, totalBuyPrice: newTotalBuyPrice, holdingValue: newHoldinigValue, profit: newProfit }, { where: { sName: body.sName } })
        const newStockinHistoryUpdate = new history({ action: 'SELL', sName: body.sName, totalBuyPrice: tempTotalBuyPrice, quantity: body.quantity, log: body.log , ppi: profitPerIter})
        await newStockinHistoryUpdate.save();
      }
      if (result.quantity < parseInt(body.quantity)) {
        console.log("ERROR : You do not have enough shares in the portfolio ")
        const newStockinHistoryUpdate = new history({ action: 'SELL FAILURE', sName: body.sName, totalBuyPrice: 0, quantity: 0, log: 'ERROR : You do not have enough shares in the portfolio' })
        await newStockinHistoryUpdate.save();
      }
    }
    return res.send(body)
  }
}