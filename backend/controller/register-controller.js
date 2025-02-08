import registerModel from "../model/register-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if user already exists
        const existUser = await registerModel.findOne({ email });
        if (existUser) {
            return res.status(400).json({ success: false, message: "User already exists, please login" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = new registerModel({
            username,
            email,
            password: hashedPassword, 
        });

        await user.save();

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            jwtSecret,  // Use environment variable for security
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        return res.status(201).json({ 
            success: true, 
            message: "User Registered Successfully", 
            token,  // Send token in response
            user 
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default userRegister;
