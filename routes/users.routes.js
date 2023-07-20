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

// UPDATE PICTURE

/* // 1- Upload Picture
//http://localhost:5005/users/upload
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  //isAuthenticated changeLater
  if (!req.file) {
    next((err) => next(err));
    return;
  }
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend  
  res.json({ fileUrl: req.file.path });
}); */


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
