
declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      email: string;
      role: "user" | "admin";
    };
  }
}

