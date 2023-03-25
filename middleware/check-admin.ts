import { NextFunction, Request, Response } from "express";

export default (request: Request, response: Response, next: NextFunction) => {
    if (request.role == "admin") {
        next()
    }
    else {
        response.redirect('/')
    }
}