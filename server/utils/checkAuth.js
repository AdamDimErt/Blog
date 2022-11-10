/** @format */

import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(
    /Bearer\s?/,
    ""
  );
  // потом упростить через тернарный оператор
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret");
      req.userId = decoded._id;
      // без next запрос дальше не идет
      next();
    } catch (error) {
      return res.status(403).json({
        message: "нет доступа",
      });
    }
  } else {
    return res.status(403).json({
      message: "нет доступа",
    });
  }
};


