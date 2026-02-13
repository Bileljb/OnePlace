import {Router, type Request, type Response} from "express"
const subscriptionRouter = Router()

subscriptionRouter.get("/", (req: Request, res: Response)=>res.send("Get all subscriptions"))

subscriptionRouter.get("/:id", (req: Request, res: Response)=>res.send("Get subscription by ID"))

subscriptionRouter.post("/", (req: Request, res: Response)=>res.send("Create a new subscription"))

subscriptionRouter.put("/:id", (req: Request, res: Response)=>res.send("Update subscription by ID"))


subscriptionRouter.delete("/:id", (req: Request, res: Response)=>res.send("Delete subscription by ID"))

subscriptionRouter.get("/user/:id", (req: Request, res: Response)=>res.send("Get subscriptions for a user"))

subscriptionRouter.put("/:id/cancel", (req: Request, res: Response)=>res.send("Cancel a subscription"))

subscriptionRouter.get("/upcoming-renewal", (req: Request, res: Response)=>res.send("get upcoming renewals"))




export default subscriptionRouter;