const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./auth-model");
const secret = process.env.JWT_SECRET || "secret secret, i got a secret";

// /api/auth

// user registration
router.post("/register", validateUser, async (req, res, next) => {
  let { email, password, firstName, lastName, role } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  let userObj = {
    email: email,
    password: hash,
    first_name: firstName,
    last_name: lastName,
    role: role
  };

  try {
    let saved = await Users.addUser(userObj);

    let roleInfo, userRole;
    if (saved.role === "volunteer") {
      roleInfo = {
        user_id: saved.id,
        availability: req.body.availability,
        country: req.body.country
      };
      userRole = await Users.addUserByType(roleInfo, saved.role);
    } else {
      roleInfo = { user_id: saved.id };
      userRole = await Users.addUserByType(roleInfo, saved.role);
    }
    const token = genToken(saved);
    res
      .status(201)
      .json({ createdUser: saved, userRole: userRole, token: token });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// user login
router.post("/login", async (req, res) => {
  if (!req.body || !req.body.password || !req.body.email || !req.body.role) {
    res
      .status(400)
      .json("A valid email, password, and role type are required.");
  } else {
    let { username, password } = req.body;

    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = genToken(user);
          res.status(200).json({ username: user.username, token: token });
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
});

function validateUser(req, res, next) {
  if (!req.body) {
    return next("missing user data");
  } else {
    let {
      email,
      password,
      firstName,
      lastName,
      role,
      availability,
      country
    } = req.body;
    if (!email || !email.length > 5) {
      next("A valid email address is required");
    } else if (!password || !password.length > 4) {
      next("A valid password with at least 5 characters is required");
    } else if (!firstName || !lastName) {
      next("First and Last name are required");
    } else if (role !== "admin" && role !== "volunteer" && role !== "student") {
      next("A role type of either admin, volunteer, or student is required");
    } else if (role === "volunteer" && !availability && !country) {
      next("Volunteers must provide their time availability and country");
    }
    // if the user is valid proceed
    next();
  }
}

function genToken(user) {
  const payload = {
    userid: user.id,
    username: user.email,
    role: user.role
  };
  const options = { expiresIn: "14d" };
  const token = jwt.sign(payload, secret, options);

  return token;
}

module.exports = router;
