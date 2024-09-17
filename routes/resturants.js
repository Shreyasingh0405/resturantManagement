export default async (app) => {

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

    app.post("/resturantRegistration", restaurantValidation, resturantRegistration)
    app.get("/getResturantData", getResturantData)
    app.post("/getResturantDataById", resturantIdValidation, getResturantDataById)
    app.post("/updateResturantData", resturantIdValidation, updateResturantData)
    app.post("/deleteResturantDetails", resturantIdValidation, deleteResturantDetails)
}