import {NextFunction, Request, Response} from "express";
import User from '../../model/User.model';
import bcrypt from 'bcrypt';
import {issueAccessToken, issueRefreshToken, verifyJwt} from "../../utils/jwt.utils";
import * as process from "process";
import config from "../../config/config";

const { refreshTokenName, refreshTokenSecret } = config;
export const handleLogin = async (req: Request, res: Response) => {
  try {
    const {username, email, password} = req.body;
    // If no user data or password provided, return error
    if ((!username && !email) || !password) return res.status(400).json({'message': 'Username/email and password are required.'});

    // Check if user is email or username and query accordingly
    let foundUser;
    if (username) {
      foundUser = await User.findOne({username}).exec();
    } else {
      foundUser = await User.findOne({email}).exec();
    }

    // If no user found, return error
    if (!foundUser) return res.status(401).json({message: "Incorrect username/email or password."});

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({message: "Incorrect username/email or password."});

    // Get roles
    const roles = foundUser.roles && Object.values(foundUser.roles).filter(Boolean);

    // create JWTs
    const {accessToken, csrfToken} = issueAccessToken(foundUser)
    const refreshToken = issueRefreshToken(foundUser);

    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie(refreshTokenName, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict',
    });

    // Send authorization roles and access token to user
    res.json({
      message: "Login successful",
      accessToken,
      csrfToken,
      user: {
        roles: result.roles,
        username: result.username,
        email: result.email,
        posts: result.posts,
      }
    });
  } catch (e) {
    console.log(e)
    return res.status(500).json({message: "Internal server error"});
  }
}

export const handleRegister = async (req: Request, res: Response) => {
  try {
    const {username, displayName, email, password, confirmPassword} = req.body;
    if (!username || !displayName || !email || !password) return res.status(400).json({'message': 'Username, displayName, email and password are required.'});
    if (password !== confirmPassword) return res.status(400).json({'message': 'Passwords do not match.'});

    // check for duplicate usernames/emails in the db
    const duplicateUser = await User.findOne({$or: [{username: username}, {email: email}]}).exec();
    if (duplicateUser) {
      let duplicateError = duplicateUser.username === username ? 'username' : 'email';
      return res.status(409).json({message: `A user with this ${duplicateError} already exists.`}); //Conflict
    }

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

    const createdUser = {...result.toObject(), password: undefined};

    res.status(201).json({message: "User created successfully.", user: {createdUser}});
  } catch (e) {
    console.log(e)
    return res.status(500).json({message: "Something went wrong."});
  }
}

export const handleLogout = async (req: Request, res: Response) => {
  try {
    // On client, also delete the accessToken
    const cookies = req.cookies;
    if (!cookies || !cookies[refreshTokenName]) return res.status(400).json({message: "No cookies found."}); //No content
    const refreshToken = cookies[refreshTokenName];

    // Is refreshToken in db?
    const foundUser = await User.findOne({refreshToken}).exec();
    if (!foundUser) {
      res.clearCookie(refreshTokenName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
      })
      return res.status(204).json({message: "No user found."});
    }

    // Delete refreshToken in db
    foundUser.refreshToken = undefined;
    const result = await foundUser.save();


    res.clearCookie(refreshTokenName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict',
    })
    return res.status(200).json({
      message: "Logged out successfully.",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: "Internal server error"});
  }
}

export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies || !cookies[refreshTokenName]) return res.status(401).json({message: "No cookies found."});
    const refreshToken = cookies[refreshTokenName];

    const { valid, expired } = verifyJwt(refreshToken, refreshTokenSecret);
    if (!valid || expired) return res.status(401).json({message: "Invalid or expired token."});

    // Is refreshToken in db?
    const found = await User.findOne({refreshToken}).exec();
    if (!found) {
      res.clearCookie(refreshTokenName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
      })
      return res.status(204).json({message: "No user found."});
    }

    const { decoded: decodedRefresh, expired: expiredRefresh, valid: validRefresh } = verifyJwt(refreshToken, refreshTokenSecret, { complete: true });

    if (expiredRefresh || !validRefresh) return res.status(401).json({message: "Invalid or expired refresh token."});

    // create new access token
    const {accessToken, csrfToken} = issueAccessToken(found);

    // create new refresh token
    const newRefreshToken = issueRefreshToken(found);

    // update refresh token in db
    found.refreshToken = newRefreshToken;
    await found.save();

    // create new secure cookie with new refresh token
    res.cookie(refreshTokenName, newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
      }
    );

    return res.status(200).json({accessToken, csrfToken});
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: "Internal server error"});
  }
}