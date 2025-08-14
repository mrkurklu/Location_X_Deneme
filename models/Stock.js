import mongoose, { Schema } from 'mongoose';

const StockSchema = new Schema(
  {
    location: { type: String, required: true, index: true },
    username: { type: String, required: true },
    date: { type: Date, required: true },
    box: { type: Number, required: true },
    case: { type: Number, required: true },
    registrationDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Stock || mongoose.model('Stock', StockSchema);


