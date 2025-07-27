import dotenv from 'dotenv';
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import mongoose from 'mongoose';
// @ts-ignore
import ejsMate from 'ejs-mate';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import MongoStore from 'connect-mongo';

import User from './models/user';
import ExpressError from './utils/ExpressError';
import userRoutes from './routes/users';
import campgroundRoutes from './routes/campgrounds';
import reviewRoutes from './routes/reviews';

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

mongoose.connect(dbUrl)
    .then(() => {
        console.log("Database connected");
    })
    .catch(err => {
        console.error("Database connection error:", err);
    });

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.urlencoded({ extended: true }) as any);
app.use(methodOverride('_method') as any);
app.use(express.static(path.join(__dirname, '../public')) as any);
app.use(mongoSanitize({
    replaceWith: '_'
}) as any);

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret
    },
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig) as any);
app.use(flash() as any);
app.use(helmet() as any);

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [
    "https://fonts.gstatic.com",
    "https://ka-f.fontawesome.com"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com",
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    }) as any
);

app.use(passport.initialize() as any);
app.use(passport.session() as any);
passport.use(new (LocalStrategy as any)(User.authenticate()) as any);

passport.serializeUser(User.serializeUser() as any);
passport.deserializeUser(User.deserializeUser() as any);

app.use(((req: Request, res: Response, next: NextFunction) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}) as any);

app.use('/', userRoutes as any);
app.use('/campgrounds', campgroundRoutes as any);
app.use('/campgrounds/:id/reviews', reviewRoutes as any);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', ((req: Request, res: Response, next: NextFunction) => {
    next(new ExpressError('Page Not Found', 404));
}) as any);

app.use(((err: any, req: Request, res: Response, next: NextFunction) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
}) as any);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
