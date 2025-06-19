import express from 'express';
import {
  registerUser,
  loginUser,
//   logout,
//   updateProfile,
//   getUser,
} from '../controller/user.controller.js';
import { protectRoute } from '../middleware/auth/auth.middleware.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
// userRouter.post('/logout', logout);
// userRouter.put('/update-profile', protectRoute, updateProfile);
// userRouter.get('/get-user', protectRoute, getUser);

export default userRouter;
