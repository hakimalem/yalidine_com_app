const mongoose = require('mongoose');

const communeSchema = new mongoose.Schema({
  nom: String,
  wilaya_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

communeSchema.set('timestamps', true);

const Commune = mongoose.model('Commune', communeSchema);

exports.Commune = Commune;
