// models/Counter.js
import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // name of the sequence (e.g. 'category, product')
  seq: { type: Number, default: 100 },
});

export default mongoose.model("Counter", counterSchema);
