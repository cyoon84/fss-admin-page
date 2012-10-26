	function initializeDateSelector(id_day, id_month) {
		var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");

		$(id_month).append('<option value=0>-----------------</option>');
		$(id_day).append('<option value=0>-----------</option>');

		for (i=0; i!= months.length ; i++ )
		{
			var actualmonth = i+1;
			if (actualmonth < 10)
			{
				$(id_month).append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
			} else {
				$(id_month).append('<option value='+actualmonth+'>'+months[i]+'</option>');
			}
		}

		for (i=1; i!= 32  ; i++ )
		{
			if (i < 10)
			{
				$(id_day).append('<option>0'+i+'</option>');
			} else {
				$(id_day).append('<option>'+i+'</option>');
			}
		}
		
		return false;
	};

	function getTodayDateString(today_date_obj) {
		var today_year = today_date_obj.getFullYear();
		var today_month = today_date_obj.getMonth()+1;
		var today_day = today_date_obj.getDate();

		if (today_month < 10)
		{
			today_month = "0"+today_month; 
		}

		if (today_day < 10)
		{
			today_day = "0"+today_day;
		}
		
		var today_str = today_year + "-"+today_month+ "-"+today_day;
		

		return today_str;

	}