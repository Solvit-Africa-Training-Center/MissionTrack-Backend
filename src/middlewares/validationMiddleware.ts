import { NextFunction,Request,Response } from "express";
import { ObjectSchema } from "joi";
import { ResponseService } from "../utils/response";

interface validateOption<T>{
    type:"body" | "params"| "headers" | "query";
    schema:ObjectSchema<T>;
}

export const validationMiddleware = <T>({ type, schema }: validateOption<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validationQueries = req[type] as T;
            const { error } = (schema as ObjectSchema<T>).validate(validationQueries);

            if (error) {
                return ResponseService({
                    data: error.details,
                    status: 400,
                    message: error.message,
                    success: false,
                    res
                });
            }

            next(); // pass control to next middleware/controller
        } catch (err) {
            return ResponseService({
                data: err,
                status: 500,
                success: false,
                message: "Validation Middleware Error",
                res
            });
        }
    };
};
