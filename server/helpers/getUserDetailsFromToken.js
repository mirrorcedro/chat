const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const getUserDetailsFromToken = async (token) => {
    try {
        if (!token) {
            return {
                message: "Session expired. Please log in again.",
                logout: true,
            };
        }

        // Verify the token
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find the user in the database
        const user = await UserModel.findById(decode.id).select('-password');

        if (!user) {
            return {
                message: "User not found. Please log in again.",
                logout: true,
            };
        }

        return user;
    } catch (err) {
        console.error("Error in getUserDetailsFromToken:", err.message);

        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return {
                message: "Invalid or expired token. Please log in again.",
                logout: true,
            };
        }

        throw new Error("Internal server error.");
    }
};

module.exports = getUserDetailsFromToken;
