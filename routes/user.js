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
        forgetPassword,
        deleteUserDetails
    } = await import("../controllers/users.js");

    //=================validations===================================//
    const {
        userValidation,
        userIdValidation,
        loginUserValidation,
        sentOtpValidation,
        verifyOtpValidation,
        forgetPasswordValidation,
        changePinOrMobileValidation
    } = await import("../validations/user.js");
    //=================API================================================//
    app.post("/v1/v2/userRegistration", userValidation, userRegistration);
    app.get('/v2/verifyEmail', verifyEmail);
    app.post("/v2/sentOtp", sentOtpValidation, sentOtp);
    app.post("/v2/verifyOTP", verifyOtpValidation, verifyOTP);
    app.post("/v2/changePinOrMobile", changePinOrMobileValidation, changePinOrMobile)
    app.get("/v1/getUserData", authorized, getUserData);
    app.post("/v1/getUserDataById", authorized, userIdValidation, getUserDataById);
    app.post("/v1/v2/userLogin", loginUserValidation, userLogin);
    app.post("/v1/updateUserData", authorized, userIdValidation, updateUserData);
    app.post("/v1/forgetPassword", forgetPasswordValidation, forgetPassword);
    app.post("/v1/deleteUserDetails", authorized, userIdValidation, deleteUserDetails);
}