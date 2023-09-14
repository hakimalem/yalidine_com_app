const mongoose = require('mongoose');
const reservationHotelSchema = new mongoose.Schema({
  hotel: String,
  adresse: String,
  facture: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
  },
});
reservationHotelSchema.set('timestamps', true);
const ReservationHotel = mongoose.model(
  'ReservationHotel',
  reservationHotelSchema
);

exports.ReservationHotel = ReservationHotel;
