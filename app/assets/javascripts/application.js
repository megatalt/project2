// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require kairos
//= require cloudinary
//= require_tree .


$(document).ajaxStart(function() {
  $(document.body).css({'cursor' : 'wait'});
}).ajaxStop(function() {
  $(document.body).css({'cursor' : 'default'});
});


$(document).ready(function(){

  $('.dropdown-toggle') // semantic ui
  .dropdown();

  $('.message .close') // semantic ui
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade');
  })
});

var camera = null;
var api_url = "https://api.kairos.com/enroll"

var API_ID = "4b76f596";
var API_KEY = "3326986684ad5d3fde93d958cddcfb1f";
var GALLERY_NAME = "Users";
var kairos = new Kairos(API_ID, API_KEY);
console.log(kairos);


var parseImageData = function(imageData) {
    imageData = imageData.replace("data:image/jpeg;base64,", "");
    imageData = imageData.replace("data:image/jpg;base64,", "");
    imageData = imageData.replace("data:image/png;base64,", "");
    imageData = imageData.replace("data:image/gif;base64,", "");
    imageData = imageData.replace("data:image/bmp;base64,", "");
    return imageData;
}

var initCamera = function () {
  if (!window.JpegCamera) {
    alert('Camera access is not available in your browser');
  } else {
    camera = new JpegCamera('#camera')
      .ready(function (resolution) {})
      .error(function () {
      alert('Camera access was denied');
    })
  }
};


var signup = function () {

  initCamera();

  $('#enroll').on('click', function (e) {

    var snap = camera.capture();
    snap.get_blob(function(img){
      // console.log(img, this);

      var reader  = new FileReader();
      reader.readAsDataURL(img);
      reader.onloadend = function () {
        var fileData = parseImageData(reader.result);
        var subjectID = $("#user_name").val()

        // console.log(subjectID, fileData.length, GALLERY_NAME);

        kairos.enroll(fileData, GALLERY_NAME, subjectID, function (response) {
          if (response.responseText.length < 100) {
            // flash an error message
            console.log(response.responseText);
          } else {
            $("#enroll").attr("type", "submit").trigger("click")
          }
          // JSON.parse(response.responseText)
        })
        // console.log(fileData);
      }
    })
  })
};

var signin = function () {

  initCamera();

  $('#verify').on('click', function (e) {

    var snap = camera.capture();
    snap.get_blob(function(img){
      // console.log(img, this);

      var reader  = new FileReader();
      reader.readAsDataURL(img);
      reader.onloadend = function () {
        var fileData = parseImageData(reader.result);


        // console.log(subjectID, fileData.length, GALLERY_NAME);

        kairos.recognize(fileData, GALLERY_NAME,  function (response) {

          var jsonResponse = JSON.parse(response.responseText)

          if (response.responseText.length < 100 || jsonResponse.images[0].transaction.confidence < 0.6) {
            // flash an error message
            console.log(response.responseText);
          } else {

            document.getElementById('username').value = jsonResponse.images[0].transaction.subject_id

            $("#verify").attr("type", "submit").trigger("click")
          }
          // JSON.parse(response.responseText)
        })
        // console.log(fileData);
      }
    })
  })
};
