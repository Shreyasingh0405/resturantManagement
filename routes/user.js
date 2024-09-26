export default async (app) => {
    const { authorized } = await import("../utils/auth.js");
    const { checkAccess } = await import("../utils/checkAccess.js")

    //================== controller ==========================================//
    const {
        userRegistration,
        getUserData,
        verifyEmail,
        sentOtp,
        resendOtp,
        verifyOTP,
        getUserDataById,
        enableLocation,
        userLogin,
        updateUserData,
        changePinOrMobile,
        forgetPassword,
        deleteUserDetails,
        logOut
    } = await import("../controllers/users.js");

    //=================validations===================================//
    const {
        userValidation,
        userIdValidation,
        loginUserValidation,
        sentOtpValidation,
        verifyOtpValidation,
        forgetPasswordValidation,
        changePinOrMobileValidation,
        logOutIdValidation
    } = await import("../validations/user.js");

    //=================API================================================//
    //=====================Version1=======================================//

    app.get("/v1/getUserData", authorized, getUserData);
    app.post("/v1/getUserDataById", authorized, userIdValidation, getUserDataById);
    app.post("/v1/updateUserData", authorized, userIdValidation, updateUserData);
    app.post("/v1/deleteUserDetails", authorized, checkAccess([3]), userIdValidation, deleteUserDetails);
    
    // app.post("/v1/userRegistration", userRegistration);     //updated is v2 so this route not in use
    // app.post("/v1/forgetPassword", forgetPasswordValidation, forgetPassword); //updated is v2 so this route not in use

    //======================Version 2======================================//

    app.post("/v2/userRegistration", userValidation, userRegistration);
    app.post("/v2/userLogin", loginUserValidation, userLogin);
    app.get('/v2/verifyEmail', verifyEmail);
    app.post("/v2/sentOtp", sentOtpValidation, sentOtp);
    app.post("/v2/resendOtp", sentOtpValidation, resendOtp)
    app.post("/v2/verifyOTP", verifyOtpValidation, verifyOTP);
    app.post("/v2/changePinOrMobile", changePinOrMobileValidation, changePinOrMobile)
    app.post("/v2/logOut", authorized, logOutIdValidation, logOut)
    app.post("/v2/enableLocation", authorized, userIdValidation, enableLocation)
}