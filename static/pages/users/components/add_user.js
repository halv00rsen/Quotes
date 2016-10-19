
var React = require("react");
var $ = require("jquery");

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<form>
					<input type="text" name="username" />
					<input type="password" name="password" />
					<input type="checkbox" name="admin" />
					<input type="submit" name="submit" />
				</form>
			</div>
		);
	}
});
