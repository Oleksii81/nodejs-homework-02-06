import express from "express";
import authController from "../../controllers/auth-controller.js";
import {authenticate, isEmptyBody} from "../../middlewares/index.js";
import {validateBody} from "../../decorators/index.js";
import { userSignupSchema, userSigninSchema, updateSubscriptionSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, validateBody(userSignupSchema), authController.signup);

authRouter.post("/login", isEmptyBody, validateBody(userSigninSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.signout);

authRouter.patch("/users", authenticate, validateBody(updateSubscriptionSchema), authController.updateSubscription);

export default authRouter;