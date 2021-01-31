# -*- coding: utf-8 -*-
import sys, time
import os
import datetime
import logging
import configparser

from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from cassandra.policies import RoundRobinPolicy

from cassandra.cqlengine import columns
from cassandra.cqlengine.columns import *
from cassandra.cqlengine.models import Model
from cassandra.cqlengine.usertype import UserType

import mysql.connector


def create_connection_to_mysql():
	mydb = mysql.connector.connect(host="localhost", user="blade", password="password", database="smat")
	return mydb


def log(file_name):
	#Create and configure logger                                                   
	logging.basicConfig(filename=file_name+".log", format='INFO %(asctime)s %(message)s', filemode='a')
	#Creating an object                                                            
	logger=logging.getLogger()                                                     
	#Setting the threshold of logger to DEBUG                                      
	logger.setLevel(logging.INFO) 
	logger.info("Started")
	return logger


def create_connection():
	# set up connection to cluster to ..............................................................3
	username='subroottest'
	password='subroottest'
	ip_list=['172.16.117.201', '172.16.117.204', '172.16.117.152']
	port=9042
	# #
	auth_provider = PlainTextAuthProvider(username, password)
	cluster = Cluster(ip_list, port, auth_provider=auth_provider, load_balancing_policy=RoundRobinPolicy())
	session = cluster.connect()
	session.default_timeout = 60
	return session


def create_keyspace(keyspace_name, session):
	session.execute("CREATE KEYSPACE "+keyspace_name+" WITH replication = {'class': 'NetworkTopologyStrategy', 'dc_osint_test': '2'}  AND durable_writes = true")
	# for checking is keyspace ready??
	# time.sleep(5)
	session.set_keyspace(keyspace_name)
	session.default_timeout = 60
    

