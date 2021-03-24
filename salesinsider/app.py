
import os
import pandas as pd
from pandas.io.sql import PandasSQL
import pandasql as ps

# Import Flask Dependencies
from flask import (Flask, render_template, jsonify, request, url_for, 
    send_from_directory, redirect)

#import jinja2.exceptions

#Import Sqlalchemy Dependencies
import sqlalchemy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

# Import config
from config import database_url


#==================================
# Create an engine for the database
#==================================
engine = create_engine(database_url)
Base = automap_base()
Base.prepare(engine, reflect=True)

app = Flask(__name__, static_folder="static")
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
db = SQLAlchemy(app)
#migrate = Migrate(app, db)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/etl.html')
def route_etl():
    return render_template('etl.html')
    
@app.route('/what_we_did.html')
def what_we_did():
    return render_template('what_we_did.html')

@app.route('/lessons_learnt.html')
def lessons_learnt():
    return render_template('lessons_learnt.html')

@app.route('/visualizations.html')
def get_visuals():
    return render_template('visualizations.html')


@app.route('/api/predicted_table')
def predictions():

    sel = pd.read_sql_table('predicted_table', database_url)
    sel = sel.drop(sel.columns[0], axis=1)

    sel['Date'] = sel['Date'].dt.strftime('%Y-%m-%d')
    sel = sel.apply(pd.to_numeric, errors='ignore')

    return sel.to_json()

@app.route('/static/images/plots')
def get_plots():
    return send_from_directory(app.static_folder, request.path[1:])


@app.route("/api/noDate")
def get_noDate_sum():
    sel = pd.read_sql_table('predicted_table', database_url)
    sel = sel.drop(sel.columns[0], axis=1)
    
    # Fill the NaN's
    calc_df = sel.fillna(0)
    noDate_df = calc_df.drop('Date',1)

    noDate_sum_df = noDate_df.sum()
    return noDate_sum_df.to_json()

# @app.route('/<pagename>')
# def admin(pagename):
#     return render_template(pagename+'.html')


# @app.route('/<path:resource>')
# def serveStaticResource(resource):
# 	return send_from_directory('static/', resource)


# @app.route('/test')
# def test():
#     return '<strong>Its Live</strong>'


# @app.errorhandler(jinja2.exceptions.TemplateNotFound)
# def template_not_found(e):
#     return not_found(e)


# @app.errorhandler(404)
# def not_found(e):
#     return '<strong>Page Not Found!</strong>', 404
    
if __name__ == "__main__":
    app.run()

