$(function () {

	$('#loginButton').click(function () {
		$('#loginresult').empty();
		var id = $('#inputID').val();
		var pwd = $('#inputPWD').val();

		var loginInfo = {"id":id , "pwd": pwd};

		if (id == '' || pwd == '')
		{
			$('#loginresult').append("Please enter ID / Password and try again!");
			return false;
		}


		$.ajax({
			type: "POST",
			data: loginInfo,
			cache: false,
			url: "bin/login.php",
			success: function(resp) {
				if (resp == 0)
				{
					$('#loginresult').append("ID / Password verified!");
					var random_id = randomString();
					$.session.set('session_id', random_id);
					$.session.set('session_userid', id);
					$(document.location = 'index.html');
				} else {
					$('#loginresult').append("Invalid ID and Password, please try again!");

				}

			}

		});
		return false;
	});

});

function randomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 20;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}