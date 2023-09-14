const express = require('express');
const { News, validate } = require('../models/news');
const auth = require('../middleware/auth');
const router = express.Router();

// create news
router.post('/', auth, async (req, res) => {
  try {
    req.body.user_id = req.user._id;
    const { error } = validate(req.body);
    if (error) {
      return res.send(error.details[0].message);
    }
    let news = await News(req.body);
    news = await news.save();
    res.send(news);
  } catch (error) {
    res.send(error.message);
  }
});

// update news
router.put('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).send('News not found');
    }

    // Check if the user trying to update the news is the owner (user_id matches)
    if (news.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send('You do not have permission to update this news');
    }

    // Update the news properties
    news.titre = req.body.titre || news.titre;
    news.type = req.body.type || news.type;
    news.description = req.body.description || news.description;
    news.picture = req.body.picture || news.picture;

    // Save the updated news
    await news.save();
    res.send(news);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// delete news
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).send('News not found');
    }

    // Check if the user trying to delete the news is the owner (user_id matches)
    if (news.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send('You do not have permission to delete this news');
    }

    // Remove the news from the database
    await News.deleteOne({ _id: id });
    res.send('News deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
