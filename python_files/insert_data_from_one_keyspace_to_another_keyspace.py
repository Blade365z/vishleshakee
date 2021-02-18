# -*- coding: utf-8 -*-
import sys, time
import os
import datetime
import logging
import configparser
import request

from cassandra.cluster import Cluster
from cassandra import ConsistencyLevel
from cassandra.auth import PlainTextAuthProvider
from cassandra.policies import LoadBalancingPolicy
from cassandra.policies import RoundRobinPolicy
from cassandra.query import UNSET_VALUE

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
	logger.info("Started Log")
	return logger


def create_connection(username,password,ip_list):
	# set up connection to cluster to ..............................................................
	port=9042
	auth_provider = PlainTextAuthProvider(username, password)
	cluster = Cluster(ip_list, port, auth_provider=auth_provider, load_balancing_policy=RoundRobinPolicy())
	session = cluster.connect()
	return session


def get_traceback_info_of_exception(e, user_defined_err_no):
	exc_type, exc_value, exc_traceback = sys.exc_info()
	logger.info ("*** exc_traceback.tb_lineno:  " + str(exc_traceback.tb_lineno)) ## give the line no. where exception occur
	logger.info(str(user_defined_err_no)+" " + str(e))



# execute insert statements
def insertToNewKS(sessionNewKS, table_name, prepared_stmt, row):
	if(table_name == "tweet_info_by_id_test"):
		try:
			bound = prepared_stmt.bind((row.tid, row.datetime, row.author, row.author_id, row.author_profile_image, row.author_screen_name, row.category, row.confidence, row.hashtags, row.keyword_list, row.lang, row.like_count, row.location, row.media_list, row.mention_list_id, row.mentions, row.possibly_sensitive_tweet_by_twitter, row.quote_count, row.quoted_source_id, row.reply_count, row.replyto_screen_name, row.replyto_source_id, row.replyto_user_id, row.retweet_count, row.retweet_source_id, row.sentiment, row.source_of_utility, row.t_location, row.timezone, row.tl_latitude, row.tl_longitude, row.tweet_coordinates, row.tweet_place, row.tweet_text, row.type, row.url_list, row.verified))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("111111")
			# print(row)
			# print(e)
	elif(table_name == "temp"):
		try:		
			bound = prepared_stmt.bind((row.date, row.hour, row.tensec, row.tid, row.author, row.author_id, row.author_screen_name, row.category, row.confidence, row.datetime, row.hashtags, row.keyword_list, row.mention_list_id, row.mentions, row.sentiment, row.t_location, row.tl_latitude, row.tl_longitude, row.tweet_place, row.type))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("222222")
			# print(row)
			# print(e)
	elif(table_name == "user_record"):
		try:		
			bound = prepared_stmt.bind((row.author_id, row.author, row.author_screen_name, row.created_at, row.default_profile, row.default_profile_image, row.description, row.favourites_count, row.followers_count, row.following_count, row.geo_enabled, row.lang, row.listed_count, row.location, row.profile_background_color, row.profile_background_image_url_https, row.profile_banner_url, row.profile_image_url_https, row.profile_link_color, row.profile_sidebar_fill_color, row.profile_text_color, row.profile_use_background_image, row.protected, row.time_zone, row.tweet_count, row.url, row.utc_offset, row.verified))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("222222")
			# print(row)
			# print(e)
	







# prepared statement for inserting to tables
def prepareTable(option, sessionNewKS):
	if(option == "tweet_info_by_id_test"):
		query = 'INSERT INTO tweet_info_by_id_test (tid , datetime , author , author_id, author_profile_image, author_screen_name, category, confidence, hashtags, keyword_list, lang, like_count, location, media_list, mention_list_id, mentions, possibly_sensitive_tweet_by_twitter, quote_count, quoted_source_id, reply_count , replyto_screen_name, replyto_source_id, replyto_user_id, retweet_count , retweet_source_id, sentiment, source_of_utility, t_location, timezone, tl_latitude, tl_longitude, tweet_coordinates, tweet_place, tweet_text, type, url_list, verified) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
	elif(option == "temp"):
		query = 'INSERT INTO temp (date, hour, tensec, tid, author, author_id, author_screen_name, category, confidence, datetime, hashtags, keyword_list, mention_list_id, mentions, sentiment, t_location, tl_latitude, tl_longitude, tweet_place, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'  
	elif(option == "user_record"):
		query = 'INSERT INTO user_record (author_id, author, author_screen_name, created_at, default_profile, default_profile_image, description, favourites_count, followers_count, following_count, geo_enabled, lang, listed_count, location, profile_background_color, profile_background_image_url_https, profile_banner_url, profile_image_url_https, profile_link_color, profile_sidebar_fill_color, profile_text_color, profile_use_background_image, protected, time_zone, tweet_count, url, utc_offset, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
	prepared_stmt = sessionNewKS.prepare(query)
	prepared_stmt.consistency_level = ConsistencyLevel.ONE 

	return prepared_stmt






