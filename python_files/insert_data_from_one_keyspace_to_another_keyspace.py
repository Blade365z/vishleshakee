# -*- coding: utf-8 -*-
import sys, time
import os
import datetime
import logging
import configparser

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


def log(file_name):
	#Create and configure logger                                                   
	logging.basicConfig(filename=file_name+".log", format='INFO %(asctime)s %(message)s', filemode='a')
	#Creating an object                                                            
	logger=logging.getLogger()                                                     
	#Setting the threshold of logger to DEBUG                                      
	logger.setLevel(logging.INFO) 
	logger.info("Started")
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



def insertToNewKS(sessionNewKS, table_name, prepared_stmt, data_list):
	if(table_name == "token_count"):		
		bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6]))
		sessionNewKS.execute(bound)
	elif(table_name == "token_count_hour_wise"):		
		bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6]))
		sessionNewKS.execute(bound)
	elif(table_name == "token_count_day_wise"):		
		bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5]))
		sessionNewKS.execute(bound)
	elif(table_name == "token_co_occur"):		
		bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6], data_list[7]))
		sessionNewKS.execute(bound)
	elif(table_name == "token_co_occur_hour_wise"):		
		bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6], data_list[7]))
		sessionNewKS.execute(bound)
	elif(table_name == "token_co_occur_day_wise"):		
		bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6]))
		sessionNewKS.execute(bound)
	elif(table_name == "location_token_co_occur"):		
		bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6], data_list[7], data_list[8], data_list[9], data_list[10], data_list[11]))
		sessionNewKS.execute(bound)
	elif(table_name == "location_token_co_occur_hour_wise"):		
		bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6], data_list[7], data_list[8], data_list[9], data_list[10], data_list[11]))
		sessionNewKS.execute(bound)
	elif(table_name == "location_token_co_occur_day_wise"):		
		bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6], data_list[7], data_list[8], data_list[9], data_list[10]))
		sessionNewKS.execute(bound)



def prepareTable(option, sessionNewKS):
	if(option == "token_count"):
		query = 'INSERT INTO token_count (created_date, class, created_time, token_name, category_class_list, count_list, tweetidlist) VALUES (?, ?, ?, ?, ?, ?, ?)'
	elif(option == "token_count_hour_wise"):
		query = 'INSERT INTO token_count_hour_wise (created_date, class, created_time, token_name, category_class_list, count_list, tweetidlist) VALUES (?, ?, ?, ?, ?, ?, ?)'  
	elif(option == "token_count_day_wise"):
		query = 'INSERT INTO token_count_day_wise (created_date, class, token_name, category_class_list, count_list, tweetidlist) VALUES (?, ?, ?, ?, ?, ?)' 
	elif(option == "token_co_occur"):
		query = 'INSERT INTO token_co_occur (created_date, class, created_time, token_name1, token_name2, category_class_list, count_list, tweetidlist) VALUES (?, ?, ?, ?, ?, ?, ?, ?)' 
	elif(option == "token_co_occur_hour_wise"):
		query = 'INSERT INTO token_co_occur_hour_wise (created_date, class, created_time, token_name1, token_name2, category_class_list, count_list, tweetidlist) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
	elif(option == "token_co_occur_day_wise"):
		query = 'INSERT INTO token_co_occur_day_wise (created_date, class, token_name1, token_name2, category_class_list, count_list, tweetidlist) VALUES (?, ?, ?, ?, ?, ?, ?)' 
	elif(option == "location_token_co_occur"):
		query = 'INSERT INTO location_token_co_occur (created_date, class, created_time, country, state, city, tweet_cl_latitude, tweet_cl_longitude, token_name, category_class_list, count_list, tweetidlist) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)' 
	elif(option == "location_token_co_occur_hour_wise"):
		query = 'INSERT INTO location_token_co_occur_hour_wise (created_date, class, created_time, country, state, city, tweet_cl_latitude, tweet_cl_longitude, token_name, category_class_list, count_list, tweetidlist) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)' 
	elif(option == "location_token_co_occur_day_wise"):
		query = 'INSERT INTO location_token_co_occur_day_wise (created_date, class, country, state, city, tweet_cl_latitude, tweet_cl_longitude, token_name, category_class_list, count_list, tweetidlist) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)' 
	prepared_stmt = sessionNewKS.prepare(query)
	prepared_stmt.consistency_level = ConsistencyLevel.ONE 

	return prepared_stmt




