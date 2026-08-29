  import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please provide an author'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['want-to-read', 'reading', 'completed'],
      default: 'want-to-read',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Book || mongoose.model('Book', BookSchema);




