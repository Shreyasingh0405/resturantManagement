import user from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import ejs from "ejs"
import path from "path"
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import geoip from 'geoip-lite';
import CONFIG from "../config/config.js"
import sendEmail from "../utils/nodemailer.js"
import common from "../utils/common.js";
import session from "../models/session.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//=============================================Registration======================================//

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

            const emailTemplatePath = path.join(__dirname, "..", 'views', 'emailVerification.ejs');
            const verificationLink = `http://localhost:5001/v2/verifyEmail?token=${verificationToken}`;
            const emailHTML = await ejs.renderFile(emailTemplatePath, {
                name: registeredData.firstName || "user",
                verificationLink: verificationLink,
            });

            const mailOptions = {
                from: CONFIG.SMTP_USER,
                to: registeredData.email,
                subject: 'Email Verification',
                html: emailHTML
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

//=====================================VerifyEmail========================================//

const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const userToVerify = await user.findOne({ verificationToken: token });
        if (!userToVerify) {
            return res.send({ status: 0, msg: "Invalid token or user not found." });
        }
        await user.updateOne(
            { _id: userToVerify._id },
            {
                $set: { isEmailVerified: 1 },
                $unset: { verificationToken: 1 }
            }
        );
        const successEmailTemplatePath = path.join(__dirname, "..", 'views', 'registrationSuccess.ejs'); // Ensure you have this template
        const mailOptions = {
            from: CONFIG.SMTP_USER,
            to: userToVerify.email,
            subject: 'Registration Successful',
            html: await ejs.renderFile(successEmailTemplatePath, {
                name: userToVerify.firstName || "User",
            }),
        };
        await sendEmail(mailOptions);
        return res.send({ status: 1, msg: "Email verified successfully! A confirmation email has been sent." });
    } catch (error) {
        return res.send({ status: 0, msg: error.message });
    }
};

//============================================Login==================================================================//

const userLogin = async (req, res) => {
    const { email, loginPin, mobileNo } = req.body;
try {
        const userQuery = email ? { email } : { mobileNo };
        const userData = await user.findOne(userQuery);
        if (!userData) {
            return res.status(404).send({ status: 0, msg: "You are not registered" });
        }
        if (userData.status === 0) {
            return res.status(403).send({ status: 0, msg: "Something went wrong" });
        }
        if (email && userData.isEmailVerified === 0) {
            return res.status(403).send({ status: 0, msg: "Please verify your email for login" });
        }
        const isMatch = await bcrypt.compare(loginPin, userData.loginPin);
        if (!isMatch) {
            return res.status(401).send({ status: 0, msg: "Invalid username or password" });
        }
        const token = jwt.sign(
            {
                userId: userData._id,
                email: userData.email,
                role: userData.role,
            },
            CONFIG.JWT_KEY,
            { algorithm: "RS256", expiresIn: "1d" }
        );
        const newSession = new session({
            userId: userData._id,
            deviceId: req.headers['user-agent'], // Capture device info
            token: token,
            lastActive: new Date(),
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set expiration to 1 day from now
            status: 'active', // Track if the session is active
        });
        await newSession.save();
 return res.status(200).send({
            status: 1,
            msg: "Login successfully",
            data: token,
        });

    } catch (error) {
        console.error("Login error:", error); // Log the error
        return res.status(500).send({ status: 0, msg: error.message });
    }
};

/// ====================forget password in v1===============//

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

