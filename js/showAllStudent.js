/**
* searchStudent.js - search students in the database - user can choose to show all (if no search criteria was given), search by name (both korean / english name), email and by school
*
*/
var resultTable;

$(function() {
	resultTable = $('#result').dataTable( {
		"sDom": "<'row'<'span4'l><'span4'f>r>t<'row'<'span4'i><'span4'p>>",
		"sPaginationType": "bootstrap",
		"oLanguage": {
			"sLengthMenu": "_MENU_ records per page"
		}
	} );

	$.ajax({
		url:"bin/getAllUser.php",
		dataType:"json",
		success:function(resp) {
			for (i=0;i!= resp.length ;i++ )
			{
				var active_stat;
				var koreanNameLink;

				if (resp[i].active_indicator == 'Y')
				{
					koreanNameLink = "<a href=viewStudent.html?id="+resp[i].student_id+"&hidden=N>"+resp[i].name_kor+"</a>"
					active_stat = "Active";
				} else {
					koreanNameLink = "<a href=viewStudent.html?id="+resp[i].student_id+"&hidden=Y>"+resp[i].name_kor+"</a>"
					active_stat = "Inactive"; 
				}

				var date_added_str = resp[i].date_added.substring(0,10);

				resultTable.fnAddData([koreanNameLink,resp[i].name_eng,resp[i].email, resp[i].phone_no,active_stat, date_added_str]);
			}
		}
	});

});