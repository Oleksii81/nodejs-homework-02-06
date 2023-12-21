import { listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact, } from "../models/contacts/index.js";
import { HttpError } from "../helpers/index.js";
import { contactsAddShema, contactsUpdateShema } from "../shemas/contact-shemas.js";

const getAllContacts = async (req, res, next) => {
    try {
        const result = await listContacts();
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

const getById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await getContactById(id);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

const deleteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await removeContact(id);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json({
            message: "Delete success"
        })
    }
    catch (error) {
        next(error);
    }
}

const add = async (req, res, next) => {
    try {
        const { error } = contactsAddShema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const result = await addContact(req.body);

        res.status(201).json(result)
    }
    catch (error) {
        next(error);
    }
}

const updateById = async (req, res, next) => {
    try {
        const { error } = contactsUpdateShema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const { id } = req.params;
        const result = await updateContact(id, req.body);
        if (!result) {
            throw HttpError(404, `Movie with id=${id} not found`);
        }

        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

export {
    getAllContacts,
    getById,
    add,
    updateById,
    deleteById,
}