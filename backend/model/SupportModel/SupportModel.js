const mongoose = require("mongoose");

const SupportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // validation
      trim: true,     // removes extra spaces
    },

    ticketID: {
      type: Number,
      unique: true,   // optional: makes each ticket ID unique
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["open", "in-progress", "closed"], // optional: restrict allowed values
      default: "open",
    },
  },
  {
    timestamps: true, // ✅ automatically adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Support", SupportSchema);
