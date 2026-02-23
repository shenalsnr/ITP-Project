const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    productId: String,
    name: { type: String, required: true },
    qty: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
  },
  { _id: false }
);

const HistorySchema = new mongoose.Schema(
  {
    from: String,
    to: String,
    at: { type: Date, default: Date.now },
    by: { type: String, default: "system" },
    note: String,
  },
  { _id: false }
);

const PaymentSchema = new mongoose.Schema(
  {
    userId: String, // optional: attach your logged-in user id/email
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "LKR" },

    method: {
  type: String,
  enum: [
    "Credit Card",
    "Bank Transfer",
    "COD",
    "Razorpay",
    "Stripe",
    "PayHere",
    "Online Wallet"   // ✅ added
  ],
  default: "Credit Card",
},
status: {
  type: String,
  enum: [
    "pending",
    "paid",
    "failed",
    "refunded",
    "completed"       // ✅ added
  ],
  lowercase: true,     // normalize values automatically
  default: "pending",
  index: true,
},


    orderId: { type: String, index: true },
    items: [ItemSchema],

    meta: {
      gateway: String, // "stripe" | "razorpay" | "payhere" | "dummy"
      txId: String,
      notes: String,
    },

    history: [HistorySchema],
  },
  { timestamps: true }
);

PaymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Payment", PaymentSchema);
