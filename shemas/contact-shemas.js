import Joi from "joi";

export const contactsAddShema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": `"name" must be exist`
    }),
    email: Joi.string().required(),
    phone: Joi.string().required(),
});

export const contactsUpdateShema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
});