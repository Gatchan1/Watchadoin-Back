const router = require("express").Router();
const isAuthenticated = require("../middleware/jwt.middleware");
const List = require("../models/List.model");
const User = require("../models/User.model");

//http://localhost:5005/lists/create
router.post("/create", isAuthenticated, (req, res, next) => {
  //isAuthenticated changeLater
  console.log("#############", req.payload);
  let { title, users } = req.body;
  let currentUserId = req.payload.userId;
  List.create({ title, users })
    .then((list) => {
      return User.findByIdAndUpdate(
       currentUserId,
        { $push: { inviteLists: list._id } }
      );
    })
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});

// //http://localhost:5005/lists/:listId/update
// router.post("/:listId/update", (req, res, next) => {
//   let { listId } = req.params;
//   let { title } = req.body;
//   let newTitle = {
//     title,
//   };

//   List.findByIdAndUpdate(listId, newTitle)
//     .then((list) => {
//       res.json(list);
//     })
//     .catch((err) => next(err));
// });

// //http://localhost:5005/lists/:listId/remove
// router.post("/:listId/remove", (req, res, next) => {
//   let { listId } = req.params;

//   List.findByIdAndDelete(listId)
//     .then((list) => {
//       res.json(list);
//     })
//     .catch((err) => next(err));
// });

// //http://localhost:5005/lists/:listId/addFriend
// router.post("/:listId/addFriend", (req, res, next) => {
//   let { listId } = req.params;
//   let { friendId } = req.body;

//   List.findByIdAndUpdate(listId, { $push: { users: friendId } })
//     .then((list) => {
//       res.json(list);
//     })
//     .catch((err) => next(err));
// });

// //http://localhost:5005/lists/:listId/removeFriend
// router.post("/:listId/removeFriend", (req, res, next) => {
//   let { listId } = req.params;
//   let { friendId } = req.body;

//   List.findByIdAndUpdate(listId, { $pull: { users: { $in: [friendId] } } })
//     .then((list) => {
//       res.json(list);
//     })
//     .catch((err) => next(err));
// });

module.exports = router;
