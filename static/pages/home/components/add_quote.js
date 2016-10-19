
var React = require("react");
var $ = require("jquery");

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<form>
					<input type="text" name="quote" tabIndex="1" id="save-quote-name"/>
					<input type="submit" name="Lagre" id="save-quote" value="Lagre" />
				</form>
			</div>
		);
	}
});

$(function() {
	$("#save-quote").click(function(e) {
		e.preventDefault();
		$.ajax({
			type: "POST",
			url: "/add_quote",
			data: JSON.stringify({
				quote: $("#save-quote-name").val()
			}),
			contentType: "application/json;charset=UTF-8",
			success: function(result) {
				if (result.success) {
					$("#save-quote-name").val("");
					console.log("The quote was saved.");
				} else {
					console.log(result.error);
				}
			},
			error: function(error) {
				console.log(error);
			}
		});
	});
});
