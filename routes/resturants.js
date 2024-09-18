export default async (app) => {
const { authorized } = await import("../utils/auth.js")
const {checkAccess}= await import ("../utils/checkAccess.js")
const {uploadImage} =await import ("../utils/multer.js");

    //================== controller ==========================================//
    const {
        resturantRegistration,
        getResturantData,
        getResturantDataById,
        updateResturantData,
        deleteResturantDetails
    } = await import("../controllers/resturants.js")

    //================validations=========================//
    const {
        restaurantValidation,
        resturantIdValidation
    } = await import("../validations/resturant.js")
    //=================API================================================//

    app.post("/resturantRegistration",authorized,checkAccess([2, 3]),uploadImage,restaurantValidation, resturantRegistration)
    app.get("/getResturantData", getResturantData)
    app.post("/getResturantDataById", resturantIdValidation, getResturantDataById)
    app.post("/updateResturantData",authorized,checkAccess([2, 3]), resturantIdValidation, updateResturantData)
    app.post("/deleteResturantDetails",authorized,checkAccess([3]), resturantIdValidation, deleteResturantDetails)
}