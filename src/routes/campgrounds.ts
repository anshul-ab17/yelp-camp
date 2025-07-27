import express from 'express';
import * as campgrounds from '../controllers/campgrounds';
import catchAsync from '../utils/catchAsync';
import { isLoggedIn, isAuthor, validateCampground } from '../middleware';
import multer from 'multer';
import { storage } from '../cloudinary';

const upload = multer({ storage: storage as any });
const router = express.Router();

router.route('/')
    .get(catchAsync(campgrounds.index) as any)
    .post(isLoggedIn as any, upload.array('image') as any, validateCampground as any, catchAsync(campgrounds.createCampground) as any);

router.get('/new', isLoggedIn as any, campgrounds.renderNewForm as any);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground) as any)
    .put(isLoggedIn as any, isAuthor as any, upload.array('image') as any, validateCampground as any, catchAsync(campgrounds.updateCampground) as any)
    .delete(isLoggedIn as any, isAuthor as any, catchAsync(campgrounds.deleteCampground) as any);

router.get('/:id/edit', isLoggedIn as any, isAuthor as any, catchAsync(campgrounds.renderEditForm) as any);

export default router;
