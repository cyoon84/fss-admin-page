

$(function() {
		
		$('#menuarea').load('menu.html');
		$('.error').hide();

		var current_userid = $.session.get('session_userid');
		pointlistLoad();

		var selectedID = 0;

		$('.category tbody').on('click', '.editAddCat',  function(){
			selectedID = this.id;


			$.ajax({
				url:"bin/point_history.php",
				data:{"action": "getPointOne", "id": selectedID},
				cache:false,
				dataType:"json",
				success:function(resp) {
					$('#editName').val(resp[0].name);
					$('#editPT').val(resp[0].point_value);
					var point_type = resp[0].point_type;
					if (point_type == 'accumulate') {
						$('#editCat').prop('selectedIndex', 0);
					} 
					if (point_type == 'deduct') {
						$('#editCat').prop('selectedIndex', 1);	
					}
				}	
			})
			$('#editFssPTCateory').modal('toggle');
		});


		$('.category tbody').on('click', '.delAddCat',  function(){
			selectedID = this.id;
			$('#delFssPTCateory').modal('toggle');
		});		

		$('#delPointCat').click(function() {
			var dataDel = {"action": "delPointList", "pointList_index": selectedID};

			$.ajax({
				type:"POST",
				url:"bin/point_history.php",
				data: dataDel,
				cache:false,
				success:function(resp) {
					$('#delFssPTCateory').modal('hide');
					if (resp == 'delete success') {
						pointlistLoad();
					} else {
						alert(resp);
					}

				}
			})
		});




		$('#editPointCat').click(function(){
			$('.error').hide();
			var newName = $('#editName').val();
			var newPT = $('#editPT').val();

			if (newName == '') {
				$('label#editName_error').show();
				$('input#editName').focus();
				return false;
			}

			if (newPT == '') {
				$('label#editPT_error').show();
				$('input#editPT').focus();
				return false;				
			} else {
				if (isNaN(newPT)) {
					$('label#editPT_error2').show();
					$('input#editPT').focus();
					return false;	
				}
			}

			var cat = $('#editCat').val();

			var dataUpd = {"action": "updPointList", "pointList_index": selectedID, "name": newName, "point_type": cat, "point_value": newPT, "user_id": current_userid};

			$.ajax({
				type:"POST",
				url:"bin/point_history.php",
				data: dataUpd,
				cache:false,
				success:function(resp) {
					$('#editFssPTCateory').modal('hide');
					if (resp == 'update success') {
						pointlistLoad();
					} else {
						alert(resp);
					}

				}
			})
		});


		$('#addNewCat').click(function() {
			$('#newFssPTCateory').modal('toggle');
		});

		$('#newPointCat').click(function(){
			$('.error').hide();
			var newName = $('#newName').val();
			var newPT = $('#newPT').val();

			if (newName == '') {
				$('label#newName_error').show();
				$('input#newName').focus();
				return false;
			}

			if (newPT == '') {
				$('label#newPT_error').show();
				$('input#newPT').focus();
				return false;				
			} else {
				if (isNaN(newPT)) {
					$('label#newPT_error2').show();
					$('input#newPT').focus();
					return false;	
				}
			}

			var cat = $('#newCat').val();

			var dataUpd = {"action": "addPointList", "pointList_index": selectedID, "name": newName, "point_type": cat, "point_value": newPT, "user_id": current_userid};

			$.ajax({
				type:"POST",
				url:"bin/point_history.php",
				data: dataUpd,
				cache:false,
				success:function(resp) {
					$('#newFssPTCateory').modal('hide');
					if (resp == 'add success') {
						pointlistLoad();
					} else {
						alert(resp);
					}

				}
			})
		});
});

function pointlistLoad () {
	$('.category tbody').empty();
	$.ajax({
	type:"GET",
	url:"bin/point_history.php",
	data:{"action": "getPointLists"},
	cache:false,
	dataType:"json",
	success:function(resp) {
		for (var i = 0; i != resp.length; i++) {
			if (resp[i].point_type == 'accumulate') {
				$('#addCat tbody').append("<tr><td>"+resp[i].name+"</td><td>"+resp[i].point_value+"</td><td><input type='button' class='editAddCat btn' id='"+resp[i].pointList_index+"' value='Edit'> <input type='button' class='delAddCat btn' id='"+resp[i].pointList_index+"' value='Delete'></td></tr>")
			}
			if (resp[i].point_type == 'deduct') {
				$('#redeemCat tbody').append("<tr><td>"+resp[i].name+"</td><td>"+resp[i].point_value+"</td><td><input type='button' class='editAddCat btn' id='"+resp[i].pointList_index+"' value='Edit'> <input type='button' class='delAddCat btn' id='"+resp[i].pointList_index+"' value='Delete'></td></tr>")
			}
		}
	}
})
}