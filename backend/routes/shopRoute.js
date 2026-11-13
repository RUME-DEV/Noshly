import express from 'express'
import auth from '../middlewares/auth.js'
import uploadImage from '../middlewares/upload.js'

import { createShop, getShops, getShopAndItemsById, updateShop, updateShopStatus, getMyShops, getMyShopById } from '../controllers/shopController.js'


const shopRouter = express.Router()



// Shop routes
shopRouter.post('/create', auth, uploadImage, createShop)
shopRouter.get('/', getShops)
shopRouter.get('/my-shops', auth, getMyShops)
shopRouter.get('/manage/:shopId', auth, getMyShopById)
shopRouter.get('/:shopId', getShopAndItemsById)
shopRouter.patch('/:shopId', auth, uploadImage, updateShop)
shopRouter.patch('/:shopId/status', auth, updateShopStatus)


export default shopRouter