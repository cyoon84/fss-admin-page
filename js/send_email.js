$(function(){

  $.urlParam = function(name){
      var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
      return results[1] || 0;
  }

  var emailAddrParm = $.urlParam('email');

  $('#menuarea').load('menu.html');

  var senderDisplay = emailAddrParm;

  $('#sendTo').val(senderDisplay);


  $('#sendEmail').click(function() {
    
    var actualEmail = $('#sendTo').val();

    var subject = $('#emailSubject').val();

    var body = $('#emailBody').val().replace(/\r\n|\r|\n/g,"<br />");

    $.ajax({
      type:"POST",
      data:{"opt": "individual", "recipient": actualEmail, "body":body, "subject": subject},
      url:"bin/use_gmail.php",
      cache:false,
      success:function(resp) {
          $('#modal-body5').append(resp);
          $('#emailMsg').modal('toggle');

      }
    });


  });


  $('#closeEmailMsg').click(function(){
    $('#emailSubject').val('');
    $('#emailBody').val('');
  });

});

  
