import { checkAccess } from "../utils/checkAccess.js"
export default async (app) => {
    const { authorized } = await import("../utils/auth.js")

    //================== controller ==========================================//
    const {
        bookingData,
        getBookingData,
        getBookingDataById,
        updateBookingData,
        deleteBookingDetails
    } = await import("../controllers/booking.js")

    //==================validations======================================//
    const {
        bookingValidation,
        bookingIdValidation
    } = await import("../validations/booking.js")
    //=================API================================================//

    app.post("/v1/bookingData", authorized, bookingValidation, bookingData)
    app.get("/v1/getBookingData",authorized,checkAccess([2,3]), getBookingData)
    app.post("/v1/getBookingDataById", authorized, bookingIdValidation, getBookingDataById)
    app.post("/v1/updateBookingData", authorized, bookingIdValidation, updateBookingData)
    app.post("/v1/deleteBookingDetails", authorized, bookingIdValidation, deleteBookingDetails)
}