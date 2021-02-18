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
	if(table_name == "token_count"):
		try:		
			# bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6]))
			bound = prepared_stmt.bind((row.created_date, row[1], row.created_time, row.token_name, row.category_class_list, row.count_list, row.tweetidlist))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("111111")
			# print(row)
			# print(e)
	elif(table_name == "token_count_hour_wise"):
		try:		
			# bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6]))
			bound = prepared_stmt.bind((row.created_date, row[1], row.created_time, row.token_name, row.category_class_list, row.count_list, row.tweetidlist))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("222222")
			# print(row)
			# print(e)
	elif(table_name == "token_count_day_wise"):	
		try:	
			# bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5]))
			bound = prepared_stmt.bind((row.created_date, row[1], row.token_name, row.category_class_list, row.count_list, row.tweetidlist))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("333333")
			# print(row)
			# print(e)
	elif(table_name == "token_co_occur"):	
		try:	
			# bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6], data_list[7]))
			bound = prepared_stmt.bind((row.created_date, row[1], row.created_time, row.token_name1, row.token_name2, row.category_class_list, row.count_list, row.tweetidlist))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("444444")
			# print(row)
			# print(e)
	elif(table_name == "token_co_occur_hour_wise"):	
		try:	
			# bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6], data_list[7]))
			bound = prepared_stmt.bind((row.created_date, row[1], row.created_time, row.token_name1, row.token_name2, row.category_class_list, row.count_list, row.tweetidlist))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("555555")
			# print(row)
			# print(e)
	elif(table_name == "token_co_occur_day_wise"):
		try:		
			# bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6]))
			bound = prepared_stmt.bind((row.created_date, row[1], row.token_name1, row.token_name2, row.category_class_list, row.count_list, row.tweetidlist))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("666666")
			# print(row)
			# print(e)
	elif(table_name == "location_token_co_occur"):	
		try:	
			bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6], data_list[7], data_list[8], data_list[9], data_list[10], data_list[11]))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("777777")
			# print(row)
			# print(e)
	elif(table_name == "location_token_co_occur_hour_wise"):	
		try:	
			bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6], data_list[7], data_list[8], data_list[9], data_list[10], data_list[11]))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("888888")
			# print(row)
			# print(e)
	elif(table_name == "location_token_co_occur_day_wise"):	
		try:	
			bound = prepared_stmt.bind((data_list[0], data_list[1], data_list[2], data_list[3], data_list[4], data_list[5], data_list[6], data_list[7], data_list[8], data_list[9], data_list[10]))
			sessionNewKS.execute(bound)
		except Exception as e:
			pass
			# print("999999")
			# print(row)
			# print(e)







# prepared statement for inserting to tables
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





# option = (token_count/co_occur/top_mention/top_hashtag)
# co_occur_option = mention/hashtag/user/keyword
def get_query_class(token, option=None, co_occur_option=None):
	first_char = token[0]
	if option == 'co_occur':
		if first_char == '#':
			code = { 
				'mention': 2, 
				'hashtag': 0,
				'user': 8,
				'keyword': 4
			}
		elif first_char == '*':
			code = { 
				'mention': 7, 
				'hashtag': 5,
				'user': 12
			}
		elif first_char == '$':
			code = { 
				'mention': 11, 
				'hashtag': 9
			}
		elif first_char == '@':
			code = { 
				'mention': 1, 
				'hashtag': 3,
				'user': 10,
				'keyword': 6
			}
		class1 = code.get(co_occur_option, "nothing")
	elif option == 'top':
		code = { 
			'mention': 1, 
			'hashtag': 0,
			'user': 2
		}
		class1 = code.get(token, "nothing")
	else:
		if first_char == '#':
			class1 = 0
		elif first_char == '^':
			class1 = 4
		elif first_char == '*':
			class1 = 3
		elif first_char == '$':
			class1 = 2
		elif first_char == '@':
			class1 = 1
	
	return class1







def get_hour_list_of_day():
	return ["01:00:00", "02:00:00", "03:00:00", "04:00:00", "05:00:00", "06:00:00", "07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00", "21:00:00", "22:00:00", "23:00:00"]

def get_10_sec_list_of_given_hour(hour):
	tensec = hour
	f1 = datetime.strptime(tensec, "%H:%M:%S")
	tenseclist = []
	for x in range(360):
		tenseclist.append(tensec)
		f1 = f1-timedelta(seconds=10)
		tensec  = f1.strftime("%H:%M:%S")
	return tenseclist




def insert_to_table(sessionGlobalKS, sessionNewKS, query, date, class1, table_name, query_stmt, prepared_stmt, time1=None):	
	stmt = sessionGlobalKS.prepare(query_stmt)
	if time1:
		option = [date, class1, time1, query]
	else:
		option = [date, class1, query]
	rows = sessionGlobalKS.execute(stmt, option)
	if(rows):			
		for row in rows:
			insertToNewKS(sessionNewKS, table_name, prepared_stmt, row)
		return 1
	else:
		return 0






