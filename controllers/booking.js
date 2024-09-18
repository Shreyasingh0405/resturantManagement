import bookings from "../models/bookings.js"
import resturantSchema from "../models/resturants.js"
import users from "../models/user.js"
const bookingData = async (req, res) => {
    const bookingsData = req.body
    try {
        const checkUserExist = await users.findOne({ _id: bookingsData.userId })
        if (!checkUserExist) {
            return res.send({ status: 0, msg: "Invalid Id" })
        }
        if (checkUserExist.status == 0) {
            return res.send({ status: 0, msg: "something went wrong" })
        }
        const checkResturantExist = await resturantSchema.findOne({ _id: bookingsData.resturantId })
        if (!checkResturantExist) {
            return res.send({ status: 0, msg: "Invalid Id" })
        }
        if (checkResturantExist.status == 0) {
            return res.send({ status: 0, msg: "something went wrong" })
        }
        const bookingData = await bookings.create(bookingsData)
        if (bookingData) {
            return res.send({ status: 1, msg: "booking data inserted successfully" })
        } else {
            return res.send({ status: 0, msg: "something went wrong" })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const getBookingData = async (req, res) => {
    try {
        const getBookingData = await bookings.find()
        if (getBookingData) {
            return res.send({ status: 1, msg: "data fetch successfully", data: getBookingData })
        } else {
            return res.send({ status: 0, msg: "something went wrong", data: [] })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const getBookingDataById = async (req, res) => {
    const getBookingById = req.body
    try {
        const getBooking = await bookings.findById({ _id: getBookingById.bookingId })
        if (getBooking) {
            return res.send({ status: 1, msg: "data get successfully", data: getBooking })
        } else {
            return res.send({ status: 0, msg: "data not found", data: [] })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const updateBookingData = async function (req, res) {
    const { bookingId, ...updateData } = req.body
    try {
        const bookingExist = await bookings.findById(bookingId);
        if (!bookingExist) {
            return res.send({ status: 0, msg: "Booking not found" });
        }
        if (bookingExist.status == 0) {
            return res.send({ status: 0, msg: "something went wrong" })
        }
        const updateBooking = await bookings.findByIdAndUpdate(
            bookingId,
            updateData,
            {
                new: true
            })
        if (updateBooking.matchedCount !== 0, updateBooking.modifiedData !== 0) {
            return res.send({ status: 1, msg: "data succesfully updated" })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const deleteBookingDetails = async (req, res) => {
    const deleteBooking = req.body
    try {
        const checkBookingExist = await bookings.findById(deleteBooking.bookingId)
        if (!checkBookingExist) {
            return res.send({ status: 0, msg: "bookings not found" })
        }
        if (checkBookingExist.status == 0) {
            return res.send({ status: 0, msg: "data already deleted" })
        }
        const deleteBookingDetails = await bookings.findByIdAndUpdate({ _id: deleteBooking.bookingId },
            { $set: { status: 0 } }
        )
        if (deleteBookingDetails) {
            return res.send({ status: 1, msg: "data deleted successfully" })
        } else {
            return res.send({ status: 0, msg: "something went wrong" })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

export {
    bookingData,
    getBookingData,
    getBookingDataById,
    updateBookingData,
    deleteBookingDetails
}