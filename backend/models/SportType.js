const mongoose = require('mongoose');

const SportTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sport type name is required'],
    unique: true,
    enum: ['Football', 'Tennis', 'Basketball', 'Paddle', 'Volleyball', 'Squash', 'Badminton']
  },
  nameAr: {
    type: String,
    required: [true, 'Arabic name is required']
  },
  description: {
    type: String,
    trim: true
  },
  descriptionAr: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    default: null
  },
  minPlayers: {
    type: Number,
    required: true
  },
  maxPlayers: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index (name already indexed via unique:true)
SportTypeSchema.index({ isActive: 1 });

module.exports = mongoose.model('SportType', SportTypeSchema);
