import providerModel from "../models/provider.js";
import addressModel from "../models/address.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

// Register Provider
export const registerProvider = async (req, res) => {
    try {
        const { name,tiffinName, email, password, phoneNumber } = req.body;
        const { addressLine1, name_add, locality, addressType, pinCode, landmark } = req.body;

        if (!name || !email || !password || !phoneNumber) {
            return res.status(400).json({ success: false, message: "Provider details missing" });
        }

        if (!addressLine1 || !name_add || !locality || !addressType || !pinCode || !landmark || !addressType.match(/^(WORK|HOME)$/)) {
            return res.status(400).json({ success: false, message: "Address details missing" });
        }

        const providerExists = await providerModel.findOne({ email });
        if (providerExists) {
            return res.status(409).json({ success: false, message: "Provider already exists" });
        }

        const isUser = await userModel.findOne({ email });
        if (isUser) {
            return res.status(400).json({ message: "Try Different Email Id" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newProvider = new providerModel({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
        });

        const newAddress = new addressModel({
            name: name_add,
            addressType,
            pinCode,
            addressLine1,
            locality,
            landmark,
            pinCode
        });

        await newAddress.save();
        newProvider.address = newAddress._id;
        await newProvider.save();

        const token = jwt.sign({ id: newProvider._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Tiffinex (Provider)',
            text: `Welcome to Tiffinex. Your provider account has been created with email: ${email}`
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ success: true, message: "Provider registered successfully", provider: newProvider });

    } catch (err) {
        console.error("Provider Registration Error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Login Provider
export const loginProvider = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const provider = await providerModel.findOne({ email });

        if (!provider) {
            return res.status(404).json({ success: false, message: "Provider not found" });
        }

        const isMatch = await bcrypt.compare(password, provider.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: provider._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ success: true, message: "Login successful" });

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Logout Provider
export const logoutProvider = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (err) {
        console.error("Logout Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


// Send Verification OTP
export const sendVerifyOtpProvider = async (req, res) => {
    try {
        const { providerId } = req.body;

        const provider = await providerModel.findById(providerId);

        if (provider.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        provider.verifyOtp = otp;
        provider.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await provider.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: provider.email,
            subject: 'Account Verification OTP (Provider)',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`
        };

        await transporter.sendMail(mailOption);

        res.json({ success: true, message: 'Verification OTP sent to email' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Verify Email
export const verifyEmailProvider = async (req, res) => {
    const { providerId, otp } = req.body;

    if (!providerId || !otp) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    try {
        const provider = await providerModel.findById(providerId);

        if (!provider) {
            return res.json({ success: false, message: 'Provider not found' });
        }

        if (provider.verifyOtp === '' || provider.verifyOtp != otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (provider.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        provider.isAccountVerified = true;
        provider.verifyOtp = '';
        provider.verifyOtpExpireAt = 0;

        await provider.save();

        res.json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Send Reset Password OTP
export const sendResetOtpProvider = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    try {
        const provider = await providerModel.findOne({ email });

        if (!provider) {
            return res.json({ success: false, message: 'Email does not exist' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        provider.resetOtp = otp;
        provider.resetOtpExpireAt = Date.now() + 5 * 60 * 1000;

        await provider.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: provider.email,
            subject: "Password Reset OTP (Provider)",
            text: `Your OTP for password reset is ${otp}.`
        };

        await transporter.sendMail(mailOption);

        return res.json({ success: true, message: 'OTP sent to your email' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Reset Password
export const resetPasswordProvider = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    try {
        const provider = await providerModel.findOne({ email });

        if (!provider) {
            return res.json({ success: false, message: 'Provider not found' });
        }

        if (provider.resetOtp === '' || provider.resetOtp != otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (provider.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        provider.password = hashedPassword;
        provider.resetOtp = '';
        provider.resetOtpExpireAt = 0;

        await provider.save();

        return res.json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Change Address
export const addressChangeProvider = async (req, res) => {
    const { providerId, name_add, addressType, pinCode, addressLine1, locality, landmark } = req.body;

    if (!name_add || !addressType || !pinCode || !addressLine1 || !locality || !landmark) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const provider = await providerModel.findById(providerId);
        if (!provider) {
            return res.status(404).json({ success: false, message: "Provider not found" });
        }

        const address = await addressModel.findById(provider.address);
        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        address.name = name_add;
        address.addressType = addressType;
        address.pinCode = pinCode;
        address.addressLine1 = addressLine1;
        address.locality = locality;
        address.landmark = landmark;

        await address.save();

        return res.status(200).json({ success: true, message: "Address updated successfully", address });

    } catch (error) {
        console.error("Address Change Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Check Auth
export const isAuthenticatedProvider = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



