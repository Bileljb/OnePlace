import express, { type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import {PORT} from './config/env.js';
import authRouter from './routes/auth.routes.js';
import membershipRouter from './routes/membership.route.js';
import userRouter from './routes/user.routes.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
const app = express()

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/membership', membershipRouter)
app.use('/api/v1/user', userRouter)
app.use(errorMiddleware)

app.get("/", (req, res)=>{ res.send("hello")})

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDB();
}); 