import { Router } from "express";

import RegisterController from '../controller/RegisterController.js'
const router = new Router()

router.post('/', RegisterController.store)

export default router