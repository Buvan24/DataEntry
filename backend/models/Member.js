const mongoose = require('mongoose');
const memberSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  fatherName:      String, dob: Date, phone: String, address: String,
  partNumber:      String, voterSerial: String, voterId: String,
  aadharNumber:    String, partyMembership: String,
  district:        { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  union:           { type: mongoose.Schema.Types.ObjectId, ref: 'Union' },
  assembly:        { type: mongoose.Schema.Types.ObjectId, ref: 'Assembly' },
  area:            { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  administration:  { type: mongoose.Schema.Types.ObjectId, ref: 'Administration' },
  position:        { type: mongoose.Schema.Types.ObjectId, ref: 'Position' },
  joinDate: Date,  resignDate: Date,
}, { timestamps: true });
module.exports = mongoose.model('Member', memberSchema);
