const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user.model");

const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
});

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to register user",
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to log in",
            error: error.message
        });
    }
};

const createDemoUser = async (req, res) => {
    try {
        let user;
        let email;
        let password;

        do {
            const randomValue = crypto.randomBytes(12).toString("hex");
            email = `demo-${randomValue}@inib.demo`;
            password = `INIB@${randomValue}`;
            user = await User.create({
                name: "INIB Demo User",
                email,
                password
            }).catch((error) => {
                if (error.code === 11000) {
                    return null;
                }

                throw error;
            });
        } while (!user);

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            demoCredentials: {
                email,
                password
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create demo account"
        });
    }
};

const getCurrentUser = async (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    });
};

module.exports = {
    registerUser,
    loginUser,
    createDemoUser,
    getCurrentUser,
    generateToken
};
