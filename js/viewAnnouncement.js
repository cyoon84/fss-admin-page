/**
* viewAnnouncement.js 
*
*/
var resultTable;

$(function() {


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
	if (announce_id != 'all')
	{
		loadAnnouncementOne(announce_id);
	} else {
		$('#announcementViewArea').hide();
		$('#commentArea').hide();
	}
	



	
	

	

	$('#announcementTable').on("click",".viewAnnouncement",function() {
		if (announce_id == 'all')
		{
			$('#announcementViewArea').show();
			$('#commentArea').show();
			init_all = true;
		}
		loadAnnouncementOne(this.id);

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
				resultTable.fnAddData([resp[i].announcementIndex,"<a href='#' class='viewAnnouncement' id='"+resp[i].announcementIndex+"'>"+resp[i].title+"</a>",resp[i].user_id, date_added_parsed]);
			}
				
			
		}
	});
};

function loadAnnouncementOne(id) {
		$('.dataArea').empty();

		var loadAnnouncement = {"action": "one", "id": id};
		
		$.ajax({
			type:"GET",
			url:"bin/getAnnouncement.php",
			dataType:"json",
			cache: false,
			data: loadAnnouncement,
			success:function(resp) {
				$('#userId').append(resp[0].user_id);
				$('#addedDate').append(resp[0].date_added);
				$('#title').append(resp[0].title);
				$('#contents').append(resp[0].body);
			
			}
		});


};
