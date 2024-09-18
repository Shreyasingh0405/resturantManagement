export const checkAccess = function (roleArray) {
    return async (_req, res, next) => {
        try {
            const { role } = res.locals.userData;
            if (!roleArray.includes(role)) {
                return res.status(401).send("Unauthorized Access");
            }
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            return res.send({ status: 1, msg: error.message });
        }
    };
};
