import { Router } from 'express'
import sqlite3 from "sqlite3";
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
    const body = req.body

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
    res.redirect('/login')
})

router.post('/register', async (req, res) => {
    const body = req.body
    const hashedPassword = await bcrypt.hash(body.password, 10)
    const sql = 'INSERT INTO users(firstname, lastname, email, password) VALUES(?,?,?,?)';
    const params = [body.firstname, body.lastname, body.email, hashedPassword]

    db.run(sql, params, (err) => {
        if (err != null) console.log(err);
    })

    res.redirect('/login')
})


export default router;
