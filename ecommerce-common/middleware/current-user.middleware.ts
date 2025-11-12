/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

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

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.session?.jwt) {
      return next();
    }

    try {
      const payload = jwt.verify(
        req.session.jwt,
        process.env.JWT_SECRET!
      ) as UserPayload;

      req.currentUser = payload;
    } catch (err) {}

    next();
  }
}
