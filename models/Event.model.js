const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
  title: { type: String, required: true },
  creator: { type: Schema.Types.ObjectID, ref: "User" },
  description: { type: String, default: "holi" },
  icon: { type: String }, //enum, fontawesome (array off html tag)
  dateTime: { type: Date, default: Date.now }, //use luxon
  location: { type: String },
  coordinates: {}, //coordinates (an object with properties lat & lng)
  pendingJoiners: [{ type: Schema.Types.ObjectID, ref: "User" }],
  confirmedJoiners: [{ type: Schema.Types.ObjectID, ref: "User" }],
  // shareable: { type: Boolean },
  // comments: [{ type: Schema.Types.ObjectID, ref: "Comment" }]
});

const Event = model("Event", eventSchema);

module.exports = Event;
