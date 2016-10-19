
var $ = require('jquery');
var React = require("react");
var ReactDOM = require("react-dom");
var isPinging = require("./ping_button.js").isPinging

function delButtonJquery(id) {
  var button = $('<button class="delete-btn" id=' + id + '>Slett</button>');
  
  // handle click event
  $(button).on('click', function(event) {
    event.preventDefault();
    $.ajax({
		type: "POST",
		url: "/delete_quote",
		data: JSON.stringify({id: event.target.id}),
		contentType: "application/json;charset=UTF-8",
		success: function(result) {
			console.log(result);
		}
	});
  });

  return button;
}

// http://tech.oyster.com/using-react-and-jquery-together/
// Hvordan koble jQuery og react sammen i en
var Quotes = React.createClass({
	getInitialState: function() {
		console.log("Loading quotes.");
		var self = this;
		this.loadData();
		setInterval(function() {
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
						self.loadData();
					}
				},
				error: function(error) {
					// console.log(error);
					console.log("Lost connection with remote server.");
				}
			});
		}, 2000);
		return {
			quotes: [],
			admin: false
		}
	},
	loadData: function() {
		var self = this;
		$.ajax({
			url: "/api/quotes",
			type: "GET",
			success: function(response) {
				// console.log("YAY! RESPONSE!");
				// console.log(response);
				console.log("Quotes loaded.");
				self.setState({
					quotes: response.quotes,
					admin: response.admin
				});
				// return response;
			},
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
		// setInterval(this.loadData, 10000);
		// var self = this;
		// setInterval(function() {
		// 	console.log("Data blir nå lastet " + counter);
		// 	counter++;
		// 	self.loadData();
		// }, 10000);
		var admin = this.state.admin;
		return (
			<div>
				<button type="button" onClick={this.loadData}>Last sitater</button> 
				<table>
					<tbody>
						{
							// console.log("Load data kis.");
							this.state.quotes.map(function(item) {
								// console.log(item);
								// console.log("HEISANN");
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
	componentDidMount: function() {
		if (this.props.admin) {
    		this.renderDeleteButton();
		}
  	},
  	componentDidUpdate: function() {
  		if (this.props.admin) {
    		this.renderDeleteButton();
  		}
  	},
	render: function() {
		var item = this.props.item;
		// console.log(item);
		return (
			<tr>
				<td>{item.quote}</td>
				<td>{item.date}</td>
				<td>
					<span className="button-container" ref="buttonContainer"></span>
				</td>
			</tr>
		);
	},
	renderDeleteButton: function() {
		$(this.refs.buttonContainer).html(delButtonJquery(this.props.item.id));
	}
});


var DeleteButton = React.createClass({
	render: function() {
		if (this.props.admin) {

			return (<button id={this.props.id} className="delete-btn">Slett</button>);
		}
		else {
			return null;
		}
	}
});


var List = React.createClass({
	render: function() {
		var admin = this.props.admin;
		return (
			<tbody>
				{
					this.props.quotes.map(function(item) {
						return <tr key={item.id}>
							<td>{item.quote}</td>
							<td>{item.date}</td>
							<td>
								<span className="button-container" ref="buttonContainer"></span>
							</td>
							<td><DeleteButton admin={admin} id={item.id} /></td>
						</tr>
					})
				}
			</tbody>
		);
	}
});

module.exports = Quotes;
