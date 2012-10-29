$(function(){

  $('#menuarea').load('menu.html');


  $('#emailSelectArea').hide();

  loadEmail();

  var emailOpt = '';

  $('.emailOpt').change(function() {


      emailOpt = $('input:radio[name=emailRecOpt]:checked').val();

      if (emailOpt == 'active')
      {
        $('#emailSelectArea').hide();
        $("#selectRecipients option:selected").removeAttr("selected");
      } else {
        $('#emailSelectArea').show();
      }

  });

  $('#sendEmail').click(function() {

    emailOpt = $('input:radio[name=emailRecOpt]:checked').val();
    
    var actualEmail = $('#sendTo').val();

    var subject = $('#emailSubject').val();

    var body = $('#emailBody').val().replace(/\r\n|\r|\n/g,"<br />");

    
    var mailList = {"opt": "mass", "recipients": [], "body": body, "subject": subject};

    
    if (emailOpt == 'active') {
         $.ajax({
            type:"GET",
            data:{"action":"get_all_active_email"},
            url:"bin/getAllUser.php",
            cache:false,
            async:false,
            dataType: "json",
            success: function(resp) {
                mailList.recipients = resp;
            }
        });
    }

    if (emailOpt == 'select') {
      var selectedValues = $('#selectRecipients').val();

      var selectedList = [];
      
      for (var i = 0; i != selectedValues.length; i++) {
          var openbracketpos = selectedValues[i].indexOf("(");
          var end = selectedValues[i].length - 1;
          var name = selectedValues[i].substring(0,openbracketpos);
          var email = selectedValues[i].substring(openbracketpos+1, end);

          var list = {"name_kor": name, "email": email};
          selectedList.push(list);
      }
      mailList.recipients = selectedList;
    }


   $.ajax({
      type:"POST",
      data:mailList,
      url:"bin/use_gmail.php",
      cache:false,
      success:function(resp) {
          $('#modal-body5').append(resp);
          $('#emailMsg').modal('toggle');
      }
    });



    return false;
  });


  $('#closeEmailMsg').click(function(){
    $('#emailSubject').val('');
    $('#emailBody').val('');
    $('#activeOnly').attr('checked','checked');
    $('#emailSelectArea').hide();
    $("#selectRecipients option:selected").removeAttr("selected");
  });

});

function loadEmail() {
  $.ajax({
    type:"GET",
    data:{"action":"get_all_active_email"},
    url:"bin/getAllUser.php",
    cache:false,
    dataType:"json",
    success:function(resp) {
      for (var i=0; i!= resp.length; i++) {
        var name = resp[i].name_kor;
        var email = resp[i].email;

        if (email != '') {

          var text = name + "("+email+")";

         $('#selectRecipients').append("<option>"+text+"</option>");
        }

      }

    }

  });


}



  
