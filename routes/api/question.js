const express = require("express");
const passport = require("passport");
const router = express.Router();

//Load Person Model
const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

//Load Question Model
const Question = require("../../models/Question");

// @type    GET
//@route    /api/question/
// @desc    route for getting all question
// @access  PUBLIC
router.get("/", (req, res) => {
  Question.find()
    .sort({ date: "desc" })
    .then((question) => res.json(question))
    .catch((err) => console.log(err));
});

// @type    POST
//@route    /api/question/
// @desc    route for posting questions
// @access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newquestion = Question({
      textone: req.body.textone,
      texttwo: req.body.texttwo,
      user: req.user.id,
      name: req.body.name,
    });
    newquestion
      .save()
      .then((question) => res.json(question))
      .catch((err) => console.log(err));
  }
);

// @type    POST
//@route    /api/question/:ques_id
// @desc    route for answering questions
// @access  PRIVATE
router.post(
  "/:ques_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findOne({ _id: req.params.ques_id })
      .then((question) => {
        const newAnswer = {
          user: req.user.id,
          name: req.body.name,
          text: req.body.text,
        };
        question.answers.push(newAnswer);
        question
          .save()
          .then((question) => res.json(question))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

// @type    POST
//@route    /api/question/upvote/:ques_id
// @desc    route for upvoting questions
// @access  PRIVATE
router.post(
  "/upvote/:ques_id",
  passport.authenticate("jwt", { session: false }), (req, res) => {
    Question.findById(req.params.ques_id)
      .then((question) => {
        if (question.upvotes.filter(upvote=>upvote.user.toString()===req.user.id.toString()).length>0) {
          res.json({ message: "already upvoted" });
        } else {
          question.upvotes.push({ user: req.user.id });
          question
            .save()
            .then((question) => res.json(question))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;
