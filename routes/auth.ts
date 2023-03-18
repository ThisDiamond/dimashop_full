import { Router } from 'express'
import Joi from 'joi'
import db from '../model/database'
import bcrypt from 'bcrypt'

const router = Router()

router.get('/register', (req, res) => {
    res.render(
        'register',
        { title: 'Register', isRegister: true, registerError: 'Error' }
    )
})
router.get('/login', (req, res) => {
    res.render(
        'login',
        { title: 'Login', isLogin: true, loginError: 'Error' }
    )
})


router.post('/login', async (req, res) => {
    const body = req.body;

    interface UserJoi { email: string; password: string }

    const loginSchema = Joi.object<UserJoi>({
        email: Joi.string().required().min(6).max(32).regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
        password: Joi.string().required().min(6).max(32).regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,32}$/)
    });

    const { error, value } = loginSchema.validate(body);

    if (error) { console.error(error.details[0].message); res.redirect('/login') }
    else { login() }

    function login() {
        type User = {
            email: string;
            password: string;
        }
        db.get('SELECT email, password FROM users WHERE email=?', [body.email], async (err, row: User) => {
            if (err) return console.log(err);
            if (row) {
                console.log(`user found `);
                const isPasswordEqual = await bcrypt.compare(body.password, String(row.password))
                if (!isPasswordEqual) { console.log('password wrong') }
                else { console.log(`user ${row.email} pass ${row.password}`); }
            } else { console.log('user not found'); }
        })
        res.redirect('/')
    }

})

router.post('/register', async (req, res) => {
    const body = req.body
    const hashedPassword = await bcrypt.hash(body.password, 10)

    interface RegJoi { firstname: string, lastname: string, email: string, password: string, }
    const RegisterSchema = Joi.object<RegJoi>({
        firstname: Joi.string().required().min(3).max(16).pattern(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/),
        lastname: Joi.string().min(3).max(20).pattern(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/),
        email: Joi.string().required().min(6).max(32).regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
        password: Joi.string().required().min(6).max(32).regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,32}$/)
    })
    const { error, value } = RegisterSchema.validate(body)

    if (error) { console.error(error.details[0].message); res.redirect('/register') }
    else { register() }

    function register() {
        interface User { email: string; }
        db.get('SELECT email, password FROM users WHERE email=?', [body.email], async (err, row: User) => {
            if (err) return console.log(err);
            if (row) {
                console.log('user  found');
            } else {
                const sql = 'INSERT INTO users(firstname, lastname, email, password) VALUES(?,?,?,?)';
                const params = [body.firstname, body.lastname, body.email, hashedPassword]
                db.run(sql, params, (err) => {
                    if (err != null) console.log(err);
                })
                res.redirect('/login')
            }
        })
    }
})


export default router;
