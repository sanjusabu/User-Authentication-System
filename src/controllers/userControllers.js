const HttpError = require("../models/http-error");
const UserModel = require("../models/UserModel");
const express = require("express");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const AdminModel = require("../models/admin");
const nodemailer = require("nodemailer");
const redis = require('redis');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const client = redis.createClient({url: "rediss://red-ch3djktgk4qarqmkffpg:68yqeaebrdwL4r6NQfgnzGUhO939y4RL@singapore-redis.render.com:6379"});
client.connect()

const signup = async (req, res, next) => {
  // const errors = validationResult(req);
  console.log(req.body);
  const { name, email, password, mobile } = req.body;
  // console.log(req.body)
  let existingEmail;
  let existingMobile;
  try {
    existingEmail = await UserModel.findOne({ email: email });
    //   existingMobile = await UserModel.findOne({ mobilenumber:mobile});
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingEmail || existingMobile) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  const createdUser = new UserModel({
    name: name,
    email: email,
    password: password,
    mobilenumber: mobile,
  });
  console.log(createdUser, "hjghjg");
  try {
    await createdUser.save();
    // console.log(newuser, "no new user error");
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(req.body)
  // const errors = validationResult(req)

  let existingUser;
  try {
    existingUser = await UserModel.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Login failed, check your credentials or signup.",
      500
    );
    return next(error);
  }
  // console.log(existingUser)
  if (!existingUser) {
    // console.log(password,existingUser.password)
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );

    return next(error);
  } else {
    const pass = await bcrypt.compare(password, existingUser.password);
    // console.log(pass)
    if (!pass) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        401
      );
      return next(error);
    }
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "1d" }
    );
    // lo;
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }
  // console.log(existingUser.id + " " + "possible?");

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};


exports.signup = signup;
exports.login = login;