def create_tables(session):
	tweet_place_dict = '''CREATE TYPE tweet_place_dict (
		id text,
		url text,
		place_type text,
		name text,
		full_name text,
		country_code text,
		country text,
		bounding_box list<frozen<list<double>>>
	)'''
	location_token_co_occur = '''CREATE TABLE location_token_co_occur (
		created_date date,
		class int,
		created_time text,
		country text,
		state text,
		city text,
		tweet_cl_latitude double,
		tweet_cl_longitude double,
		token_name text,
		category_class_list list<int>,
		count_list list<int>,
		tweetidlist list<frozen<list<text>>>,
		PRIMARY KEY (created_date, class, created_time, country, state, city, tweet_cl_latitude, tweet_cl_longitude, token_name)
	) WITH CLUSTERING ORDER BY (class DESC, created_time DESC, country ASC, state ASC, city ASC, tweet_cl_latitude ASC, tweet_cl_longitude ASC, token_name ASC)'''
	location_token_co_occur_hour_wise = '''CREATE TABLE location_token_co_occur_hour_wise (
		created_date date,
		class int,
		created_time text,
		country text,
		state text,
		city text,
		tweet_cl_latitude double,
		tweet_cl_longitude double,
		token_name text,
		category_class_list list<int>,
		count_list list<int>,
		tweetidlist list<frozen<list<text>>>,
		PRIMARY KEY (created_date, class, created_time, country, state, city, tweet_cl_latitude, tweet_cl_longitude, token_name)
	) WITH CLUSTERING ORDER BY (class DESC, created_time DESC, country ASC, state ASC, city ASC, tweet_cl_latitude ASC, tweet_cl_longitude ASC, token_name ASC)'''
	location_token_co_occur_day_wise = '''CREATE TABLE location_token_co_occur_day_wise (
		created_date date,
		class int,
		country text,
		state text,
		city text,
		tweet_cl_latitude double,
		tweet_cl_longitude double,
		token_name text,
		category_class_list list<int>,
		count_list list<int>,
		tweetidlist list<frozen<list<text>>>,
		PRIMARY KEY (created_date, class, country, state, city, tweet_cl_latitude, tweet_cl_longitude, token_name)
	) WITH CLUSTERING ORDER BY (class DESC, country ASC, state ASC, city ASC, tweet_cl_latitude ASC, tweet_cl_longitude ASC, token_name ASC)'''
	token_co_occur = '''CREATE TABLE token_co_occur (
		created_date date,
		class int,
		created_time text,
		token_name1 text,
		token_name2 text,
		category_class_list list<int>,
		count_list list<int>,
		tweetidlist list<frozen<list<text>>>,
		PRIMARY KEY (created_date, class, created_time, token_name1, token_name2)
	) WITH CLUSTERING ORDER BY (class DESC, created_time DESC, token_name1 DESC, token_name2 DESC)'''
	token_co_occur_hour_wise = '''CREATE TABLE token_co_occur_hour_wise (
		created_date date,
		class int,
		created_time text,
		token_name1 text,
		token_name2 text,
		category_class_list list<int>,
		count_list list<int>,
		tweetidlist list<frozen<list<text>>>,
		PRIMARY KEY (created_date, class, created_time, token_name1, token_name2)
	) WITH CLUSTERING ORDER BY (class DESC, created_time DESC, token_name1 DESC, token_name2 DESC)'''
	token_co_occur_day_wise = '''CREATE TABLE token_co_occur_day_wise (
		created_date date,
		class int,
		token_name1 text,
		token_name2 text,
		category_class_list list<int>,
		count_list list<int>,
		tweetidlist list<frozen<list<text>>>,
		PRIMARY KEY (created_date, class, token_name1, token_name2)
	) WITH CLUSTERING ORDER BY (class DESC, token_name1 DESC, token_name2 DESC)'''
	token_count = '''CREATE TABLE token_count (
		created_date date,
		class int,
		created_time text,
		token_name text,
		category_class_list list<int>,
		count_list list<int>,
		tweetidlist list<frozen<list<text>>>,
		PRIMARY KEY (created_date, class, created_time, token_name)
	) WITH CLUSTERING ORDER BY (class DESC, created_time DESC, token_name DESC)'''
	token_count_hour_wise = '''CREATE TABLE token_count_hour_wise (
		created_date date,
		class int,
		created_time text,
		token_name text,
		category_class_list list<int>,
		count_list list<int>,
		tweetidlist list<frozen<list<text>>>,
		PRIMARY KEY (created_date, class, created_time, token_name)
	) WITH CLUSTERING ORDER BY (class DESC, created_time DESC, token_name DESC)'''
	token_count_day_wise = '''CREATE TABLE token_count_day_wise (
		created_date date,
		class int,
		token_name text,
		category_class_list list<int>,
		count_list list<int>,
		tweetidlist list<frozen<list<text>>>,
		PRIMARY KEY (created_date, class, token_name)
	) WITH CLUSTERING ORDER BY (class DESC, token_name DESC)'''



	session.execute(tweet_place_dict)
	# time.sleep(1)
	session.execute(location_token_co_occur)
	session.execute(location_token_co_occur_hour_wise)
	session.execute(location_token_co_occur_day_wise)
	session.execute(token_co_occur)
	session.execute(token_co_occur_hour_wise)
	session.execute(token_co_occur_day_wise)
	session.execute(token_count)
	session.execute(token_count_hour_wise)
	session.execute(token_count_day_wise)
	


def update_status_to_mysql(keyspace_name):
	mydb = create_connection_to_mysql()
	mycursor = mydb.cursor()
	sql = "UPDATE projects SET status = 1 WHERE project_name = '"+keyspace_name+"'"
	mycursor.execute(sql)
	mydb.commit()
	# logger.info(mycursor.rowcount, "record(s) affected")





# get input date from which we should start
def main():
	session = create_connection()
	keyspace_name = sys.argv[1]
	create_keyspace(keyspace_name, session)
	# time.sleep(5)
	create_tables(session)
	# update_status_to_mysql(keyspace_name)


if __name__ == '__main__':
	# logger = log("create")
	main()