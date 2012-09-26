$(function() {
	row = 1;
	$('#test').on("click", ".addRow", function() {
		row++;
		$('#test tbody tr:last').after('<tr><td> <input type="text" class="name" id="name'+row+'"><td> <input type="text" class="phone" id="phone'+row+'"><td> <input type="text" class="address" id="address'+row+'"><td> <button class="addRow">Add new row</button></tr>');
	});


	$('#addAllToDB').click(function() {
		var rowMaster = {"rowTable":[]};;

		for (i=0;i!=row ;i++ )
		{
			var idnum = i + 1;
			var nameId = '#name'+idnum;
			var phoneId = '#phone'+idnum;
			var addressId = '#address'+ idnum;
			
			var nameVal = $(nameId).val();
			var phoneVal = $(phoneId).val();
			var addressVal = $(addressId).val();

			var list = {"name": nameVal, "phoneNo": phoneVal, "address" : addressVal};

			rowMaster.rowTable.push(list);
			
		}

		$.ajax({
			type:"POST",
			url:"bin/experimental.php",
			data: rowMaster,
			success:function(resp) {
				alert(resp);

			}


		});

	});



});