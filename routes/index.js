const express = require('express');
const router = express.Router();
const DataModels = require('../models');
const hashPassword = require('../helpers/hash-password');
const verifyPassword = require('../helpers/verify-password');

//USE postman for now to create users, questions and answers
// all routes begin with /api

/* LOGIN.  /api/login */
// SAMPLE DATA FOR POSTMAN
// {
// 	"email": "fred@fred.com",
// 	"password": "password"
// }
router.post('/login', function(req, res, next){
  const password = req.body.password;
  const email = req.body.email;
  DataModels.User.findOne({email: email})
    .then(function(result){
      console.log('result', result);
      return verifyPassword(password, result.passwordHash)
        .then(function(result){
          if (result) {
            console.log('user successfully loged in', result);
            return res.json({message: 'user successfully logged in.'});
            //create json webtoken and log user in
          } else {
            return res.json({error: 'Unable to verify user and password.'});
          }
        })
        .catch(function(err){
          return res.json(err);
        })
    })
});


/* CREATE USER.  /api/register */

// SAMPLE DATA FOR POSTMAN
// {"user": {
// 	"name": "bob",
// 	"email": "bob@bob.com",
// 	"password": "password",
// 	"age": 36,
// 	"honestyCredits": 0,
// 	"honestyFreebies": 0
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
      console.log('result', result);
      return res.json(result);
    })
    .catch(function(err){
      return res.json(err);
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
      return res.json(err);
    });
});


/* GET questions for people to answer. */
router.get('/questions', function(req, res, next) {
  //get all questions with tags matching anything for that user
  // as well as gender, age and sex if specified
});


/* POST question. /api/:userId/question */
router.post('/:userId/question', function(req, res, next) {
  const question = req.body.question;
  question.user = req.params.userId;
  DataModels.Question.create(question)
    .then(function(result){
      return res.json(result);
    })
    .catch(function(err){
      return res.json(err);
    });
});



/* POST answer.  /api/answer  */
router.post('/answer', function(req, res, next) {
  const questionId = req.body.answer.questionId;
  DataModels.Answer.create(answer)
    .then(function(result){
      DataModels.Question.update({question: questionId},{ $set: { answer: result._id }})
    })
    .then(function(result){
      return res.json(result);
    })
    .catch(function(err){
      return res.json(err);
    });
});



module.exports = router;
