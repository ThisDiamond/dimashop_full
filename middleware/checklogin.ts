export default function (req: any, res: any, next: any) {
    if (req.cookies.token) {
        res.redirect('/')
        return
    }
    next()
}