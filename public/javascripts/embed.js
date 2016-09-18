$(window).scroll(function(){
  handleTopNavAnimation();
});

$(window).load(function(){
  handleTopNavAnimation();
});

function handleTopNavAnimation() {
  var top=$(window).scrollTop();

  if(top>10){
    $('#site-nav').addClass('navbar-solid'); 
  }
  else{
    $('#site-nav').removeClass('navbar-solid'); 
  }
}

$(function() {

  $('#registration-form').submit(function (e) { 

      e.preventDefault();

      var user = {
        "event":$("#event").html(),
        "fname":$("#fname").val(),
        "lname":$("#lname").val(),
        "uname":$("#uname").val(),
        "email":$("#email").val(),
        "cell":$("#cell").val(),
        "handicap":$("#handicap").val(),
        "option1":$("#option1").val(),
        "option2":$("#option2").val(),
      };

      $.post("./register",user, function(data){
        if(data==='Success')
          {
                $('#registration-msg .alert').html("Registration Successful");
                $('#registration-msg .alert').removeClass("alert-danger");
                $('#registration-msg .alert').addClass("alert-success");
                $('#registration-msg').show();
          }
        else
        {
                $('#registration-msg .alert').html("Registration Failed");
                $('#registration-msg .alert').removeClass("alert-success");
                $('#registration-msg .alert').addClass("alert-danger");
                $('#registration-msg').show();
        }
      });
    });
  });