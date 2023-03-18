import express, { Express } from "express";
import { engine, create } from 'express-handlebars'
import dotenv from 'dotenv'
import cors from 'cors'

import AuthRoutes from './routes/auth'
import ProductsRoutes from './routes/products'

dotenv.config()

const server: Express = express()

const hbs = create({ defaultLayout: 'main', extname: 'hbs' })


server.engine('hbs', hbs.engine)
server.set('view engine', 'hbs')
server.set('views', './views')

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use(express.static('public'))

server.use(AuthRoutes)
server.use(ProductsRoutes)

const StartServer = () => {
    try {
        const PORT = process.env.PORT || 1110
        server.listen((PORT), () => console.log(`http://localhost:${PORT}`))
    } catch (err) { console.log(err) }
}

StartServer()