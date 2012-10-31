/**
* searchStudent.js - search students in the database - user can choose to show all (if no search criteria was given), search by name (both korean / english name), email and by school
*
*/
var resultTable;

$(function() {

	$('#menuarea').load('menu.html');

	resultTable = $('#result').dataTable( {
		"sDom": "<'row'<'span4'l><'span5'f>r>t<'row'<'span4'i><'span5'p>>",
		"sPaginationType": "bootstrap",
		"oLanguage": {
			"sLengthMenu": "_MENU_ records per page"
		},
		"aaSorting": [[6,'desc'],[0,'asc'],[1,'asc']]
		
	} );

	
	loadTable('All');


	$('#category').change(function() {
		var new_category = $('#category').val();
		loadTable(new_category);
	
	});

});

function loadTable(category) {
		
	var loadTableCond = {"category": category, "action": "all"};

	resultTable.fnClearTable();

	$.ajax({
		type:"GET",
		url:"bin/getAllUser.php",
		dataType:"json",
		cache: false,
		data: loadTableCond,
		success:function(resp) {
			for (i=0;i!= resp.length ;i++ )
			{
				var active_stat;
				var koreanNameLink;

				if (resp[i].active_indicator == 'Y')
				{
				//	koreanNameLink = "<a href=viewStudent_2.html?id="+resp[i].student_id+"&hidden=N class='viewRec' id='"+resp[i].student_id+"'>"+resp[i].name_kor+"</a>"
					koreanNameLink = "<a href=viewStudent.html?id="+resp[i].student_id+"&hidden=N>"+resp[i].name_kor+"</a><br>("+resp[i].unique_id+")";
					active_stat = "Active";
				} else {
					koreanNameLink = "<a href=viewStudent.html?id="+resp[i].student_id+"&hidden=Y>"+resp[i].name_kor+"</a><br>("+resp[i].unique_id+")";
				//	koreanNameLink = "<a href=viewStudent_2.html?id="+resp[i].student_id+"&hidden=N class='viewRec' id='"+resp[i].student_id+"'>"+resp[i].name_kor+"</a>"
					active_stat = "Inactive"; 
				}

				var date_added_str = resp[i].date_added.substring(0,10);

				resultTable.fnAddData([koreanNameLink,resp[i].name_eng,resp[i].date_birth,resp[i].email, resp[i].phone_no,active_stat, date_added_str]);
			}
		}
	});


	$('#result').on("click",".viewRec",function() {
		var nWin = window.open($(this).prop('href'),'','height=800,width=1100');
		if (window.focus)
		{
			nWin.focus();
		}
		return false;

	});


}