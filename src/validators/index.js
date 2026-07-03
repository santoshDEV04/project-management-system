import { body } from "express-validator";

const userRegisterValdator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),

        body("userName")
            .trim()
            .notEmpty()
            .withMessage("UserName is required")
            .toLowerCase()
            .withMessage("UserName must be in lowercase")
            .isLength({ min : 3 })
            .withMessage("UserName must be at least 3 characters long"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required"),
        body("fullName")
            .notEmpty()
            .trim()
            .optional(true)
        ]
}

const userLoginValidator = () => {
    return [
        body("email")
        .optional()
        .isEmail()
        .withMessage(),
        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ]
}

export {
    userRegisterValdator, userLoginValidator
}