var express = require('express');
var bodyParser = require("body-parser");
var SparkPost = require('sparkpost');
var router = express.Router();
var fs = require('fs');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.post('/', function (req, res, next) {
  console.log('Starting registration, getting user');

  try {
    var eventData = require('../public/javascripts/events.json');

    var congratsReturn = sendCongratsMail(req.body);
    var regSuccess = sendRegMail(req.body);

    var shortuser = { "uname": req.body.uname, "handicap": req.body.handicap };

    eventData.events.forEach(function (obj) {
      if (obj.name == req.body.event) {
        obj.attendees.push(shortuser);
      }
    });

    fs.writeFile('./public/javascripts/events.json', JSON.stringify(eventData, null, 4));
    if (congratsReturn == true && regSuccess == true) {
      res.send('success');
    }
    else {
      res.send(new Error('registration failed somewhere'));
    }
  }
  catch (err) {
    console.log(err);
    res.send(err);
  }
});


function sendCongratsMail(user) {


  var trans = {
    "content": {
      "from": 'chris@mastertonsmith.uk',
      "template_id": "regsuccess"
    },
    "substitution_data": {
      "event": user.course
    },
    "recipients": [
      {
        "address": {
          "email": user.email,
          "name": user.fname + " " + user.lname
        },
        "substitution_data": {
          "fname": user.fname,
          "lname": user.lname
        }
      }
    ]
  };

  var options = {
    num_rcpt_errors: 3

  };

  return mailSender(trans, options);
}

function sendRegMail(user) {
  var trans = {
    "content": {
      "from": 'chris@mastertonsmith.uk',
      "template_id": "newreg"
    },
    "substitution_data": {
      "event": user.course
    },
    "recipients": [
      {
        "address": {
          "email": "chris@cmsdes.co.uk",
          "name": "Chris Masterton-Smith"
        },
        "substitution_data": {
          "fname": user.fname,
          "lname": user.lname,
          "handicap": user.handicap,
          "uname": user.uname,
          "email": user.email,
          "option1": user.option1,
          "option2": user.option2
        }
      }
    ]
  };

  var options = {
    num_rcpt_errors: 3
  };

  return mailSender(trans, options);
}

function mailSender(trans, options) {
  console.log('Starting mailer function');

  var sp = new SparkPost('65fd47cd88f443198f7b09b863a244d476de6e3d');
  console.log('Sending mail');

  sp.transmissions.send(trans, options, function (err, res) {
    if (err) {
      console.log('Whoops! Something went wrong');
      console.log(err);
    } else {
      console.log('Woohoo! You sent a mail!');
    }
  }
  );

}


module.exports = router;
