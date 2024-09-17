export default async (app) => {

    //================== controller ==========================================//
    const {
        bookingData,
        getBookingData,
        getBookingDataById,
        updateBookingData,
        deleteBookingDetails
    } = await import("../controllers/booking.js")

    //==================validations======================================//
    const{
        bookingValidation,
        bookingIdValidation
    } = await import("../validations/booking.js")
    //=================API================================================//

    app.post("/bookingData",bookingValidation, bookingData)
    app.get("/getBookingData", getBookingData)
    app.post("/getBookingDataById",bookingIdValidation, getBookingDataById)
    app.post("/updateBookingData",bookingIdValidation, updateBookingData)
    app.post("/deleteBookingDetails",bookingIdValidation, deleteBookingDetails)
}