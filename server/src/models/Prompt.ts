import { Schema, model } from 'mongoose';

const promptSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    description: { type: String, default: '' },
    isFavorite: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      }
    }
  }
);

export const Prompt = model('Prompt', promptSchema);
