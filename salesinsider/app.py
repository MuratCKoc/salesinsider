
import os
# Import Flask Dependencies
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect
)


from flask import Flask, url_for, render_template, send_from_directory
import jinja2.exceptions
# Import Sqlalchemy Dependencies
# import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine

# Import config
#from config import database_url

#===========
# Create an engine for the database
#============
# engine = create_engine(database_url)
# Base = automap_base()
# Base.prepare(engine, reflect=True)

app = Flask(__name__)


# Renders
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/<pagename>')
def admin(pagename):
    return render_template(pagename+'.html')


@app.route('/<path:resource>')
def serveStaticResource(resource):
	return send_from_directory('static/', resource)


@app.route('/test')
def test():
    return '<strong>It\'s Alive!</strong>'


@app.errorhandler(jinja2.exceptions.TemplateNotFound)
def template_not_found(e):
    return not_found(e)


@app.errorhandler(404)
def not_found(e):
    return '<strong>Page Not Found!</strong>', 404
    
if __name__ == "__main__":
    app.run()

