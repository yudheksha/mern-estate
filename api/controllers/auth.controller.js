import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const {userName, email, password} = req.body;
  console.log(req.body)
  console.log(userName)
  const hashedPassword = bcryptjs.hashSync(password, 10);
  console.log("Password Hashed")
  const newUser = new User({userName:userName, email:email, password:hashedPassword});
  console.log("New user created to save to database", newUser)

  try{

    await newUser.save();
    console.log("saved to database")
    res.status(201).json("User created successfully!");

  } catch(error) {

    next(error);

  }
};

