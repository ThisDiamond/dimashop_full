import express, { Express } from "express";
import { engine, create } from 'express-handlebars'
import session from "express-session";
import dotenv from 'dotenv'
import cors from 'cors'
import flash from 'connect-flash'
import cookieParser from "cookie-parser";
import tokenMiddleware from './middleware/token'

import AuthRoutes from './routes/auth'
import ProductsRoutes from './routes/products'
import adminOnly from './routes/admin-only'
import hbsHelper from './helper/index'

dotenv.config()

const server: Express = express()
const hbs = create({ defaultLayout: 'main', extname: 'hbs', helpers: hbsHelper })


server.engine('hbs', hbs.engine)
server.set('view engine', 'hbs')
server.set('views', './views')

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(session({ secret: "secret", resave: false, saveUninitialized: false }))
server.use(flash());
server.use(cookieParser())
server.use(tokenMiddleware)

server.use(AuthRoutes)
server.use(ProductsRoutes)
server.use(adminOnly)

const StartServer = () => {
    try {
        const PORT = process.env.PORT || 1110
        server.listen((PORT), () => console.log(`http://localhost:${PORT}`))
    } catch (err) { console.log(err) }
}

StartServer()

