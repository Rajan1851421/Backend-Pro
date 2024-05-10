// user.routes.js

import express from 'express';
import { registerUser } from '../controllers/user.controller.js';

const router = express.Router();

// Define the registration route
router.post('/register', registerUser);

export default router;
