import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true },
);

schema.index({ id: 1 });

export const Redirect = mongoose.model("Redirect", schema);
