import { check, validationResult } from "express-validator";

// Restaurant validation
const restaurantValidation = [
    check("resturantName")
        .notEmpty().withMessage("resturantName is required")
        .isString().withMessage("resturantName must be a string")
        .trim(),
    check("address.street")
        .notEmpty().withMessage("Street address is required")
        .isString().withMessage("Street must be a string")
        .trim(),
    check("address.city")
        .notEmpty().withMessage("City is required")
        .isString().withMessage("City must be a string")
        .trim(),
    check("address.state")
        .notEmpty().withMessage("State is required")
        .isString().withMessage("State must be a string")
        .trim(),
    check("address.zipCode")
        .notEmpty().withMessage("Zip code is required")
        .isPostalCode('IN').withMessage("Invalid zip code format"),
    check("contactInfo.phone")
        .notEmpty().withMessage("Phone number is required")
        .isMobilePhone('en-IN').withMessage("Invalid phone number format"),
    check("contactInfo.email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    check("menu.veg.*.itemName")
        .notEmpty().withMessage("Veg itemName is required")
        .isString().withMessage("Veg itemName must be a string")
        .trim(),
    check("menu.veg.*.price")
        .notEmpty().withMessage("Veg item price is required")
        .isFloat({ gt: 0 }).withMessage("Veg item price must be a positive number"),
    check("menu.veg.*.description")
        .optional()
        .isString().withMessage("Veg item description must be a string")
        .trim(),
    check("menu.nonVeg.*.itemName")
        .notEmpty().withMessage("Non-veg itemName is required")
        .isString().withMessage("Non-veg itemName must be a string")
        .trim(),
    check("menu.nonVeg.*.price")
        .notEmpty().withMessage("Non-veg item price is required")
        .isFloat({ gt: 0 }).withMessage("Non-veg item price must be a positive number"),
    check("menu.nonVeg.*.description")
        .optional()
        .isString().withMessage("Non-veg item description must be a string")
        .trim(),
    check("averagePricePerPerson")
        .optional()
        .isString().withMessage("averagePricePerPerson must be a string")
        .trim(),
    check("ownerId")
        .notEmpty().withMessage("ownerId is required")
        .isMongoId().withMessage("Invalid owner ID"),
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

const resturantIdValidation = [
    check("resturantId")
        .isMongoId().withMessage("Invalid booking ID")
        .notEmpty().withMessage("resturantId is required"),
    (req, res, next) => {
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            return res.send({ status: 0, message: errors[0].msg });
        }
        return next();
    }
];

export {
    restaurantValidation,
    resturantIdValidation
};
