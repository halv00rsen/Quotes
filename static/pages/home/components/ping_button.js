
var React = require("react");
var $ = require("jquery");

var pinging = true;

module.exports.isPinging = function() {
	return pinging;
}

module.exports.Buttons = React.createClass({
	getInitialState: function() {
		return {
			pingBtn: (pinging)? "Stopp ping": "Start ping"
		}
	},

	ping: function() {
		$.ajax({
			type: "POST",
			url: "/ping",
			// contentType: "application/json;charset=UTF-8",
			success: function(result) {
				console.log(result);
			}
		});
	},

	togglePing: function() {
		pinging = !pinging;
		if (pinging) {
			console.log("Turning on pinging.");
			this.setState({
				pingBtn: "Stopp ping"
			});
		}
		else {
			console.log("Turning off pinging.");
			this.setState({
				pingBtn: "Start ping"
			});
		}
	},

	render: function() {
		return (
			<div>
				<button id="pingbtn" onClick={this.ping}>Ping</button>
				<button id="stopPing" onClick={this.togglePing}>{this.state.pingBtn}</button>
			</div>
		);
	}
});
