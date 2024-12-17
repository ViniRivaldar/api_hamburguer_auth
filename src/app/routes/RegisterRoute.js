import { Router } from "express";

import RegisterController from '../controller/RegisterController.js'
import authMiddleware from "../../config/authMiddleware.js";
const router = new Router()

router.post('/', RegisterController.store)
router.put('/:id', authMiddleware,RegisterController.update)
router.delete('/:id', authMiddleware, RegisterController.delete)

export default router