/** @format */

import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    comments: {
      type: Array,
      ref: "Comment",
      default: [],
    },
    tags: {
      type: Array,
      ref: "Comment",
      default: [],
    },

    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      // связь между двумя таблицами
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Post", PostSchema);
