import { Router } from 'express'
import authcheckMiddleware from '../middleware/authcheck'
import getTokenUser from '../middleware/getTokenUser'
const router = Router()
import { products_db } from '../model/database'

router.get('/', (req, res) => {
    res.render(
        'index', {
        title: 'Main page',
    })
})
router.get('/products', (req, res) => {
    res.render(
        'products',
        { title: 'Products', isProducts: true }
    )
})
router.get('/add', authcheckMiddleware, (req, res) => {
    res.render(
        'add',
        {
            title: 'Add new product',
            isAdd: true,
            errorAddProducts: req.flash('errorAddProducts')
        }
    )
})

router.post('/add-products', getTokenUser, (req, res) => {
    const { title, description, image, price } = req.body
    if (!title || !description || !image || !price) {
        req.flash('errorAddProducts', `Hamma maydonlar to'ldirilishi shart!`)
        res.redirect('/add')
    }
    res.redirect('/')
})

export default router
