import {Request, Response} from "express";
import UserModel, {UserInput} from '../model/User.model';
import bcrypt from 'bcrypt';
import isEmail from "validator/es/lib/isEmail";
import {signJwt, verifyJwt} from "../utils/jwt.utils";

export const handleLogin = async (req: Request, res: Response) => {
  const {user, password} = req.body;
  // If no user data or password provided, return error
  if (!user || !password) return res.status(400).json({'message': 'Username/email and password are required.'});

  // Check if user is email or username and query accordingly
  let foundUser = null;
  if (isEmail(user)) {
    foundUser = await UserModel.findOne({email: user}).exec();
  } else {
    foundUser = await UserModel.findOne({username: user}).exec();
  }

  // If no user found, return error
  if (!foundUser) return res.status(401).json({message: "Incorrect username/email or password."});

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({message: "Incorrect username/email or password."});

  // Get roles
  const roles = foundUser.roles && Object.values(foundUser.roles).filter(Boolean);

  // create JWTs
  const accessToken = signJwt({
    UserInfo: {
      username: foundUser.username,
      email: foundUser.email,
      roles: roles,
    }
  }, "ACCESS_TOKEN_SECRET", {expiresIn: "15m"});

  const refreshToken = signJwt({
    UserInfo: {
      username: foundUser.username,
    },
  }, "REFRESH_TOKEN_SECRET", {expiresIn: '90d'});

  // Saving refreshToken with current user
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();
  console.log(result);

  // Creates Secure Cookie with refresh token
  res.cookie(process.env.APP_NAME || 'REFRESH_TOKEN', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000
  });

  // Send authorization roles and access token to user
  res.json({roles, accessToken});

}
