var express = require('express');
var bodyParser = require("body-parser");
var router = express.Router();
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/', function (req, res, next) {
    // spreadsheet key is the long id in the sheets URL 
    try {
        var doc = new GoogleSpreadsheet('1Lh6GbEBaq9dXXtJLm7hET6q_NIHc0Plk-Hoi5qKYEjI');
        var sheet;

        async.series([
            function setAuth(step) {
                // see notes below for authentication instructions! 
                var creds = require('./goog.json');
                // OR, if you cannot save the file locally (like on heroku) 

                doc.useServiceAccountAuth(creds, step);
            },
            function workingWithRows(step) {
                // google provides some query options 
                doc.addRow(1, req.body, function (err, res2) {
                    if (err) {
                        console.log('Whoops! Something went wrong');
                        console.log(err);
                        res.send ('failure')
                    } else {
                        console.log('Woohoo! You added to the spreadie');
                        res.send('success');
                    }
                });
            },

        ]);
    }
    catch (err) {
        console.log('Whoops! Something went wrong');
        console.log(err);
        res.send ('failure')
    }
});


module.exports = router;