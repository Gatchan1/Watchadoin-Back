const router = require("express").Router();
const isAuthenticated = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const List = require("../models/List.model")
const fileUploader = require("../config/cloudinary.config")


//ROUTE TO GET ALL USERS FOR FINDFRIENDS
//http://localhost:5005/users/all
router.get("/all", (req, res, next) => {
  //isAuthenticated changeLater
  User.find()
    .then((users) => {
      // console.log('USERSSS: ', users)
      res.json(users)
    })
    .catch((err) => next(err));
});

//RETRIEVE A USER DATA: POPULATED ROUTE
//http://localhost:5005/users/:username
router.get("/:username", (req, res, next) => {
  //removed isAuthenticated because needs to be accessible from other users as well changeLater
  let { username } = req.params;
  User.findOne({ username: username })
    .populate("eventsCreated eventsJoined eventsPending friendsPending inviteLists friendsConfirmed notifications" )
    .populate({
      path:"inviteLists",
      populate: {
        path: "users"
      }
    })
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});


//RETRIEVE A USER DATA: THIS ONE IS NOT POPULATED
//http://localhost:5005/users/:username/raw
// We need one unpopulated GET by username for when retrieving info of user profiles. 
router.get("/:username/raw", (req, res, next) => {
  //removed isAuthenticated changeLater
  let { username } = req.params;
  User.findOne({ username: username })
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => next(err));
});

//FIND A USER (for sign up)
//http://localhost:5005/users/:username/find
router.get("/:username/find", (req, res, next) => {
  let { username } = req.params;
  User.find({ username })
    .then((resp) => {
      if (resp.length != 0){
        res.json(resp);
        return;
      }
      else res.json("username available");
    })
    .catch((err) => next(err));
});

// UPDATE PICTURE

//Used this tutorial: https://medium.com/geekculture/how-to-upload-images-to-cloudinary-with-a-react-app-f0dcc357999c
//http://localhost:5005/users/:userId/edit
router.post("/:userId/edit", (req, res, next)=>{
  const {userId} = req.params
  const {imageUrl} = req.body

  User.findOneAndUpdate({_id: userId}, {picture: imageUrl}, {
    new: true,
  })
  .then((resp) => {
    res.json(resp);
  })
  .catch((err) => next(err));
})


module.exports = router;
