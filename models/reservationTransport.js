const mongoose = require('mongoose');
const reservationTransportSchema = new mongoose.Schema({
  transport: String,
  facture: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
  },
});

reservationTransportSchema.set('timestamps', true);
const ReservationTransport = mongoose.model(
  'ReservationTransport',
  reservationTransportSchema
);

exports.ReservationTransport = ReservationTransport;
