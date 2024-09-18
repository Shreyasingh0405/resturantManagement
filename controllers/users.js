import user from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import CONFIG from "../config/config.js"

const userRegistration = async function (req, res) {
    const registeredData = req.body
    try {
        const checkEmail = await user.findOne({ email: registeredData.email })
        if (checkEmail) {
            return res.send({ status: 0, msg: "email already exist" })
        }
        registeredData.password = bcrypt.hashSync(registeredData.password, 10)
        const registeredUser = await user.create(registeredData)
        if (registeredUser) {
            return res.send({ status: 1, msg: "data registered succesfully" })
        } else {
            return res.send({ status: 0, msg: "something went wrong" })
        }
    } catch (error) {
        return res.send({ status: 0, msg:error.message })
    }
}

const userLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const checkEmail = await user.findOne({email})
        if (!checkEmail) {
            return res.send({ status: 0, msg: "you are not registered" })
        }
        if (checkEmail.status === 0) {
            return res.send({ status: 0, msg: "something went wrong" });
        }
        bcrypt.compare(password, checkEmail.password, function (err, result) {
            if (result === true) {
                const token = jwt.sign(
                    {
                        userId: checkEmail._id,
                        email: checkEmail.email,
                        role: checkEmail.role,
                    },
                    CONFIG.JWT_KEY,
                    { algorithm: "RS256", expiresIn: "1d" }
                );
                if (token) {
                    return res.send({
                        status: 1,
                        msg: "login succesfully",
                        data: token,
                    });
                }
            } else if (err) {
                return res.send({
                    status: 0,
                    msg: "User name or Password is Invalid",
                });
            }
            return res.send({
                status: 0,
                msg: "User name or Password is Invalid",
            });
        });
    } catch (error) {
        return res.send({ status: 0, msg:error.message })
    }
}

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
        return res.send({ status: 0, msg:error.message })
    }
}

const getUserData = async function (req, res) {
    const getUserData = await user.find().select('-password -role -status -createdAt -updatedAt')
    if (getUserData) {
        return res.send({ status: 1, msg: "data fetch successfully", data: getUserData })
    } else {
        return res.send({ status: 0, msg: "data not found", data: [] })
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
    }
}

const updateUserData = async function (req, res) {
    const { userId, ...updateData } = req.body
    try {
        const userExist = await user.findById(userId);
        if (!userExist) {
            return res.send({ status: 0, msg: "User not found" });
        }

        if(userExist.status === 0) {
            return res.send({ status: 0, msg: "something went wrong" });
        }

        const updateUser = await user.findByIdAndUpdate(
            userId,
            updateData,
            {new: true}
        )
        if (updateUser.matchedCount !== 0, updateUser.modifiedData !== 0) {
            return res.send({ status: 1, msg: "data succesfully updated" })
        }
    } catch (error) {
        return res.send({ status: 0, msg:error.message })
    }
}

const deleteUserDetails = async (req, res) => {
    const deleteUsers = req.body
    try {
        const checkUserExist = await user.findById(deleteUsers.userId)
        if (!checkUserExist) {
            return res.send({ status: 0, msg: "user not found" })
        }
        if(checkUserExist.status==0){
            return res.send({status:0,msg:"data already deleted"})
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
    getUserData,
    getUserDataById,
    userLogin,
    updateUserData,
    forgetPassword,
    deleteUserDetails
}
