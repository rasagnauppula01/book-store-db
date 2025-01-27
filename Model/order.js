const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  book: {
    type: mongoose.Types.ObjectId,
    ref: "books",
  },
  status: {
    type: String,
    default: "Order Placed",
    enum: ["Order Placed", "Out for delivery , Delivered,Canceled"],
  },
  date: {
    type: Date, // Date when the order was placed
    default: Date.now, // Defaults to the current date
  },
  updatedDate: {
    type: Date, // Tracks the date of the most recent update
  },
});

module.exports = mongoose.model("order", orderSchema);
