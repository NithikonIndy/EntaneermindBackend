import { mongoose,Schema, model } from 'mongoose';

const schema = mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    }
  }
);


export const ImageModel = mongoose.model("images", schema);


