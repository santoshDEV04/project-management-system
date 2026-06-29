import { Router } from "express"
import { registerUser } from "../controllers/auth.controller.js"

import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValdator } from "../validators/index.js"
const router = Router();

router.route("/register").post(userRegisterValdator(),validate,registerUser);

export default router;