import express from "express";
import authController from "../../controllers/auth-controller.js";
import {authenticate, isEmptyBody, upload} from "../../middlewares/index.js";
import {validateBody} from "../../decorators/index.js";
import { userSignupSchema, userSigninSchema, updateSubscriptionSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, validateBody(userSignupSchema), authController.signup);

authRouter.post("/login", isEmptyBody, validateBody(userSigninSchema), authController.signin);
upload
authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.signout);

authRouter.patch("/users", authenticate, validateBody(updateSubscriptionSchema), authController.updateSubscription);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar);

export default authRouter;