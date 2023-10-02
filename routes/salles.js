const express = require('express');
const { validate, Salle } = require('../models/salle');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const router = express.Router();

//create
router.post('/', [auth, admin], async (req, res) => {
  req.body.createdBy = req.user._id;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let salle = await new Salle(req.body);

  salle = await salle.save();

  res.send(salle);
});

// update
router.put('/:id', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const salle = await Salle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!salle) return res.status(404).send('Salle not found');

    res.send(salle);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

//get all
router.get('/', auth, async (req, res) => {
  try {
    const salles = await Salle.find({ deleted: false });

    res.send(salles);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

//softdelete
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const salle = await Salle.findByIdAndUpdate(
      req.params.id,
      {
        deleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!salle) return res.status(404).send('Salle not found');

    res.send(salle);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
