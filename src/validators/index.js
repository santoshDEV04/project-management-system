import { body } from "express-validator";

const userRegisterValdator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),

        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowerCase()
            .withMessage("Username must be in lowercase")
            .isLength({ min : 3 })
            .withMessage("Username must be at least 3 characters long"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required"),
        body("fullName")
            .notEmpty()
            .trim()
        ]
}


export {
    userRegisterValdator
}