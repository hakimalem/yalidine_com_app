const mongoose = require('mongoose');

const agenceSchema = new mongoose.Schema({
  nom: String,
  commune_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

agenceSchema.set('timestamps', true);

const Agence = mongoose.model('Agence', agenceSchema);

exports.Agence = Agence;
