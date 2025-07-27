import express from 'express';
import passport from 'passport';
import catchAsync from '../utils/catchAsync';
import * as users from '../controllers/users';

const router = express.Router();

router.route('/register')
    .get(users.renderRegister as any)
    .post(catchAsync(users.register) as any);

router.route('/login')
    .get(users.renderLogin as any)
    .post(
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login',
            keepSessionInfo: true
        }) as any,
        users.login as any
    );

router.get('/logout', users.logout as any);

export default router;
