import express from 'express';
import {
    registerProvider,
    loginProvider,
    logoutProvider,
    sendVerifyOtpProvider,
    verifyEmailProvider,
    sendResetOtpProvider,
    resetPasswordProvider,
    addressChangeProvider,
    isAuthenticatedProvider
} from '../controller/provider.js';

import { providerMiddleware } from '../middleware/provider.js';
import { upload } from '../middleware/multer.middleware.js';

const providerRouter = express.Router();

providerRouter.post('/register',upload.single("providerLogo"), registerProvider);
providerRouter.post('/login', loginProvider);
providerRouter.get('/logout', logoutProvider);
providerRouter.post('/send-verify-otp', providerMiddleware, sendVerifyOtpProvider);
providerRouter.post('/verify-email', providerMiddleware, verifyEmailProvider);
providerRouter.get('/is-authenticated', providerMiddleware, isAuthenticatedProvider);
providerRouter.post('/send-reset-otp', providerMiddleware, sendResetOtpProvider);
providerRouter.post('/reset-password', providerMiddleware, resetPasswordProvider);
providerRouter.post('/address-change', providerMiddleware, addressChangeProvider);

export default providerRouter;
