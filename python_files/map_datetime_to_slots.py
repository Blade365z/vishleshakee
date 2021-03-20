import datetime
from datetime import timedelta

def get_local_datetime(utc_datetime_str):
    pdatetime = datetime.datetime.strptime(utc_datetime_str, '%Y-%m-%d %H:%M:%S')
    return (pdatetime + timedelta(hours=5, minutes=30)).strftime('%Y-%m-%d %H:%M:%S')
    
    
def map_10sec(time_str, sec_part):
    second_to_plus_to_get_round_fig = 10-int(sec_part)%10
    ptime = datetime.datetime.strptime(time_str, '%H:%M:%S')
    res = (ptime + timedelta(seconds=second_to_plus_to_get_round_fig)).strftime('%H:%M:%S')
    if(res == '00:00:00'):
        res = '24:00:00'
    return res
    
def map_hour(time_str):
    ptime = datetime.datetime.strptime(time_str, '%H:%M:%S')
    temp_hour = (ptime + timedelta(hours=1)).strftime('%H')
    if temp_hour == '00':
        res = '24:00:00'
    else:
        res = temp_hour+':00:00'
    return res
    
def map_to(datetime_str):
    datetime_str = get_local_datetime(datetime_str)
    # print('convertes_to_local_time-->',datetime_str)
    datetime_list = datetime_str.split(" ")
    date = datetime_list[0]
    time_str = datetime_list[1]
    time_part = time_str.split(":")
    hour = map_hour(time_str)
    tensec = map_10sec(time_str, time_part[2])
    return [date, hour, tensec, datetime_str]
    
	
# datetime_str = '2020-01-02 18:28:59'
# datetime_str = '2020-01-02 18:29:59'
# datetime_str = '2020-01-02 18:30:59'
# print('utc_given_time-->', datetime_str)
# res = map_to(datetime_str)
# print(res)