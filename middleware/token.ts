export default function (req: any, res: any, next: any) {
    const isAuth = req.cookies.token ? true : false // req.cookies.tokeni ishlatish uchun cookie parser install qilish kerak 
    res.locals.token = isAuth // local ozgaruvchi isAuth da token bolsa true bolmasa false qaytaradi
    next()
}