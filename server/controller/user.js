import userModel from "../models/user.js";  
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import addressModel from "../models/address.js";
import transporter from "../config/nodemailer.js"; 


export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;
        const { addressLine1, name_add, locality, addressType, pinCode, landmark } = req.body;

        // Validate user fields
        if (!name || !email || !password || !phoneNumber) {
            return res.status(400).json({ success: false, message: "User details missing" });
        }

        // Validate address fields
        if (!addressLine1 || !name_add || !locality || !addressType || !pinCode || !landmark || !addressType.match(/^(WORK|HOME)$/)) {
            return res.status(400).json({ success: false, message: "Address details missing" });
        }

        // Check if user already exists
        const userExists = await userModel.findOne({ email });

        if (userExists) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const isProvider = await providerModel.findOne({email});
        if(isProvider)
            return res.status(400).json({message:"Try Different Email Id"})

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        
        const newUser = new userModel({
            name,
            email,
            password : hashedPassword, 
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
        // Save the address and link it to the user
        await newAddress.save();
        newUser.address = newAddress._id;           
        await newUser.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, 
            {
             expiresIn : '7d'
        },
     );

     res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 
            'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
     });

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Welcome to Tiffinex',
        text: `Welcome to Tiffinex. Your account has been created with email id : ${email}`
     }

     await transporter.sendMail(mailOptions);



    return res.status(201).json({ success: true, message: "User registered successfully", user: newUser });

    } catch (err) {
        console.error("Registration Error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate user fields
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check password (you should hash the password and compare in production)
        const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
}

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, 
            {
             expiresIn : '7d'
        },
     );

     res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 
            'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
     });

        return res.status(200).json({ success: true, message: "Login successful"});

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


export const logoutUser = async(req,res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 
            'none' : 'strict',
        });
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (err) {
        console.error("Logout Error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

export const sendVerifyOtpUser = async(req,res)=> {
    try {

        const {userId} = req.body;
        
        const user = await userModel.findById(userId);

        if(user.isAccountVerified)
        {
            return res.json({success: false, message: "Account already verified"})
        }

       const otp = String(Math.floor(100000 + Math.random() * 900000));

       user.verifyOtp = otp;
       user.verifyOtpExpireAt = Date.now() + 24*60*60*1000

       await user.save();

       const mailOption = {
        from : process.env.SENDER_EMAIL,
        to : user.email,
        subject: 'Account Verification Otp',
        text: ` Your OTP is ${otp}. Verify your account using this OTP. `
       }

       await transporter.sendMail(mailOption);

       res.json({success: true, message: 'Verification OTP sent on Email '});

        
    } catch (error) {
        res.json({success : false, message: error.message});
    }
}


export const verifyEmailUser = async (req,res)=>{
    const {userId, otp} = req.body;

    if(!userId || !otp)
    {
        res.json({success: false, message : 'Missing Details'});
    }

    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({ success: false, message:'User not found'});
        }

        if(user.verifyOtp === '' || user.verifyOtp != otp)
        {
            return res.json({ success: false, message: 'Invalid OTP'});
        }

        if(user.verifyOtpExpireAt < Date.now())
        {
            return res.json({Success: false, message: 'OTP Expired'})
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        res.json({success: true, message: "email verified successfully"});



    } catch (error) {
        res.json({success: false , message: error.message});
    }


}


export const isAuthenticatedUser = async (req,res)=> {
     try {
        
         return res.json({success: true});

     } catch (error) {
        res.json({ success: false, message: error.message});
     }
}

export const sendResetOtpUser = async (req,res) => {
    const {email} = req.body;

    if(!email)
    {
        return res.json({ success: false, message: "email is required" });
    }

    try {

        const user = await userModel.findOne({email});

        if(!user)
        {
            return res.json({success: false, message: 'Email doesnt exist'});
        }
        
        const otp = String(Math.floor(100000 + Math.random()*900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 5*60*1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password reset otp",
            text: `Your otp for reset password is ${otp}. Verify your account using this otp`
        }

        await transporter.sendMail(mailOption);

        return res.json({success: true, message: 'OTP sent to your email'});

    } catch (error) {
        return res.json({ success: false, message: error.message});
    }
}

// reset user password

export const resetPasswordUser = async (req,res) => {

    const {email, otp , newPassword} = req.body;
    
    if(!email || !otp || !newPassword)
    {
        return res.json({success : defaultMaxListeners, message: 'Email, OTP, and new password is required'});
    }

    try {

        const user = await userModel.findOne({email});

        if(!user)
        {
            return res.json({success: false, message: 'User not found'});

        }

        if(user.resetOtp === "" || user.resetOtp != otp )
        {
          return res.json({success: false, message: 'Invalid Otp'});
        }

        if(user.resetOtpExpireAt < Date.now())
        {
            return res.json({success: false, message: 'OTP Expired'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({success: true, message: "Password has been reset successfully"});
        
    }
    catch(error)
    {
        return res.json({success: false, message: error.message})
    }
}

export const addressChangeUser = async (req, res) => {
    const { userId, name_add, addressType, pinCode, addressLine1, locality, landmark } = req.body;

    if (!name_add || !addressType || !pinCode || !addressLine1 || !locality || !landmark) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const address = await addressModel.findById(user.address);
        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        // Update the address
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
}



















