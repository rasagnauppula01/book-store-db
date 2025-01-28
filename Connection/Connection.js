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

// const mongoose = require('mongoose');

// const Connect = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('Database connected successfully');
//     } catch (error) {
//         console.error('Database connection failed:', error.message);
//         process.exit(1); // Exit the application if connection fails
//     }
// };

// module.exports = Connect;

