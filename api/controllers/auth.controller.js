import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ userName, email, password: hashedPassword });

  try {
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Exclude password from the response
    const { password, ...user } = newUser._doc;

    // Send response with token and user information
    res.status(201).json({ ...user, token });
  } catch (error) {
    next(error);
  }
};


export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({ ...rest, token });  // Include token in the response body
  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {

  try{
    console.log('Google Auth Request:', req.body);
    const user = await User.findOne({ email: req.body.email })
    if (user){
      console.log('User found:', user)

      const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
      const { password: pass, ...rest} = user._doc;

      res
         .cookie('access_token', token, { httpOnly: true})
         .status(200)
         .json({...rest, token});
    } else {


      console.log('User not found, creating a new user');

      const generatedPassword = req.body.password || Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({ 
        userName: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), 
        email: req.body.email, 
        password: hashedPassword, 
        avatar:req.body.photo});

      await newUser.save();
      console.log('New user created:', newUser);

      const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET);
      const { password: pass, ...rest} = newUser._doc;
      res.cookie('access_token', token, { httpOnly: true})
      .status(200)
      .json(rest);

    }

  } catch (error){
    console.error('Error in Google Auth:', error);
    next(error)
  }

};

export const signOut = async (req, res, next) => {

  try{
    res.clearCookie('access_token');
    res.status(200).json({ success: true, message: 'User has been logged out!' });

  } catch(error){
    next(error);
  }

};