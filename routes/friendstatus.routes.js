const router = require("express").Router();
const User = require("../models/User.model");
const isAuthenticated = require("../middleware/jwt.middleware");

//http://localhost:5005/friendstatus/:friendId/accept
router.post("/:friendId/accept", isAuthenticated, (req, res, next) => {
  let currentUserId = req.payload.userId;
  let { friendId } = req.params;

  User.findByIdAndUpdate(currentUserId, {
    //if(!User.friendsConfirmed.includes(friendId))
    // else console.log("Friendrequest already accepted")
    $push: { friendsConfirmed: friendId },
    $pull: { friendsPending: friendId },
  })
    .then(() => {
      return User.findByIdAndUpdate(friendId, {
        $push: { friendsConfirmed: currentUserId },
      });
    })
    .then((resp) => {
      res.json("friendship successfully accepted");
    })
    .catch((err) => next(err));
});

//http://localhost:5005/friendstatus/:friendId/revoke
router.post("/:friendId/revoke", isAuthenticated, (req, res, next) => {
  let currentUserId = req.payload.userId;
  let { friendId } = req.params;
  User.findByIdAndUpdate(currentUserId, {
    $pull: { friendsConfirmed: friendId },
  })
    .then(() => {
      return User.findByIdAndUpdate(friendId, {
        $pull: { friendsConfirmed: currentUserId },
      });
    })
    .then((resp) => {
      res.json("friendship successfully revoked");
    })
    .catch((err) => next(err));
});

//http://localhost:5005/friendstatus/:friendId/sendrequest
router.post("/:friendId/sendrequest", isAuthenticated, (req, res, next) => {
  //isAuthenticated changeLater, change userId to the actual parameters
  let currentUserId = req.payload.userId;
  let { friendId } = req.params;
  User.findById(friendId).then((user) => {
    if (!user.friendsPending.includes(currentUserId)) {
      User.findByIdAndUpdate(friendId, {
        $push: { friendsPending: currentUserId },
      })
        .then((resp) => {
          res.json(resp);
        })
        .catch((err) => next(err));
    } else if (user.friendsPending.includes(currentUserId)) {
      res.json("friendship already requested");
      return;
    }
  });
});

//http://localhost:5005/friendstatus/:friendId/reject
router.post("/:friendId/reject", isAuthenticated, (req, res, next) => {
  let currentUserId = req.payload.userId;
  let { friendId } = req.params;
  User.findByIdAndUpdate(currentUserId, {
    $pull: { friendsPending: friendId },
  })
    .then((resp) => {
      res.json("friendship successfully rejected");
    })
    .catch((err) => next(err));
});

module.exports = router;
