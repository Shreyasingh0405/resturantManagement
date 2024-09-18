import resturant from "../models/resturants.js"
const resturantRegistration = async (req, res) => {
    const resturantData = req.body
    try {
        const files = req.files; // Multer adds uploaded files to `req.files`
        if (files && files.length > 0) {
            resturantData.image = files.map(file => file.path); // Store the paths of all uploaded images
        }

        const resturantDataRegister = await resturant.create(resturantData)
        if (resturantDataRegister) {
            return res.send({ status: 1, msg: "resturant data inserted successfully" })
        } else {
            return res.send({ status: 0, msg: "something went wrong" })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}
const getResturantData = async (req, res) => {
    try {
        const getResturantData = await resturant.find()
        if (getResturantData) {
            return res.send({ status: 1, msg: "data fetch successfully", data: getResturantData })
        } else {
            return res.send({ status: 0, msg: "something went wrong", data: [] })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const getResturantDataById = async (req, res) => {
    const getResturantById = req.body
    try {
        const getResturant = await resturant.findById({ _id: getResturantById.resturantId })
        if (getResturant) {
            return res.send({ status: 1, msg: "data get successfully", data: getResturant })
        } else {
            return res.send({ status: 0, msg: "data not found", data: [] })
        }
    } catch (error) {
    }
}

const updateResturantData = async function (req, res) {
    const { resturantId, ...updateData } = req.body
    try {
        const resturantExist = await resturant.findById(resturantId);
        if (!resturantExist) {
            return res.send({ status: 0, msg: "resturant not found" });
        }
        if (resturantExist.status == 0) {
            return res.send({ status: 0, msg: "something went wrong" })
        }
        const updateResturant = await resturant.findByIdAndUpdate(
            resturantId,
            updateData,
            {
                new: true
            })
        if (updateResturant.matchedCount !== 0, updateResturant.modifiedData !== 0) {
            return res.send({ status: 1, msg: "data succesfully updated" })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

const deleteResturantDetails = async (req, res) => {
    const deleteResturants = req.body
    try {
        const checkResturantsExist = await resturant.findById(deleteResturants.resturantId)
        if (!checkResturantsExist) {
            return res.send({ status: 0, msg: "resturants not found" })
        }
        if (checkResturantsExist.status == 0) {
            return res.send({ status: 0, msg: "data already deleted" })
        }
        const deleteResturantsDetails = await resturant.findByIdAndUpdate({ _id: deleteResturants.resturantId },
            { $set: { status: 0 } }
        )
        if (deleteResturantsDetails) {
            return res.send({ status: 1, msg: "data deleted successfully" })
        } else {
            return res.send({ status: 0, msg: "something went wrong" })
        }
    } catch (error) {
        return res.send({ status: 0, msg: error.message })
    }
}

export {
    resturantRegistration,
    getResturantData,
    getResturantDataById,
    updateResturantData,
    deleteResturantDetails
}