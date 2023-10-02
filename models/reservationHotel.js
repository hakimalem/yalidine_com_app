const Joi = require('joi');
const mongoose = require('mongoose');
const reservationHotelSchema = new mongoose.Schema({
  etat: {
    type: String,
    enum: ['accepte', 'refuse', 'en attente'],
    default: 'en attente',
  },
  reponsePar: mongoose.Schema.Types.ObjectId,
  demandePar: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  hotel: String,
  adresse: String,
  piece_jointe: String,
});
reservationHotelSchema.set('timestamps', true);
const ReservationHotel = mongoose.model(
  'ReservationHotel',
  reservationHotelSchema
);

function validateReservation(reservation) {
  let template = Joi.object().keys({
    etat: Joi.string().min(2).max(50),
    demandePar: Joi.string().hex().length(24).required(),
    hotel: Joi.string().min(2).max(400),
    adresse: Joi.string(),
    piece_jointe: Joi.string(),
  });

  return template.validate(reservation);
}

exports.validate = validateReservation;

exports.ReservationHotel = ReservationHotel;
