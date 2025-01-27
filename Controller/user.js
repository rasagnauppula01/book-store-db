const User = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Singup = async (req, res) => {
  try {
    const { username, password, email, address, role } = req.body;
    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username length  should be greater than 3" });
    }

    const existingusername = await User.findOne({ username: username });
    if (existingusername) {
      return res.status(400).json({ message: "Username alredy exist" });
    }

    const existingemail = await User.findOne({ email: email });
    if (existingemail) {
      return res.status(400).json({ message: "email alredy exist" });
    }

    if (password.length <= 5) {
      return res
        .status(400)
        .json({ message: "Password length shld be greater than 5" });
    }

    const hashpass = await bcrypt.hash(password, 10);

    const newuser = await User.create({
      username: username,
      password: hashpass,
      email: email,
      address: address,
      role: role,
    });
    if (newuser) {
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exisitingemail = await User.findOne({ email: email });
    if (!exisitingemail) {
      return res.status(400).json({ message: "Invalid credentails" });
    }
    await bcrypt.compare(password, exisitingemail.password, (err, data) => {
      if (data) {
        let authCalims = [
          { email: exisitingemail.email },
          { role: exisitingemail.role },
        ];
        let token = jwt.sign({ authCalims }, process.env.SECREAT_KEY, {
          expiresIn: "30d",
        });
        res.status(200).json({
          id: exisitingemail._id,
          role: exisitingemail.role,
          token: token,
        });
      } else {
        res.status(400).json({ message: "Invalid credenatails" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const Auth = async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const UpdateAddress = async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id } = req.headers;
    const { currentPassword, newPassword } = req.body;
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { Singup, Login, Auth, UpdateAddress, resetPassword };
