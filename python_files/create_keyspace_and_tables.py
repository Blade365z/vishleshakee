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
	username='cassandra'
	password='cassandra'
	ip_list=['172.16.117.201']
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
	tweet_info_by_id_test = '''CREATE TABLE tweet_info_by_id_test (
		tid text,
		datetime timestamp,
		author text,
		author_id text,
		author_profile_image text,
		author_screen_name text,
		category bigint,
		confidence double,
		hashtags list<text>,
		keyword_list list<text>,
		lang text,
		like_count bigint,
		location text,
		media_list list<frozen<map<text, text>>>,
		mention_list_id list<text>,
		mentions list<text>,
		possibly_sensitive_tweet_by_twitter boolean,
		quote_count bigint,
		quoted_source_id text,
		reply_count bigint,
		replyto_screen_name text,
		replyto_source_id text,
		replyto_user_id text,
		retweet_count bigint,
		retweet_source_id text,
		sentiment smallint,
		source_of_utility text,
		t_location text,
		timezone text,
		tl_latitude double,
		tl_longitude double,
		tweet_coordinates list<double>,
		tweet_place frozen<tweet_place_dict>,
		tweet_text text,
		type text,
		url_list list<text>,
		verified text,
		PRIMARY KEY (tid, datetime)
	) WITH CLUSTERING ORDER BY (datetime DESC)'''
	temp = '''CREATE TABLE temp (
		date date,
		hour text,
		tensec text,
		tid text,
		datetime timestamp,
		author text,
		author_id text,		
		author_screen_name text,
		category bigint,
		confidence double,
		hashtags list<text>,
		keyword_list list<text>,
		mention_list_id list<text>,
		mentions list<text>,
		sentiment smallint,
		t_location text,
		tl_latitude double,
		tl_longitude double,
		tweet_place frozen<tweet_place_dict>,
		type text,
		PRIMARY KEY (date, hour, tensec, tid)
	) WITH CLUSTERING ORDER BY (hour DESC, tensec DESC, tid DESC)'''
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
	user_record='''CREATE TABLE user_record (
		author_id text PRIMARY KEY,
		author text,
		author_screen_name text,
		created_at timestamp,
		default_profile boolean,
		default_profile_image boolean,
		description text,
		favourites_count bigint,
		followers_count bigint,
		following_count bigint,
		geo_enabled boolean,
		lang text,
		listed_count bigint,
		location text,
		lucene text,
		profile_background_color text,
		profile_background_image_url_https text,
		profile_banner_url text,
		profile_image_url_https text,
		profile_link_color text,
		profile_sidebar_fill_color text,
		profile_text_color text,
		profile_use_background_image boolean,
		protected boolean,
		time_zone text,
		tweet_count bigint,
		url text,
		utc_offset text,
		verified text
	)'''



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
	session.execute(tweet_info_by_id_test)
	session.execute(temp)
	session.execute(user_record)
	


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