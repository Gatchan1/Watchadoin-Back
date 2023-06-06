const { Schema, model } = require("mongoose");

const listSchema = new Schema({
  name: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectID, ref: "User" }],
});

const List = model("List", listSchema);

module.exports = List;
