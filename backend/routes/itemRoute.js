import express from 'express'
import auth from '../middlewares/auth.js'
import uploadImage from '../middlewares/upload.js'

import {
    addItem,
    deleteItem,
    editItem,
    getItemById
} from '../controllers/itemController.js'

const itemRouter = express.Router()


// Item routes
itemRouter.post('/add/:shopId', auth, uploadImage, addItem)
itemRouter.patch('/:itemId', auth, uploadImage, editItem)
itemRouter.get('/:itemId', getItemById)
itemRouter.delete('/:itemId', auth, deleteItem)

export default itemRouter