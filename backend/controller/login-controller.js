import registerModel from "../model/register-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existUser = await registerModel.findOne({ email });

        if (!existUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, existUser.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: existUser._id, email: existUser.email }, // Payload
            process.env.JWT_SECRET, // Secret Key from .env
            { expiresIn: "1h" } // Token expiration time
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token, // Send token in response
            user: { id: existUser._id, username: existUser.username, email: existUser.email },
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default userLogin;



// import registerModel from "../model/register-model.js";
// import bcrypt from "bcrypt";

// const userLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ success: false, message: "All fields are required" });
//         }

//         const existUser = await registerModel.findOne({ email });

//         if (!existUser) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         const isMatch = await bcrypt.compare(password, existUser.password);

//         if (!isMatch) {
//             return res.status(401).json({ success: false, message: "Invalid credentials" });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Login successful",
//             user: { id: existUser._id, username: existUser.username, email: existUser.email },
//         });

//     } catch (error) {
//         console.error("Login Error:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// export default userLogin;