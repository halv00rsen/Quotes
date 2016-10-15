import flask, sqlite3, hashlib, time, re
from functools import wraps
from contextlib import closing
from uuid import uuid4

app = flask.Flask(__name__, static_url_path='/static')
app.config.from_pyfile("config.py")
session = flask.session


@app.errorhandler(404)
def page_not_found(e):
    return flask.render_template('errors/404.html'), 404


def logged_in(f):
	@wraps(f)
	def is_logged_in(*args, **kwargs):
		if "user" in session:
			return f(*args, **kwargs)
		return flask.render_template("login/login.html")
	return is_logged_in


def is_admin(f):
	@wraps(f)
	def is_admin_logged_in(*args, **kwargs):
		if "admin" in session and session["admin"]:
			return f(*args, **kwargs)
		return redirect("home")
	return is_admin_logged_in


@app.route("/")
def main():
	if is_logged_in():
		return redirect("home")
	return flask.redirect(flask.url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
	if flask.request.method == "POST":
		req = flask.request
		if "username" in req.form and "password" in req.form:
			username = req.form["username"]
			password = req.form["password"]
			cur = flask.g.db.execute("select password, admin from User where username = ?", [username]).fetchall()
			if cur and cur[0][0] == hash_password(password):
				session["user"] = {"username": req.form["username"]}
				session["logged_in"] = True
				session["admin"] = cur[0][1]
				return flask.redirect(flask.url_for("home"))

	return flask.render_template("login/login.html")


@app.route("/add_user", methods=["POST", "GET"])
@is_admin
def add_new_user():
	if flask.request.method == "GET":
		return flask.render_template("user/new_user.html")
	form = flask.request.form
	error = ""
	success = ""
	if "username" in form and "password" in form and len(form["username"]) > 4 and len(form["password"]) > 4:
		username = form["username"]
		password = form["password"]
		if not re.match("^[A-Za-z0-9_-]*$", username) or not re.match("^[A-Za-z0-9_-]*$", password):
			error = "Ulovlige tegn i brukernavn eller passord."
		else:
			flask.g.db.execute("insert into User(username, password, admin) values (?,?,?)", [username, hash_password(password), form.get("admin") is not None])
			flask.g.db.commit()
			success = "Brukeren {} ble lagt til!".format(username)
	else:
		error = "Brukernavn og/eller passord er for korte."
	if error:
		return flask.render_template("user/new_user.html", error=error)
	return redirect("home")



@app.route("/add_quote", methods=["POST"])
@logged_in
def add_quote():
	req = flask.request
	error = None
	if "quote" in req.form:
		quote = req.form["quote"]
		 # INSERT INTO people (first_name, last_name) VALUES ("John", "Smith")
		flask.g.db.execute("insert into Quote(create_by, quote, date, id) values (?,?,?,?)", [session["user"]["username"], quote.strip(), int(time.time()), str(uuid4())])
		flask.g.db.commit()
	else:
		error = "Wrong input fields in form."
	return redirect("home")


@app.route("/delete_all")
@is_admin
def delete_all_quotes():
	flask.g.db.execute("delete from Quote")
	flask.g.db.commit()
	return redirect("home")


@app.route("/delete_quote", methods=["POST"])
@is_admin
def delete_one_quote():
	if "quote_id" in flask.request.form:
		try:
			quote_id = flask.request.form["quote_id"]
			flask.g.db.execute("delete from Quote where id = ?", [quote_id])
			flask.g.db.commit()
		except ValueError as e:
			pass
	return redirect("home")


@app.route("/home")
@logged_in
def home():
	return flask.render_template("home/home.html")


@app.route("/logout")
@logged_in
def logout():
	session.pop("user", None)
	session.pop("logged_in", None)
	session.pop("admin", None)
	return redirect("login")

@app.route("/api/v1.0/quotes", methods=["GET"])
def get_quotes_api():
	form = flask.request.args
	if "start" in form and "end" in form:
		start = form["start"]
		end = form["end"]
		try:
			start = int(start)
			end = int(end)
			if start > end:
				end = start
			quotes = get_all_quotes()["quotes"]
			
			if len(quotes) > end:
				return flask.jsonify(quotes[start:end])
		except Exception:
			pass
	return flask.jsonify(get_all_quotes()["quotes"])


@app.context_processor
def get_all_quotes():
	return dict(quotes=[dict(quote=i[1], date=time.asctime(time.localtime(i[2])), create_by=i[0], id=i[3]) for i in flask.g.db.execute("select create_by, quote, date, id from Quote order by date desc").fetchall()])

# @app.context_processor
# def utility_processor():
#     def format_price(amount, currency=u'€'):
#         return u'{0:.2f}{1}'.format(amount, currency)
#     return dict(format_price=format_price)

def redirect(url):
	return flask.redirect(flask.url_for(url))


def is_logged_in():
	if "user" in session:
		return True
	return False


def hash_password(password):
	return hashlib.sha224(str(password).encode("ascii")).hexdigest()


def connect_db():
	return sqlite3.connect(app.config["DATABASE"])


def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()


@app.before_request
def before_request():
	flask.g.db = connect_db()


@app.teardown_request
def teardown_request(exception):
	db = getattr(flask.g, "db", None)
	if db is not None:
		db.close()


if __name__ == "__main__":
	app.run(debug=True)
