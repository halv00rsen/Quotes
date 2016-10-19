
var React = require("react");
var $ = require("jquery");

module.exports = React.createClass({
	getInitialState: function() {
		return {quote: ""};
	},
	handleChange: function(e) {
		this.setState({quote: e.target.value});
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var quote = this.state.quote;
		if (!quote) {
			return;
		}
		$.ajax({
			type: "POST",
			url: "/add_quote",
			data: JSON.stringify({
				quote: quote
			}),
			contentType: "application/json;charset=UTF-8",
			success: function(result) {
				if (result.success) {
					// $("#save-quote-name").val("");
					this.props.callback.update(result.quote);
					this.setState({quote: ''});
					console.log("The quote was saved.");
				} else {
					console.log(result.error);
				}
			}.bind(this),
			error: function(error) {
				console.log(error);
			}
		});
	},
	render: function() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<input 
						type="text" 
						tabIndex="1"
						placeholder="Sitat..."
						value={this.state.quote}
						onChange={this.handleChange}
						/>
					<input 
						type="submit" 
						value="Lagre"
						 />
				</form>
			</div>
		);
	}
});
