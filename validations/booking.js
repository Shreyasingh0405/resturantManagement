import { check, validationResult } from "express-validator";
// Booking validation
const bookingValidation = [
    check("resturantId")
        .isMongoId().withMessage("Invalid restaurant ID")
        .notEmpty().withMessage("restaurantId is required"),
    check("userId")
        .isMongoId().withMessage("Invalid user ID")
        .notEmpty().withMessage("userId is required"),
    check("numberOfPeople")
        .isInt({ gt: 0 }).withMessage("numberOfPeople should be a positive integer")
        .notEmpty().withMessage("numberOfPeople is required"),
    check("date")
        .isISO8601().withMessage("Invalid date format, should be in YYYY-MM-DD format")
        .notEmpty().withMessage("date is required"),
    check("specialRequests")
        .optional().isString().withMessage("specialRequests should be a string"),
    check("bookingStatus")
        .optional()
        .isIn(['pending', 'confirmed', 'cancelled']).withMessage("Invalid booking status"),
    check("status")
        .optional()
        .isIn([0, 1, 2]).withMessage("Invalid status value"), // 0: deleted, 1: active, 2: inactive
    (req, res, next) => {
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            return res.send({ status: 0, message: errors[0].msg });
        }
        return next();
    }
];

// Booking ID validation
const bookingIdValidation = [
    check("bookingId")
        .isMongoId().withMessage("Invalid booking ID")
        .notEmpty().withMessage("bookingId is required"),
    (req, res, next) => {
        const errors = validationResult(req).array();
        if (errors.length > 0) {
            return res.send({ status: 0, message: errors[0].msg });
        }
        return next();
    }
];

export {
    bookingValidation,
    bookingIdValidation
};
