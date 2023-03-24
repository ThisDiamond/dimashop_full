import sqlite3 from "sqlite3";
const db = new sqlite3.Database('./database/database_dimashop.db')
export default db