def fetchFromGlobalKS(sessionGlobalKS, sessionNewKS, keyspace_name, query, date, module_name):
	sessionGlobalKS.set_keyspace(keyspace_name)
	if(module_name == 'ha'):
		prepared_stmt_token_count = prepareTable("token_count", sessionNewKS)	
		prepared_stmt_token_count_hour_wise = prepareTable("token_count_hour_wise", sessionNewKS)	
		prepared_stmt_token_count_day_wise = prepareTable("token_count_day_wise", sessionNewKS)	
		prepared_stmt_token_co_occur = prepareTable("token_co_occur", sessionNewKS)	
		prepared_stmt_token_co_occur_hour_wise = prepareTable("token_co_occur_hour_wise", sessionNewKS)	
		prepared_stmt_token_co_occur_day_wise = prepareTable("token_co_occur_day_wise", sessionNewKS)	
		rows = sessionGlobalKS.execute("select * from token_count where created_date="+"'"+date+"'")
		for row in rows:
			# print(row.created_date, row.token_name)
			insertToNewKS(sessionNewKS, "token_count", prepared_stmt_token_count, [row.created_date, row[1], row.created_time, row.token_name, row.category_class_list, row.count_list, row.tweetidlist])
		logger.info("token_count done")
		rows = sessionGlobalKS.execute("select * from token_count_hour_wise where created_date="+"'"+date+"'")
		for row in rows:
			insertToNewKS(sessionNewKS, "token_count_hour_wise", prepared_stmt_token_count_hour_wise, [row.created_date, row[1], row.created_time, row.token_name, row.category_class_list, row.count_list, row.tweetidlist])
		logger.info("token_count_hour_wise done")
		rows = sessionGlobalKS.execute("select * from token_count_day_wise where created_date="+"'"+date+"'")
		for row in rows:
			insertToNewKS(sessionNewKS, "token_count_day_wise", prepared_stmt_token_count_day_wise, [row.created_date, row[1], row.token_name, row.category_class_list, row.count_list, row.tweetidlist])
		logger.info("token_count_day_wise done")
		rows = sessionGlobalKS.execute("select * from token_co_occur where created_date="+"'"+date+"'")
		for row in rows:
			insertToNewKS(sessionNewKS, "token_co_occur", prepared_stmt_token_co_occur, [row.created_date, row[1], row.created_time, row.token_name1, row.token_name2, row.category_class_list, row.count_list, row.tweetidlist])
		logger.info("token_co_occur done")
		# rows = sessionGlobalKS.execute("select * from token_co_occur_hour_wise where created_date="+"'"+date+"'")
		# for row in rows:
		# 	insertToNewKS(sessionNewKS, "token_co_occur_hour_wise", prepared_stmt_token_co_occur_hour_wise, [row.created_date, row[1], row.created_time, row.token_name1, row.token_name2, row.category_class_list, row.count_list, row.tweetidlist])
		# logger.info("token_co_occur_hour_wise done")
		# rows = sessionGlobalKS.execute("select * from token_co_occur_day_wise where created_date="+"'"+date+"'")
		# for row in rows:
		# 	insertToNewKS(sessionNewKS, "token_co_occur_day_wise", prepared_stmt_token_co_occur_day_wise, [row.created_date, row[1], row.token_name1, row.token_name2, row.category_class_list, row.count_list, row.tweetidlist])
		# logger.info("token_co_occur_day_wise done")
		



# get input date from which we should start
def main():	
	sessionNewKS = create_connection('subroottest', 'subroottest', ['172.16.117.201', '172.16.117.152','172.16.117.204'])
	sessionGlobalKS = create_connection('cassandra', 'cassandra', ['172.16.117.201', '172.16.117.152', '172.16.117.204'])
	# take arguments
	global_keyspace_name = "processed_keyspace"
	new_keyspace_name = sys.argv[1]
	query = sys.argv[2] ##"COVID19"
	from_date = sys.argv[3] ##"2020-12-01"
	to_date = sys.argv[4] ##"2020-12-07"
	module_name = sys.argv[5] ##"ha"
	sessionNewKS.set_keyspace(new_keyspace_name)
	fetchFromGlobalKS(sessionGlobalKS, sessionNewKS, global_keyspace_name, query, to_date, module_name)



if __name__ == '__main__':
	logger = log("insert")
	main()