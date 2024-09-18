import { check, validationResult } from "express-validator";

// User validation
const userValidation = [
    check("firstName")
        .notEmpty().withMessage("firstName is required")
        .isString().withMessage("firstName must be a string")
        .trim(),
    check("lastName")
        .notEmpty().withMessage("lastName is required")
        .isString().withMessage("lastName must be a string")
        .trim(),
    check("mobile")
        .notEmpty().withMessage("mobile is required")
        .isMobilePhone().withMessage("Invalid mobile number"),
    check("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("Invalid email format")
        .trim()
        .toLowerCase(),
    check("password")
        .notEmpty().withMessage("password is required")
        .isStrongPassword().withMessage("password must be strong with one uppercase,one numeric and one special charcter"),
    check("role")
        .optional()
        .isIn([1, 2, 3]).withMessage("Invalid role value, must be 1 (User), 2 (Admin), or 3 (Business Owner)"),
    check("status")
        .optional()
        .isIn([0, 1, 2]).withMessage("Invalid status value, must be 0 (Deleted), 1 (Active), or 2 (Inactive)"),
    (req, res, next) => {
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            return res.send({ status: 0, message: errors[0].msg });
        }
        return next();
    }
];

// User ID validation
const userIdValidation = [
    check("userId")
        .isMongoId().withMessage("Invalid user ID")
        .notEmpty().withMessage("userId is required"),
    (req, res, next) => {
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            return res.send({ status: 0, message: errors[0].msg });
        }
        return next();
    }
];

const loginUserValidation = [
    check("email")
        .notEmpty().withMessage("Email should be required and in proper format"),
    check("password")
        .notEmpty().withMessage("password is required"),
    (req, res, next) => {
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            return res.send({ status: 0, message: errors[0].msg });
        }
        return next();
    },
];

const forgetPasswordValidation = [
    check("userId").isMongoId().withMessage("Invalid user ID").notEmpty().withMessage("userId should be required "),
    check("password")
        .notEmpty().withMessage("password is required")
        .isStrongPassword().withMessage("password must be strong with one uppercase,one numeric and one special charcter"),
    check("confirmPassword")
        .notEmpty().withMessage("confirmPassword is required")
        .isStrongPassword().withMessage("password must be strong with one uppercase,one numeric and one special charcter"),
 (req, res, next) => {
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            return res.send({ status: 0, message: errors[0].msg });
        }
        return next();
    },
];
export {
    userValidation,
    userIdValidation,
    loginUserValidation,
    forgetPasswordValidation
};
