import mongoose, { Schema } from 'mongoose';

const SalesSchema = new Schema(
  {
    location: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    clientName: { type: String, required: true },
    product: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    time: { type: String },
    registrationDate: { type: Date, default: Date.now },
    note: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Sales || mongoose.model('Sales', SalesSchema);


