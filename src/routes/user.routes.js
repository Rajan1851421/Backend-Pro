// user.routes.js

import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middileware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';


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

router.route('/login').post(loginUser)

router.route('/logout').post(verifyJWT , logoutUser)

export default router;
