
var Home = require("./pages/home/home.js");
var Users = require("./pages/users/index.js");
var React = require("react");
var ReactDOM = require("react-dom");
var ReactRouter = require("react-router");


var { Router, Route, IndexRoute, IndexLink, Link, browserHistory } = ReactRouter;

var App = React.createClass({
  render: function() {
    return (
    	<div>
    		<h1>Sitater</h1>
    		<ul role="nav">
    			<li><Link to="/app/home">Hjem</Link></li>
    			<li><Link to="/app/users">Brukere</Link></li>
          <li><a href="/logout">Logg ut</a></li>
    		</ul>

    		{this.props.children || <Home/>}

    	</div>
    );
  }
});


ReactDOM.render(
	<Router history={browserHistory}>
    	<Route path="/app" component={App}>
    		<Route path="/app/home" component={Home}/>
    		<Route path="/app/users" component={Users}/>
    	</Route>
  	</Router>,
  	document.getElementById("application")
);
