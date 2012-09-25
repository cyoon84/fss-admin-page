$(function() {
	if (typeof $.session.get('session_id') === 'undefined')
	{
		$('#plzlogin').modal('toggle');
	} 

	$('#goToLogin').click(function() {
		$(document.location = 'login.html');

	});

	$('#logout').click(function() {
		$('#logoutWindow').modal('toggle');
	});

	$('#goToLogout').click(function() {
		$.session.delete('session_id');
		$(document.location = 'login.html');
	});
});