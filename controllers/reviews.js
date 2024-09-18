import reviews from "../models/reviews.js"
import resturantSchema from "../models/resturants.js"
import users from "../models/user.js"
const reviewData = async (req, res) => {
    const reviewsData = req.body
    try {
        const checkUserExist = await users.findOne({ _id: reviewsData.userId })
        if (!checkUserExist) {
            return res.send({ status: 0, msg: "Invalid Id" })
        }
        if (checkUserExist.status == 0) {
            return res.send({ status: 0, msg: "something went wrong" })
        }
        const checkResturantExist = await resturantSchema.findOne({ _id: reviewsData.resturantId })
        if (!checkResturantExist) {
            return res.send({ status: 0, msg: "Invalid Id" })
        }
        if (checkResturantExist.status == 0) {
            return res.send({ status: 0, msg: "something went wrong" })
        }
        const reviewData = await reviews.create(reviewsData)
        if (reviewData) {
            return res.send({ status: 1, msg: "review data inserted successfully" })
        } else {
            return res.send({ status: 0, msg: "something went wrong" })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const getReviewsData = async (req, res) => {
    try {
        const getReviewsData = await reviews.find()
        if (getReviewsData) {
            return res.send({ status: 1, msg: "data fetch successfully", data: getReviewsData })
        } else {
            return res.send({ status: 0, msg: "something went wrong", data: [] })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const getReviewsDataById = async (req, res) => {
    const getReviewsById = req.body
    try {
        const reviewsExist = await reviews.findById(getReviewsById.reviewId);
        if (!reviewsExist) {
            return res.send({ status: 0, msg: "reviews not found" });
        }
        const getReviews = await reviews.findById({ _id: getReviewsById.reviewId })
        if (getReviews) {
            return res.send({ status: 1, msg: "data get successfully", data: getReviews })
        } else {
            return res.send({ status: 0, msg: "data not found", data: [] })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const updateReviewData = async function (req, res) {
    const { reviewId, ...updateData } = req.body
    try {
        const reviewsExist = await reviews.findById(reviewId);
        if (!reviewsExist) {
            return res.send({ status: 0, msg: "reviews not found" });
        }
        if (reviewsExist.status == 0) {
            return res.send({ status: 0, msg: "something went wrong" })
        }
        const updateReview = await reviews.findByIdAndUpdate(
            reviewId,
            updateData,
            { new: true }
        )
        if (updateReview.matchedCount !== 0, updateReview.modifiedData !== 0) {
            return res.send({ status: 1, msg: "data succesfully updated" })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const deleteReviewsDetails = async (req, res) => {
    const deleteReviews = req.body
    try {
        const checkReviewsExist = await reviews.findById(deleteReviews.reviewsId)
        if (!checkReviewsExist) {
            return res.send({ status: 0, msg: "reviews not found" })
        }
        if (checkReviewsExist.status == 0) {
            return res.send({ status: 0, msg: "data already deleted" })
        }
        const deleteReviewsDetails = await reviews.findByIdAndUpdate({ _id: deleteReviews.reviewsId },
            { $set: { status: 0 } }
        )
        if (deleteReviewsDetails) {
            return res.send({ status: 1, msg: "data deleted successfully" })
        } else {
            return res.send({ status: 0, msg: "something went wrong" })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

export {
    reviewData,
    getReviewsData,
    getReviewsDataById,
    updateReviewData,
    deleteReviewsDetails
}