
var Buttons = require("./components/ping_button.js");
var Quotes = require("./components/quotes.js");
var AddQuote = require("./components/add_quote.js");
var React = require("react");

var PingButton = Buttons.Buttons;

module.exports = React.createClass({
	render: function() {

		// This is very hackish. Sends the object to addQuote so it will call update()
		// Changes the update() reference in Quotes.
		var updateObject = {
			update: function(e) {
				console.log("This should not show kis.");
			}
		}
		return (
			<div>
				<PingButton />
				<AddQuote callback={updateObject}/>
				<Quotes callback={updateObject}/>
			</div>
		);
	}
});
