import { Router } from 'express';
import {  userRegister } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { jwtVerify } from '../middlewares/auth.middleware.js';
const router = Router();

router.route('/register').post(
  // upload.fields([
  //   {
  //     name: 'avatar',
  //     maxCount: 1,
  //   },
  //   {
  //     name: 'coverImage',
  //     maxCount: 1,
  //   },
  // ]),
  userRegister
);
// router.route("/login").post(userLogin);

///////// secure routes

// router.route("/logout").get(jwtVerify,);




export default router;
