/**
* viewAnnouncement.js 
*
*/
var resultTable;
var article_userid = '';

$(function() {

	$('.error').hide();
	var current_userid = $.session.get('session_userid');
	var today_str = getTodayDateString(new Date());
	var deleteButtonId = '';
	var editButtonId = '';



	var init_all = false;
	resultTable = $('#announcementTable').dataTable( {
		"sDom": "<'row'<'span4'l><'span5'f>r>t<'row'<'span4'i><'span5'p>>",
		"sPaginationType": "bootstrap",
		"oLanguage": {
			"sLengthMenu": "_MENU_ records per page"
		},
		"aaSorting": [[0,'desc']]
	});

	loadTable();

	$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
	}
	
	
	var announce_id = $.urlParam('id');

	var current_announce_id = 0;
	if (announce_id != 'all')
	{
		loadAnnouncementOne(announce_id);
		current_announce_id = announce_id;
	} else {
		$('#announcementViewArea').hide();
		$('#commentArea').hide();
	}
	

	$('#announcementTable').on("click",".viewAnnouncement",function() {
		if (announce_id == 'all')
		{
			$('#announcementViewArea').show();
			$('#commentArea').show();
		}
		loadAnnouncementOne(this.id);
		current_announce_id = this.id;
	});


	$('#addComment').click(function() {
		var commentText = $('#comment').val();
		if ($.trim(commentText).length == 0) {
			$('label#comment_error').show();
			$('#comment').focus();
 			return false;
		} 


		var commentData = {"announcementIndex": current_announce_id, "body": commentText, "user_id": current_userid, "action": "new_comment"};

		$.ajax({
		 	type:"POST",
		 	url:"bin/add_announcement.php",
		 	dataType:"json",
		 	data: commentData,
		 	cache:false,
		 	success:function(resp) {
		 		if (!isNaN(resp)){
		 			var comment_text_formatted = commentText.replace(/\r\n|\r|\n/g,"<br />");
		 			$('#comment').val("");
		 			$('#commentTable tbody').append("<tr><td>"+current_userid+"</td><td>"+comment_text_formatted+"</td><td>"+today_str+"</td><td><button class='editComment' id='editComment"+resp+"'>Edit</button><button class='deleteComment' id='deleteComment"+resp+"'>Delete</button></td></tr>");
		 		} else {
		 			alert(resp);
		 		}	
		 	}

		});
		
	});

	$('#commentTable').on('click','.editComment',function(){
		editButtonId = this.id;


		var editButtonId_edited = '#'+editButtonId;

		var user_id_comment = $(editButtonId_edited).parent().parent().find('td:first').html();

		var existing_comment = $(editButtonId_edited).parent().parent().find('td').eq(1).html();

		if (current_userid != user_id_comment) {
			$('#accessDenied').modal('toggle');
			return false;
		} else {
			existing_comment = existing_comment.replace(/<br\s*[\/]?>/gi, "\n");
			$('#editCommentText').val(existing_comment);
			$('#editComment').modal('toggle');
		}


	});

	$('#commentTable').on('click','.deleteComment',function() {
		deleteButtonId = this.id;

		var deleteButtonId_edited = '#'+deleteButtonId;

		var user_id_comment = $(deleteButtonId_edited).parent().parent().find('td:first').html();

		if (current_userid != user_id_comment) {
			$('#accessDenied').modal('toggle');
			return false;
		} else {
			$('#deleteCommentWindow').modal('toggle');
		}
	});


	$('#editConfirm').click(function() {
		var new_comment_text = $('#editCommentText').val();


		var editButtonId_edited = '#'+editButtonId;

		var comment_id = editButtonId_edited.substring(11);
		var new_comment_text_formatted = new_comment_text.replace(/\r\n|\r|\n/g,"<br />");

		$.ajax({
			type:"POST",
			url:"bin/add_announcement.php",
			data:{"action": "edit_comment", "comment_index": comment_id, "comment_body": new_comment_text},
			cache:false,
			success: function(resp) {
				if (resp == 'update success') {
					$('#editComment').modal('hide');
					$(editButtonId_edited).parent().parent().remove();
					$('#commentTable tbody').append("<tr><td>"+current_userid+"</td><td>"+new_comment_text_formatted+"</td><td>"+today_str+"</td><td><button class='editComment' id='"+editButtonId+"'>Edit</button><button class='deleteComment' id='"+deleteButtonId+"'>Delete</button></td></tr>");
				} else {
					alert(resp);
				}
			}

		});
	});

	$('#deleteConfirm').click(function() {
		
		var comment_id = deleteButtonId.substring(13);
		var deleteButtonId_edited = '#'+deleteButtonId;

		$.ajax({
			type:"POST",
			url:"bin/add_announcement.php",
			data:{"action": "delete_comment", "comment_index": comment_id},
			cache:false,
			success:function(resp) {
				if (resp == 'delete success') {
					$('#deleteCommentWindow').modal('hide');

					$(deleteButtonId_edited).parent().parent().remove();
				}
			}	
			
		});

		
	});


	$('#editAnnouncement').click(function() {
		if (current_userid != article_userid) {
			$('#accessDeniedAnnouncement').modal('toggle');
			return false;			
		} else { 
			var url = "edit_announcement.html?id="+current_announce_id;
			window.location = url;		
			return false;
		}
	});

	$('#delAnnouncement').click(function() {
		if (current_userid != article_userid) {
			$('#accessDeniedAnnouncement').modal('toggle');
			return false;			
		} else { 
			$('#deleteAnnouncement').modal('toggle');
			return false;
		}

	});



	$('#deleteAnnouncementConfirm').click(function() {

		$.ajax({
			type:"POST",
			url:"bin/add_announcement.php",
			data:{"action":"delete_announcement", "announcementIndex": current_announce_id},
			cache:false,
			success:function(resp) {
				if (resp == 'delete success') {
					var url = "viewAnnouncement.html?id=all";
					window.location = url;
				} else {
					alert(resp);
				}
			}
		})
	});



});

