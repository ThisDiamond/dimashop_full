import { Router } from "express";
import authcheckMiddleware from "../middleware/authcheck";
import getTokenUser from "../middleware/getTokenUser";
import db from "../model/database";
const router = Router();

router.get("/", (req, res) => {
  db.all("SELECT * FROM product;", (err: any, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal server error");
      return;
    } else {
      res.render("index", {
        title: "Main page",
        product: rows,
      });
    }
  });
});
router.get("/products", (req, res) => {
  res.render("products", { title: "Products", isProducts: true });
});

export default router;
