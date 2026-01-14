import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplates.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 4-digit OTP
    const otp = String(Math.floor(1000 + Math.random() * 9000));

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verifyOtp: otp,
      verifyOtpExpireAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    // Send verification email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: newUser.email,
      subject: "Welcome to Errornix - Verify Your Email 🎉",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp)
        .replace("{{email}}", newUser.email)
        .replace("{{name}}", newUser.name),
    };

    await transporter.sendMail(mailOptions);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    const otpString = String(otp);

    if (
      user.verifyOtp !== otpString ||
      !user.verifyOtpExpireAt ||
      user.verifyOtpExpireAt < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpireAt = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// RESEND OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    // Enforce 60s cooldown for OTP resend
    const now = Date.now();
    if (user.lastOtpSentAt && now - user.lastOtpSentAt < 60 * 1000) {
      const secondsLeft = Math.ceil(
        (60 * 1000 - (now - user.lastOtpSentAt)) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${secondsLeft}s before requesting another OTP`,
      });
    }

    const otp = String(Math.floor(1000 + Math.random() * 9000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = now + 15 * 60 * 1000; // 15 mins
    user.lastOtpSentAt = now;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Your new verification OTP",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp)
        .replace("{{email}}", user.email)
        .replace("{{name}}", user.name),
    });

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, do not reveal if user exists
      return res.status(200).json({
        success: true,
        message: "If this email is registered, you will receive a reset code.",
      });
    }

    // Generate 4-digit OTP
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset Code",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp)
        .replace("{{email}}", user.email)
        .replace("{{name}}", user.name || "User"),
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "If this email is registered, you will receive a reset code.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//password reset otp
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpString = String(otp);

    if (
      user.resetOtp !== otpString ||
      !user.resetOtpExpireAt ||
      user.resetOtpExpireAt < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Optionally clear OTP fields after successful verification
    user.resetOtp = undefined;
    user.resetOtpExpireAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified. You can now reset your password.",
    });
  } catch (error) {
    console.error("Verify Reset OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
  
}

//resend password 
export const resendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, respond with success
      return res
        .status(200)
        .json({
          success: true,
          message: "If this email is registered, a new code will be sent.",
        });
    }

    // Generate new 4-digit OTP
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset Code",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp)
        .replace("{{email}}", user.email)
        .replace("{{name}}", user.name || "User"),
    };
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({
        success: true,
        message: "A new reset code has been sent to your email.",
      });
  } catch (error) {
    console.error("Resend Reset OTP Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
try {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }


  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  // Clear any reset OTP fields
  user.resetOtp = undefined;
  user.resetOtpExpireAt = undefined;

  await user.save();

  res.status(200).json({ success: true, message: "Password reset successful" });
} catch (error) {
  console.error("Reset Password Error:", error);
  res.status(500).json({ success: false, message: "Server error" });
}
}