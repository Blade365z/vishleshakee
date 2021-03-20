# -*- coding: utf-8 -*-
import sys, time
import os
import datetime
import logging
import configparser
import requests

from cassandra.cluster import Cluster
from cassandra import ConsistencyLevel
from cassandra.auth import PlainTextAuthProvider
from cassandra.policies import LoadBalancingPolicy
from cassandra.policies import RoundRobinPolicy
from cassandra.query import UNSET_VALUE
from cassandra.query import SimpleStatement
from map_datetime_to_slots import map_to
from map_datetime_to_slots import get_local_datetime


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



def get_tweet_track_info(row):	
	utc_datetime_str = str(row.datetime)
	local_date_time = get_local_datetime(utc_datetime_str)
	date = local_date_time.split(" ")[0]
	user_id = row.author_id
	tweet_type = row.type
	if(row.type == 'Tweet'):
		source_tweet_id = row.tid
		type_tweet_id = row.tid
	elif(row.type == 'retweet'):
		type_tweet_id = row.tid
		source_tweet_id = row.retweet_source_id
	elif(row.type == 'QuotedTweet'):
		type_tweet_id = row.tid
		source_tweet_id = row.quoted_source_id
	elif(row.type == 'Reply'):
		type_tweet_id = row.tid
		source_tweet_id = row.replyto_source_id
	return {'source_tweet_id':source_tweet_id, 'date': date, 'tweet_type': tweet_type, 'type_tweet_id':type_tweet_id, 'user_id': user_id}



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
			slot_list = map_to(str(row.datetime))
			date = slot_list[0]
			hour = slot_list[1]
			tensec = slot_list[2]
			local_datetime =  slot_list[3]
			bound = prepared_stmt.bind((date, hour, tensec, row.tid, row.author, row.author_id, row.author_screen_name, row.category, row.confidence, row.datetime, row.hashtags, row.keyword_list, local_datetime, row.mention_list_id, row.mentions, row.sentiment, row.t_location, row.tl_latitude, row.tl_longitude, row.tweet_place, row.type))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("222222")
			# print(row)
			print(e)
	elif(table_name == "user_record"):
		try:		
			bound = prepared_stmt.bind((row.author_id, row.author, row.author_screen_name, row.created_at, row.default_profile, row.default_profile_image, row.description, row.favourites_count, row.followers_count, row.following_count, row.geo_enabled, row.lang, row.listed_count, row.location, row.profile_background_color, row.profile_background_image_url_https, row.profile_banner_url, row.profile_image_url_https, row.profile_link_color, row.profile_sidebar_fill_color, row.profile_text_color, row.profile_use_background_image, row.protected, row.time_zone, row.tweet_count, row.url, row.utc_offset, row.verified))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("222222")
			# print(row)
			# print(e)
	elif(table_name == "tweet_track"):
		try:
			tweet_track_info = get_tweet_track_info(row)
			bound = prepared_stmt.bind((tweet_track_info['source_tweet_id'], tweet_track_info['date'], tweet_track_info['tweet_type'], tweet_track_info['type_tweet_id'], tweet_track_info['user_id'] ))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
	







# prepared statement for inserting to tables
def prepareTable(option, sessionNewKS):
	if(option == "tweet_info_by_id_test"):
		query = 'INSERT INTO tweet_info_by_id_test (tid , datetime , author , author_id, author_profile_image, author_screen_name, category, confidence, hashtags, keyword_list, lang, like_count, location, media_list, mention_list_id, mentions, possibly_sensitive_tweet_by_twitter, quote_count, quoted_source_id, reply_count , replyto_screen_name, replyto_source_id, replyto_user_id, retweet_count , retweet_source_id, sentiment, source_of_utility, t_location, timezone, tl_latitude, tl_longitude, tweet_coordinates, tweet_place, tweet_text, type, url_list, verified) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
	elif(option == "temp"):
		query = 'INSERT INTO temp (date, hour, tensec, tid, author, author_id, author_screen_name, category, confidence, datetime, hashtags, keyword_list, local_datetime, mention_list_id, mentions, sentiment, t_location, tl_latitude, tl_longitude, tweet_place, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'  
	elif(option == "user_record"):
		query = 'INSERT INTO user_record (author_id, author, author_screen_name, created_at, default_profile, default_profile_image, description, favourites_count, followers_count, following_count, geo_enabled, lang, listed_count, location, profile_background_color, profile_background_image_url_https, profile_banner_url, profile_image_url_https, profile_link_color, profile_sidebar_fill_color, profile_text_color, profile_use_background_image, protected, time_zone, tweet_count, url, utc_offset, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
	elif(option == "tweet_track"):
		query = 'INSERT INTO tweet_track (source_tweet_id, datetime, tweet_type, type_tweet_id, user_id) VALUES (?, ?, ?, ?, ?)'
	prepared_stmt = sessionNewKS.prepare(query)
	prepared_stmt.consistency_level = ConsistencyLevel.ONE 
	return prepared_stmt





def get_output_from_livy_spark_job(spark_id):
	url = "http://172.16.117.50:8998/batches/"+spark_id
	response = requests.get(url)
	data_convert_to_json = response.json()
	print(data_convert_to_json)
	final_output_list = eval(data_convert_to_json["log"][-2]) ## the provided list is in unicode string format, so converted it to list by using eval
	return final_output_list




# doing
def check_status_of_livy_spark_job(spark_id):
	url = "http://172.16.117.50:8998/batches/"+spark_id
	response = requests.get(url)
	data_convert_to_json = response.json()
	livy_spark_job_status = data_convert_to_json["state"]
	print(livy_spark_job_status)
	if livy_spark_job_status == 'success':
		print(livy_spark_job_status)
		status = 1
	elif livy_spark_job_status == 'running':
		time.sleep(6)
		status = 1
		check_status_of_livy_spark_job(spark_id)
	elif livy_spark_job_status == 'dead':
		status = -1
	elif livy_spark_job_status == 'starting':
		time.sleep(6)
		status = 1
		check_status_of_livy_spark_job(spark_id)
	return status



