export interface JWTPayload {
  id: number;
  email: string;
  role: "user" | "admin";
}

