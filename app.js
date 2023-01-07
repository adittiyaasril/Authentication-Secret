import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose, { Model, Schema } from "mongoose";
import { connect } from "http2";
import bcrypt from "bcrypt";

const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", true);

main().catch((err) => console.log(err));

// connect
async function main() {
  await mongoose.connect("mongodb://0.0.0.0:27017/userDB");
}

// Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Model
const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUSer = new User({
      email: req.body.username,
      password: hash,
    });

    newUSer.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      res.send(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result === true) {
            res.render("secrets");
          }
        });
      }
    }
  });
});

app.listen(3000, function (req, res) {
  console.log("Server started on port 3000.");
});
