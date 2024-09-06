import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../models/user";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send("As senhas não coincidem.");
  }

  if (users.find((u) => u.email === email)) {
    return res.status(400).send("Email já cadastrado.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = { name, email, password: hashedPassword };
  users.push(user);

  console.log(users);

  res.status(201).send("Usuário registrado com sucesso!");
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).send("Email ou senha incorretos.");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send("Email ou senha incorretos.");
  }

  const token = jwt.sign({ email }, "12345678", {
    expiresIn: "12h",
  });
  res.status(200).send(token);
};
