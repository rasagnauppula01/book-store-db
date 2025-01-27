const router = require("express").Router();
const uploadprofile = require("../Config/MulterConfig");
const cloudinary = require("../Config/CloudinaryConfig");
const Otp = require("../Model/otpModel");
const generateOtp = require("../Utils/generateOtp");
const { sendOtpEmail } = require("../Utils/emailService");
const bcrypt = require("bcrypt");

const {
  Singup,
  Login,
  Auth,
  UpdateAddress,
  resetPassword,
} = require("../Controller/user");
const { Authentication } = require("../Routes/userAuth");
const User = require("../Model/User");

router.post("/Signup", Singup);

router.post("/login", Login);

router.get("/get-user-info", Authentication, Auth);

router.put("/update-address", Authentication, UpdateAddress);
router.put("/reset-password", Authentication, resetPassword);

router.put(
  "/profile/update-avatar",
  Authentication,
  uploadprofile.single("avatar"),
  async (req, res) => {
    try {
      console.log(req.users);

      // Get email from token claims
      const email = req.users.authCalims.find((claim) => claim.email)?.email;

      if (!email) {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Avatar file is required" });
      }

      // Upload to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "avatars",
        }
      );

      const avatarUrl = req.file.path;
      console.log("Uploaded Avatar URL:", avatarUrl);

      // Update user avatar in database
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { avatar: avatarUrl },
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Avatar updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating avatar:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post("/request-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    console.log("Generated OTP:", otp);

    const newOtp = new Otp({ email, otp });
    const result = await newOtp.save();
    console.log("OTP saved:", result);

    const emailResponse = await sendOtpEmail(email, otp);
    console.log("Email response:", emailResponse);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error requesting OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/verify-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    console.log("Email:", email);
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    await Otp.deleteMany({ email });
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error verifying OTP or resetting password:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
