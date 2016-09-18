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
        var users = require('../public/javascripts/users.json');
        console.log(users);
      }
      catch(err){
        console.log('require failed ' + err);
      }

  

      console.log('Starting mailer');
      console.log(req.body);
      var sp = new SparkPost('65fd47cd88f443198f7b09b863a244d476de6e3d');

      var fname = req.body.fname;
      var lname = req.body.lname;

      sp.transmissions.send({
      transmissionBody: {
          content: {
            from: 'chris@mastertonsmith.uk',
            subject: 'Hello, World!',
            html:"<html><body>"+fname + " " +lname+ " sent this</body></html>"
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
          console.log('Woohoo! You just sent your first mailing!');
        }
      });

    users.push(req.body); 
    console.log(users);   
    try{
      fs.writeFile('./public/javascripts/users.json', JSON.stringify(users, null, 4));
    }
    catch(err){
      console.log(err);
    }


  });


module.exports = router;
