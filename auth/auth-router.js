const router = require("express").Router();

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./auth-model");

router.post("/register", (req, res) => {
  const credentials = req.body;

  if (credentials) {
    const rounds = process.env.BCRYPT_ROUNDS || 10;

    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    Users.add(credentials)
      .then((user) => {
        const token = makeJwt(user);
        res.status(201).json({ data: user, token });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password",
    });
  }
});

router.post("/login", (req, res) => {
  const {username, password} = req.body
  if(req.body){
    Users.findBy({ username: username})
      .then(([user]) => {
        if( user && bcryptjs.compareSync(password, user.password)){
          const token = makeJwt(user);
          res.status(200).json({ message: "welcome in!", token})
        } else {
          res.status(401).json({ message: "invalid credentials"})
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message})
    });
  } else {
    res.status(400).json({
        message: "please provide username and password",
    })
}

});

//build out Jwt function


function makeJwt(user) {
  const payload = {
      subject: user.id,
      username: user.username,
      role: user.role,
  };

  const secret = process.env.JWT_SECRET || "THIS IS THE SECRET";

  const options = {
      expiresIn: "2m",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
