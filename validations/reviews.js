import { check, validationResult } from "express-validator";

const reviewValidation = [
    check("resturantId")
        .notEmpty().withMessage("resturantId is required")
        .isMongoId().withMessage("Invalid resturantId format"),
    check("userId")
        .notEmpty().withMessage("userId is required")
        .isMongoId().withMessage("Invalid userId format"),
    check("rating")
        .notEmpty().withMessage("Rating is required")
        .isInt({ min: 1, max: 5 }).withMessage("Rating must be a number between 1 and 5"),
    check("comment")
        .notEmpty().withMessage("Comment is required")
        .isString().withMessage("Comment must be a string")
        .trim(),
    check("response")
        .optional()
        .isString().withMessage("Response must be a string")
        .trim(),
    check("status")
        .optional()
        .isIn([0, 1, 2]).withMessage("Invalid status value (0: Deleted, 1: Active, 2: Inactive)"),
    (req, res, next) => {
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            return res.send({ status: 0, message: errors[0].msg });
        }
        return next();
    }
];
const reviewIdValidation = [
    check("reviewId")
        .isMongoId().withMessage("Invalid booking ID")
        .notEmpty().withMessage("reviewId is required"),
    (req, res, next) => {
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            return res.send({ status: 0, message: errors[0].msg });
        }
        return next();
    }
];

export {
    reviewValidation,
    reviewIdValidation
};
