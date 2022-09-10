const jwt = require("jsonwebtoken");
const mySecret = process.env.SECRET;

exports.isBlank = (input) => {
  if (input === "" || input === undefined || input === null) {
    return true;
  } else if (typeof input === "string" && input.replace(/ /g, "") === "") {
    return true;
  } else {
    return false;
  }
};

exports.isAuth = (token) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, mySecret);
    if (decodedToken) {
      return decodedToken;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};
