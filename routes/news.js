const express = require('express');
const { News, validate } = require('../models/news');
const auth = require('../middleware/auth');
const fileUpload = require('express-fileupload');
const router = express.Router();

// create news
router.post(
  '/',
  auth,
  fileUpload({ createParentPath: true }),
  async (req, res) => {
    try {
      const files = req.files;
      console.log(files);

      const fileNames = [];

      if (files && Object.keys(files).length > 0) {
        for (const fileKey in files) {
          const file = files[fileKey];
          const fileName = `${Date.now()}_${file.name}`;

          // Move the file to the server with the unique name
          file.mv(`uploads/${fileName}`, (err) => {
            if (err) {
              return res.status(500).send(err);
            }
          });

          fileNames.push(fileName);
        }
      }

      req.body.user_id = req.user._id;

      req.body.piece_jointe = fileNames;

      const { error } = validate(req.body);

      if (error) {
        return res.status(400).send(error.details[0].message);
      }

      let news = await News(req.body);
      news = await news.save();

      res.send(news);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

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
