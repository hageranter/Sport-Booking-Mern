const SportType = require('../models/SportType');

/**
 * @desc    Create a new sport type
 * @route   POST /api/sport-types
 * @access  Admin
 */
const createSportType = async (req, res) => {
  try {
    const { name, nameAr, description, descriptionAr, icon, minPlayers, maxPlayers, isActive } = req.body;

    if (!name || !nameAr || !minPlayers || !maxPlayers) {
      return res.status(400).json({
        success: false,
        message: 'name, nameAr, minPlayers and maxPlayers are required'
      });
    }

    const existing = await SportType.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Sport type with this name already exists'
      });
    }

    const sport = await SportType.create({
      name,
      nameAr,
      description,
      descriptionAr,
      icon,
      minPlayers,
      maxPlayers,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Sport type created',
      data: sport
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
    }
    res.status(500).json({ success: false, message: error.message || 'Error creating sport type' });
  }
};

/**
 * @desc    Get all sport types
 * @route   GET /api/sport-types
 * @access  Public
 */
const getAllSportTypes = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    const filter = {};
    if (activeOnly === 'true') filter.isActive = true;

    const list = await SportType.find(filter).sort('name');
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching sport types' });
  }
};

/**
 * @desc    Get sport type by ID
 * @route   GET /api/sport-types/:id
 * @access  Public
 */
const getSportTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const sport = await SportType.findById(id);
    if (!sport) {
      return res.status(404).json({ success: false, message: 'Sport type not found' });
    }
    res.status(200).json({ success: true, data: sport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching sport type' });
  }
};

/**
 * @desc    Update sport type
 * @route   PUT /api/sport-types/:id
 * @access  Admin
 */
const updateSportType = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    delete update._id;

    const sport = await SportType.findById(id);
    if (!sport) {
      return res.status(404).json({ success: false, message: 'Sport type not found' });
    }

    // if name changed, ensure uniqueness
    if (update.name && update.name !== sport.name) {
      const exists = await SportType.findOne({ name: update.name });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Sport type with this name already exists' });
      }
    }

    Object.assign(sport, update);
    await sport.save();

    res.status(200).json({ success: true, message: 'Sport type updated', data: sport });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
    }
    res.status(500).json({ success: false, message: error.message || 'Error updating sport type' });
  }
};

/**
 * @desc    Delete sport type
 * @route   DELETE /api/sport-types/:id
 * @access  Admin
 */
const deleteSportType = async (req, res) => {
  try {
    const { id } = req.params;
    const sport = await SportType.findById(id);
    if (!sport) {
      return res.status(404).json({ success: false, message: 'Sport type not found' });
    }
    await SportType.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Sport type deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting sport type' });
  }
};

module.exports = {
  createSportType,
  getAllSportTypes,
  getSportTypeById,
  updateSportType,
  deleteSportType
};
