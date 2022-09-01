import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RequestWithUser } from "../interfaces/request-with-user";
import axios from "axios";

async function validateToken(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  axios.defaults.headers.common["Authorization"] = "";
  delete axios.defaults.headers.common["Authorization"];
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

    axios.defaults.headers.common["Authorization"] = `${token}`;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
}

export default validateToken;
