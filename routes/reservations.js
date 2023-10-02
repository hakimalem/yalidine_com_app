const express = require('express');
const { ReservationSalle, validate } = require('../models/reservation');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const responsable = require('../middleware/responsable');
const router = express.Router();

// create new reservation
router.post('/', [auth, responsable], async (req, res) => {
  req.body.demandePar = req.user._id;
  const validation = await validate(req.body);
  if (validation.error) return res.status(400).send(validation.error);

  let reservation = await new ReservationSalle(req.body);
  reservation = await reservation.save();

  return res.send(reservation);
});

// change etat [accepte/refuse]
router.put('/repondre/:id', [auth, admin], async (req, res) => {
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

// update reservation (edit date)  :
router.put('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    let reservation = await ReservationSalle.findById(id);
    if (!reservation) return res.status(404).send('no reservation found');
    if (
      reservation.demandePar.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    )
      return res.send(
        'Access denied, you do not have the permission to edit this reservation'
      );

    reservation.date_debut = req.body.date_debut || reservation.date_debut;
    reservation.date_fin = req.body.date_fin || reservation.date_fin;

    if (
      reservation.date_debut > reservation.date_fin ||
      reservation.date_debut.toISOString() < new Date().toISOString()
    )
      return res.send('invalid dates');

    reservation = await reservation.save();

    res.send(reservation);
  } catch (error) {
    res.send(error.message);
  }
});

// get all reservations
router.get('/', auth, async (req, res) => {
  try {
    const reservations = await ReservationSalle.find({ deleted: false });
    res.send(reservations);
  } catch (error) {
    res.send(error.message);
  }
});

// soft delete reservation
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    let reservation = await ReservationSalle.findById(id);
    if (!reservation) return res.status(404).send('No reservation found');

    if (
      reservation.demandePar.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    )
      return res.send(
        'Access denied, you do not have the permission to edit this reservation'
      );

    // Check if the reservation is already soft-deleted
    if (reservation.deleted)
      return res.status(400).send('Reservation is already deleted');

    // Update the reservation to mark it as deleted
    reservation.deletedAt = new Date();
    reservation.deleted = true;
    reservation = await reservation.save();

    res.send(reservation);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
