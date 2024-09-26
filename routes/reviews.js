export default async (app) => {
    const { authorized } = await import("../utils/auth.js")
    const { checkAccess } = await import("../utils/checkAccess.js")
    //================== controller ==========================================//
    const {
        reviewData,
        getReviewsData,
        getReviewsDataById,
        updateReviewData,
        deleteReviewsDetails
    } = await import("../controllers/reviews.js")

    //===============valliadtions=======================
    const {
        reviewValidation,
        reviewIdValidation
    } = await import("../validations/reviews.js")
    //=================API================================================//

    app.post("/v1/reviewData", authorized, checkAccess([1, 3]), reviewValidation, reviewData)
    app.get("/v1/getReviewsData", getReviewsData)
    app.post("/v1/getReviewsDataById", authorized, reviewIdValidation, getReviewsDataById)
    app.post("/v1/updateReviewData", authorized, reviewIdValidation, updateReviewData)
    app.post("/v1/deleteReviewsDetails", authorized, checkAccess([1, 3]), reviewIdValidation, deleteReviewsDetails)
}