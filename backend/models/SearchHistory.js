const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  searchType: {
    type: String,
    enum: ['Court', 'Match', 'Location', 'Sport'],
    required: [true, 'Search type is required']
  },
  searchQuery: {
    type: String,
    required: [true, 'Search query is required'],
    trim: true
  },
  filters: {
    sportType: {
      type: String,
      enum: ['Football', 'Tennis', 'Basketball', 'Paddle', 'Volleyball', 'Squash', 'Badminton', null],
      default: null
    },
    city: {
      type: String,
      default: null
    },
    governorate: {
      type: String,
      default: null
    },
    priceMin: {
      type: Number,
      default: null
    },
    priceMax: {
      type: Number,
      default: null
    },
    date: {
      type: Date,
      default: null
    },
    ratingMin: {
      type: Number,
      default: null
    }
  },
  resultsCount: {
    type: Number,
    default: 0
  },
  clickedResult: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  clickedResultModel: {
    type: String,
    enum: ['Court', 'Match', null],
    default: null
  }
}, {
  timestamps: true
});

// Indexes for performance
SearchHistorySchema.index({ userId: 1, createdAt: -1 });
SearchHistorySchema.index({ searchType: 1 });
SearchHistorySchema.index({ 'filters.sportType': 1 });
SearchHistorySchema.index({ 'filters.city': 1 });

// Limit search history per user (keep last 50)
SearchHistorySchema.statics.addSearch = async function(searchData) {
  const newSearch = await this.create(searchData);
  
  // Get count of user's searches
  const count = await this.countDocuments({ userId: searchData.userId });
  
  // If more than 50, delete oldest
  if (count > 50) {
    const excess = count - 50;
    const oldSearches = await this.find({ userId: searchData.userId })
      .sort({ createdAt: 1 })
      .limit(excess)
      .select('_id');
    
    const ids = oldSearches.map(s => s._id);
    await this.deleteMany({ _id: { $in: ids } });
  }
  
  return newSearch;
};

// Get popular searches
SearchHistorySchema.statics.getPopularSearches = async function(limit = 10) {
  return await this.aggregate([
    {
      $group: {
        _id: '$searchQuery',
        count: { $sum: 1 },
        lastSearched: { $max: '$createdAt' }
      }
    },
    { $sort: { count: -1, lastSearched: -1 } },
    { $limit: limit }
  ]);
};

// Get user's recent searches
SearchHistorySchema.statics.getUserRecentSearches = async function(userId, limit = 10) {
  return await this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);
