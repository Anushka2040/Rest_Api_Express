import { Request, Response, NextFunction } from "express";
import { BasicUser } from "../types/user";
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const loginUser = (user: BasicUser) => {
  const accessToken = jwt.sign(
    { username: user.username, id: user.id },
    config.secret
  );
  const refreshToken = jwt.sign(
    { username: user.username, id: user.id },
    config.refresh_secret
  );
  return { accessToken, refreshToken };
};

const verifyToken = (req: Request, res: Response) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    return false;
  } else {
    try {
      const validToken = jwt.verify(accessToken, config.secret);
      const validRToken = jwt.verify(accessToken, config.refresh_secret);
      if (validToken || validRToken) {
        return true;
      }
      return false;
    } catch (err) {
      return res.status(400);
    }
  }
};

const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("access-token");
  res.status(200).send({ message: "USER LOGGED OUT!" });
};

export { loginUser, verifyToken, logoutUser };
