const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Users = require("./auth-model");
const secret = process.env.JWT_SECRET || "secret secret, i got a secret";

// /api/auth

// user registration
// router.post("/register", validateUser, async (req, res, next) => {
//   let { email, password, firstName, lastName, role } = req.body;
//   const hash = bcrypt.hashSync(password, 8);
//   let userObj = {
//     email: email,
//     password: hash,
//     first_name: firstName,
//     last_name: lastName,
//     role: role
//   };

//   try {
//     // add new user to the db
//     let newUser = await Users.addUser(userObj);
//     console.log(newUser);
//     // create variables to save new user info for response
//     // let roleInfo = {};
//     let userRole = {};
//     let newUserId = newUser.id;
//     // check new users role - add additional info for volunteers
//     switch (newUser.role) {
//       case "volunteer":
//         roleInfo = {
//           user_id: newUserId,
//           availability: req.body.availability,
//           country: req.body.country
//         };
//         userRole = await Users.addVolunteer(roleInfo);
//         break;
//       case "admin":
//         // add user_id to respective role table for foreign key requirement
//         roleInfo = { user_id: newUserId };
//         userRole = await Users.addAdmin(roleInfo);
//         break;
//       case "student":
//         roleInfo = { user_id: newUserId };
//         userRole = await Users.addStudent(roleInfo);
//         break;
//       default:
//         next("auth router did not find a valid user type");
//     }
//     console.log("auth router userRole", userRole);
//     const token = genToken(newUser);
//     res.status(201).json({ createdUser: newUser, token: token });
//   } catch (error) {
//     res.status(501).json(error);
//   }
// });

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

  // add new user to the db
  Users.addUser(userObj)
    .then(newUser => {
      console.log(newUser);
      // create variables to save new user info for response
      // let roleInfo = {};
      let userRole = {};
      let newUserId = newUser.id;
      // check new users role - add additional info for volunteers
      // switch (newUser.role) {
      //   case "volunteer":
      //     roleInfo = {
      //       user_id: newUserId,
      //       availability: req.body.availability,
      //       country: req.body.country
      //     };
      //     // userRole = await Users.addVolunteer(roleInfo);
      //     break;
      //   case "admin":
      //     // add user_id to respective role table for foreign key requirement
      //     roleInfo = { user_id: newUserId };
      //     Users.addAdmin(roleInfo).then(role => {
      //       const token = genToken(newUser);
      //       res
      //         .status(201)
      //         .json({ createdUser: newUser, userRole: role, token: token });
      //     });
      //     break;
      //   case "student":
      //     roleInfo = { user_id: newUserId };
      //     // userRole = await Users.addStudent(roleInfo);
      //     break;
      //   default:
      //     next("auth router did not find a valid user type");
      // }
      console.log("auth router userRole", userRole);
      const token = genToken(newUser);
      // res.status(201).json({ createdUser: newUser, token: token });
      res.status(200).send("hi");
    })
    .catch(error => {
      res.status(501).json(error.message);
    });
});

// user login
router.post("/login", async (req, res, next) => {
  if (!req.body || !req.body.password || !req.body.email) {
    next("A valid email and password are required.");
  } else {
    let { email, password } = req.body;

    try {
      const user = await Users.findBy({ email });

      if (user && bcrypt.compareSync(password, user.password)) {
        const roleInfo = await Users.findTypeById(user.id, user.role);
        console.log("auth-routher.js login roleInfo:", roleInfo);
        const token = genToken(user);
        res.status(200).json({ user: user, roleId: roleInfo, token: token });
      } else {
        res.status(401).json({ message: "Invalid Login Credentials" });
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
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
