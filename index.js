const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require("bcrypt")

const SALT_COUNT = 5

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password

app.post("/register", async (req, res) => {
  try {
    username = req.body.username
  password = req.body.password

  console.log(username, password)

  const hashed = await bcrypt.hash(password, SALT_COUNT)
  
  const user = await User.create({username, password:hashed})

  res.send(`successfully created user ${username}`).status(200)
  } catch (error) {
    res.send({message: "Something went wrong"}, error)
  }
  
})



// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB

app.post("/login", async (req, res) => {
  try {
    const {username, password} = req.body
    const possibleUser = await User.findOne({where: {username}})
    const hashedPassword = possibleUser.password
    const isMatching = await bcrypt.compare(password, hashedPassword)

    if (possibleUser && isMatching) {
      res.send(`successfully logged in user ${username}`).status(200)
    } else {
      res.send("incorrect username or password").status(401)
    }
  } catch (error) {
    res.send({message: "Something went wrong"}, error).status(400)
  }
})
// we export the app, not listening in here, so that we can run tests
module.exports = app;
