/**
* viewAnnouncement.js 
*
*/
var resultTable;
var article_userid = '';
var page_no = 0;

$(function() {

	$('.error').hide();
	$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
	}
	var current_userid = $.session.get('session_userid');
	var today_str = getTodayDateString(new Date());
	var deleteButtonId = '';
	var editButtonId = '';

	var announcementId_clicked = 0;




	var init_all = false;


	
	
	page_no = $.urlParam('page');

	var current_announce_id = 0;
	


	if (page_no == 'latest') {
		$('#numberPerPage').hide();
		$('#numberPageTitle').empty();
		$('#numberPageTitle').append("To show all announcements, please select 'View Announcement' on the left")

		var selectedId = $.urlParam('id');
		loadPage(page_no,'latestOnly', selectedId)

	} else {
		loadPagination();
		loadPage(page_no);
	}


	
	

	

	$('#announcementTable').on("click",".viewAnnouncement",function() {
		if (announce_id == 'all')
		{
			$('#announcementViewArea').show();
			$('#commentArea').show();
		}
		loadPage(this.id);
		current_announce_id = this.id;
	});



	$('#editConfirm').click(function() {
		var new_comment_text = $('#editCommentText').val();


		var commentLine_edited = '#commentLine'+editButtonId;

		var new_comment_text_formatted = new_comment_text.replace(/\r\n|\r|\n/g,"<br />");

		var comment_id = editButtonId;

		$.ajax({
			type:"POST",
			url:"bin/add_announcement.php",
			data:{"action": "edit_comment", "comment_index": comment_id, "comment_body": new_comment_text},
			cache:false,
			success: function(resp) {
				if (resp == 'update success') {
					var x = '#'+announcementId_clicked;

					$('#editComment').modal('hide');
					
					$(x).append("<p class='commentLine' id='commentLine"+comment_id+"'><span id='comment_text_body"+comment_id+"'>"+new_comment_text_formatted+"</span> <small> by <span id='user_id_comment"+comment_id+"'>" + current_userid+"</span> at " + today_str+ "</small> <a href='#' class='editComment' id='editComment"+comment_id+"'>[Edit]</a>  [Delete]</p><hr>");
					
					$(commentLine_edited).remove();
				} else {
					alert(resp);
				}
			}

		});
	});

	$('#deleteConfirm').click(function() {
		
		var comment_id = editButtonId;
		var commentLine_removed = '#commentLine'+editButtonId;

		var announcementId = announcementId_clicked.substring(11);

		var comment_count_area = '#commentCount'+ announcementId;

		
		$.ajax({
			type:"POST",
			url:"bin/add_announcement.php",
			data:{"action": "delete_comment", "comment_index": comment_id},
			cache:false,
			success:function(resp) {
				if (resp == 'delete success') {
					var x = '#'+announcementId_clicked;

					$('#deleteCommentWindow').modal('hide');

					var comment_count = parseInt($(comment_count_area).html(),10);

					comment_count--;

					$(comment_count_area).empty();

					$(comment_count_area).append(comment_count);

					$(commentLine_removed).remove();
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

		if (current_userid.toLowerCase() != author_id.toLowerCase()) {
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

		if (current_userid.toLowerCase() != author_id.toLowerCase()) {
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


	$('#contentArea').on('click','.editComment',function() {
		var comment_id = this.id.substring(11);

		editButtonId = comment_id;


		announcementId_clicked = $(this).parent().parent().attr("id");

		var user_id_area = '#user_id_comment'+comment_id;

		var comment_body_area_elem ='#comment_text_body'+comment_id;

		var user_id_comment = $(user_id_area).html();

		var existing_comment = $(comment_body_area_elem).html();

		if (current_userid.toLowerCase() != user_id_comment.toLowerCase()) {
			$('#accessDenied').modal('toggle');
			return false;
		} else {
			existing_comment = existing_comment.replace(/<br\s*[\/]?>/gi, "\n");
			$('#editCommentText').val(existing_comment);
			$('#editComment').modal('toggle');
		}
	});


	$('#contentArea').on('click','.delComment',function() {
		var comment_id = this.id.substring(10);

		editButtonId = comment_id;


		announcementId_clicked = $(this).parent().parent().attr("id");


		var user_id_area = '#user_id_comment'+comment_id;

		var comment_body_area_elem ='#comment_text_body'+comment_id;

		var user_id_comment = $(user_id_area).html();


		if (current_userid.toLowerCase() != user_id_comment.toLowerCase()) {
			$('#accessDenied').modal('toggle');
			return false;
		} else {
			$('#deleteCommentWindow').modal('toggle');
		}
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

			var comment_count_area = '#commentCount'+ id;



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

			 			$(commentListId).append("<p class='commentLine' id='commentLine"+resp+"'><span id='comment_text_body"+resp+"'>"+comment_text_formatted+"</span> <small> by <span id='user_id_comment"+resp+"'>" + current_userid+"</span> at " + today_str+ "</small> <a href='#' class='editComment' id='editComment"+resp+"'>[Edit]</a> <a href='#' class='delComment' id='delComment"+resp+"'>[Delete]</a></p><hr>");


						var comment_count = parseInt($(comment_count_area).html(),10);

						comment_count++;

						$(comment_count_area).empty();

						$(comment_count_area).append(comment_count);


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



function loadPage(page_no, condition,selectedId) {
		$('#contentArea').empty();

		if (condition == 'latestOnly') {
			var loadAnnouncement = {"action": "one", "id": selectedId};			
		} else {
			var per_page = $('#numberPerPage').val();

			var loadAnnouncement = {"action": "page", "page": page_no, "per_page": per_page};
		}
		
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
						+'<h3><span class="dataArea" id="titleArea'+resp[i].announcement[0].body[0].announcementIndex+'">'+resp[i].announcement[0].body[0].title+'</span> </h3>'
						+'<div id="infoAnnouncement" >'
						+'<div style="float:left"><h3><small> by <span class="dataArea" id="addedUser'+resp[i].announcement[0].body[0].announcementIndex+'">'+resp[i].announcement[0].body[0].user_id+'</span> at <span id="addedDate" class="dataArea">'+resp[i].announcement[0].body[0].date_added+' </span> | Comments (<span id="commentCount'+resp[i].announcement[0].body[0].announcementIndex+'">'+comments_count+'</span>)</small></h3>'
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
							$(commentListId).append("<p class='commentLine' id='commentLine"+comment_list[j].comment_index+"'><span id='comment_text_body"+comment_list[j].comment_index+"'>"+comment_text_formatted+"</span> <small> by <span id='user_id_comment"+comment_list[j].comment_index+"'>" + user_id+"</span> at " + date +"</small> <a href='#' class='editComment' id='editComment"+comment_list[j].comment_index+"'>[Edit]</a>  <a href='#' class='delComment' id='delComment"+comment_list[j].comment_index+"'> [Delete]</a></p><hr>");

						}
					}
				}
			}
		});


};
