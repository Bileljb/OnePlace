import { Router, type Request, type Response } from "express";

const authRouter = Router();

authRouter.post("/sign-up", (req: Request, res: Response) => res.send("Sign up route"));
authRouter.post("/sign-in", (req: Request, res: Response) => {res.send("Sign in route")});
authRouter.post("/sign-out", (req: Request, res: Response) => {res.send("Sign out route")});

export default authRouter;