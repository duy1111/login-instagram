// express.d.ts
import express from "express";
import IUser from "../user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
