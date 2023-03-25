import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.token) {
        res.redirect('/')
        return
    }
    next()
}