$(function() {
	if (typeof $.session.get('session_id') === 'undefined')
	{
		alert("please log in first");
		
		$(document.location = 'login.html');

	} 
});