import { Request, Response, Router } from "express";
import getTokenUser from "../middleware/getTokenUser";
const router = Router();
import db from "../model/database";
import { v4 } from "uuid";
import checkAdmin from "../middleware/check-admin";

declare global {
  namespace Express {
    interface Request {
      role?: string;
    }
  }
}

interface Row {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
}

router.get(
  "/dashboard",
  getTokenUser,
  checkAdmin,
  (req: Request, res: Response) => {
    db.all("SELECT * FROM users;", (err: any, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
        return;
      }

      res.status(200).render("admin/dashboard", {
        statusAdmin: true,
        data: rows,
        totalUser: rows.length,
      });
    });
  }
);

router.get(
  "/users_admin",
  getTokenUser,
  checkAdmin,
  (req: Request, res: Response) => {
    db.all("SELECT * FROM users;", (err: any, rows: Row) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
        return;
      }
      // add index
      res.status(200).render("admin/users_admin", {
        statusAdmin: true,
        data: rows,
      });
    });
  }
);

router.get(
  "/products_list_admin",
  getTokenUser,
  checkAdmin,
  (req: Request, res: Response) => {
    db.all("SELECT * FROM product;", (err: any, product: Product) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
        return;
      }

      res.status(200).render("admin/products_list_admin", {
        statusAdmin: true,
        deleteProduct: req.flash("deleteProduct"),
        isChangeProduct: req.flash("isChangeProduct"),
        product,
      });
    });
  }
);

router.get("/add", getTokenUser, checkAdmin, (req: Request, res: Response) => {
  res.status(200).render("admin/add", {
    title: "Add new product",
    isAdd: true,
    errorAddProducts: req.flash("errorAddProducts"),
    isAddProducts: req.flash("isAddProducts"),
    statusAdmin: true,
  });
});

router.get(
  "/delete/:id",
  getTokenUser,
  checkAdmin,
  (req: Request, res: Response) => {
    db.run("DELETE FROM Product WHERE id=?", [req.params.id], (err) => {
      if (err) console.log(err);
      req.flash("deleteProduct", `Mahsulot o'chirib tashlandi!`);
      res.redirect("/products_list_admin");
    });
  }
);

router.post(
  "/add-products",
  getTokenUser,
  checkAdmin,
  (req: Request, res: Response) => {
    const { title, description, image, price } = req.body;
    if (!title || !description || !image || !price) {
      req.flash("errorAddProducts", `Hamma maydonlar to'ldirilishi shart!`);
      res.redirect("/add");
    } else {
      // validatsiya qilishi kerak
      const sql =
        "INSERT INTO Product(id, title, description, image, price) VALUES(?,?,?,?,?)";
      const uuidGen = v4();
      const params = [uuidGen, title, description, image, price];
      db.run(sql, params, (err) => {
        if (err != null) console.log(err);
      });
      req.flash("isAddProducts", `Yangi mahsulot qoshildi.`);
      res.redirect("/add");
    }
  }
);

router.post(
  "/edit-products",
  getTokenUser,
  checkAdmin,
  (req: Request, res: Response) => {
    const productId = req.body.productId;
    const newTitle = req.body.title;
    const newDescription = req.body.description;
    const newImage = req.body.image;
    const newPrice = req.body.price;

    db.get(
      `SELECT * FROM Product WHERE id=?`,
      [productId],
      (err, product: Product) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
          return;
        }

        if (!product) {
          res.status(404).send("Product not found");
          return;
        }

        //validatsya qilish kerak
        const sql = db.prepare(`UPDATE Product 
    SET title = COALESCE(?, title), 
        description = COALESCE(?, description), 
        image = COALESCE(?, image), 
        price = COALESCE(?, price) 
    WHERE id = ?`);

        const params = [
          newTitle !== "" ? newTitle : product.title,
          newDescription !== "" ? newDescription : product.description,
          newImage !== "" ? newImage : product.image,
          newPrice !== "" ? newPrice : product.price,
          productId,
        ];

        sql.run(params, (err) => {
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
          }
          req.flash("isChangeProduct", "Mahsulot muvaffaqiyatli o'zgartirilgan!");
          res.redirect("/products_list_admin");
        });
      }
    );
  }
);

export default router;
