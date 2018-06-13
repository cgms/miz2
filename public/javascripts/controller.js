var App = angular.module('App', ['angularSmoothscroll', 'ngAnimate', 'ngTouch'], function ($locationProvider) {
    $locationProvider.html5Mode(true);
});
var AWS = require('aws-sdk')

App.controller('EventControl', function ($scope, $sce, $http, $location) {

   // loadEvent();
    loadDynEvent();


    $scope.myInterval = 3000;
    'use strict';

    // initial image index
    $scope._Index = 0;

    // if a current image is the same as requested image
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };

    // show prev image
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
    };

    // show next image
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
    };

    // show a certain image
    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };

    $scope.submit = function () {

        if (checkDuplicate($("#uname").val(), $scope.users) == false) {

            var user = {
                "event": $("#event").html(),
                "fname": $("#fname").val(),
                "lname": $("#lname").val(),
                "uname": $("#uname").val(),
                "email": $("#email").val(),
                "cell": $("#cell").val(),
                "handicap": $("#handicap").val(),
                "option1": $("#option1").val(),
                "option2": $("#option2").val(),
                "course": $scope.course
            };

            $http.post("./register", user).then
                (data => {
                    console.log('register post success')
                    $http.post("./spreadsheet", user)
                        .then(data2 => {
                            console.log('spreadsheet post success')
                            $('#registration-msg .alert').html("Registration Successful");
                            $('#registration-msg .alert').removeClass("alert-danger");
                            $('#registration-msg .alert').addClass("alert-success");
                            $('#paybutton').show();
                            $('#registration-msg').show();
                            loadEvent();
                        })
                        .catch(err => {
                            $('#registration-msg .alert').html("Something went wrong");
                            $('#registration-msg .alert').removeClass("alert-success");
                            $('#registration-msg .alert').addClass("alert-danger");
                            $('#paybutton').hide();
                            $('#registration-msg').show();
                        });
                })
                .catch(err => {
                    $('#registration-msg .alert').html("Something went wrong");
                    $('#registration-msg .alert').removeClass("alert-success");
                    $('#registration-msg .alert').addClass("alert-danger");
                    $('#paybutton').hide();
                    $('#registration-msg').show();
                });
        }
        else {
            $('#registration-msg .alert').html("Username already registered");
            $('#registration-msg .alert').removeClass("alert-success");
            $('#registration-msg .alert').addClass("alert-danger");
            $('#paybutton').hide();
            $('#registration-msg').show();
        }

    function loadDynEvent() {
        AWS.config.loadFromPath('../../routes/config.json');

        ddb = AWS.DynamoDB({apiVersion: '2012-10-08'});

        var params = {
            TableName: 'events',
            Key: {
                'name': $location.path().substring(1),
            }
        };
        ddb.getItem(params, function(err, data) {
            if (err) {
                eventData = {
                    "name": "error",
                    "title": "No Event Selected",
                    "date": "",
                    "course": "",
                    "county": "",
                    "deposit": "",
                    "amount": "",
                    "description": "",
                }
                $scope.ev = eventData;

                $scope.bullets = eventData.bullets;
                $scope.costs = eventData.costs;
                $scope.users = eventData.attendees;
                $scope.schedules = eventData.schedule;
                $scope.option1 = eventData.option1;
                $scope.option2 = eventData.option2;
                $scope.photos = eventData.gallery;
                $scope.deposit = eventdata.amount;
            } else {

                $scope.ev = data.Items[0];
                $scope.bullets = data.Items[0].bullets;
                $scope.costs = data.Items[0].costs;
                $scope.schedules = data.Items[0].schedule;
                $scope.option1 = data.Items[0].option1;
                $scope.option2 = data.Items[0].option2;
                $scope.photos = data.Items[0].gallery;
                $scope.deposit = data.Items[0].deposit;
                $scope.amount = data.Items[0].amount;
                $scope.course = data.Items[0].course;
                $scope.mapURL = $sce.trustAsResourceUrl(data.Items[0].gmap);
                console.log("Error", err);
            }
        })
    } 
    


    function loadEvent() {
        $http.get('./javascripts/events.json')
            .then(function (res) {
                var data = res.data;

                var eventName = $location.path().substring(1);

                data.events.forEach(function (obj) {
                    if (obj.name == eventName) {
                        eventData = obj;
                    }
                });

                if (!!eventData) {

                    $scope.ev = eventData;
                    $scope.bullets = eventData.bullets;
                    $scope.costs = eventData.costs;
                    $scope.users = eventData.attendees;
                    $scope.schedules = eventData.schedule;
                    $scope.option1 = eventData.option1;
                    $scope.option2 = eventData.option2;
                    $scope.photos = eventData.gallery;
                    $scope.deposit = eventData.deposit;
                    $scope.amount = eventData.amount;
                    $scope.course = eventData.course;
                    $scope.mapURL = $sce.trustAsResourceUrl(eventData.gmap);
                }
                else {
                    eventData = {
                        "name": "error",
                        "title": "No Event Selected",
                        "date": "",
                        "course": "",
                        "county": "",
                        "deposit": "",
                        "amount": "",
                        "description": "",
                    }
                    $scope.ev = eventData;

                    $scope.bullets = eventData.bullets;
                    $scope.costs = eventData.costs;
                    $scope.users = eventData.attendees;
                    $scope.schedules = eventData.schedule;
                    $scope.option1 = eventData.option1;
                    $scope.option2 = eventData.option2;
                    $scope.photos = eventData.gallery;
                    $scope.deposit = eventdata.amount;
                    $scope.mapURL = $sce.trustAsResourceUrl(eventData.gmap);
                }

            });
    }
};


App.controller('IndexControl', function ($scope, $http) {

    $http.get('./javascripts/events.json')
        .then(function (res) {
            $scope.events = res.data.events;
        });

});

App.directive('backgroundImageDirective', ['$location', function (location) {
    return function (scope, element, attrs) {
        var eventName = location.path().substring(1);
        element.css({
            'background-image': 'url(images/backgrounds/' + eventName + '_banner.jpg)',
            'background-repeat': 'no-repeat',
            'background-align': 'center',
            'background-size': 'cover'
        });
    };
}]);

function checkDuplicate(uname, allusers) {
    try {
        var duplicate = false;
        for (var i = 0; i < allusers.length; i++) {
            if (allusers[i].uname == uname) {
                duplicate = true;
                return duplicate;
            }
        }
        return duplicate;
    }
    catch (err) {
        console.log('error duplicate checking: ' + err)
    }
    //Do something

}
})