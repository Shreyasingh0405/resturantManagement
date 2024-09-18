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

    app.post("/reviewData", authorized, checkAccess([1, 3]), reviewValidation, reviewData)
    app.get("/getReviewsData", getReviewsData)
    app.post("/getReviewsDataById", authorized, reviewIdValidation, getReviewsDataById)
    app.post("/updateReviewData", authorized, reviewIdValidation, updateReviewData)
    app.post("/deleteReviewsDetails", authorized, checkAccess([1, 3]), reviewIdValidation, deleteReviewsDetails)
}