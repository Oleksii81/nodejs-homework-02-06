import Contact from "../models/contacts/index.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAllContacts = async (__, res) => {
        const result = await Contact.find();
        res.json(result);
}

const getById = async (req, res, next) => {
        const {id} = req.params;
        const result = await Contact.findById(id);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json(result);
}

const deleteById = async (req, res, next) => {
        const { id } = req.params;
        const result = await Contact.findByIdAndDelete(id);
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json({
            message: "Delete success"
        })
}

const add = async (req, res, next) => { 
        const result = await Contact.create(req.body);

        res.status(201).json(result)
}

const updateById = async (req, res, next) => {
        const { id } = req.params;
        const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }

        res.json(result);
}

const updateFavoriteById = async (req, res) => {
    const { id } = req.params;
    const existingContact = await Contact.findByIdAndUpdate(id);
    if (!existingContact) {
      throw HttpError(404, "Contact was not found");
    }
    if (!req.body.favorite) {
      return res.status(400).json({ message: "missing field favorite" });
    }
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});

    res.status(200).send(result);
  };

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
    updateFavoriteById: ctrlWrapper(updateFavoriteById),
}