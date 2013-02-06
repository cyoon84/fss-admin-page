

$(function() {
		
		$('#menuarea').load('menu.html');
		$('.error').hide();

		var current_userid = $.session.get('session_userid');

		var selected_school_id = 0;

		var orig_school_type = '';

		var studentrec_count = 0;

		loadSchoolList("init");

		schoolCatLoad("#newCat");

		$('#addNewSchool').click(function() {
			$('#newSchool').val('');
			$('#newCat').prop('selectedIndex', 0);
			$('#newSchoolModal').modal('toggle');
		});


		$('#newSchoolSave').click(function() {
			$('.error').hide();
			var schoolName = $('#newSchool').val();
			if (schoolName == '') {
				$('label#newSchoolName_error').show();
				$('#newSchool').focus();
				return false;
			}

			var school_type = $('#newCat').val();

			var schoolData = {"action": "add_new", "school_name": schoolName, "school_type": school_type, "user_id": current_userid};

			$.ajax({
				type:"POST",
				data:schoolData,
				url:"bin/school_list.php",
				success:function(resp){
					if (resp == 'add success') {
						loadSchoolList(school_type);
						$('#newSchoolModal').modal('hide');
					} else {
						alert(resp);
					}
				}

			});

		});

		$('.category tbody').on('click', '.delSchool', function() {
			selected_school_id = this.id;

			var tableid = $(this).parent().parent().parent().parent().attr('id');
			$('#recordCountStudent').empty();

			$.ajax({
				type:"GET",
				data: {"action": "get_count", "school_index": selected_school_id},
				url:"bin/school_list.php",
				async:false,
				success:function(resp) {
					studentrec_count=resp;
				}
			});

			if (studentrec_count > 0) {
				$('#recordCountStudent').html(studentrec_count);
				$('#warningareaDelSchool').show();
			} else {
				$('#warningareaDelSchool').css('display','none');
			}

			switch (tableid) {
				case "langSch":
					$('#editCat').prop('selectedIndex', 0);
					orig_school_type = "LANGUAGE_SCHOOL";
					break;
				case "unicollege":
					$('#editCat').prop('selectedIndex', 1);
					orig_school_type = "UNIV/COLLEGE";
					break;
				case "highschool" : 
					$('#editCat').prop('selectedIndex', 3);
					orig_school_type = "OTHER/PUBLIC_SCHOOL";
					break;
				default:
					alert('error');
					break;
			}

			$('#delSchool').modal('toggle');
		});

		$('.category tbody').on('click','.editSchool',function() {
			var schoolName = $(this).closest('tr').find('td:first').text();
			var tableid = $(this).parent().parent().parent().parent().attr('id');

			selected_school_id = this.id;

			$('#editName').val(schoolName);

			switch (tableid) {
				case "langSch":
					$('#editCat').prop('selectedIndex', 0);
					orig_school_type = "LANGUAGE_SCHOOL";
					break;
				case "unicollege":
					$('#editCat').prop('selectedIndex', 1);
					orig_school_type = "UNIV/COLLEGE";
					break;
				case "highschool" : 
					$('#editCat').prop('selectedIndex', 2);
					orig_school_type = "OTHER/PUBLIC_SCHOOL";
					break;
				default:
					alert('error');
					break;
			}

			$('#editSchool').modal('toggle');
		});

		$('#editSchoolConfirm').click(function() {
			var school_name = $('#editName').val();
			var school_type = $('#editCat').val();

			if (school_name == '') {
				$('label#editName_error').show();
				$('#editName').focus();
				return false;
			}

			var schoolData = {"action": "update", "school_index": selected_school_id, "school_name": school_name, "school_type": school_type, "user_id": current_userid};

			$.ajax({
				type:"POST",
				data:schoolData,
				url:"bin/school_list.php",
				success:function(resp){
					if (resp == 'update success') {
						$('#editSchool').modal('hide');
						loadSchoolList(school_type);
						if (orig_school_type != school_type) {
							loadSchoolList(orig_school_type);
						} 
						
					} else {
						alert(resp);
					}
				}			
			});
		});

		$('#delSchoolConfirm').click(function(){
			var schoolData = {"action": "delete", "school_index": selected_school_id, "count": studentrec_count};

			$.ajax({
				type:"POST",
				data:schoolData,
				url:"bin/school_list.php",
				success:function(resp){
					if (resp == 'delete success') {
						$('#delSchool').modal('hide');
						loadSchoolList(orig_school_type);						
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


function loadSchoolList(cond) {
	var selCondition = cond;

	switch (selCondition) {
		case "init":
			$('.category tbody').empty();
			break;
		case "LANGUAGE_SCHOOL":
			$('#langSch tbody').empty();
			break;
		case "UNIV/COLLEGE":
			$('#unicollege tbody').empty();
			break;		
		case "OTHER/PUBLIC_SCHOOL":
			$('#highschool tbody').empty();
			break;
		default:
			break;
	}


	var schoolListData = {"action": "get_list", "cond": selCondition};


	$.ajax({
		type: "GET",
		data:schoolListData,
		dataType:"json",
		url:"bin/school_list.php",
		success:function(resp) {
			if (resp.length > 0) {
				for (var i = 0; i!= resp.length; i++) {
					if (resp[i].school_type == 'LANGUAGE_SCHOOL') {

						$('#langSch tbody').append("<tr><td>"+resp[i].school_name+"</td><td><input type='button' class='editSchool btn' id='"+resp[i].school_index+"' value='Edit'> <input type='button' class='delSchool btn' id='"+resp[i].school_index+"' value='Delete'></td></tr>")
					}
					if (resp[i].school_type == 'UNIV/COLLEGE') {
						$('#unicollege tbody').append("<tr><td>"+resp[i].school_name+"</td><td><input type='button' class='editSchool btn' id='"+resp[i].school_index+"' value='Edit'> <input type='button' class='delSchool btn' id='"+resp[i].school_index+"' value='Delete'></td></tr>")
					}
					if (resp[i].school_type == 'OTHER/PUBLIC_SCHOOL') {
						$('#highschool tbody').append("<tr><td>"+resp[i].school_name+"</td><td><input type='button' class='editSchool btn' id='"+resp[i].school_index+"' value='Edit'> <input type='button' class='delSchool btn' id='"+resp[i].school_index+"' value='Delete'></td></tr>")
					}
				}
			}

		}
	});
}


function schoolCatLoad(id) {
	var dataAction = {"action" : "get_type"};
	$.ajax({
		type: "POST",
		url: "bin/school_list.php",
		data:dataAction,
		dataType:"json",
		cache: false,	
		success: function(resp) {
			for (var i = 1; i!= resp.length; i++) {
				$(id).append('<option>'+resp[i].school_type+'</option>');
			}
		}
	});	
}