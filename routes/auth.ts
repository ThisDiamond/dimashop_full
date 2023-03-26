import { Request, Response, Router } from "express";
import Joi from "joi";
import db from "../model/database";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import { generateJWTToken } from "../services/token.service";
import checklogin from "../middleware/checklogin";
import { postLogin } from "../controllers/auth.controller"; // controller

const router = Router();

interface RegJoi {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

router.get("/register", checklogin, (req: Request, res: Response) => {
  res.status(200).render("register", {
    title: "Register",
    isRegister: true,
    registerError: req.flash("registerError"),
  });
});
router.get("/login", checklogin, (req: Request, res: Response) => {
  res.status(200).render("login", {
    title: "Login",
    isLogin: true,
    loginError: req.flash("loginError"),
  });
});

router.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect("/");
});

router.post("/login", postLogin);

router.post("/register", async (req: Request, res: Response) => {
  const body = req.body;
  const hashedPassword = await bcrypt.hash(body.password, 10);

  const { firstname, lastname, email, password } = body;

  if (!firstname || !lastname || !email || !password) {
    req.flash("registerError", `Hamma maydonlar to'ldirilishi shart`);
    res.redirect("/register");
    return;
  }

  const RegisterSchema = Joi.object<RegJoi>({
    firstname: Joi.string()
      .required()
      .min(3)
      .max(16)
      .pattern(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/),
    lastname: Joi.string()
      .min(3)
      .max(20)
      .pattern(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/),
    email: Joi.string()
      .required()
      .min(6)
      .max(32)
      .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
    password: Joi.string()
      .required()
      .min(6)
      .max(32)
      .regex(/^[a-zA-Z0-9]{6,32}$/),
  });
  const { error, value } = RegisterSchema.validate(body);

  if (error) {
    req.flash("registerError", error.details[0].message);
    res.redirect("/register");
    return;
  } else {
    register();
  }

  function register() {
    interface User {
      email: string;
    }
    db.get(
      "SELECT email, password FROM users WHERE email=?",
      [email],
      async (err, row: User) => {
        if (err) return console.log(err);
        if (row) {
          req.flash(
            "registerError",
            `Bu Emaildan foydalanuvchi ro'yxatdan o'tgan:`
          );
          res.redirect("/register");
          return;
        } else {
          // users register save database
          const sql =
            "INSERT INTO users(id, firstname, lastname, email, password, role) VALUES(?,?,?,?,?,?)";
          const uuidGen = v4();
          const params = [
            uuidGen,
            firstname,
            lastname,
            email,
            hashedPassword,
            "user",
          ];
          db.run(sql, params, (err) => {
            if (err != null) console.log(err);
          });

          // JWT token
          const token = generateJWTToken(uuidGen);
          res.cookie("token", token, { httpOnly: true, secure: true });

          res.redirect("/");
        }
      }
    );
  }
});

export default router;
