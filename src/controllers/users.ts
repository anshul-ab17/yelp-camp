import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

export const renderRegister = (req: Request, res: Response) => {
    res.render('users/register');
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    } catch (e: any) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

export const renderLogin = (req: Request, res: Response) => {
    res.render('users/login');
};

export const login = (req: Request, res: Response) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = (req.session as any).returnTo || '/campgrounds';
    delete (req.session as any).returnTo;
    res.redirect(redirectUrl);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};
