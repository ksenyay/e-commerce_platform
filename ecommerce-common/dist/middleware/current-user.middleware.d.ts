import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
interface UserPayload {
    id: string;
    email: string;
    username: string;
}
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
            session?: {
                jwt?: string;
                [key: string]: any;
            };
        }
    }
}
export declare class CurrentUserMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
export {};
