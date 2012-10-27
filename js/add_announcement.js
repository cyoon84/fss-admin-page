$(function() {
	var d = getTodayDateString(new Date());
	var current_userid = $.session.get('session_userid');

	$('#menuarea').load('menu.html');

	$('#todayDate').append(d);
	$('.error').hide();

	$('#addNew').click(function() {
		$('.error').hide();
		var announcement_body = $('#announcementBody').val();
		var announcement_title = $('#announcementTitle').val();

		if (($.trim(announcement_title).length) == 0)
		{
			$('label#noTitle').show();
			$('#announcementTitle').focus();
				return false;
		}

		if (announcement_body.length > 2000)
		{
			$('label#limitExceed').show();
			$('#announcementBody').focus();
			return false;
			
		} else {
			if (($.trim(announcement_body).length) == 0)
			{
				$('label#noText').show();
				$('#announcementBody').focus();
				return false;

			}
			announcement_body = announcement_body.replace(/\r\n|\r|\n/g,"<br />");
		}



		var dataAnnouncement = {"user_id": current_userid, "title": announcement_title, "body": announcement_body,"action": "new_post"};
		
		$.ajax({
			data: dataAnnouncement,
			type:"POST",
			url: "bin/add_announcement.php",
			cache:false,
			success:function(resp) {
				var url = "index.html";
				window.location = url;
			}
		});




		


	});
	


});;