function loadTable() {
		
	var loadTableCond = {"action": "all"};

	resultTable.fnClearTable();


	$.ajax({
		type:"GET",
		url:"bin/getAnnouncement.php",
		dataType:"json",
		cache: false,
		data: loadTableCond,
		success:function(resp) {
			max = resp[0].announcementIndex;
			for (var i =0;i!= resp.length ;i++ )
			{
				var date_added_parsed = resp[i].date_added.substring(0,10);
				resultTable.fnAddData([resp[i].announcementIndex,"<a class='viewAnnouncement' id='"+resp[i].announcementIndex+"'>"+resp[i].title+"</a>",resp[i].user_id, date_added_parsed]);
			}
				
			
		}
	});
};

function loadAnnouncementOne(id) {
		$('.dataArea').empty();
		$('#commentTable tbody').empty();

		var loadAnnouncement = {"action": "one", "id": id};
		
		$.ajax({
			type:"GET",
			url:"bin/getAnnouncement.php",
			dataType:"json",
			cache: false,
			data: loadAnnouncement,
			success:function(resp) {

				var contents_edit = resp[0].body[0].body.replace(/\r\n|\r|\n/g,"<br />");	

				$('#userId').append(resp[0].body[0].user_id);
				$('#addedDate').append(resp[0].body[0].date_added);
				$('#title').append(resp[0].body[0].title);
				$('#contents').append(contents_edit);
				article_userid = resp[0].body[0].user_id;
			
				if (resp[0].comments.length > 0) {
					for (var i = 0; i!= resp[0].comments.length; i++) {
						var comment_date = resp[0].comments[i].date_added.substring(0,10);

						var comment_body = resp[0].comments[i].comment_body.replace(/\r\n|\r|\n/g,"<br />");
						var comment_index = resp[0].comments[i].comment_index;

						$('#commentTable tbody').append("<tr><td>"+resp[0].comments[i].user_id+"</td><td>"+comment_body+"</td><td>"+comment_date+"</td><td><button class='editComment' id='editComment"+comment_index+"'>Edit</button><button class='deleteComment' id='deleteComment"+comment_index+"'>Delete</button></td></tr>");

					}
				} 
			}
		});


};