def tweet_track_insertion(row, table_name, insertion_statement, sessionNewKS, sessionGlobalKS):
	fetch_size = 1
	insertToNewKS(sessionNewKS, table_name, insertion_statement, row)
	if(row.type == 'retweet'):
		tweet_id = row.retweet_source_id
		insert_to_table(sessionGlobalKS, sessionNewKS, tweet_id, fetch_size)
	elif(row.type == 'QuotedTweet'):
		tweet_id = row.quoted_source_id
		insert_to_table(sessionGlobalKS, sessionNewKS, tweet_id, fetch_size)
	elif(row.type == 'Reply'):
		tweet_id = row.replyto_source_id
		insert_to_table(sessionGlobalKS, sessionNewKS, tweet_id, fetch_size)




def insert_to_table(sessionGlobalKS, sessionNewKS, tweet_id, fetch_size):	
	tweet_info_by_id_test_table_name = 'tweet_info_by_id_test'
	user_record_table_name = 'user_record'
	temp_table_name = 'temp'
	tweet_track_table_name = 'tweet_track'

	# # prepared insert stmt for insertion
	insert_prepared_stmt_tweet_info_by_id_test = prepareTable(tweet_info_by_id_test_table_name, sessionNewKS)
	insert_prepared_stmt_user_record = prepareTable(user_record_table_name, sessionNewKS)	
	insert_prepared_stmt_temp = prepareTable(temp_table_name, sessionNewKS)
	insert_prepared_stmt_tweet_track = prepareTable(tweet_track_table_name, sessionNewKS)

	# # query to get tweet_info from global KS
	query_to_get_tweet_info = "select * from "+tweet_info_by_id_test_table_name+" where tid='"+tweet_id+"'"
	statement_query_to_get_tweet_info = SimpleStatement(query_to_get_tweet_info, fetch_size=fetch_size)	

	print(tweet_id)
	for row in sessionGlobalKS.execute(statement_query_to_get_tweet_info):
		insertToNewKS(sessionNewKS, tweet_info_by_id_test_table_name, insert_prepared_stmt_tweet_info_by_id_test, row)
		insertToNewKS(sessionNewKS, temp_table_name, insert_prepared_stmt_temp, row)
		# insertToNewKS(sessionNewKS, tweet_track_table_name, insert_prepared_stmt_tweet_track, row)
		tweet_track_insertion(row, tweet_track_table_name, insert_prepared_stmt_tweet_track, sessionNewKS, sessionGlobalKS)
		author_id = row.author_id
		# print(author_id)
		# # query to get user_info from global KS
		query_to_get_user_info = "select * from "+user_record_table_name+" where author_id='"+author_id+"'"
		user_rows = sessionGlobalKS.execute(query_to_get_user_info)
		if(user_rows):			
			for urow in user_rows:
				insertToNewKS(sessionNewKS, user_record_table_name, insert_prepared_stmt_user_record, urow)



		
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


## get input date from which we should start
def main():
	fetch_size = 1
	sessionNewKS = create_connection('cassandra', 'cassandra', ['172.16.117.201'])
	sessionGlobalKS = create_connection('cassandra', 'cassandra', ['172.16.117.201'])
	## take arguments
	global_keyspace_name = "processed_keyspace"
	sessionGlobalKS.set_keyspace(global_keyspace_name)
	new_keyspace_name = sys.argv[1]
	sessionNewKS.set_keyspace(new_keyspace_name)
	# query = sys.argv[2] ##"COVID19" or "COVID19|#COVID"
	# from_date = sys.argv[3] ##"2020-12-01"
	# to_date = sys.argv[4] ##"2020-12-07"
	user_id = sys.argv[5]
	spark_id = None
	# print(len(sys.argv))
	if len(sys.argv) == 7:
		spark_id = sys.argv[6]
	sessionNewKS.set_keyspace(new_keyspace_name)
	if(spark_id):		
		## check is it complete or not, if not check again , if yes then trigger insertion by taking tweet_id_list....
		status_of_livy_spark_job = check_status_of_livy_spark_job(spark_id)# doing
		print(status_of_livy_spark_job)
		# print(status_of_livy_spark_job)
		# print(type(status_of_livy_spark_job))
		# status_of_livy_spark_job = 1 ### testing...
		if status_of_livy_spark_job == 1:
			print('1111')
			final_tweet_id_list = get_output_from_livy_spark_job(spark_id)
			# print(final_tweet_id_list)
			# final_tweet_id_list = ['1362443003474964483', '1362496452652650502', '1362605646785384448', '1362502831752757256', '1362493441230467073', '1362464676991311873', '888911073411289090', '1357027550799613953', '1362511124307009545', '1362494522488360961'] ### testing...
			for tweet_id in final_tweet_id_list:				
				if(str(tweet_id) == '0'):
					continue
				print(str(tweet_id))
				insert_to_table(sessionGlobalKS, sessionNewKS, tweet_id, fetch_size)
			update_status_to_project_table_mysql(new_keyspace_name, 1)
		elif status_of_livy_spark_job == -1:
			print('2')
			## it is dead....project creation not successful...update the status in mysql as -1
			update_status_to_project_table_mysql(new_keyspace_name, -1)
		else:
			print('3')
			update_status_to_project_table_mysql(new_keyspace_name, -1)



if __name__ == '__main__':
	# logger = log("../storage/insert_new")
	main()