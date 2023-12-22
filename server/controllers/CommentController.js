/** @format */

import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";

export const createComment = async (req, res) => {
  try {
    const postId = req.body.post;
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "статья не найдена",
      });
    }

    const comment = new CommentModel({
      text: req.body.text,
      post: postId,
    });

    await comment.save();

    // Добавляем созданный комментарий к массиву комментариев поста
    post.comments.push(comment._id);
    await post.save();

    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "не удалось создать комментарий",
    });
  }
};
