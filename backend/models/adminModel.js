import mongoose from "mongoose";


const adminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
    phoneNumber: {
        type: String,
    },
    role:{
        type: String,
        default: "admin",
    },
    profilePic:{
        type: String,
        default: "https://www.gravatar.com/avatar/?d=identicon",
    },
    bio:{
        type: String,
    },
});

export const Admin = mongoose.model("Admin", adminSchema);