import { db } from "../models/db";
import { Request, Response } from "express";
import { loginUser, logoutUser, verifyToken } from "../middleware/JWT";

const createUser = (req: Request, res: Response) => {
  if (verifyToken(req, res)) {
    let user = req.body;
    db.query(
      "INSERT INTO user (username, firstname, lastname, email, password, phone, userStatus) VALUES ( ? , ? , ? , ? , ? , ? , ? )",
      [
        user.username,
        user.firstname,
        user.lastname,
        user.email,
        user.password,
        user.phone,
        user.userStatus,
      ],
      (err, result) => {
        console.log(result);
        if (result === undefined) {
          res.status(400).send({ error: "USER NOT CREATED!" });
        } else {
          res.status(201).send({ message: result });
        }
      }
    );
  } else {
    res.status(400).send({ error: "USER NOT LOGGED IN!" });
  }
};

const createUserWithList = (req: Request, res: Response) => {
  let user = req.body;
  for (var i = 0; i < user.length; i++) {
    db.query(
      "INSERT INTO user (username, firstname, lastname, email, password, phone, userStatus) VALUES ( ? , ? , ? , ? , ? , ? , ? )",
      [
        user[i].username,
        user[i].firstName,
        user[i].lastName,
        user[i].email,
        user[i].password,
        user[i].phone,
        user[i].userStatus,
      ],
      (err, result) => {
        if (i === user.length - 1) {
          if (result === null) {
            res.status(400).send({ error: "USER NOT CREATED!" });
          } else {
            res.status(200).send({ result });
          }
        }
      }
    );
  }
};

const getUserLogin = (req: Request, res: Response) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM user WHERE username= ?",
    [username],
    (err, result) => {
      if (err) {
        res.status(400).send({ error: "USER DOESN'T EXISTS!" });
      } else {
        if (password == result[0].password) {
          const tokenList = loginUser(result[0]);
          res.cookie("access-token", tokenList.accessToken, { maxAge: 900000 });
          res.cookie("refresh-token", tokenList.refreshToken, {
            maxAge: 86400000,
          });
          res.status(200).send({ message: "LOGGED IN!" });
        } else {
          res
            .status(400)
            .send({ message: "WRONG USERNAME AND PASSWORD COMBINATION!" });
        }
      }
    }
  );
};

const getUserLogout = (req: Request, res: Response) => {
  logoutUser(req, res);
};

const getUserbyUsername = (req: Request, res: Response) => {
  if (verifyToken(req, res)) {
    const username = req.params.username;
    db.query(
      "SELECT * FROM user WHERE username= ?",
      [username],
      (err, result) => {
        if (Object.keys(result).length === 0) {
          res.status(400).send({ error: "USER DOESN'T EXISTS!" });
        } else {
          res.status(200).send({ message: result });
        }
      }
    );
  } else {
    res.status(400).send({ error: "USER NOT LOGGED IN!" });
  }
};

const updateUserbyUsername = (req: Request, res: Response) => {
  if (verifyToken(req, res)) {
    const username = req.params.username;
    const body = req.body;
    db.query(
      "UPDATE user SET id= ? ,username= ? ,firstName= ? ,lastName= ? ,email= ? ,password= ? ,phone= ? ,userStatus= ? WHERE username= ?",
      [
        body.id,
        body.username,
        body.firstName,
        body.lastName,
        body.email,
        body.password,
        body.phone,
        body.userStatus,
        username,
      ],
      (err, result) => {
        if (err) {
          res.status(400).send({ error: "USER DOESN'T EXISTS!" });
        } else {
          res.status(200).send({ message: "USER FOUND!" });
        }
      }
    );
  } else {
    res.status(400).send({ error: "USER NOT LOGGED IN!" });
  }
};

const deleteUserbyUsername = (req: Request, res: Response) => {
  if (verifyToken(req, res)) {
    const username = req.params.username;
    db.query(
      "DELETE FROM user WHERE username= ?",
      [username],
      (err, result) => {
        if (err) {
          res.status(400).send({ error: "USER DOESN'T EXISTS!" });
        } else {
          res.status(200).send({ message: "USER DELETED!" });
        }
      }
    );
  } else {
    res.status(400).send({ error: "USER NOT LOGGED IN!" });
  }
};

const getRefreshToken = (req: Request, res: Response) => {
  const Rtoken = req.cookies["refresh-token"];
  res.cookie("access-token", Rtoken, { maxAge: 85500000 });
  res.status(200).send({ message: "Token Refreshed" });
};

export {
  createUser,
  createUserWithList,
  getUserLogin,
  getUserLogout,
  getUserbyUsername,
  updateUserbyUsername,
  deleteUserbyUsername,
  getRefreshToken,
};
