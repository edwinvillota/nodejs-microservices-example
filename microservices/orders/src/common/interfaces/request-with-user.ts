import { Request } from "express";
import { TypedRequestBody } from "./typed-request-body";

export interface RequestWithUser<T> extends TypedRequestBody<T> {
  user: string;
}
