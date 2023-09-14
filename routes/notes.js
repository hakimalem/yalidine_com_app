const express = require('express');
const { Note, validate } = require('../models/note');
const auth = require('../middleware/auth');
const router = express.Router();

// create note
router.post('/', auth, async (req, res) => {
  try {
    req.body.user_id = req.user._id;
    const { error } = validate(req.body);
    if (error) {
      return res.send(error.details[0].message);
    }
    let note = await Note(req.body);
    note = await note.save();
    res.send(note);
  } catch (error) {
    res.send(error.message);
  }
});

// update note
router.put('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).send('Note not found');
    }

    // Check if the user trying to update the note is the owner (user_id matches)
    if (note.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send('You do not have permission to update this note');
    }

    note.titre = req.body.titre || note.titre;
    note.type = req.body.type || note.type;
    note.description = req.body.description || note.description;
    note.picture = req.body.picture || note.picture;

    // Save the updated note
    await note.save();
    res.send(note);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).send('Note not found');
    }

    // Check if the user trying to delete the note is the owner (user_id matches)
    if (note.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send('You do not have permission to delete this note');
    }

    // Remove the note from the database
    await Note.deleteOne({ _id: id });
    res.send('Note deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
