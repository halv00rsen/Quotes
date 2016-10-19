
var Buttons = require("./components/ping_button.js");
var Quotes = require("./components/quotes.js");
var AddQuote = require("./components/add_quote.js");
var React = require("react");

var PingButton = Buttons.Buttons;

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<PingButton />
				<AddQuote />
				<Quotes />
			</div>
		);
	}
});
