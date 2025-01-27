const express = require("express");
const router = express.Router();
const { Authentication } = require("../Routes/userAuth");
const Book = require("../Model/books");
const Order = require("../Model/order");
const User = require("../Model/User");

router.post("/place-order", Authentication, async (req, res) => {
  try {
    const { id } = req.headers; // Extract user ID from headers
    const { items } = req.body; // Extract the items array from request body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Loop through the items in the order and create new orders
    for (const orderData of items) {
      // Create a new order for each item
      const newOrder = await Order.create({
        user: id,
        book: orderData._id,
        price: orderData.price, // Ensure you have price here
      });

      // Add this new order to the user's orders array
      await User.findByIdAndUpdate(id, {
        $push: { orders: newOrder._id },
      });

      // Remove the item from the cart of the book
      await Book.findByIdAndUpdate(orderData._id, {
        $pull: { cart: orderData._id },
      });
    }

    return res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error); // Log the error
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.get("/get-order-history", Authentication, async (req, res) => {
  try {
    const { id } = req.headers; // Corrected to req.headers
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });
    const orderData = userData.orders.reverse();
    return res
      .status(200)
      .json({ message: "Order history fetched successfully", data: orderData });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-all-orders", Authentication, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({ path: "book" })
      .populate({ path: "user" })
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "Order placed successfully", data: userData });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-status/:id", Authentication, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, {
      status: req.body.status,
    });
    return res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
