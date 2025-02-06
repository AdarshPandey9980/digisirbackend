const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  created_by: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  target_users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Student'
    },
    {
      type: Schema.Types.ObjectId,
      ref: 'Parent'
    }
  ],
  event_related: { type: Schema.Types.ObjectId, ref: 'Event' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
