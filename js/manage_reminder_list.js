

$(function() {
		
		$('#menuarea').load('menu.html');
		$('.error').hide();

		var current_userid = $.session.get('session_userid');

		var selected_remind_category_id = 0;

		remindCategoryLoad();

		$('#addnewReminderCategory').click(function() {
			$('#newReminder').val('');
			$('#newReminderModal').modal('toggle');
		});


		$('#newRemindSave').click(function() {
			$('.error').hide();
			var remindName = $('#newReminder').val();
			if (remindName == '') {
				$('label#newReminder_error').show();
				$('#newReminder').focus();
				return false;
			}

			var schoolData = {"action": "add_new", "reminder_name": remindName, "user_id": current_userid};

			$.ajax({
				type:"POST",
				data:schoolData,
				url:"bin/reminder_list.php",
				success:function(resp){
					if (resp == 'add success') {
						$('#newReminderModal').modal('hide');
						remindCategoryLoad();
					} else {
						alert(resp);
					}
				}

			});

		});

		$('.category tbody').on('click', '.delRemindCat', function() {
			selected_remind_category_id = this.id;

			$('#delRemindModal').modal('toggle');
		});

		$('.category tbody').on('click','.editRemindCat',function() {
			var remindName = $(this).closest('tr').find('td:first').text();

			selected_remind_category_id = this.id;

			$('#editReminderName').val(remindName);

			$('#editReminder').modal('toggle');
		});

		$('#editRemindConfirm').click(function() {
			var remind_name = $('#editReminderName').val();
			
			if (remind_name == '') {
				$('label#editReminderName_error').show();
				$('#editReminderName').focus();
				return false;
			}

			var schoolData = {"action": "update", "rem_list_index": selected_remind_category_id, "remind_name": remind_name, "user_id": current_userid};

			$.ajax({
				type:"POST",
				data:schoolData,
				url:"bin/reminder_list.php",
				success:function(resp){
					if (resp == 'update success') {
						$('#editReminder').modal('hide');
						remindCategoryLoad();
					} else {
						alert(resp);
					}
				}			
			});
		});

		$('#delRemindConfirm').click(function(){
			var schoolData = {"action": "delete", "rem_list_index": selected_remind_category_id};

			$.ajax({
				type:"POST",
				data:schoolData,
				url:"bin/reminder_list.php",
				success:function(resp){
					if (resp == 'delete success') {
						$('#delRemindModal').modal('hide');
						remindCategoryLoad();				
					} else {
						alert(resp);
					}
				}			
			});
		});

		$('.scrolltotop').click(function() {
			$('html, body').animate({scrollTop: $('#top').offset().top }, 'fast');
		});

		$('#goLangSch').click(function() {
			$('html, body').animate({scrollTop: $('#lang').offset().top }, 'fast');	
		});

		$('#goUniCollege').click(function() {
			$('html, body').animate({scrollTop: $('#uni').offset().top }, 'fast');	
		});

		$('#goHS').click(function() {
			$('html, body').animate({scrollTop: $('#hs').offset().top }, 'fast');	
		});

		$('#goCreditSch').click(function() {
			$('html, body').animate({scrollTop: $('#credit').offset().top }, 'fast');	
		});
	return false;
});


function remindCategoryLoad() {
	var dataAction = {"action" : "get_category"};
	$('#reminder_list tbody').empty();
	$.ajax({
		type: "GET",
		url: "bin/reminder_list.php",
		data:dataAction,
		dataType:"json",
		cache: false,	
		success: function(resp) {
			for (var i = 0; i!= resp.length; i++) {
				$('#reminder_list tbody').append("<tr><td>"+resp[i].rem_list_name+"</td><td><input type='button' class='editRemindCat btn' id='"+resp[i].rem_list_index+"' value='Edit'> <input type='button' class='delRemindCat btn' id='"+resp[i].rem_list_index+"' value='Delete'></td></tr>");
			}
		}
	});	
}