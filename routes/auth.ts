import { Router } from 'express'
import Joi from 'joi'
import db from '../model/database'
import { v4 } from 'uuid'
import bcrypt from 'bcrypt'
import { generateJWTToken } from '../services/token.service'
import checklogin from '../middleware/checklogin'

const router = Router()


router.get('/register', checklogin, (req, res) => {
    res.render(
        'register',
        { title: 'Register', isRegister: true, registerError: req.flash('registerError') }
    )
})
router.get('/login', checklogin, (req, res) => {
    res.render(
        'login',
        { title: 'Login', isLogin: true, loginError: req.flash('loginError') }
    )
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
})

router.post('/login', async (req, res) => {
    const body = req.body;
    const { email, password } = body;

    if (!email && !password) {
        req.flash('loginError', 'Email va parol kiriting')
        res.redirect('/login')
        return
    }

    interface UserJoi { email: string; password: string }

    const loginSchema = Joi.object<UserJoi>({
        email: Joi.string().required().min(6).max(32).regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
        password: Joi.string().required().min(6).max(32).regex(/^[a-zA-Z0-9]{6,32}$/)
    });

    const { error, value } = loginSchema.validate(body);

    if (error) {
        let flash: string = ''
        if (`"email" is not allowed to be empty` == error.details[0].message) {
            flash = 'Emailingizni yozing'
        } else if (`"password" is not allowed to be empty` == error.details[0].message) {
            flash = 'Parol kiritilishi shart'
        }
        req.flash('loginError', flash)
        res.redirect('/login')
        return
    }
    else { login() }

    function login() {
        type User = {
            id: string,
            email: string;
            password: string;
        }
        db.get('SELECT id, email, password FROM users WHERE email=?', [body.email], async (err, row: User) => {
            if (err) return console.log(err);
            if (row) {
                // user found and check
                const isPasswordEqual = await bcrypt.compare(body.password, String(row.password));
                if (!isPasswordEqual) {
                    req.flash('loginError', 'Parol xato')
                    res.redirect('/login')
                } else { // user found all check complated

                    const token = generateJWTToken(row.id)
                    res.cookie("token", token, { httpOnly: true, secure: true })

                    res.redirect('/')
                }
            }
            if (!row) {
                req.flash('loginError', 'Foydalanuvchi mavjud emas')
                res.redirect('/login')
            }
        })

    }

})

router.post('/register', async (req, res) => {
    const body = req.body
    const hashedPassword = await bcrypt.hash(body.password, 10)

    const { firstname, lastname, email, password } = body

    if (!firstname || !lastname || !email || !password) {
        req.flash('registerError', `Hamma maydonlar to'ldirilishi shart`)
        res.redirect('/register')
        return
    }

    interface RegJoi { firstname: string, lastname: string, email: string, password: string, }

    const RegisterSchema = Joi.object<RegJoi>({
        firstname: Joi.string().required().min(3).max(16).pattern(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/),
        lastname: Joi.string().min(3).max(20).pattern(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/),
        email: Joi.string().required().min(6).max(32).regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
        password: Joi.string().required().min(6).max(32).regex(/^[a-zA-Z0-9]{6,32}$/)
    })
    const { error, value } = RegisterSchema.validate(body)

    if (error) {
        req.flash('registerError', error.details[0].message)
        res.redirect('/register')
        return
    }
    else { register() }

    function register() {
        interface User { email: string; }
        db.get('SELECT email, password FROM users WHERE email=?', [email], async (err, row: User) => {
            if (err) return console.log(err);
            if (row) {
                req.flash('registerError', `Bu Emaildan foydalanuvchi ro'yxatdan o'tgan:`)
                res.redirect('/register')
                return
            } else { // users register save database
                const sql = 'INSERT INTO users(id, firstname, lastname, email, password, role) VALUES(?,?,?,?,?,?)';
                const uuidGen = v4()
                const params = [uuidGen, firstname, lastname, email, hashedPassword, 'user']
                db.run(sql, params, (err) => {
                    if (err != null) console.log(err);
                })

                // JWT token
                const token = generateJWTToken(uuidGen)
                res.cookie("token", token, { httpOnly: true, secure: true })

                res.redirect('/')
            }
        })
    }
})


export default router;
