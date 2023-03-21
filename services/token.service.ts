import jwt from 'jsonwebtoken'

const generateJWTToken = (userId: string) => {
    const assessToken = jwt.sign({ userId }, String(process.env.JWT_SECRET), { expiresIn: '30d' })
    return assessToken
}

export { generateJWTToken }