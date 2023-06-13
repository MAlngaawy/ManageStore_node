const mongoose = require('mongoose');

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.methods.increaseQuantity = function (amount) {
  this.quantity += amount;
};

itemSchema.methods.decreaseQuantity = function (amount) {
  if (this.quantity >= amount) {
    this.quantity -= amount;
  } else {
    throw new Error('Insufficient quantity.');
  }
};

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
