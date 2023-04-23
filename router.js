import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import getData from "./getData.js";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

export default function (CACHE) {
  const router = express.Router();

  router.get("/", (_req, res) => {
    return res.send({
      health: "OK",
    });
  });

  const verifyUserMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    jwt.verify(token, SECRET_KEY, (err, data) => {
      if (err || !data.regComplete) {
        return res.status(404).send("Unauthorized")
      } else {
        res.locals.data = data;
        next()
      }
    })
  }

  router.get("/getOpposite", verifyUserMiddleware, async (_req, res) => {
    try {
      const { type } = res.locals.data;

      const opposite = type === "M" ? "F" : "M";

      const data = await getData(CACHE, opposite);

      return res.send({
        success: true,
        data
      });
    } catch (err) {
      return res.status(401).send({
        success: false,
        message: "Something went wrong",
      });
    }
  });

  router.get("/cache", async (_req, res) => {
    return res.send({
      cache: CACHE
    });
  });

  return router
}
