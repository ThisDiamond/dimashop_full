import { Router } from "express";
import authcheckMiddleware from "../middleware/authcheck";
import getTokenUser from "../middleware/getTokenUser";
const router = Router();
import db from "../model/database";
import { Request } from "express";
import { v4 } from 'uuid'

declare global {
  namespace Express {
    interface Request {
      role?: string;
    }
  }
}



router.get("/dashboard", getTokenUser, (req, res) => {
  const role = req.role;
  let statusAdmin: boolean = false;
  if (String(role) == "admin") {
    statusAdmin = true;
  }

  if (statusAdmin) {
    db.all("SELECT * FROM users;", (err: any, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
        return;
      }

      res.render("admin/dashboard", {
        statusAdmin,
        data: rows,
        totalUser: rows.length,
      });
    });
  } else {
    res.redirect("/");
  }
});

router.get("/users_admin", getTokenUser, (req, res) => {
  const role = req.role;
  let statusAdmin: boolean = false;
  if (String(role) == "admin") {
    statusAdmin = true;
  }
  if (statusAdmin) {
    interface Row {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      password: string;
    }
    db.all("SELECT * FROM users;", (err: any, rows: Row) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
        return;
      }

      res.render("admin/users_admin", {
        statusAdmin,
        data: rows,
      });
    });
  } else {
    res.redirect("/");
  }
});

router.get("/products_list_admin", getTokenUser, (req, res) => {
  const role = req.role;
  let statusAdmin: boolean = false;
  if (String(role) == "admin") {
    statusAdmin = true;
  }
  if (statusAdmin) {
    db.all("SELECT * FROM product;", (err: any, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
        return;
      }
      res.render("admin/products_list_admin", { statusAdmin, data: rows });
    });
  } else {
    res.redirect("/");
  }
});

router.get("/add", getTokenUser, (req, res) => {
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
      statusAdmin
    });
  } else {
    res.redirect("/");
  }
});

router.post("/add-products", getTokenUser, (req, res) => {
  const role = req.role;
  let statusAdmin: boolean = false;
  if (String(role) == "admin") {
    statusAdmin = true;
  }
  if (statusAdmin) {

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
  } else {
    res.redirect("/");
  }
});


export default router;
