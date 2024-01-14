import fs from "fs/promises";
import path from "path";
import Contact from "../models/contacts/index.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const avatarPath = path.resolve("public", "avatars");

const getAllContacts = async (req, res) => {
        const {_id: owner} = req.user;
        const {page = 1, limit = 10} = req.query;
        const skip = (page - 1) * limit;
        const result = await Contact.find({owner}, {owner}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "username");
        res.json(result);
}

const getById = async (req, res) => {
        const {id: _id} = req.params;
        const {_id: owner} = req.user;
        const result = await User.findOne({_id, owner});
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json(result);
}

const deleteById = async (req, res, next) => {
        const { id: _id } = req.params;
        const {_id: owner} = req.user;
        const result = await Contact.findByIdAndDelete({_id, owner});
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json({
            message: "Delete success"
        })
}

const add = async (req, res) => { 
        const {_id: owner} = req.user;
        const avatarPath = path.resolve("public", "avatars");
        const { path: tempDir, originalname } = req.file;
        const uploadResult = path.join(avatarPath, originalname);
        await fs.rename(tempDir, uploadResult);
        const avatar = path.join("avatars", originalname);
        const result = await Contact.create({...req.body, owner, avatar,});

        res.status(201).json(result)
}

const updateById = async (req, res) => {
        const { id: _id } = req.params;
        const result = await Contact.findByIdAndUpdate({_id, owner}, req.body, {new: true});
        if (!result) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }

        res.json(result);
}

const updateFavoriteById = async (req, res) => {
    const { id } = req.params;
    const existingContact = await Contact.findByIdAndUpdate({id, owner});
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