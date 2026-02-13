import {Router, type Request, type Response} from 'express';

const userRouter = Router();

userRouter.get('/', (req: Request, res: Response) => {
  res.send('Get all users');
});

userRouter.get('/:id', (req: Request, res: Response) => {
  res.send('Get user by ID');
});

userRouter.post('/:id', (req: Request, res: Response) => {
  res.send('Create a new user');
});

userRouter.put('/:id', (req: Request, res: Response) => {
  res.send('Update user by ID');
});

userRouter.delete('/:id', (req: Request, res: Response) => {
  res.send('Delete user by ID');
});


export default userRouter;