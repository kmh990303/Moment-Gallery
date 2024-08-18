const express = require('express');
const { check } = require('express-validator');

const workControllers = require('../controllers/works-controllers');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/getWorks', workControllers.getWorks);

router.use(authenticate);

router.post(
    '/upload',
    workControllers.fileUpload.single('image'),
    [
        check('title')
            .not()
            .isEmpty(),
        check('description').isLength({ min: 5 }),
    ],
    workControllers.createWork
);

router.patch(
    '/edit/:wid',
    [
        check('title')
            .not()
            .isEmpty(),
        check('description').isLength({ min: 5 })
    ],
    workControllers.editWork
);

router.delete('/:wid', workControllers.deleteWork);

module.exports = router;