
$(function() {
	$(".delete-usr-btn").on("click", function(e) {
		e.preventDefault();
		$.ajax({
			type: "POST",
			url: "/delete_user",
			data: JSON.stringify({username: event.target.id}),
			contentType: "application/json;charset=UTF-8",
			success: function(result) {
				console.log(result);
			}
		});
	});
});
