const mongoose = require('mongoose');
const fonctionSchema = new mongoose.Schema({
  nom: String,
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  },
});
fonctionSchema.set('timestamps', true);
const Fonction = mongoose.model('Fonction', fonctionSchema);
exports.Fonction = Fonction;
