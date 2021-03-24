#!/usr/bin/env python
# coding: utf-8

# <a href="https://colab.research.google.com/github/MuratCKoc/salesinsider/blob/main/ProphetsPrediction.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>

# # Facebook's Prophets Sales Forecast

# In[1]:


# First setup the dependencies
import pandas as pd
import numpy as np
import matplotlib

# Our most important library is FB Prophet which will be using rule based learning
from fbprophet import Prophet


# In[14]:


# We then read the CSV file from GitHub
df = pd.read_csv('https://raw.githubusercontent.com/MuratCKoc/salesinsider/main/salesinsider/data/Groceries_dataset.csv')
# As the file has multiple columns, we select the columns that we will be using for the project.
data_df = df[['Date', 'itemDescription']]
data_df.head()


# In[15]:


# We then use the get dummies function to convert each of the food items into an indicator.
# What this means is that all the data is converted into a single number (1)
cat_df = pd.get_dummies(data_df["itemDescription"])
# We then concatenate the data
final_df = pd.concat([data_df,cat_df],axis=1)
# After concatenation of the data we then group all the data by the dates which gives 
# a table we can use to conduct our machine learning algorithm.
grouped_df = final_df.groupby("Date", as_index=False).sum()
grouped_df.head()


# In[16]:


list(grouped_df)


# In[18]:


# Format the data, remove ".()/ " characters and restructure the names
# When tried to move the tables into SQL we received errors, the cause of this was the certain column names have parenthesis.
# The parentheses are escape strings which cause an error, so we have to replace them.
grouped_df.columns = grouped_df.columns.str.replace("[(.)]", "")
grouped_df.columns = grouped_df.columns.str.replace("[/]", " or ")
grouped_df.columns = grouped_df.columns.str.replace("[ ]", "_")


# # Prepare data for any future use
# ### Loading the data with ' . ( ) / ' characters created plenty of problems
# 'artif. sweetener',
# 'flower (seeds)',
# 'flower soil/fertilizer',
# ### str.replace function used to transform into
# 'artif_sweetener',
# 'flower_seeds',
# 'flower_soil_or_fertilizer',

# In[ ]:


# Create master dataframe
master_df = pd.DataFrame()

for j in range(727, len(grouped_df.index)):
   # Predict thru all transactions.
  for i in range (1, len(grouped_df.columns)): 
    prophet_df = grouped_df[["Date", grouped_df.columns[i]]]
    
    # Convert the df into prophets format
    prophet_df.columns = ["ds", 'y']
    prophet_df['ds'] = pd.to_datetime(prophet_df.ds,format='%d-%m-%Y')
    
    # Fit the model by instantiate new Prophet object
    model = Prophet()
    model.fit(prophet_df)
    
    # Predictions are then made based on "ds" store it in yhat
    future = model.make_future_dataframe(periods=213)
    forecast = model.predict(future)
    predicted_df = forecast[["ds", "yhat"]]
    
    predicted_df.yhat = predicted_df.yhat.round()

    # Rename the column contains the predicted values
    predicted_ColName = grouped_df.columns[i]+"_Predicted"

    # Generate a figure (plot) displaying the forecast
    fig = model.plot(forecast, xlabel='Date', ylabel='Frequency')
    ax = fig.gca()
    ax.set_title(predicted_ColName, size=24)
    ax.set_xlabel("Date", size=18)
    ax.set_ylabel("Frequency", size=18)
    ax.tick_params(axis="x", labelsize=15)
    ax.tick_params(axis="y", labelsize=15)
    # Save the figure to re-use later on
    fig.savefig("static/images/plots/"+predicted_ColName+".png", bbox_inches='tight')

    # Rename the predicted columns as "<item name>_Predicted"
    predicted_df = predicted_df.rename( columpns={"ds": "Date", "yhat": predicted_ColName})

    #initialize container df if its the first column
    if len(master_df.index) == 0:
      master_df = predicted_df.copy()
    
    # merge the newly generated predicted Table to the right
    else:
      master_df[predicted_ColName] = predicted_df[predicted_ColName]
    
    # merge the original data column to the container 
    colName = grouped_df.columns[i]
    master_df[colName] = grouped_df[colName]

    # Break at the End Of File
    if i == len(grouped_df.columns):
      break


# In[19]:


# This table shows us a consolidated view of the table with the output of machine learning applied here.
# Notice that we have double the number of columns.
master_df.tail()


# In[8]:


# We then have to start cleaning up the table and remove all "NAN"s from the predicted columns. 
# This will make it easier for visualization purposes.
clean_df = master_df
clean_df = clean_df.replace(np.nan,"")
clean_df.dtypes


# In[9]:


# This is to check if the strings have been changed.
clean_df = clean_df.set_index('Date').apply(pd.to_numeric, errors='ignore').reset_index(drop=False)
clean_df = clean_df.fillna(0)
clean_df.head()


# In[10]:


# We then proceed to move the table to SQL
# Import SQLAlchemy Dependencies 
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from config import database_url


# In[11]:


# To update database with dataframe
def Update_Database(df_name, table_name):
    engine = create_engine(database_url, echo=False)
    session = Session(engine)
    Base = automap_base()
    Base.prepare(engine, reflect=True)    
    cxn = engine.connect()
    df_name.to_sql(name=table_name, con=engine, if_exists='append', index=True)
    print(table_name + ' added')
    #Add primary key
    #with engine.connect() as con:
    #con.execute('ALTER TABLE `predicted_table` ADD PRIMARY KEY (`Date`);')


# In[12]:


Update_Database(clean_df, "predicted_table")


# In[ ]:





