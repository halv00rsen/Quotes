
import Home from './home/home.js'

var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Quotes</h1>
        <nav>
	        <ul className="header">
	          <li>Home</li>
	          <li>Stuff</li>
	          <li>Contact</li>
	        </ul>
	    </nav>
        <div className="content">
 			{this.props.children}
        </div>
      </div>
    )
  }
});

var { Router,
      Route,
      IndexRoute,
      IndexLink,
      Link } = ReactRouter;


ReactDOM.render(
  <Router>
    <Route path="/" component={App}>
    	<Home />
    </Route>
  </Router>,
  document.getElementById("application")
);
