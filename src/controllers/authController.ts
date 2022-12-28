import {Request, Response} from "express";
import User, {UserInput} from '../model/User.model';
import bcrypt from 'bcrypt';
import isEmail from "validator/es/lib/isEmail";
import {signJwt, verifyJwt} from "../utils/jwt.utils";

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const {user, password} = req.body;
    // If no user data or password provided, return error
    if (!user || !password) return res.status(400).json({'message': 'Username/email and password are required.'});

    // Check if user is email or username and query accordingly
    let foundUser = null;
    if (isEmail(user)) {
      foundUser = await User.findOne({email: user}).exec();
    } else {
      foundUser = await User.findOne({username: user}).exec();
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
  } catch (e) {
    return res.status(500).json({message: "Internal server error"});
  }
}

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const {username, displayName, email, password, confirmPassword} = req.body;
    if (!username || !displayName || !email || !password) return res.status(400).json({'message': 'Username, displayName, email and password are required.'});
    if (password !== confirmPassword) return res.status(400).json({'message': 'Passwords do not match.'});

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({username: username}).exec();
    if (duplicate) return res.status(409).json({message:"A user with this username already exists."}); //Conflict

    //encrypt the password
    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(password, salt)

    //create and store the new user
    const result = await User.create({
      "username": username,
      "password": hashedPwd,
      "displayName": displayName,
      "email": email,
    });

    console.log(result);
    const createdUser = {...result.toObject(), password: undefined};

    res.status(201).json({message: "User created successfully.", user: {createdUser}});
  } catch (e) {
    return res.status(500).json({message: "Something went wrong."});
  }
}