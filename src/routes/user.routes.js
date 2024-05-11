// user.routes.js

import express from 'express';
import { registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middileware.js';

const router = express.Router();

// Define the registration route
// router.post('/register', registerUser);
router.route('/register').post(
    upload.fields([
{
    name:'avatar',
    maxCount:1
},

{
    name:'coverImage',
    maxCount:1
}
    ]),
    registerUser
)

export default router;
