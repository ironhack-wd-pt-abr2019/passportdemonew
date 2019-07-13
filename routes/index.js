const express = require('express');
const router = express.Router();


const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

const checkRoles = (role) => {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      if (req.isAuthenticated && req.user.role === "ADMIN") {
        return next()
      }
      res.redirect('/login')
    }
  }
}

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/private-page", checkRoles("ADMIN"), (req, res, next) => {
  res.render("private-page", {
    user: req.user
  });
});

router.get("/GUEST", checkRoles("GUEST"), (req, res, next) => {
  res.render("guestPage", {
    user: req.user
  });
});



router.post('/rooms', ensureAuthenticated, (req, res, next) => {
  const newRoom = new Room({
    name: req.body.name,
    desc: req.body.desc,
    owner: req.user._id // <-- we add the user ID
  });

  newRoom.save((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect('/rooms');
    }
  })
});

router.get('/rooms', ensureAuthenticated, (req, res, next) => {

  Room.find({
    owner: req.user._id
  }, (err, myRooms) => {
    if (err) {
      return next(err);
    }

    res.render('rooms/index', {
      rooms: myRooms
    });
  });

});

module.exports = router;