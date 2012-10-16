/**
* viewAnnouncement.js 
*
*/
var resultTable;
var article_userid = '';
var page_no = 0;

$(function() {

	$('.error').hide();
	var current_userid = $.session.get('session_userid');
	var today_str = getTodayDateString(new Date());
	var deleteButtonId = '';
	var editButtonId = '';

	loadPagination();

	var init_all = false;
/*	resultTable = $('#announcementTable').dataTable( {
		"sDom": "<'row'<'span4'l><'span5'f>r>t<'row'<'span4'i><'span5'p>>",
		"sPaginationType": "bootstrap",
		"oLanguage": {
			"sLengthMenu": "_MENU_ records per page"
		},
		"aaSorting": [[0,'desc']]
	});

	loadTable();

*/	$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
	}
	
	
	page_no = $.urlParam('page');

	var current_announce_id = 0;
	



	loadAnnouncementOne(page_no);
	

	

	$('#announcementTable').on("click",".viewAnnouncement",function() {
		if (announce_id == 'all')
		{
			$('#announcementViewArea').show();
			$('#commentArea').show();
		}
		loadAnnouncementOne(this.id);
		current_announce_id = this.id;
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


	$('#deleteAnnouncementConfirm').click(function() {
			var number_article_page = $('#contentArea').children().size();

			$.ajax({
				type:"POST",
				url:"bin/add_announcement.php",
				data:{"action":"delete_announcement", "announcementIndex": current_announce_id},
				cache:false,
				success:function(resp) {
					if (resp == 'delete success') {
						number_article_page --;

						if (number_article_page == 0) {
							var new_page = page_no - 1;

							var url="viewAnnouncement.html?page="+new_page;
						} else {
							var url="viewAnnouncement.html?page="+page_no;
						}
						window.location = url;
					} else {
						alert(resp);
					}
				}
			})
		});


	$('#contentArea').on('click','.editAnnouncement',function() {
		
		var id = this.id.substring(16);

		var author_elementId = '#addedUser'+id;

		var author_id = $(author_elementId).text();

		if (current_userid != author_id) {
			$('#accessDeniedAnnouncement').modal('toggle');
			return false;			
		} else { 

			var url = "edit_announcement.html?id="+id+"&prev_page="+page_no;
			window.location = url;
			return false;	
		}
		
	});


	$('#contentArea').on('click','.delAnnouncement',function() {
		var id = this.id.substring(15);
		var author_elementId = '#addedUser'+id;

		current_announce_id = id;

		var author_id = $(author_elementId).text();

		if (current_userid != author_id) {
			$('#accessDeniedAnnouncement').modal('toggle');
			return false;			
		} else {
			$('#deleteAnnouncement').modal('toggle');	
			return false;

		}
	});

	$('#numberPerPage').change(function() {
		loadAnnouncementOne(1);
		$('#pageList').empty();
		loadPagination();
	});

	$('#contentArea').on('click','.addComment', function() {
		var id = this.id.substring(10);
		var labelId = 'label#comment_error'+id;
		$(labelId).hide();
		var comment_body_boxId = '#comment'+id;
		var comment_text = $(comment_body_boxId).val();
		if ($.trim(comment_text).length == 0) {
			
			$(labelId).show();
			$(comment_body_boxId).focus();
 			return false;
		} else {

			var commentData = {"announcementIndex": id, "body": comment_text, "user_id": current_userid, "action": "new_comment"};

			$.ajax({
			 	type:"POST",
			 	url:"bin/add_announcement.php",
			 	dataType:"json",
			 	data: commentData,
			 	cache:false,
			 	success:function(resp) {
			 		if (!isNaN(resp)){
			 			var comment_text_formatted = comment_text.replace(/\r\n|\r|\n/g,"<br />");
			 			var commentListId = '#commentList'+id;
			 			$(comment_body_boxId).val("");
			 			$(commentListId).append("<p>"+comment_text_formatted+" by "+ "<small>"+ current_userid+" at " + today_str +"</small></p>")
			 			//$('#commentTable tbody').append("<tr><td>"+current_userid+"</td><td>"+comment_text_formatted+"</td><td>"+today_str+"</td><td><button class='editComment' id='editComment"+resp+"'>Edit</button><button class='deleteComment' id='deleteComment"+resp+"'>Delete</button></td></tr>");
			 		} else {
			 			alert(resp);
			 		}	
			 	}

			});


		} 
	}); 

});


function loadPagination() {
	var per_page = $('#numberPerPage').val();

	$.ajax({
		type:"GET",
		url:"bin/getAnnouncement.php",
		data: {"action":"getPageNumber", "per_page": per_page},
		cache:false,
		success:function(resp) {
			if (page_no != 1) {
				var prev_page_no = page_no - 1; 
				$('#pageList').append('<li><a href="viewAnnouncement.html?page='+prev_page_no+'">&laquo;</a></li>');
			} else {
				$('#pageList').append('<li><a href="#">&laquo;</a></li>');
			}

			for (var i=0; i!= resp; i++) {
				var pageNo = i+1;
				$('#pageList').append('<li><a href="viewAnnouncement.html?page='+pageNo+'">'+pageNo+'</a></li>');

			}
			if (page_no != resp) {	
				var next_page = resp + 1;
				$('#pageList').append('<li><a href="viewAnnouncement.html?page='+next_page+'">&raquo;</a></li>');
			} else {
				$('#pageList').append('<li><a href="#">&raquo;</a></li>');
			}
		}


	});

};



function loadAnnouncementOne(page_no) {
		$('#contentArea').empty();
		//$('#commentTable tbody').empty();

		var per_page = $('#numberPerPage').val();

		var loadAnnouncement = {"action": "page", "page": page_no, "per_page": per_page};
		
		$.ajax({
			type:"GET",
			url:"bin/getAnnouncement.php",
			dataType:"json",
			cache: false,
			data: loadAnnouncement,
			success:function(resp) {
				
				for  (var i =0; i!= resp.length; i++) {
					var contents_edit = resp[i].announcement[0].body[0].body.replace(/\r\n|\r|\n/g,"<br />");	
					var comments_count = resp[i].announcement[0].comments.length;

					$('#contentArea').append(
						'<div class="span9 well-nobgcolor" id="article'+resp[i].announcement[0].body[0].announcementIndex+'" style="margin-left:0px">'
						+'<h3><span class="dataArea">'+resp[i].announcement[0].body[0].title+'</span> </h3>'
						+'<div id="infoAnnouncement" >'
						+'<div style="float:left"><h3><small> by <span class="dataArea" id="addedUser'+resp[i].announcement[0].body[0].announcementIndex+'">'+resp[i].announcement[0].body[0].user_id+'</span> at <span id="addedDate" class="dataArea">'+resp[i].announcement[0].body[0].date_added+' </span> | Comments('+comments_count+')</small></h3>'
						+'</div>'
						+'<div style="float:right">'
						+'<form class="form-inline">'
					 	+'<input type="submit" class="editAnnouncement" id="editAnnouncement'+resp[i].announcement[0].body[0].announcementIndex+'" value="Edit">&nbsp;'
					 	+'<input type="submit" class="delAnnouncement" id="delAnnouncement'+  resp[i].announcement[0].body[0].announcementIndex+'" value="Delete"> '
						+'</form></div>'
						+'</div>'
						+'<div style="margin-top:50px">'
						+'<hr>'
						+'<div class="dataArea" style="min-height:200px">'+contents_edit+'</div></div></div>'
						+'<div class="writeComment span9" style="margin-left:0px"> <div class="commentList" id="commentList'+resp[i].announcement[0].body[0].announcementIndex+'"></div><table class="table" style="width:100%">'
						+'<tr><td style="width:80%"> <textarea class="writeCommentArea" id="comment'+resp[i].announcement[0].body[0].announcementIndex+'" style="width:100%" rows="4" placeholder="Write a comment here"></textarea>'
						+'<label class="error" for="comment" id="comment_error'+resp[i].announcement[0].body[0].announcementIndex+'" style="display:none"> This field is required </label>'
						+'<td style="width:20%"> <input type="submit" class="addComment btn btn-primary" id="addComment'+resp[i].announcement[0].body[0].announcementIndex+'" value="Add comment"></tr></table>'
						+'</div>'

					);


					if (comments_count > 0) {
						var comment_list = resp[i].announcement[0].comments;

						for (var j = 0; j != comments_count; j++) {
							var comment_text_formatted = comment_list[j].comment_body.replace(/\r\n|\r|\n/g,"<br />");	
							var user_id = comment_list[j].user_id;
							var date = comment_list[j].date_added.substring(0,10);
							var commentListId = '#commentList'+comment_list[j].announcementIndex;
							$(commentListId).append("<p>"+comment_text_formatted+" <small> by "+ user_id+" at " + date +"</small> [Edit] [Delete]</p><hr>");

						}
					}
				}
			}
		});


};
