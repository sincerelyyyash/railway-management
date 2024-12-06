import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { z } from "zod";


const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "secret-key-here";


const signupSchema = z.object({
  name: z.string().min(3, "Name should be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password should be at least 8 characters long"),
});

const signinSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password should be at least 8 characters long"),
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const parsedBody = signupSchema.safeParse(req.body);


  if (!parsedBody.success) {
    const errors = parsedBody.error.errors.map(err => ({
      path: err.path[0],
      message: err.message,
    }));
    throw new ApiError({ statusCode: 400, message: "Invalid inputs", errors });
  }

  const { name, email, password } = parsedBody.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError({ statusCode: 400, message: "Email is already registered" })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER"
    },
  });

  const response = new ApiResponse({
    statusCode: 201,
    data: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
    message: "User registered successfully"
  });

  return res.status(response.statusCode).json(response);
});


export const signin = asyncHandler(async (req: Request, res: Response) => {
  const parsedBody = signinSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const errors = parsedBody.error.errors.map(err => ({
      path: err.path[0],
      message: err.message,
    }));
    throw new ApiError({ statusCode: 400, message: "Validation failed", errors });
  }

  const { email, password } = parsedBody.data;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid email or password"
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError({
      statusCode: 401,
      message: "Password invalid"
    });
  }

  const token = jwt.sign({
    id: user.id,
    role: user.role
  }, JWT_SECRET, {
    expiresIn: "1h"
  });

  const response = new ApiResponse({
    statusCode: 200,
    data: { token },
    message: "Sign In successfull"
  });

  return res.status(response.statusCode).json(response);

})
