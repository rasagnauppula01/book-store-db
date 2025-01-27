const mongoose = require("mongoose");

const Connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected Database");
  } catch (error) {
    console.log(error);
  }
};

Connect();