def insertion_of_token_count_table(sessionGlobalKS, sessionNewKS, query, date):	
	day_table_name = 'token_count_day_wise'
	hour_table_name = 'token_count_hour_wise'
	tensec_table_name = 'token_count'


	prepared_stmt_token_count = prepareTable(tensec_table_name, sessionNewKS)	
	prepared_stmt_token_count_hour_wise = prepareTable(hour_table_name, sessionNewKS)	
	prepared_stmt_token_count_day_wise = prepareTable(day_table_name, sessionNewKS)	


	day_select_query_stmt = "select * from token_count_day_wise where created_date=? AND class=? AND token_name=?"
	hour_select_query_stmt = "select * from token_count_hour_wise where created_date=? AND class=? AND created_time=? AND token_name=?"
	tensec_select_query_stmt = "select * from token_count where created_date=? AND class=? AND created_time=? AND token_name=?"

	hour_list_of_day = get_hour_list_of_day()
	class1 = get_query_class(query)

	
	# token_count_day_wise
	exist_or_not = insert_to_table(sessionGlobalKS, sessionNewKS, query, date, class1, day_table_name, day_select_query_stmt, prepared_stmt_token_count_day_wise)
	# for token_count_hour_wise
	if exist_or_not:
		for hour in hour_list_of_day:
			exist_or_not = insert_to_table(sessionGlobalKS, sessionNewKS, query, date, class1, hour_table_name, hour_select_query_stmt, prepared_stmt_token_count_hour_wise, hour)
			# for token_count
			if exist_or_not:
				tenseclist1 = get_10_sec_list_of_given_hour(hour)
				for one10sec in tenseclist1:
					insert_to_table(sessionGlobalKS, sessionNewKS, query, date, class1, hour_table_name, tensec_select_query_stmt, prepared_stmt_token_count, one10sec)
				
	



def insertion_of_token_co_occur_table(sessionGlobalKS, sessionNewKS, query, date):
	day_table_name = 'token_co_occur_day_wise'
	hour_table_name = 'token_co_occur_hour_wise'
	tensec_table_name = 'token_co_occur'
	
	prepared_stmt_token_co_occur = prepareTable(tensec_table_name, sessionNewKS)	
	prepared_stmt_token_co_occur_hour_wise = prepareTable(hour_table_name, sessionNewKS)	
	prepared_stmt_token_co_occur_day_wise = prepareTable(day_table_name, sessionNewKS)

	day_select_query_stmt = "select * from token_co_occur_day_wise where created_date=? AND class=? AND token_name1=?"
	hour_select_query_stmt = "select * from token_co_occur_hour_wise where created_date=? AND class=? AND created_time=? AND token_name1=?"
	tensec_select_query_stmt = "select * from token_co_occur where created_date=? AND class=? AND created_time=? AND token_name1=?"

	hour_list_of_day = get_hour_list_of_day()

	first_char = query[0]
	# token_co_occur_day_wise
	if((first_char == '#') or (first_char == '@') or (first_char == '$')):
		class1 = get_query_class(query, 'co_occur', 'hashtag')		
		exist_or_not_hashtag = insert_to_table(sessionGlobalKS, sessionNewKS, query, date, class1, day_table_name, day_select_query_stmt, prepared_stmt_token_co_occur_day_wise)
		class1 = get_query_class(query, 'co_occur', 'mention')		
		exist_or_not_mention = insert_to_table(sessionGlobalKS, sessionNewKS, query, date, class1, day_table_name, day_select_query_stmt, prepared_stmt_token_co_occur_day_wise)
		exist_or_not_user = 0
		if(first_char != '$'):
			class1 = get_query_class(query, 'co_occur', 'user')		
			exist_or_not_user = insert_to_table(sessionGlobalKS, sessionNewKS, query, date, class1, day_table_name, day_select_query_stmt, prepared_stmt_token_co_occur_day_wise)
		# for token_co_occur_hour_wise
		if(exist_or_not_hashtag or exist_or_not_mention or exist_or_not_user):
			for hour in hour_list_of_day:
				class1 = get_query_class(query, 'co_occur', 'hashtag')		
				exist_or_not_hashtag_hour = insert_to_table(sessionGlobalKS, sessionNewKS, query, date, class1, hour_table_name, hour_select_query_stmt, prepared_stmt_token_co_occur_hour_wise, hour)
				class1 = get_query_class(query, 'co_occur', 'mention')		
				exist_or_not_mention_hour = insert_to_table(sessionGlobalKS, sessionNewKS, query, date, class1, hour_table_name, hour_select_query_stmt, prepared_stmt_token_co_occur_hour_wise, hour)
				exist_or_not_user_hour = 0
				if(first_char != '$'):
					class1 = get_query_class(query, 'co_occur', 'user')		
					exist_or_not_user_hour = insert_to_table(sessionGlobalKS, sessionNewKS, query, date, class1, hour_table_name, hour_select_query_stmt, prepared_stmt_token_co_occur_hour_wise, hour)
				# for token_co_occur
				if(exist_or_not_hashtag_hour or exist_or_not_mention_hour or exist_or_not_user_hour):
					tenseclist1 = get_10_sec_list_of_given_hour(hour)
					for one10sec in tenseclist1:
						class1 = get_query_class(query, 'co_occur', 'hashtag')		
						insert_to_table(sessionGlobalKS, sessionNewKS, query, date, class1, tensec_table_name, tensec_select_query_stmt, prepared_stmt_token_co_occur, one10sec)
						class1 = get_query_class(query, 'co_occur', 'mention')		
						insert_to_table(sessionGlobalKS, sessionNewKS, query, date, class1, tensec_table_name, tensec_select_query_stmt, prepared_stmt_token_co_occur, one10sec)
						if(first_char != '$'):
							class1 = get_query_class(query, 'co_occur', 'user')		
							insert_to_table(sessionGlobalKS, sessionNewKS, query, date, class1, tensec_table_name, tensec_select_query_stmt, prepared_stmt_token_co_occur, hour)
					
	




