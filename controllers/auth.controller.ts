import { Request, Response, Router } from "express";
import Joi from "joi";
import db from "../model/database";
import bcrypt from "bcrypt";
import { generateJWTToken } from "../services/token.service";

export const postLogin = async (req: Request, res: Response) => {
  const body = req.body;
  const { email, password } = body;

  if (!email && !password) {
    req.flash("loginError", "Email va parol kiriting");
    res.redirect("/login");
    return;
  }

  interface UserJoi {
    email: string;
    password: string;
  }

  const loginSchema = Joi.object<UserJoi>({
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

  const { error, value } = loginSchema.validate(body);

  if (error) {
    let flash: string = "";
    if (`"email" is not allowed to be empty` == error.details[0].message) {
      flash = "Emailingizni yozing";
    } else if (
      `"password" is not allowed to be empty` == error.details[0].message
    ) {
      flash = "Parol kiritilishi shart";
    }
    req.flash("loginError", flash);
    res.redirect("/login");
    return;
  } else {
    login();
  }

  function login() {
    type User = {
      id: string;
      email: string;
      password: string;
    };
    db.get(
      "SELECT id, email, password FROM users WHERE email=?",
      [body.email],
      async (err, row: User) => {
        if (err) return console.log(err);
        if (row) {
          // user found and check
          const isPasswordEqual = await bcrypt.compare(
            body.password,
            String(row.password)
          );
          if (!isPasswordEqual) {
            req.flash("loginError", "Parol xato");
            res.redirect("/login");
          } else {
            // user found all check complated
            const token = generateJWTToken(row.id);
            res.cookie("token", token, { httpOnly: true, secure: true });

            res.redirect("/");
          }
        }
        if (!row) {
          req.flash("loginError", "Foydalanuvchi mavjud emas");
          res.redirect("/login");
        }
      }
    );
  }
};
