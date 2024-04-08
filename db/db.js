// const { Client, Pool } = require("pg");
// require("dotenv").config();
const jwt = require("jsonwebtoken");
const postgres = require("postgres");
require("dotenv").config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

async function checkUserTables() {
  try {
    const q =
      await sql`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY,name TEXT,email TEXT,password TEXT,role TEXT,enrolled TEXT[] DEFAULT '{}')`;
    // const result =
    // await client.query(q);

    console.log("created the table or existed");
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function checkCourseTables() {
  try {
    const query = await sql`
    CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name TEXT,
        author TEXT,
        dateofcreation DATE DEFAULT CURRENT_DATE,
        rating INTEGER DEFAULT 3,
        category TEXT,
        level TEXT CHECK(level IN ('beginner', 'intermediate', 'advanced')),
        enrolled TEXT[] DEFAULT '{}'
    )
`;

    console.log("Tables created successfully.");
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function createUser(name, email, password, role) {
  try {
    if (await checkUserTables) {
      const q =
        await sql`INSERT INTO users(name,email,password,role) VALUES (${name},${email},${password},${role})`;
      // await client.query(q, [name, email, password, role]);
      console.log(q);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
}

async function insertCourses(token, name, rating, category, level) {
  const decode = jwt.verify(token, process.env.SECRET);
  const user = decode.token;
  console.log(decode);
  if (user.role === "superadmin") {
    try {
      if (await checkCourseTables) {
        const q =
          await sql`INSERT INTO courses (name,author,rating,category,level,enrolled) VALUES(${name},${
            user.name
          },${rating}, ${category}, ${level}, ${[]})`;
        // await client.query(q, [name, user.name, rating, category, level, []]);
        console.log(q);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  } else {
    console.log("admin cant add course");
    return false;
  }
}
async function fetchCourses() {
  const q = await sql`SELECT * FROM courses`;
  // const data = await client.query(q);
  // console.log(q);
  if (q) {
    return q;
  } else {
    return null;
  }
}

async function fetchParticularCourses(name) {
  // console.log(id," dmfjkfdnshjfbj");
  const data = await sql`SELECT * FROM courses WHERE name=${name}`;

  // const { rows } = await client.query(q, [name]);
  console.log(data);
  if (data) {
    return data;
  } else {
    return null;
  }
}

function checkcourses(data, name) {
  return data.includes(name);
}

async function enrolled(token, name) {
  try {
    console.log(token, " ", name);
    const d = await adduserenrolled(token, name);
    return d;
  } catch (e) {
    console.log(e);
    return "invalid token";
  }
}

async function Login(email, password) {
  try {
    const res =
      await sql`SELECT * FROM users WHERE email=${email} AND password=${password}`;
    if (res.length > 0) {
      return res[0];
    } else {
      return "data not found";
    }
  } catch (e) {
    console.log(e);
  }
}
async function viewcourses(token) {
  try {
    const decode = jwt.verify(token, process.env.SECRET);
    const user = decode.token;
    const res =
      await sql`SELECT enrolled FROM users WHERE email=${user.email} AND password=${user.password}`;
    return res[0].enrolled || [];
  } catch (e) {
    console.log(e);
  }
}

async function adduserenrolled(token, name) {
  const decode = jwt.verify(token, process.env.SECRET);
  const user = decode.token;
  const rows =
    await sql`SELECT enrolled FROM users WHERE email = ${user.email} AND password=${user.password}`;
  const current = rows[0].enrolled || [];
  if (checkcourses(current, name)) {
    return "user already enrolled to the course";
  } else {
    const updated = [...current, name];
    const upq =
      await sql`UPDATE users SET enrolled= ${updated} WHERE email=${user.email}`;
    console.log(upq);
    await addcourseenrolled(name, user.name);
    return "user enrolled to course";
  }
}

async function addcourseenrolled(name, username) {
  const data = await sql`SELECT enrolled FROM courses WHERE name=${name}`;
  if (data) {
    let current = data[0].enrolled || [];
    const updated = [...current, username];
    const upd =
      await sql`UPDATE courses SET enrolled=${updated} WHERE name=${name}`;
    console.log(upd);
    console.log("user added to teh course data");
  }
}

module.exports = {
  sql,
  createUser,
  insertCourses,
  fetchCourses,
  fetchParticularCourses,
  enrolled,
  getPgVersion,
  checkCourseTables,
  checkUserTables,
  Login,
  viewcourses
};
