const express = require('express');
const router = express.Router();
const DataModels = require('../models');
const hashPassword = require('../helpers/hash-password');
const verifyPassword = require('../helpers/verify-password');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//USE postman for now to create users, questions and answers
// all routes begin with /api

/* LOGIN.  /api/login */
// SAMPLE DATA FOR POSTMAN
// {
// 	"email": "bob@bob.com",
// 	"password": "password"
// }
router.post('/login', function(req, res, next){
  const password = req.body.password;
  const email = req.body.email;
  DataModels.User.findOne({email: email})
    .then(function(result){
      if (result === null) {
        return res.json({success: false, error: 'Unable to verify user and password.'});
      } else {
        return verifyPassword(password, result.passwordHash)
          .then(function(result){
            if (result) {
              return res.json({success: true, message: 'user successfully logged in.'});
              //create json webtoken and log user in
            } else {
              return res.json({success: false, error: 'Unable to verify user and password.'});
            }
          })
          .catch(function(err){
            return res.status(400).json(err);
          });
      }
    })
    .catch(function(err){
      return res.status(400).json(err);
    });
});

router.post('/logout', function(req, res, next){
  // delete user jwt
});


/* CREATE USER.  /api/register */

// SAMPLE DATA FOR POSTMAN
// {"user": {
// 	"name": "bob",
// 	"email": "bob@bob.com",
// 	"password": "password",
// 	"age": 36,
// 	"honestyCredits": 99,
// 	}
// }
router.post('/register', function(req, res, next){
  const user = req.body.user;
  hashPassword(user.password)
    .then(function(result){
      user.passwordHash = result;
      return DataModels.User.create(user)
    })
    .then(function(result){
      return res.json(result);
    })
    .catch(function(err){
      return res.status(400).json(err);
    });
});

/* GET user's questions. /api/:userId/questions */
router.get('/:userId/questions', function(req, res, next) {
  DataModels.Question.findAll({user: req.params.userId})
    .populate('answer')
    .exec(function(result){
      return res.json(result);
    })
    .catch(function(err){
      return res.status(400).json(err);
    });
});


/* GET questions for people to answer. */
router.get('/:userId/unanswered', function(req, res, next) {
  const userId = req.params.userId; //placeholder, need to get user from cookie or jwt
  DataModels.User.findOne({_id: userId})
    .then(function(result){
      //get all questions with tags matching anything for that user
      // as well as gender, age and sex if specified
      return DataModels.Question.find({
        gender: { $in: [result.gender, 'any'] },
        minAge: { $lte: result.age},
        maxAge: { $gte: result.age},
        tags: { $in: result.tags}
      });
    })
    .then(function(result){
      return res.json(result);
    })
    .catch(function(err){
      return res.status(400).json(err);
    })
});


/* POST question. /api/:userId/question */
router.post('/:userId/question', function(req, res, next) {
  const question = new DataModels.Question(req.body.question);
  question.user = req.params.userId;

  DataModels.User.findOne({_id: req.params.userId})
    .then(function(user) {
      if (user.honestyCredits > 0) {
        user.honestyCredits--;
        return user.save()
          .then(function(result){
            return DataModels.Question.create(question)
          })
          .then(function(result){
            return res.json(result);
          })
          .catch(function(err){
            return res.status(400).json(err);
          });
      } else {
        return res.json({
          success: false,
          error: 'You must purchase more credits to get an answer to this question.'
        });
      }
    })
    .catch(function(err){
      return res.status(400).json(err);
    });
});



/* POST answer.  /api/answer  */
router.post('/answer', function(req, res, next) {
  const questionId = req.body.questionId;
  const answer = new DataModels.Answer({
    answer: req.body.answer,
    user: req.body.user //Placeholder: GET USER_ID FROM JWT OR COOKIE HERE'
  });

  DataModels.Answer.create(answer)
    .then(function(result){
      return DataModels.Question.update({_id: questionId},{ $set: { answer: result._id }})
    })
    .then(function(result){
      return res.json(result);
    })
    .catch(function(err){
      return res.status(400).json(err);
    });
});



module.exports = router;
