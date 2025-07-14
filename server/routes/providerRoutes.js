import express from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    sendVerifyOtpUser, 
    verifyEmailUser, 
    isAuthenticatedUser, 
    sendResetOtpUser, 
    resetPasswordUser, 
    addressChangeUser
} from '../controller/user.js';
import { userMiddleware } from '../middleware/user.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', logoutUser);
userRouter.post('/send-verify-otp',userMiddleware, sendVerifyOtpUser);
userRouter.post('/verify-email', userMiddleware,verifyEmailUser);
userRouter.get('/is-authenticated',userMiddleware, isAuthenticatedUser);
userRouter.post('/send-reset-otp',userMiddleware, sendResetOtpUser);
userRouter.post('/reset-password',userMiddleware, resetPasswordUser);
userRouter.post('/address-change',userMiddleware,addressChangeUser);

export default userRouter;
