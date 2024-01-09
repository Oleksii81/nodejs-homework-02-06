import express from "express";
import {authenticate, isEmptyBody, isValidId} from "../../middlewares/index.js";
import contactController from "../../controllers/contacts-controller.js";
import { contactsAddSchema, updateFavoriteSchema } from "../../models/contacts/index.js";
import { validateBody } from "../../decorators/index.js"

const contactsRouter = express.Router()

contactsRouter.use(authenticate);

contactsRouter.get('/', contactController.getAllContacts);

contactsRouter.get('/:id', isValidId, contactController.getById);

contactsRouter.post('/', isEmptyBody, validateBody(contactsAddSchema), contactController.add);

contactsRouter.delete('/:id', isValidId, contactController.deleteById);

contactsRouter.put('/:id', isValidId, isEmptyBody, validateBody(contactsAddSchema), contactController.updateById);

contactsRouter.patch('/:id/favorite', isValidId, validateBody(updateFavoriteSchema), contactController.updateFavoriteById);

export default contactsRouter;