def insert_to_table(sessionGlobalKS, sessionNewKS, query_stmt, prepared_stmt, id):	
	stmt = sessionGlobalKS.prepare(query_stmt)
	option = [id]
	rows = sessionGlobalKS.execute(stmt, option)
	
	if(rows):			
		for row in rows:
			insertToNewKS(sessionNewKS, table_name, prepared_stmt, row)
		return 1
	else:
		return 0






def insertion_to_tables(sessionGlobalKS, sessionNewKS, tweet_id_list):	
	tweet_info_by_test = 'tweet_info_by_test'
	user_record = 'user_record'
	temp_table = 'temp'

	# doing
	prepared_insertion_stmt_tweet_info_by_test = prepareTable(tweet_info_by_test, sessionNewKS)	
	# prepared_insertion_stmt_user_record = prepareTable(user_record, sessionNewKS)	
	# prepared_insertion_stmt_temp_table = prepareTable(temp_table, sessionNewKS)	


	select_query_stmt_tweet_info_by_id_test = "select * from tweet_info_by_id_test where tid=?"
	# select_query_stmt_user_record = "select * from user_record where author_id=?"

	

	for tweet_id in tweet_id_list:
		insert_to_table(sessionGlobalKS, sessionNewKS, select_query_stmt_tweet_info_by_id_test, prepared_insertion_stmt_tweet_info_by_test, tweet_id)




def fetchFromGlobalKS(sessionGlobalKS, sessionNewKS, keyspace_name, tweet_id_list):
	sessionGlobalKS.set_keyspace(keyspace_name)	
	## for tweet_info_by_id_test, user_record, temp...........................................................BEGIN
	insertion_to_tables(sessionGlobalKS, sessionNewKS, tweet_id_list)
	## for tweet_info_by_id_test, user_record, temp...........................................................END


		
def get_project_id_by_project_name_mysql(project_name):
	mydb = create_connection_to_mysql()
	mycursor = mydb.cursor()
	sql = "SELECT project_id FROM projects WHERE  project_name = '"+ project_name +"'"
	mycursor.execute(sql)
	myresult = mycursor.fetchone()
	project_id = myresult[0]
	return project_id



def update_status_to_project_table_mysql(keyspace_name, status):
	mydb = create_connection_to_mysql()
	mycursor = mydb.cursor()
	sql = "UPDATE projects SET status = "+ str(status) +" WHERE project_name = '"+keyspace_name+"'"
	mycursor.execute(sql)
	mydb.commit()
	# logger.info(mycursor.rowcount, "record(s) affected")



def check_status_of_spark_job(spark_id):
	# doing




# get input date from which we should start
def main():		
	sessionNewKS = create_connection('cassandra', 'cassandra', ['172.16.117.201'])
	sessionGlobalKS = create_connection('cassandra', 'cassandra', ['172.16.117.201'])
	# take arguments
	global_keyspace_name = "processed_keyspace"
	new_keyspace_name = sys.argv[1]
	# query = sys.argv[2] ##"COVID19" or "COVID19|#COVID"
	# from_date = sys.argv[3] ##"2020-12-01"
	# to_date = sys.argv[4] ##"2020-12-07"
	user_id = sys.argv[5]
	spark_id = None
	print(len(sys.argv))
	if(len(sys.argv) == 7)
		spark_id = sys.argv[6]
	sessionNewKS.set_keyspace(new_keyspace_name)
	tweet_id_list = None
	if(spark_id):
		# doing
		# check is it complete or not, if not check again , if yes then trigger insertion by taking tweet_id_list....




		if(tweet_id_list):
			fetchFromGlobalKS(sessionGlobalKS, sessionNewKS, global_keyspace_name, tweet_id_list)



if __name__ == '__main__':
	# logger = log("../storage/insert_new")
	main()