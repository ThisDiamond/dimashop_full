import { Request, Response, Router } from "express";
import db from "../model/database";
const router = Router();

router.get("/", (req: Request, res: Response) => {
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
router.get("/products", (req: Request, res: Response) => {
  res.status(200).render("products", { title: "Products", isProducts: true });
});

export default router;
