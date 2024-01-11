const router = require("express").Router();
const User = require("../models/User.model");
const List = require("../models/List.model");
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
    .then(() => {
      // Find your invite lists so that we can remove the other user out of them.
      return User.findById(currentUserId).populate("inviteLists");
    })
    .then((resp) => {
      const affectedInviteLists = resp.inviteLists.filter((inviteList) => inviteList.users.includes(friendId));
      const queries = affectedInviteLists.map((list) => List.findByIdAndUpdate(list._id, { $pull: { users: friendId } }));
      return Promise.all(queries);
    })
    .then(() => {
      // Find THEIR invite lists so that we can remove your own user out of them.
      return User.findById(friendId).populate("inviteLists");
    })
    .then((resp) => {
      const affectedInviteLists = resp.inviteLists.filter((inviteList) => inviteList.users.includes(currentUserId));
      const queries = affectedInviteLists.map((list) => List.findByIdAndUpdate(list._id, { $pull: { users: currentUserId } }));
      return Promise.all(queries);
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
