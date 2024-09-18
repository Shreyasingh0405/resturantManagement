export default async (app) => {
    const { authorized } = await import("../utils/auth.js")

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
    app.get("/getUserData", authorized, getUserData)
    app.post("/getUserDataById", authorized, userIdValidation, getUserDataById)
    app.post("/userLogin", loginUserValidation, userLogin)
    app.post("/updateUserData", authorized, userIdValidation, updateUserData)
    app.post("/forgetPassword", forgetPasswordValidation, forgetPassword)
    app.post("/deleteUserDetails", authorized, userIdValidation, deleteUserDetails)
}