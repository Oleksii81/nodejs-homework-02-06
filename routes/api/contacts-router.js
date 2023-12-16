import express from "express";
import {isEmptyBody} from "../../middlewares/index.js";
import {getAllContacts,
  getById,
  add,
  updateById,
  deleteById,} from "../../controllers/contacts-controller.js";

const contactsRouter = express.Router()

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', getById);

contactsRouter.post('/', isEmptyBody, add);

contactsRouter.delete('/:id', deleteById);

contactsRouter.put('/:id', isEmptyBody, updateById);

export default contactsRouter;