//=====================otp sent for pin change==============================//

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
            const emailTemplatePath = path.join(__dirname, '..', 'views', 'otpEmail.ejs');
            const emailHTML = await ejs.renderFile(emailTemplatePath, {
                name: userData.firstName,
                otp: otp,
            });
            const mailOptions = {
                from: CONFIG.SMTP_USER,
                to: email,
                subject: "OTP for Change Pin",
                html: emailHTML,
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

//===========================================verify Otp for change loginPin============================//

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
                const emailTemplatePath = path.join(__dirname, '..', 'views', 'otpVerificationEmail.ejs');
                const emailHTML = await ejs.renderFile(emailTemplatePath, {
                    name: otpVerification.firstName,
                });
                const mailOptions = {
                    from: CONFIG.SMTP_USER,
                    to: otpVerification.email,
                    subject: "OTP Verification Successful",
                    html: emailHTML,
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

// ============================================================Resend otp====================================================================//

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const userData = await user.findOne({ email });
        if (!userData) {
            return res.send({ status: 0, msg: "User not found" });
        }
        const otp = common.otpGenerate();
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
        await user.findOneAndUpdate(
            { email },
            { otp, otpExpiration: expirationTime }
        );
        const emailTemplatePath = path.join(__dirname, '..', 'views', 'otpResendEmail.ejs');
        const emailHTML = await ejs.renderFile(emailTemplatePath, {
            name: userData.firstName || "User",
            otp: otp,
        });
        const mailOptions = {
            from: CONFIG.SMTP_USER,
            to: email,
            subject: "Your OTP Code",
            html: emailHTML,
        };
        await sendEmail(mailOptions);
        return res.send({
            status: 1,
            message: "OTP resent successfully to your email",
        });
    } catch (error) {
        return res.send({ status: 0, message: error.message });
    }
};

//======================================================changelogin pin or Mobile =====================================================//

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
            updateData.loginPin = hashedLoginPin;
        }
        if (mobileNo) {
            if (!/^\d{10}$/.test(mobileNo)) {
                return res.send({ status: 0, msg: "Mobile number should be valid" });
            }
            updateData.mobileNo = mobileNo;
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

//====================================================getUserData=================================================//

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

//===================================================getUserDataById===================================================//

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

//================================================== Update User Data =================================================//

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

//================================================== Delete User Data ==================================================//

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

//===================================Enable location=========================//

const enableLocation = async (req, res) => {
    try {
        const { userId, location } = req.body;  // Expecting userId and location in the body
        const userLocation = await user.findById(userId);

        if (!userLocation) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if location was provided in the request body
        if (location && location.lat && location.lng) {
            userLocation.location = location; // Use the provided location
        } else {
            const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            console.log("IP Address:", ip);

            if (ip === '::1' || ip === '127.0.0.1') {
                console.log('Running on localhost; skipping geo lookup.');
                return res.status(400).json({ message: 'Running on localhost; please provide location manually.' });
            }

            const geo = geoip.lookup(ip);
            console.log("Geolocation Data:", geo);

            if (!geo || !geo.ll) {
                console.log('Geo lookup failed or returned no location data.');
                return res.status(400).json({ message: 'Could not determine location.' });
            }

            userLocation.location = {
                lat: geo.ll[0],
                lng: geo.ll[1]
            };
        }

        userLocation.locationEnabled = true;
        await userLocation.save();

        res.json({
            message: 'Location enabled and detected',
            location: userLocation.location
        });
    } catch (error) {
        res.status(500).json({ message: "Error enabling location", error: error.message });
    }
};

//===============================================logout=========================================================//

const logOut = async (req, res) => {
    try {
        const { logOutId, logoutAll } = req.body; 
        if (!logOutId) {
            return res.status(400).send({ status: 0, msg: "logOutId must be provided" });
        }
        if (logoutAll) {
            const result = await session.updateMany({ _id: logOutId }, { isActive: false });
            if (result.modifiedCount === 0) {
                return res.status(404).send({ status: 0, msg: "No active sessions found for this user" });
            }
            await session.deleteMany({ userId: logOutId });
            
            return res.status(200).send({ status: 1, msg: "Logged out from all devices and sessions deleted" });
        } else {
            const sessionData = await session.findOneAndUpdate(
                { _id: logOutId, isActive: true },
                { isActive: false }
            );
            if (!sessionData) {
                return res.status(404).send({ status: 0, msg: "No active session found for this user on this device" });
            }
            await session.deleteOne({ _id: logOutId });

            return res.status(200).send({ status: 1, msg: "Logged out from this device and session deleted" });
        }
    } catch (error) {
        return res.status(500).send({ status: 0, msg: error.message });
    }
};


export {
    userRegistration,
    verifyEmail,
    sentOtp,
    logOut,
    resendOtp,
    verifyOTP,
    getUserData,
    getUserDataById,
    userLogin,
    changePinOrMobile,
    updateUserData,
    forgetPassword,
    deleteUserDetails,
    enableLocation
}
