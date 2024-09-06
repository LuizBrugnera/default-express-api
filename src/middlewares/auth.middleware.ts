import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Acesso negado.");
  }

  try {
    const verified = jwt.verify(token, "your_secret_key");
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Token inválido.");
  }
};
