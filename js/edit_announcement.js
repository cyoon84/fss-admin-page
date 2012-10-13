$(function() {
	var d = getTodayDateString(new Date());
	var current_userid = $.session.get('session_userid');

	$('#todayDate').append(d);
	$('.error').hide();


	$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
	}


	var announce_id = $.urlParam('id');


	var loadAnnouncement = {"action": "one", "id": announce_id};

	$.ajax({
			type:"GET",
			url:"bin/getAnnouncement.php",
			dataType:"json",
			cache: false,
			data: loadAnnouncement,
			success:function(resp) {
				var body = resp[0].body[0].body;

				var body_edited= body.replace(/<br\s*[\/]?>/gi, "\n");

				$('#announcementTitle_new').val(resp[0].body[0].title);
				$('#announcementBody_new').val(body_edited);
			
			}
	});


	$('#update').click(function(){

		var title = $('#announcementTitle_new').val();
		var body = $('#announcementBody_new').val();

		var updateAnnouncement = {"action": "update_announcement", "announcementId": announce_id, "title": title, "body": body};

		$.ajax({
			type:"POST",
			url:"bin/add_announcement.php",
			cache:false,
			data: updateAnnouncement,
			success:function(resp) {
				if (resp == 'update success') {
					var url = "viewAnnouncement.html?id="+announce_id;
					window.location = url;
				}
			}

		});

	});

	$('#back').click(function(){
		var url = "viewAnnouncement.html?id="+announce_id;
		window.location = url;
	});

});