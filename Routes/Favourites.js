const express = require("express");
const router = express.Router();
const { Authentication } = require("../Routes/userAuth");
const User = require("../Model/User");

router.put("/add-to-favourite", Authentication, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      return res
        .status(400)
        .json({ message: "Book already added to favourites" });
    }
    await User.findByIdAndUpdate(id, {
      $push: { favourites: bookid },
    });
    return res
      .status(200)
      .json({ message: "Book added to favourites successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete(
  "/remove-book-from-favourite",
  Authentication,

  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const userData = await User.findById(id);
      const isBookFavourite = userData.favourites.includes(bookid);
      if (isBookFavourite) {
        await User.findByIdAndUpdate(id, {
          $pull: { favourites: bookid },
        });
      }

      return res
        .status(200)
        .json({ message: "Book removed from favourites successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/get-fav-book", Authentication, async (req, res) => {
  try {
    const { id } = req.headers;
    console.log(id);
    const userData = await User.findById(id).populate("favourites");

    const favouriteBooks = userData.favourites;
    return res.json({ status: "Success", data: favouriteBooks });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
