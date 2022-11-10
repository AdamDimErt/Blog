/** @format */
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import validationErrors from "../utils/validationErrors.js";

import UserModel from "../models/User.js";

import bcrypt, { hash } from "bcrypt";

export const register = async (req, res) => {
  try {
    // хеш паролей обязательно
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });
    // create user in mongodb
    const user = await doc.save();
    // создание токена
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );
    // убираем пароль из пользователя
    const { passwordHash, ...userdata } = user._doc;

    res.json({
      ...userdata,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "не удалось зарегестрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        // потом изменить на логин или пароль не подходит для безопасности
        message: "пользователей не найден",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPassword) {
      return res.status(404).json({
        // потом изменить на логин или пароль не подходит для безопасности
        message: "пароль не подходит",
      });
    }
    // создание токена
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );
    // убираем пароль из пользователя
    const { passwordHash, ...userdata } = user._doc;

    res.json({
      ...userdata,
      token,
    });
  } catch (err) {
    console.log(err);
    // res.status(500).json({
    //   message: "не войти",
    // });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({
        message: "пользователь не найден",
      });
    }
    const { passwordHash, ...userdata } = user._doc;

    res.json({
      ...userdata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "нету доступа",
    });
  }
};
