const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../Config/CloudinaryConfig");

// Configure Multer to use Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "books", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed image formats
  },
});
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile",
    resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });
const uploadProfile = multer({ storage: profileStorage });

module.exports = upload;
module.exports = uploadProfile;
