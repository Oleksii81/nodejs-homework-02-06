import {Schema, model} from "mongoose";
import Joi from "joi";

import {handleSaveError, addUpdateSettings} from "./hooks.js";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const subscriptionType = ["starter", "pro", "business"]; 

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "User name is required"]
    },
    subscription: {
        type: String,
        enum: subscriptionType,
        default: "starter"
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        minLength: 6,
        required: [true, 'Set password for user'],
    },
    token: {
        type: String,
    }
}, {versionKey: false, timestamps: true});

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", addUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
    username: Joi.string().required(),
    subscription: Joi.string().valid(...subscriptionType).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

export const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

export const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string()
      .valid(...subscriptionType)
      .required(),
  });

const User = model("user", userSchema);

export default User;