def fetchFromGlobalKS(sessionGlobalKS, sessionNewKS, keyspace_name, query, date):
	sessionGlobalKS.set_keyspace(keyspace_name)
	# if(module_name == 'ha'):
		# print('ha')
	## for token_count, token_count_hour_wise, token_count_day_wise table...........................................................BEGIN
	insertion_of_token_count_table(sessionGlobalKS, sessionNewKS, query, date)
	## for token_count, token_count_hour_wise, token_count_day_wise table...........................................................END

	## for token_co_occur, token_co_occur_hour_wise, token_co_occur_day_wise table..................................................BEGIN
	insertion_of_token_co_occur_table(sessionGlobalKS, sessionNewKS, query, date)
	## for token_co_occur, token_co_occur_hour_wise, token_co_occur_day_wise table..................................................END

		
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



# def update_status_to_mysql(keyspace_name, insertion_successful_flag, user_id, query, from_date, to_date, module_name):
# 	mydb = create_connection_to_mysql()
# 	mycursor = mydb.cursor()
# 	project_id = get_project_id_by_project_name_mysql(keyspace_name)
# 	if query[0] == '#':
# 		aname = query[1:]
# 		full_query = str(user_id)+project_id+'HASH'+aname+str(from_date)+str(to_date)+module_name
# 	else:
# 		full_query = str(user_id)+project_id+query+str(from_date)+str(to_date)+module_name
# 	print(full_query,insertion_successful_flag )
# 	sql = "UPDATE project_activities SET insertion_successful_flag = "+ str(insertion_successful_flag) +" WHERE full_query = '"+full_query+"'"
# 	mycursor.execute(sql)
# 	mydb.commit()
# 	# logger.info(mycursor.rowcount, "record(s) affected")




# get input date from which we should start
def main():		
	sessionNewKS = create_connection('cassandra', 'cassandra', ['172.16.117.201'])
	sessionGlobalKS = create_connection('cassandra', 'cassandra', ['172.16.117.201'])
	# take arguments
	global_keyspace_name = "processed_keyspace"
	new_keyspace_name = sys.argv[1]
	query = sys.argv[2] ##"COVID19" or "COVID19|#COVID"
	from_date = sys.argv[3] ##"2020-12-01"
	to_date = sys.argv[4] ##"2020-12-07"
	user_id = sys.argv[5]
	sessionNewKS.set_keyspace(new_keyspace_name)
	query_list = query.split("|")
	try:	
		orig_to_datetime_obj = datetime.strptime(to_date, '%Y-%m-%d')	
		orig_to_date = orig_to_datetime_obj.date()
		#  for each query it should run.....
		for each_query in query_list:
			print(each_query)
			from_datetime_obj = datetime.strptime(str(from_date), '%Y-%m-%d')
			to_datetime_obj = datetime.strptime(str(orig_to_date), '%Y-%m-%d')		
			# for each date it should run.....
			while(1):
				to_date = to_datetime_obj.date()
				from_date = from_datetime_obj.date()
				if(to_date < from_date):
					break
				fetchFromGlobalKS(sessionGlobalKS, sessionNewKS, global_keyspace_name, each_query, to_date)
				## python3 insert_data_from_one_keyspace_to_another_keyspace_new.py diljitdoshanjh "#COVID19" 2020-12-22 2020-12-23 ha
				## print(new_keyspace_name, query, from_date, to_date, module_name)
				## print(to_date, from_date)
				to_datetime_obj=to_datetime_obj+timedelta(-1)
		update_status_to_project_table_mysql(new_keyspace_name, 1)
	except Exception as e:
		# print(e)
		update_status_to_project_table_mysql(new_keyspace_name, -1)



if __name__ == '__main__':
	# logger = log("../storage/insert_new")
	main()