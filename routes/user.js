export default async (app) => {
    const { authorized } = await import("../utils/auth.js")

    //================== controller ==========================================//
    const {
        userRegistration,
        getUserData,
        verifyEmail,
        sentOtp,
        verifyOTP,
        getUserDataById,
        userLogin,
        updateUserData,
        changePinOrMobile,
        //forgetPassword,
        deleteUserDetails
    } = await import("../controllers/users.js");

    //=================validations===================================//
    const {
        userValidation,
        userIdValidation,
        loginUserValidation,
        //forgetPasswordValidation
    } = await import("../validations/user.js");
    //=================API================================================//
    app.post("/userRegistration", userRegistration);
    app.get('/verifyEmail', verifyEmail);
    app.post("/sentOtp",sentOtp);
    app.post("/verifyOTP",verifyOTP);
    app.post("/changePinOrMobile",changePinOrMobile)
    app.get("/getUserData", authorized, getUserData);
    app.post("/getUserDataById", authorized, userIdValidation, getUserDataById);
    app.post("/userLogin", userLogin);
    app.post("/updateUserData", authorized, userIdValidation, updateUserData);
   // app.post("/forgetPassword", forgetPasswordValidation, forgetPassword);
    app.post("/deleteUserDetails", authorized, userIdValidation, deleteUserDetails);
}