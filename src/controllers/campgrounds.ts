import { Request, Response, NextFunction } from 'express';
import Campground from '../models/campground';
import { cloudinary } from '../cloudinary';
// @ts-ignore
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const mapBoxToken = process.env.MAPBOX_TOKEN || '';
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

export const index = async (req: Request, res: Response) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

export const renderNewForm = (req: Request, res: Response) => {
    res.render('campgrounds/new');
};

export const createCampground = async (req: Request, res: Response, next: NextFunction) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = (req.files as Express.Multer.File[]).map(f => ({ url: f.path, filename: f.filename }));
    campground.author = (req.user as any)._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

export const showCampground = async (req: Request, res: Response) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};

export const renderEditForm = async (req: Request, res: Response) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

export const updateCampground = async (req: Request, res: Response) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    const imgs = (req.files as Express.Multer.File[]).map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

export const deleteCampground = async (req: Request, res: Response) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
};
