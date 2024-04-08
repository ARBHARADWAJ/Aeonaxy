const express = require("express");
const axios = require("axios");
const { RegisterUser, ValidateUser, LoginUser } = require("./db/User");
const {
  getPgVersion,
  checkCourseTables,
  checkUserTables,
  fetchCourses,
  insertCourses,
  fetchParticularCourses,
  enrolled,
  viewcourses,
} = require("./db/db");
getPgVersion();
checkUserTables();
checkCourseTables();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Jai shree ram");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const response = await LoginUser(email, password);
  res.send({ token: response ?? null });
});

app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(name, email, password, role);
  const register = await RegisterUser(name, email, password, role);

  res.send({
    result: register
      ? "The user registered successfully ,please redirect to login"
      : "error occured",
  });
});

app.post("/validate", async (req, res) => {
  const { token, key } = req.body;
  try {
    const response = await ValidateUser(token, key);
    res.send(response);
  } catch (e) {
    console.log("error at the token", e);
  }
});
app.get("/allcourses", async (req, res) => {
  const coruses = await fetchCourses();
  res.send({ courses: coruses });
});

app.get("/course/:name", async (req, res) => {
  try {
    const id = req.params.name;
    const data = await fetchParticularCourses(id);
    if (data) {
      res.send({ course: data });
    } else {
      res.send({ message: "course not found" });
    }
  } catch (e) {
    console.log(e);
  }
});
app.post("/addCourse", async (req, res) => {
  const { token, name, rating, category, level } = req.body;
  const result = await insertCourses(token, name, rating, category, level);
  if (result) {
    res.send({ message: "course is added successfully" });
  }
});

// filter?rating=store && category && level
app.get("/filter", async (req, res) => {
  const { rating, category } = req.query;
  let courses = null;
  const data = await fetchCourses();
  if (rating) {
    courses = data.filter((item) => {
      return item.rating == rating;
    });
  } else if (category) {
    courses = data.filter((item) => {
      return item.category == category;
    });
  }
  console.log(courses);

  res.send({ courses: courses });
});

app.post("/enrole/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const { token } = req.body;
    // console.log(token," ",name);exit
    const response = await enrolled(token, name);
    res.send({ details: response });
  } catch (e) {
    console.log(e);
  }
});

app.post("/viewcourses", async (req, res) => {
  try {
    const { token } = req.body;
    const response = await viewcourses(token);
    res.send({ courses_enrolled: response });
  } catch (e) {
    console.log(e);
  }
});

app.listen(3500, () => {
  console.log("the server is runnning in the post 3500");
});
