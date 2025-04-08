import mongoose from "mongoose";

import dotenv from "dotenv";
import e from "express";
dotenv.config();

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  profilePic:{
    type: String,
    default: "https://www.gravatar.com/avatar/?d=identicon",
  },
  bio:{
    type: String,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  skills:{
    type: Array,
    default: [],
  },
  linkedinProfile:{
    type: String,
  },
  githubProfile:{
    type: String,
  },
  projects:{
    type: Array,
    default: [],
  },
  isVerified:{
    type: Boolean,
    default: false,
  },
  isSuspended:{
    type: Boolean,
    default: false,
  },
  isDeleted:{
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export const Member = mongoose.model("Member", memberSchema);