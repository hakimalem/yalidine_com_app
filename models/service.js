const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  nom: String,
  depart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departement',
  },
});

serviceSchema.set('timestamps', true);
const Service = mongoose.model('Service', serviceSchema);

exports.Service = Service;
