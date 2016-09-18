var express = require('express');
var bodyParser = require("body-parser");
var SparkPost = require('sparkpost');
var router = express.Router();
var fs= require('fs');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.post('/',  function(req, res, next) { 
      console.log('Starting mailer, getting users');
      
      try{
        var eventData = require('../public/javascripts/events.json');

      sendMail(req.body);

      var shortuser = {"uname": req.body.uname, "handicap":req.body.handicap};

      console.log('shortuser  ' + shortuser);
        eventData.events.forEach(function(obj){
          if(obj.name == req.body.event){
            console.log('We amde it');
            obj.attendees.push(shortuser);
          }
        });

        fs.writeFile('./public/javascripts/events.json', JSON.stringify(eventData, null, 4));

        res.send('Success') ;
      }
      catch(err){
        console.log(err);
        res.send('Failure') ;
      }


  });

function sendMail(user){
      console.log('Starting mailer');

      var sp = new SparkPost('65fd47cd88f443198f7b09b863a244d476de6e3d');

      var fname = user.fname;
      var lname = user.lname;
      var uname = user.uname;
      var email = user.email;
      var cell = user.cell;
      var handicap = user.handicap;
      var option1 = user.option1;
      var option2 = user.option2;

      var table = "<table><thead><th>Field</th><th>Data</th></thead><tr><td>First</td><td>"+fname+"</td></tr><tr><td>Last</td><td>"+lname+"</td></tr><tr><td>username</td><td>"+uname+"</td></tr><tr><td>Email</td><td>"+email+"</td></tr><tr><td>Phone</td><td>"+cell+"</td></tr><tr><td>Handicap</td><td>"+handicap+"</td></tr><tr><td>Option 1</td><td>"+option1+"</td></tr><tr><td>Option 2</td><td>"+option2+"</td></tr></table>";

      sp.transmissions.send({
      transmissionBody: {
          content: {
            from: 'chris@mastertonsmith.uk',
            subject: user.event + ' registration from ' + uname,
            html:"<html><body>"+table+"</body></html>"
          },
          recipients: [
            {address: 'chris@cmsdes.co.uk'}
          ]
        }
      }, function(err, res) {
        if (err) {
          console.log('Whoops! Something went wrong');
          console.log(err);
        } else {
          console.log('Woohoo! You sent a mail!');
        }
      });
}
module.exports = router;
