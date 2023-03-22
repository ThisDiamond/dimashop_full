import sqlite3 from "sqlite3";
const db = new sqlite3.Database('./database/users.db')
export const products_db = new sqlite3.Database('./database/products.db')
export default db