const express = require('express');
const { ReservationSalle, validate } = require('../models/reservation');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// create new reservation
router.post('/', auth, async (req, res) => {
  req.body.demandePar = req.user._id;
  const validation = await validate(req.body);
  if (validation.error) return res.status(400).send(validation.error);

  let reservation = await new ReservationSalle(req.body);
  reservation = await reservation.save();

  return res.send(reservation);
});

// change etat
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const id = req.params.id;
    let reservation = await ReservationSalle.findById(id);
    reservation.etat = req.body.etat;
    reservation.reponsePar = req.user._id;
    reservation = await reservation.save();
    res.send(reservation);
  } catch (error) {
    res.send(error.message);
  }
});

// get all reservations
router.get('/', auth, async (req, res) => {
  try {
    const reservations = await ReservationSalle.find();
    res.send(reservations);
  } catch (error) {
    res.send(error.message);
  }
});

// delete reservation
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await ReservationSalle.findById(id);

    if (!reservation) {
      return res.status(404).send('Reservation not found');
    }

    // Check if the user trying to delete the reservation is the one who created it
    console.log(reservation.demandePar, req.user._id);
    if (reservation.demandePar.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send('You do not have permission to delete this reservation');
    }

    await ReservationSalle.findByIdAndDelete(id);
    res.send('Reservation deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
