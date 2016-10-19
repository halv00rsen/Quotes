
var React = require("react");
var $ = require("jquery");

module.exports = React.createClass({
	getInitialState: function() {
		var self = this;
		this.loadUsers();
		return {
			users: []
		}
	},

	loadUsers: function() {
		var self = this;
		$.ajax({
			url: "/api/all_users",
			type: "GET",
			success: function(res) {
				console.log("Loading users.");
				// console.log(res);
				if (res.success) {
					self.setState({
						users: res.users
					});
				} else {
					console.log(res.message);
				}
			},
			error: function(error) {
				console.log("Lost connection with server.");
				return {};
			}
		});
	},

	render: function() {
		return (
			<div>
				<button type="button" onClick={this.loadUsers}>Last brukere på nytt</button>
				<table>
					<thead>
						<tr>
							<th>Brukernavn</th>
							<th>Administrator</th>
						</tr>
					</thead>
					<tbody>
						{
							this.state.users.map(function(item) {
								return (<User key={item.username} user={item} />);
							})
						}
					</tbody>
				</table>
			</div>
		);
	}
});


var User = React.createClass({
	render: function() {
		var user = this.props.user;
		return (
			<tr>
				<td>{user.username}</td>
				<td>{(user.admin?"Ja":"Nei")}</td>
			</tr>
		);
	}
});
