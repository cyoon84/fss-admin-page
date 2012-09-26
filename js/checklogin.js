$(function() {
	
	if (typeof $.session.get('session_id') === 'undefined')
	{
		$('#plzlogin').modal('toggle');
	}  else {
		
		var current_id = $.session.get('session_userid');
		var userData = {"user_id": current_id};

		$.ajax({
			type:"GET",
			data:userData,
			dataType:"json",
			url:"bin/getLoginUserInfo.php",
			cache:false,
			success:function(resp) {
				var first_name = resp[0].first_name;
				var last_name = resp[0].last_name;
					$('#currentUserName').append("Welcome "+first_name+ " " +last_name); 


			}
		});


	}

	$('#goToLogin').click(function() {
		$(document.location = 'login.html');

	});

	$('#logout').click(function() {
		$('#logoutWindow').modal('toggle');
	});

	$('#goToLogout').click(function() {
		$.session.delete('session_id');
		$(document.location = 'login.html');
	});
});