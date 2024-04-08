// const sql = require("./db");
const { RegisterMail } = require("../mail/mail");
const jwt = require("jsonwebtoken");
const { sql, createUser,Login } = require("./db");
require("dotenv").config();

async function RegisterUser(name, email, password, role) {
  const rol = 123456;
  const res = await RegisterMail(email, rol);
  console.log(res);
  if (!res.error) {
    const userdetails = {
      name: name,
      email: email,
      password: password,
      role: role,
      token: rol,
    };
    const token = jwt.sign({ user: userdetails }, process.env.REGISTER_SECRET, {
      expiresIn: "2h",
    });
    return { token: token, message: "head over to teh validate" };
  } else {
    return "error:check the provided data";
  }
}

async function ValidateUser(token, key) {
  const decode = jwt.verify(token, process.env.REGISTER_SECRET);
  const user = decode.user;
  console.log(user, " --", key);
  if (user && user.token === key) {
    console.log("valid user savedin db");
    const res = await createUser(
      user.name,
      user.email,
      user.password,
      user.role
    );
    console.log(res);
    return res;
  } else {
    console.log("invalid token or code");
  }
}

async function LoginUser(email, password) {
  try {
    const user=await Login(email,password);
    console.log(user);
      const token = await jwt.sign({ token: user }, process.env.SECRET, {
        expiresIn: "1h",
      });

      return token;
    } 
   catch (e) {
    console.log(e);
  }
}
// async function LogoutUser() {}

module.exports = { RegisterUser, ValidateUser, LoginUser };
