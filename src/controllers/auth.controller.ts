import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send("As senhas não coincidem.");
  }

  const userExists = await userModel.findByEmail(email);

  if (userExists) {
    return res.status(400).send("Email já cadastrado.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = { name, email, password: hashedPassword };
  userModel.create(user);

  console.log(await userModel.findAll());

  res.status(201).send("Usuário registrado com sucesso!");
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userExists = await userModel.findByEmailWithPassword(email);
  if (!userExists) {
    return res.status(400).send("Email ou senha incorretos.");
  }

  const validPassword = await bcrypt.compare(password, userExists.password);
  if (!validPassword) {
    return res.status(400).send("Email ou senha incorretos.");
  }

  console.log(await userModel.findAll());

  const token = jwt.sign({ email }, "12345678", {
    expiresIn: "12h",
  });
  res.status(200).send(token);
};
