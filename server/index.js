/** @format */

import express from "express";

import mongoose from "mongoose";

import multer from "multer";

import cors from "cors";
import fs from "fs";

import {
  registerValidation,
  LoginValidation,
} from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";

import {
  checkAuth,
  validationErrors,
} from "./utils/index.js";

import {
  PostController,
  UserController,
    CommentController,
} from "./controllers/index.js";
import {createComment} from "./controllers/CommentController.js";



mongoose
  .connect(
    "mongodb+srv://AdamDim:09012008@cluster0.p0aseks.mongodb.net/"
  )

  .then(() => {
    console.log("connects db");
  })


  .catch((e) => {
    console.log(e);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
// valid

// auth
app.post(
  "/auth/login",

  LoginValidation,
  validationErrors,
  UserController.login
);
// register
app.post(
  "/auth/register",

  registerValidation,
  validationErrors,
  UserController.register
);
app.get("/post/:id:",PostController.getPost)
// get me info
app.get("/auth/me", checkAuth, UserController.getMe);
// get posts
app.get("/posts", PostController.getAll);
// get post id
app.get("/posts/:id", PostController.getOne);
// create post
app.post(
  "/posts",
  checkAuth,

  postCreateValidation,
  validationErrors,
  PostController.create
);
// delete post
app.delete("/posts/:id", checkAuth, PostController.remove);
// patch post
app.patch(
  "/posts/:id",
  postCreateValidation,
  validationErrors,
  PostController.update
);
// тэги
app.get("/tags", PostController.getTags);

app.post("/comments",CommentController.createComment)
// картиник
app.post(
  "/upload",
  checkAuth,
  upload.single("image"),
  (req,res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  }
);


app.listen(1234, (err) => {
  err ? console.log(err) : console.log(`server is running on port ${1234}`);
});
