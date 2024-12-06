import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser'


const app = express()


app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));


app.use(express.json({
  limit: "16kb"
}))

app.use(express.urlencoded({
  extended: true,
  limit: "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())


//Routes import 
import userRouter from "./routes/user.routes";
import trainRouter from "./routes/train.routes";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/train", trainRouter);
export { app }
