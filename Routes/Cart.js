const express = require("express");
const router = express.Router();
const { Authentication } = require("../Routes/userAuth");
const User = require("../Model/User");

router.put("/add-to-cart", Authentication, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookCart = userData.cart.includes(bookid);
    if (isBookCart) {
      return res.json({
        status: "Success",
        message: "Book is already in the cart",
      });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.json({
      status: "Success",
      message: "Book added to cart ",
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occured" });
  }
});

router.delete("/remove-from-cart/:bookid", Authentication, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;
    console.log(bookid);

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookInCart = userData.cart.includes(bookid);
    if (!isBookInCart) {
      return res.json({
        status: "Success",
        message: "Book is not in the cart",
      });
    }

    await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
    return res.json({
      status: "Success",
      message: "Book removed from cart",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

router.get("/get-cart", Authentication, async (req, res) => {
  try {
    const { id } = req.headers;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart;
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      status: "Success",
      cart: cart,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

module.exports = router;
