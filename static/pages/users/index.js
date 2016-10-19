
var React = require("react");
var AddUser = require("./components/add_user.js");
var AllUsers = require("./components/all_users.js");

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<AddUser />
				<AllUsers />
			</div>
		);
	}
});
