import * as jwt from 'jsonwebtoken'
import db from '../model/database'
import { NextFunction, Request, Response } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.token) {
        res.redirect('/login')
        return
    }
    const token = req.cookies.token
    let decode = jwt.verify(token, String(process.env.JWT_SECRET)) as jwt.JwtPayload

    interface Row {
        id: string,
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        role: string
    }

    const row: Row = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id=?', [decode.userId], (err, row: Row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row)
            }
        });
    })

    req.role = row.role

    next()
}
