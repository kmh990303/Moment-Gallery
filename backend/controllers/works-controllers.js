const Work = require('../models/work');
const User = require('../models/user');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const fs = require('fs');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const fileUpload = multer({
    limits: { fileSize: 500000 },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv4() + '.' + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid);
    }
});

const getWorkById = async (req, res, next) => {
    const workId = req.params.wid;

    let work;

    try {
        work = await Work.findById(workId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a work.',
            500
        );
        return next(error);
    }

    res.json({ work: work.toObject({ getters: true }) })
}

const getWorksByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userWithWorks;

    try {
        userWithWorks = await User.findById(userId).populate('works');
    } catch (err) {
        const error = new HttpError(
            'Fetching places failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!userWithWorks || userWithWorks.works.length === 0) {
        return next(
            new HttpError('Could not find places for the provided user id.', 404)
        )
    }

    res.json({
        works: userWithWorks.works.map(work =>
            work.toObject({ getters: true })
        )
    });
}

const createWork = async (req, res) => {
    const { title, description } = req.body;
    const image = req.file;

    if (!image) {
        return res.status(400).json({ message: 'Image file is required.' });
    }

    const imagePath = path.join('uploads', 'images', image.filename).replace(/\\/g, '/');

    const newWork = new Work({
        title,
        description,
        imagePath,
        userId: req.userData.userId
    });

    let user;

    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error)
    }

    console.log(user);


    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newWork.save({ session: sess });
        user.works.push(newWork);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating work failed, please try again',
            500
        );
        return next(error);
    }

    res.status(201).json({
        work: newWork,
    });
}

const getWorks = async (req, res, next) => {
    let works;

    try {
        works = await Work.find({});
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({ works: works.map(work => work.toObject({ getters: true })) });
}

const editWork = async (req, res, next) => {
    const { title, description } = req.body;
    const workId = req.params.wid;

    let work;

    try {
        work = await Work.findById(workId);
    } catch (err) {
        const error = new HttpError('Something went wrong.', 500);
        return next(error);
    }

    if (work.userId.toString() !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to edit this place',
            401
        );
        return next(error);
    }


    work.title = title;
    work.description = description;

    try {
        await work.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update work..',
            500
        )
        return next(error);
    }

    res.status(200).json({ work: work.toObject({ getters: true }) });
}

const deleteWork = async (req, res, next) => {
    const workId = req.params.wid;

    let work;

    try {
        work = await Work.findById(workId).populate('userId');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete work.',
            500
        );
        return next(error);
    }

    if (!work) {
        const error = new HttpError('Could not find work that you wanna find.. Sorry..', 404);
        return next(error);
    }

    if (work.userId.id !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this place.',
            401
        );
        return next(error);
    }

    const imagePath = work.imagePath;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await work.remove({ session: sess });
        work.userId.works.pull(work);
        await work.userId.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('failed to delete work....', 500);
        return next(error);
    }

    fs.unlink(imagePath, err => {
        console.log(err);
    })

    res.status(200).json({ message: 'Success to Delete work!!!!' });
}

exports.getWorks = getWorks;
exports.fileUpload = fileUpload;
exports.createWork = createWork;
exports.editWork = editWork;
exports.deleteWork = deleteWork;
exports.getWorkById = getWorkById;
exports.getWorksByUserId = getWorksByUserId;