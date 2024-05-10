// user.controller.js

import { asyncHandler } from '../utils/asyncHandle.js';

const registerUser = asyncHandler(async (req, res) => {
    // Business logic for registering the user

    // Assuming registration is successful, send a JSON response
    res.status(200).json({
        success: true,
        message: 'User registered successfully',
       
    });
    console.log(registerUser);
});

export  {registerUser};
