import express, { type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT, CLIENT_URL } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import membershipRouter from './routes/membership.route.js';
import userRouter from './routes/user.routes.js';
import communityRouter from './routes/community.routes.js';
import adminRouter from './routes/admin.routes.js';
import uploadRouter from './routes/upload.routes.js';
import notificationRouter from './routes/notification.routes.js';
import aiRouter from './routes/ai.routes.js';
import knowledgeRouter from './routes/knowledge.routes.js';
import { startExpiryJob } from './jobs/expiry.job.js';
import errorMiddleware from './middlewares/error.middleware.js';
import { connectDB, disconnectDB, prisma } from './database/db.js';
const app = express()

//Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

// Health check for the hosting platform and uptime monitors (also verifies the DB connection)
app.get('/api/v1/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', database: 'ok' });
  } catch {
    res.status(503).json({ status: 'error', database: 'unreachable' });
  }
});

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/membership', membershipRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/communities', communityRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/upload', uploadRouter)
app.use('/api/v1/notifications', notificationRouter)
app.use('/api/v1/ai', aiRouter)
app.use('/api/v1/communities/:communityId/knowledge', knowledgeRouter)
app.use(errorMiddleware)

app.get("/", (req, res)=>{ res.send("hello")})

const server = app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDB();
  startExpiryJob();
}); 

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});