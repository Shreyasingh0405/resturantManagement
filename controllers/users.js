import user from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import CONFIG from "../config/config.js"
import sendEmail from "../utils/nodemailer.js"
import common from "../utils/common.js";

const userRegistration = async function (req, res) {
    const registeredData = req.body
    try {
        const mobile = await user.findOne({ mobile: registeredData.mobile })
        if (mobile) {
            return res.send({ status: 0, msg: "mobile already exist" })
        }
        const checkEmail = await user.findOne({ email: registeredData.email })
        if (checkEmail) {
            return res.send({ status: 0, msg: "email already exist" })
        }
        if (registeredData.loginPin !== registeredData.confirmLoginPin) {
            return res.send({ status: 0, msg: "pin and confirm loginPin should be same" })
        }
        registeredData.loginPin = bcrypt.hashSync(registeredData.loginPin, 10)
        const verificationToken = common.generateUniqueToken();
        registeredData.verificationToken = verificationToken;
        const registeredUser = await user.create(registeredData)
        if (registeredUser) {
            const mailOptions = {
                from: CONFIG.SMTP_USER,
                to: registeredData.email,
                subject: 'Email Verification',
                text: `Please verify your email by clicking on this link: /verify-email?token=${verificationToken}`
            };
            await sendEmail(mailOptions);
            return res.send({ status: 1, msg: "data registered succesfully" })
        } else {
            return res.send({ status: 0, msg: "something went wrong" })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const userToVerify = await user.findOne({ verificationToken: token });
        if (!userToVerify) {
            return res.send({ status: 0, msg: "Invalid token or user not found" });
        }
        await user.updateOne(
            { _id: userToVerify._id },
            {
                $set: { isEmailVerified: 1 }, // Set email as verified
                $unset: { verificationToken: 1 } // Remove the verificationToken field
            }
        );

        return res.send({ status: 1, msg: "Email verified successfully!" });
    } catch (error) {
        return res.send({ status: 0, msg: error.message });
    }
};

const userLogin = async (req, res) => {
    const { email, loginPin, mobile } = req.body;

    try {
        const userQuery = email ? { email } : { mobile };
        const userData = await user.findOne(userQuery);

        if (!userData) {
            return res.send({ status: 0, msg: "You are not registered" });
        }

        // Check if the account is active
        if (userData.status === 0) {
            return res.send({ status: 0, msg: "Something went wrong" });
        }

        // Ensure the email is verified (if logging in by email)
        if (email && userData.isEmailVerified === 0) {
            return res.send({ status: 0, msg: "Please verify your email for login" });
        }

        // Compare login pin
        bcrypt.compare(loginPin, userData.loginPin, function (err, result) {
            if (result === true) {
                const token = jwt.sign(
                    {
                        userId: userData._id,
                        email: userData.email,
                        role: userData.role,
                    },
                    CONFIG.JWT_KEY,
                    { algorithm: "RS256", expiresIn: "1d" }
                );

                if (token) {
                    return res.send({
                        status: 1,
                        msg: "Login successfully",
                        data: token,
                    });
                }
            } else if (err) {
                return res.send({
                    status: 0,
                    msg: "Invalid username or password",
                });
            }

            return res.send({
                status: 0,
                msg: "Invalid username or password",
            });
        });
    } catch (error) {
        return res.send({ status: 0, msg: error.message });
    }
};


const forgetPassword = async (req, res) => {
    const { email, password, confirmPassword, userId } = req.body
    try {
        const checkEmail = await user.findOne(email)
        if (!checkEmail) {
            return res.send({ status: 0, msg: "you are not registered" })
        }
        if (checkEmail.status === 0) {
            return res.send({ status: 0, msg: "something went wrong" });
        }
        if (password !== confirmPassword) {
            return res.send({ status: 0, msg: "password and confirmPassword should be same" })
        }
        const checkUserExist = await user.findById(userId)
        if (!checkUserExist) {
            return res.send({ status: 0, msg: "user not found" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        checkUserExist.password = hashedPassword;
        await checkUserExist.save();
        return res.send({ status: 1, msg: "Password reset successfully" });
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const sentOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const userData = await user.findOne({ email });
        if (!userData) {
            return res.send({ status: 0, msg: "User not found" });
        }
        const otp = common.otpGenerate();
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
        const otpSent = await user.findOneAndUpdate(
            { email },
            { otp, otpExpiration: expirationTime }
        );
        if (otpSent) {
            const mailOptions = {
                from: CONFIG.SMTP_USER,
                to: email,
                subject: "OTP Sent",
                text: "otp sent ",
            };
            await sendEmail(mailOptions);
            return res.send({
                status: 1,
                message: "OTP sent to email successfully",
            });
        } else {
            return res.send({
                status: 0,
                message: "Failed to process request",
            });
        }
    } catch (error) {
        return res.send({ status: 0, message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { otp, userId } = req.body;
        const otpVerification = await user.findOne({
            _id: userId,
            otp: otp,
        });
        if (otpVerification && otpVerification.otp === otp) {
            const currentTime = new Date();
            if (currentTime >= otpVerification.otpExpiration) {
                return res.send({ status: 0, msg: "OTP timeout" });
            }
            const updateResult = await user.updateOne(
                { _id: userId },
                {
                    $set: { isOtpVerified: 1 },
                    $unset: { otp: "", otpExpiration: "" }
                }
            );
            if (updateResult.modifiedCount > 0) {
                const mailOptions = {
                    from: CONFIG.SMTP_USER,
                    to: otpVerification.email,
                    subject: "OTP Verification",
                    text: "verifyotp",
                };
                await sendEmail(mailOptions);
                return res.send({
                    status: 1,
                    msg: "OTP verified successfully",
                });
            } else {
                return res.send({ status: 0, msg: "Failed to remove OTP data" });
            }
        } else {
            return res.send({ status: 0, msg: "Invalid OTP" });
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message });
    }
};
const changePinOrMobile = async (req, res) => {
    const { loginPin, confirmLoginPin, mobileNo, userId } = req.body;

    try {
        const checkUserExist = await user.findById(userId);
        
        if (!checkUserExist) {
            return res.send({ status: 0, msg: "User not found" });
        }
        
        if (checkUserExist.isOtpVerified === 0) {
            return res.send({ status: 0, msg: "Verify OTP to change pin or mobile" });
        }

        const updateData = {};
        if (loginPin && confirmLoginPin) {
            if (loginPin !== confirmLoginPin) {
                return res.send({ status: 0, msg: "Pin and confirm pin should be the same" });
            }
            
            const hashedLoginPin = await bcrypt.hash(loginPin, 10);
            updateData.loginPin = hashedLoginPin; // Add hashed pin to update object
        }
        if (mobileNo) {
            if (!/^\d{10}$/.test(mobileNo)) {  // Ensure mobile is 10 digits
                return res.send({ status: 0, msg: "Mobile number should be valid" });
            }
            updateData.mobileNo = mobileNo; // Add mobile to update object
        }

        if (Object.keys(updateData).length === 0) {
            return res.send({ status: 0, msg: "No changes to update" });
        }
        await user.updateOne(
            { _id: userId },
            { 
                $set: updateData, 
                $unset: { isOtpVerified: "" } 
            }
        );
        
        return res.send({ status: 1, msg: "Login pin and/or mobile updated successfully" });
    } catch (error) {
        return res.send({ status: 0, msg: error.message });
    }
};


const getUserData = async function (req, res) {
    try {
        const getUserData = await user.find().select('-password -role -status -createdAt -updatedAt')
        if (getUserData) {
            return res.send({ status: 1, msg: "data fetch successfully", data: getUserData })
        } else {
            return res.send({ status: 0, msg: "data not found", data: [] })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const getUserDataById = async function (req, res) {
    const getUserById = req.body
    try {
        const getUser = await user.findById({ _id: getUserById.userId }).select('-password -role -status -createdAt -updatedAt')
        if (getUser) {
            return res.send({ status: 1, msg: "data get successfully", data: getUser })
        } else {
            return res.send({ status: 0, msg: "data not found", data: [] })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const updateUserData = async function (req, res) {
    const { userId, ...updateData } = req.body
    try {
        const userExist = await user.findById(userId);
        if (!userExist) {
            return res.send({ status: 0, msg: "User not found" });
        }

        if (userExist.status === 0) {
            return res.send({ status: 0, msg: "something went wrong" });
        }

        const updateUser = await user.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        )
        if (updateUser.matchedCount !== 0, updateUser.modifiedData !== 0) {
            return res.send({ status: 1, msg: "data succesfully updated" })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const deleteUserDetails = async (req, res) => {
    const deleteUsers = req.body
    try {
        const checkUserExist = await user.findById(deleteUsers.userId)
        if (!checkUserExist) {
            return res.send({ status: 0, msg: "user not found" })
        }
        if (checkUserExist.status == 0) {
            return res.send({ status: 0, msg: "data already deleted" })
        }
        const deleteUserDetails = await user.findByIdAndUpdate({ _id: deleteUsers.userId },
            { $set: { status: 0 } }
        )
        if (deleteUserDetails) {
            return res.send({ status: 1, msg: "data deleted successfully" })
        } else {
            return res.send({ status: 0, msg: "something went wrong" })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}
export {
    userRegistration,
    verifyEmail,
    sentOtp,
    verifyOTP,
    getUserData,
    getUserDataById,
    userLogin,
    changePinOrMobile,
    updateUserData,
    forgetPassword,
    deleteUserDetails
}
