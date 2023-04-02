export default {
    ifTek(a: any, b: any, options: any) {
        if (a == b) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    ifKatta(a: any, b: any, options: any) {
        if (a >= b) {
            return options.fn(this)
        }
        return options.inverse(this)
    }
}
