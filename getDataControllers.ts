
import "reflect-metadata";
import { Controller, Body, Get, Res } from "routing-controllers";
import { Response } from 'express'
import { Stock } from "./model/stock";
import { protfolio } from "./model/protfolio";
import { history } from "./model/history";

@Controller()
export class getDataControllers {
    @Get("/stock")
    async stock(@Body() body: any, @Res() res: Response) {
        const stockGet = await Stock.findAll()
        return res.send(stockGet)
    }

    @Get("/protfolio")
    async protfolio(@Body() body: any, @Res() res: Response) {
        const protfolioGet = await protfolio.findAll()
        return res.send(protfolioGet)
    }

    @Get("/history")
    async history(@Body() body: any, @Res() res: Response) {
        const historyGet = await history.findAll()
        return res.send(historyGet)
    }

}