export default async (app) => {

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

    app.post("/reviewData", reviewValidation, reviewData)
    app.get("/getReviewsData", getReviewsData)
    app.post("/getReviewsDataById", reviewIdValidation, getReviewsDataById)
    app.post("/updateReviewData", reviewIdValidation, updateReviewData)
    app.post("/deleteReviewsDetails", reviewIdValidation, deleteReviewsDetails)
}