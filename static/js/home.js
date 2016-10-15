$(function() {
	console.log("første");
	$("#my-btn").click(function() {
		$.ajax({
			url: "/api/v1.0/quotes",
			type: "GET",
			success: function(response) {
				console.log(response)
			},
			error: function(error) {
				console.log(error);
			}
		});
	});
});
