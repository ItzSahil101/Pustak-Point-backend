const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const {
    page = 1,
    limit = 25,
    category = "programming",
    search = "",
  } = req.query;
  try {
    const response = await axios.get(
      `https://www.dbooks.org/api/search/${category}`
    );
    const books = response.data?.books;

    if (!Array.isArray(books)) {
      return res
        .status(500)
        .json({
          message: "Books data is missing or invalid from external API.",
        });
    }

    let formattedBooks = books.map((book, index) => ({
      id: book.id || index + 1,
      title: book.title,
      description: book.subtitle || "No description available.",
      cover: book.image,
      category: "General",
      pointsRequired: 10,
      download: book.download,
    }));

    const keyword = search || category;
    if (keyword && keyword.toLowerCase() !== "all") {
      formattedBooks = formattedBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(keyword.toLowerCase()) ||
          b.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    const start = (page - 1) * limit;
    const paginated = formattedBooks.slice(start, start + parseInt(limit));

    res.json({
      books: paginated,
      totalBooks: formattedBooks.length,
    });
  } catch (err) {
    console.error("Error fetching books:", err.message);
    res.status(500).json({ message: "Failed to fetch books from API." });
  }
});

module.exports = router;
