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

    app.post("/bookingData", authorized, bookingValidation, bookingData)
    app.get("/getBookingData", getBookingData)
    app.post("/getBookingDataById", authorized, bookingIdValidation, getBookingDataById)
    app.post("/updateBookingData", authorized, bookingIdValidation, updateBookingData)
    app.post("/deleteBookingDetails", authorized, bookingIdValidation, deleteBookingDetails)
}