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

router.get("/dashboard", getTokenUser, checkAdmin, (req: Request, res: Response) => {
  db.all("SELECT * FROM users;", (err: any, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal server error");
      return;
    }

    res.render("admin/dashboard", {
      statusAdmin: true,
      data: rows,
      totalUser: rows.length,
    });
  });
});

router.get("/users_admin", getTokenUser, checkAdmin, (req: Request, res: Response) => {
  db.all("SELECT * FROM users;", (err: any, rows: Row) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal server error");
      return;
    }

    res.render("admin/users_admin", {
      statusAdmin: true,
      data: rows,
    });
  });
});

router.get("/products_list_admin", getTokenUser, checkAdmin, (req: Request, res: Response) => {
  db.all("SELECT * FROM product;", (err: any, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal server error");
      return;
    }
    res.render("admin/products_list_admin", {
      statusAdmin: true,
      data: rows,
    });
  });
});

router.get("/add", getTokenUser, checkAdmin, (req: Request, res: Response) => {
  const role = req.role;
  let statusAdmin: boolean = false;
  if (String(role) == "admin") {
    statusAdmin = true;
  }
  if (statusAdmin) {
    res.render("admin/add", {
      title: "Add new product",
      isAdd: true,
      errorAddProducts: req.flash("errorAddProducts"),
      statusAdmin,
    });
  } else {
    res.redirect("/");
  }
});

router.post("/add-products", getTokenUser, checkAdmin, (req: Request, res: Response) => {
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

    res.redirect("/add");
  }
});

export default router;
