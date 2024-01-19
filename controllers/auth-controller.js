import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import User from "../models/User.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import { subscriptionType } from "../models/User.js";
import dotenv from "dotenv";
import Jimp from "jimp";
import { nanoid } from "nanoid";

dotenv.config();
const { JWT_SECRET, BASE_URL } = process.env;

const avatarPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationCode = nanoid();
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationCode });

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click to verify email</a>`
    }
    await sendEmail(verifyEmail);

    res.status(201).json({
        username: newUser.username,
        email: newUser.email,
    })
}

const verify = async(req, res)=> {
  const {verificationCode} = req.params;
  const user = await User.findOne({verificationCode});
  if(!user) {
      throw HttpError(400, "Email not found or already verify");
  }

  await User.findByIdAndUpdate(user._id, {verify: true, verificationCode: ""});

  res.json({
      message: "Email verify success"
  })
}

const resendVerifyEmail = async(req, res)=> {
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user) {
      throw HttpError(404, "Email not found");
  }
  if(user.verify) {
      throw HttpError(400, "Email already verify");
  }

  const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Click to verify email</a>`,
  }

  await sendEmail(verifyEmail);

  res.json({
      message: "Verify email send success"
  })
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }
    if(!user.verify) {
      throw HttpError(401, "Email not verify");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const {_id: id} = user;
    const payload = {
        id
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, {token});
    
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
    },
    })
}

const getCurrent = async (req, res) => {
    const { username, email } = req.user;

    res.json({
        username,
        email,
    })
}

const signout = async(req, res)=> {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        message: "Signout success"
    })
}

const updateSubscription = async (req, res) => {
    const { _id } = req.user;
    try {
      const { subscription } = req.body;
      if (!subscriptionType.includes(subscription)) {
        throw HttpError(400, "Invalid subscription value");
      }
  
      const result = await User.findByIdAndUpdate(
        _id,
        { subscription },
        { new: true }
      );
      if (!result) {
        throw HttpError(404, "User not found");
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }; 

const updateAvatar = async (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
    }
    const { _id } = req.user;
    const { path: tempDir, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const uploadResult = path.join(avatarPath, filename);
    await fs.rename(tempDir, uploadResult);  
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    const avatar = await Jimp.read(uploadResult);
    avatar.resize(250, 250).writeAsync(uploadResult);

    res.json({
        avatarURL,
      });
    };

export default {
    signup: ctrlWrapper(signup),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}