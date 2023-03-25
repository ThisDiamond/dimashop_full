import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
    const isAuth = req.cookies.token ? true : false // req.cookies.tokeni ishlatish uchun cookie parser install qilish kerak 
    res.locals.token = isAuth // local ozgaruvchi isAuth da token bolsa true bolmasa false qaytaradi
    next()
}