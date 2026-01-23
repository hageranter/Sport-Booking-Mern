// Export all models from a single file for easier imports

module.exports = {
  User: require('./User'),
  Court: require('./Court'),
  SportType: require('./SportType'),
  Booking: require('./Booking'),
  Match: require('./Match'),
  Payment: require('./Payment'),
  ChatMessage: require('./ChatMessage'),
  Review: require('./Review'),
  Notification: require('./Notification'),
  NotificationSettings: require('./NotificationSettings'),
  SearchHistory: require('./SearchHistory')
};
