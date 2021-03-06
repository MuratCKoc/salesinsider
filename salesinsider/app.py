
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
#from config import database_url

database_url = 'postgres://jxjswcgzrdbbwg:478c9797d5ce92f765d973a886f93de59af3de94ed90feacd3ab8c8af8601276@ec2-3-223-72-172.compute-1.amazonaws.com:5432/d85kivepj9hj9h'


app = Flask(__name__, static_folder="static")
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
db = SQLAlchemy(app)
#migrate = Migrate(app, db)

#=================Routes=============#
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/etl')
def route_etl():
    return render_template('etl.html')
    
@app.route('/what_we_did')
def what_we_did():
    return render_template('what_we_did.html')

@app.route('/lessons_learnt')
def lessons_learnt():
    return render_template('lessons_learnt.html')

@app.route('/visualizations')
def get_visuals():
    return render_template('visualizations.html')



#==============API==================#
@app.route('/api/predicted_table')
def predictions():

    sel = pd.read_sql_table('predicted_table', database_url)
    sel = sel.drop(sel.columns[0], axis=1)

    print(sel)
    sel['Date'] = sel['Date'].dt.strftime('%Y-%m-%d')
    sel = sel.apply(pd.to_numeric, errors='ignore')
    result = sel.to_json()
    return result

@app.route('/static/images/plots')
def get_plots():
    return send_from_directory(app.static_folder, request.path[1:])


@app.route("/api/nodate")
def get_noDate_sum():
    sel = pd.read_sql_table('predicted_table', database_url)
    sel = sel.drop(sel.columns[0], axis=1)
    
    # Fill the NaN's
    calc_df = sel.fillna(0)
    noDate_df = calc_df.drop('Date',1)

    noDate_sum_df = noDate_df.sum()
    return noDate_sum_df.to_json()

if __name__ == "__main__":
    app.run()

