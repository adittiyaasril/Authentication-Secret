import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose, { Model, Schema } from "mongoose";
import { connect } from "http2";
import encrypt from "mongoose-encryption";

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
  const newUSer = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUSer.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.render("secrets");
    }
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
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, function (req, res) {
  console.log("Server started on port 3000.");
});
