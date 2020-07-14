$(function () {
	$('#top-menu').click(function(){
		$('.sidebars').toggle(100);
	});
	$('#note').click(function(){
		$('#note span').toggle();
		$('#note div').toggle(100);
		$('#note div').html("<center>Loading...</center>");
		$.ajax({
			url: "/notification/",
			type: "GET",
			data:{

			},
			success: function (data) {
				$('#note div').html(data);
			},
			error: function (error_data) {
				console.log(error_data);
			}
		});
	});
	$('#close-menu').click(function(){
		$('.sidebars').hide(100);
	});
	$('#logout').click(function(){
		window.open('/accounts/logout/','_self');
	});
	$('#home').click(function(){
		window.open('/','_self');
	});
	$('#brand').click(function(){
		window.open('/','_self');
	});
});
