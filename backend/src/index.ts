import express, { type Request, type Response } from 'express';
import {PORT} from './config/env.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.route.js';
import userRouter from './routes/user.routes.js';
import connectDB from './database/mongodb.js';
const app = express()

//Middleware
app.use(express.json());
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/subscription', subscriptionRouter)
app.use('/api/v1/user', userRouter)

app.get("/", (req, res)=>{ res.send("hello")})

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDB();
}); 