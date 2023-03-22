import { Router } from 'express'
import authcheckMiddleware from '../middleware/authcheck'
import getTokenUser from '../middleware/getTokenUser'
const router = Router()
import db from '../model/database'
import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            email?: string;
        }
    }
}

router.get('/dashboard', getTokenUser, (req, res) => {
    const email = req.email
    let statusAdmin: boolean = false
    if (String(email) == 'dilshodbeknodejs@gmail.com') {
        statusAdmin = true
    } else {
        statusAdmin = false
    }
    if (statusAdmin) {
        res.render('admin/dashboard', { statusAdmin })
    } else {
        res.redirect('/')
    }

})

router.get('/users_admin', getTokenUser, (req, res) => {
    const email = req.email
    let statusAdmin: boolean = false
    if (String(email) == 'dilshodbeknodejs@gmail.com') {
      statusAdmin = true
    } else {
      statusAdmin = false
    }
    if (statusAdmin) {
      interface Row {
        id: string,
        firstname: string,
        lastname: string,
        email: string,
        password: string
      }
      db.all('SELECT * FROM users;', (err: any, rows: Row) => {
        if (err) {
          console.log(err);
          res.status(500).send('Internal server error');
          return;
        }
        res.render('admin/users_admin', { statusAdmin, data: rows });
      });
    } else {
      res.redirect('/')
    }
  })
  
router.get('/products_admin', getTokenUser, (req, res) => {
    const email = req.email
    let statusAdmin: boolean = false
    if (String(email) == 'dilshodbeknodejs@gmail.com') {
        statusAdmin = true
    } else {
        statusAdmin = false
    }
    if (statusAdmin) {
        res.render('admin/products_admin', { statusAdmin })
    } else {
        res.redirect('/')
    }
})

export default router