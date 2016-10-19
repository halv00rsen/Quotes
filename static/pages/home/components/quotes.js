
var $ = require('jquery');
var React = require("react");
var ReactDOM = require("react-dom");
var isPinging = require("./ping_button.js").isPinging


// http://tech.oyster.com/using-react-and-jquery-together/
// Hvordan koble jQuery og react sammen i en
var Quotes = React.createClass({
	pingFunction: function() {
		// console.log("Starting interval kis.");
		if (!isPinging())
			return;
		$.ajax({
			type: "POST",
			url: "/ping",
			// contentType: "application/json;charset=UTF-8",
			success: function(result) {
				if (result.update) {
					console.log("Will update view.");
					this.loadData();
				}
			}.bind(this),
			error: function(error) {
				// console.log(error);
				console.log("Lost connection with remote server.");
			}
		});
	},

	componentDidMount: function() {
		console.log("Mounting interval, starting ping.");
	    this.loadInterval = setInterval(this.pingFunction, 2000);
	    this.props.callback.update = function(e) {
	    	if (!this.loadInterval) {
	    		return;
	    	}
	    	var newQuotes = [e].concat(this.state.quotes);
	    	this.setState({
	    		quotes: newQuotes
	    	})
	    }.bind(this);
	},

	componentWillUnmount: function() {
		console.log("Unmounting quotes. Stop pinging.");
	    this.loadInterval && clearInterval(this.loadInterval);
	    this.loadInterval = false;
	},

	getInitialState: function() {
		console.log("Loading quotes.");
		this.loadData();
		return {
			quotes: [],
			admin: false
		}
	},

	loadData: function() {
		$.ajax({
			url: "/api/quotes",
			type: "GET",
			success: function(response) {
				if (!this.loadInterval) {
					console.log("No mount here, so no new qotes.");
					return;
				}

				console.log("Quotes loaded.");
				this.setState({
					quotes: response.quotes,
					admin: response.admin
				});
				// return response;
			}.bind(this),
			error: function(error) {
				console.log("AAAH, error kis.");
				return {
					quotes: [],
					admin: false
				}
			}
		});
	},
	render: function() {
		var admin = this.state.admin;
		return (
			<div>
				<button type="button" onClick={this.loadData}>Last sitater</button> 
				<table>
					<tbody>
						{
							this.state.quotes.map(function(item) {
								return (
									<Row key={item.id} admin={admin} item={item} />
								);
							})
						}
					</tbody>
				</table>
			</div>
		);
	}
});


var Row = React.createClass({
	getInitialState: function() {
		return {show: true};
	},

	hideRow: function() {
		this.setState({show: false});
	},

	render: function() {
		var item = this.props.item;

		if (!this.state.show) {
			return null;
		}

		return (
			<tr>
				<td>{item.quote}</td>
				<td>{item.date}</td>
				<td>
					<DeleteButton id={this.props.item.id} admin={this.props.admin} deleteRow={this.hideRow}/>
				</td>
			</tr>
		);
	}
});


var DeleteButton = React.createClass({
	deleteQuote: function() {
		$.ajax({
			type: "POST",
			url: "/delete_quote",
			data: JSON.stringify({id: this.props.id}),
			contentType: "application/json;charset=UTF-8",
			success: function(result) {
				if (result.success) {
					this.props.deleteRow();
				}
				if (result.message) {
					console.log(result.message);
				}
			}.bind(this)
		});
	},

	render: function() {
		if (this.props.admin) {
			return (<button onClick={this.deleteQuote}>Slett</button>);
		}
		else {
			return null;
		}
	}
});

module.exports = Quotes;
