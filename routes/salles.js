const express = require('express');
const { validate, Salle } = require('../models/salle');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', [auth, admin], async (req, res) => {
  req.body.createdBy = req.user._id;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let salle = await new Salle(req.body);

  salle = await salle.save();

  res.send(salle);
});

router.get('/', auth, async (req, res) => {
  let salles = await Salle.find();
  res.send(salles);
});

module.exports = router;
