import {Schema, model} from "mongoose";
import Joi from "joi";

import {handleSaveError, addUpdateSettings} from "../hooks.js";

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
}, {versionKey: false, timestamps: true});

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", addUpdateSettings);

contactSchema.post("findOneAndUpdate", handleSaveError);

export const contactsAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" must be exist`
  }),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
})

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})

const Contact = model("db-contacts", contactSchema);

export default Contact;