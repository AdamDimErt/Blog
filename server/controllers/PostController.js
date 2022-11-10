/** @format */

import PostModel from "../models/Post.js";

export const getTags = async (req, res) => {
  try {
    // populate для связвания объектов
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "не удалось получить теги",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    // populate для связвания объектов
    const posts = await PostModel.find()
      .populate("user")
      .exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "не удалось получить статьи,",
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "не удалось вернуть статью",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "статья не найдена",
          });
        }
        res.json(doc);
      }
    ).populate('user');
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "не удалось получить статьи,",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "не удалось создать пост",
    });
  }
};
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "не удалить статью",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "статья не найдена",
          });
        }
        res.json({
          succes: true,
        });
      }
    );
  } catch (error) {}
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    );
    res.json({
      succes: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "не удалось обновить статью",
    });
  }
};
