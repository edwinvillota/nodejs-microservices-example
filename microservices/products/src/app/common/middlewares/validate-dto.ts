import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { BadRequestException } from "../exceptions/bad-request-exception";

function validateDto(type: any, skipMissingProperties = false): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(type, req.body);

    const errors = await validate(dtoObj, { skipMissingProperties });

    if (errors.length) {
      const dtoErrors = errors.map((error: ValidationError) => {
        if (!error) return "";

        if (!error.constraints) {
          return error.children;
        }

        return Object.keys(error.constraints)
          .map((key) => (error.constraints ? error.constraints[key] : null))
          .join(",");
      });

      return res
        .status(400)
        .send(new BadRequestException("Verify your data", dtoErrors));
    }

    next();
  };
}

export default validateDto;
