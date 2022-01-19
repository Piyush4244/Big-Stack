const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Person Model
const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

// @type    GET
//@route    /api/profile/
// @desc    route for personnal user profile
// @access  PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          return res.status(404).json({ profilenotfound: "No profile Found" });
        }
        res.json(profile);
      })
      .catch((err) => console.log("got some error in profile " + err));
  }
);

// @type    POST
//@route    /api/profile/
// @desc    route for updating/saving personnal user profile
// @access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.username) profileValues.username = req.body.username;
    if (req.body.website) profileValues.website = req.body.website;
    if (req.body.country) profileValues.country = req.body.country;
    if (req.body.portfolio) profileValues.portfolio = req.body.portfolio;
    if (typeof req.body.languages !== undefined) {
      profileValues.languages = req.body.languages.split(",");
    }
    //set social
    profileValues.social = {};
    if (req.body.youtube) profileValues.social.youtube = req.body.youtube;
    if (req.body.facebook) profileValues.social.facebook = req.body.facebook;
    if (req.body.instagram) profileValues.social.instagram = req.body.instagram;

    //do database stuff
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then((profile) => res.json(profile))
            .catch((err) => console.log("problem in updating profile " + err));
        } else {
          Profile.findOne({ username: profileValues.username })
            .then((profile) => {
              //username already exist
              if (profile) {
                res.status(400).json({
                  username: `${profileValues.username} already exist`,
                });
              }
              new Profile(profileValues)
                .save()
                .then((profile) => res.json(profile))
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log("problem in fetching profile " + err));
  }
);

// @type    POST
//@route    /api/profile/:username
// @desc    route for getting profile based on username
// @access  PUBLIC
router.get("/:username", (req, res) => {
  Profile.findOne({ username: req.params.username })
    .populate("user", ["name", "profilepic"])
    .then((profile) => {
      if (!profile) {
        res.status(404).json({ usernotfound: "usernotfound" });
      } else {
        res.json(profile);
      }
    })
    .catch((err) => console.log(err));
});

// @type    POST
//@route    /api/profile/find/everyone
// @desc    route for getting everyone profile
// @access  PUBLIC
router.get("/find/everyone", (req, res) => {
  Profile.find()
    .populate("user", ["name", "profilepic"])
    .then((profiles) => {
      if (!profiles) {
        res.status(404).json({ usernotfound: "not a single user present" });
      } else {
        res.json(profiles);
      }
    })
    .catch((err) => console.log(err));
});

// @type    DELETE
//@route    /api/profile/
// @desc    route for deleting profile
// @access  PRIVATE
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Person.findOneAndRemove({ _id: req.user.id })
      .then(() => {
        Profile.findOneAndRemove({ user: req.user.id })
          .then(() => res.json({ success: "delete was success" }))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

// @type    POST
//@route    /api/profile/workrole
// @desc    route for adding workroles to profile
// @access  PRIVATE
router.post(
  "/workrole",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const newwork = {
          role: req.body.role,
          company: req.body.company,
          country: req.body.country,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          details: req.body.details,
        };
        profile.workrole.unshift(newwork);
        profile
          .save()
          .then((profile) => res.json(profile))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

// @type    DELETE
//@route    /api/profile/workrole/:w_id
// @desc    route for deleting workrole whoose id is given
// @access  PRIVATE
router.delete(
  "/workrole/:w_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        const removeThis = profile.workrole.findIndex(
          (workrole) => workrole._id === req.params.w_id
        );
        profile.workrole.splice(removeThis, 1);
        profile
          .save()
          .then((profile) => res.json(profile))
          .catch((err => console.log(err)));
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;
