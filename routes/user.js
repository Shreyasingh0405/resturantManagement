export default async (app) => {

    //================== controller ==========================================//
    const {
        userRegistration,
        getUserData,
        getUserDataById,
        userLogin,
        updateUserData,
        forgetPassword,
        deleteUserDetails
    } = await import("../controllers/users.js")

    //=================validations===================================//
    const {
        userValidation,
        userIdValidation,
        loginUserValidation,
        forgetPasswordValidation
    } = await import("../validations/user.js")
    //=================API================================================//
    app.post("/userRegistration", userValidation, userRegistration)
    app.get("/getUserData", getUserData)
    app.post("/getUserDataById", userIdValidation, getUserDataById)
    app.post("/userLogin", loginUserValidation, userLogin)
    app.post("/updateUserData", userIdValidation, updateUserData)
    app.post("/forgetPassword", forgetPasswordValidation, forgetPassword)
    app.post("/deleteUserDetails", userIdValidation, deleteUserDetails)
}