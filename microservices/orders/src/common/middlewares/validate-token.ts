import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RequestWithUser } from "../interfaces/request-with-user";

async function validateToken(
  req: RequestWithUser<unknown>,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  try {
    jwt.verify(token, process.env.SECRETKEY_AUTH || "");
    const { email }: any = jwt.decode(token);
    req.user = email;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
}

export default validateToken;
