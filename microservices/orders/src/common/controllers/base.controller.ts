import { Response } from "express";
import { ConflictException } from "../exceptions/conflict-exception";

export abstract class BaseController {
  handleException(error: unknown, res: Response) {
    console.log("Error ->", error);

    if (error instanceof ConflictException) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).send(error);
    }
  }
}
