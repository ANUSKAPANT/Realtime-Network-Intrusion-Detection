$(function (e) {
	$(".dash-alt").click(function (e) {
		$(".main-dash").attr("class","nav-item main-dash");
		$(".dash-alt").attr("class","nav-item active dash-alt");
		$(".content").html("<div><center>Loading...</center></div><br><br>");
		$.ajax({
			url: '/netview/',
			success: function(data){
				$(".content").html(data);
			},
			error: function (error_data) {
				console.log(error_data);
			}
		});
	});
});