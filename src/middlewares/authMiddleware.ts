import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError";
import { JWTPayload } from "../types/jwt";

const JWT_TOKEN = process.env.JWT_TOKEN || "secret-key-here";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "admin-api-key-here";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError({
      statusCode: 401,
      message: "Access Denied",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_TOKEN);

    req.user = decoded as JWTPayload;
    next();
  } catch (error) {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid token",
    });
  }
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header("x-api-key");

  if (!apiKey || apiKey !== ADMIN_API_KEY) {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid API key",
    });
  }

  next();
};
