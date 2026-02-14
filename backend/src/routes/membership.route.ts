import {Router, type Request, type Response} from "express"
const membershipRouter = Router()

membershipRouter.get("/", (req: Request, res: Response)=>res.send("Get all memberships"))

membershipRouter.get("/:id", (req: Request, res: Response)=>res.send("Get membership by ID"))

membershipRouter.post("/", (req: Request, res: Response)=>res.send("Create a new membership"))

membershipRouter.put("/:id", (req: Request, res: Response)=>res.send("Update membership by ID"))


membershipRouter.delete("/:id", (req: Request, res: Response)=>res.send("Delete membership by ID"))

membershipRouter.get("/user/:id", (req: Request, res: Response)=>res.send("Get memberships for a user"))

membershipRouter.put("/:id/cancel", (req: Request, res: Response)=>res.send("Cancel a membership"))

membershipRouter.get("/upcoming-renewal", (req: Request, res: Response)=>res.send("get upcoming renewals"))




export default membershipRouter;