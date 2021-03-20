import time, json, sys, traceback, pprint, logging, os, atexit
from datetime import datetime, timedelta
from collections import OrderedDict 
import socket
import pickle
from keras.models import model_from_json
import numpy as np
import glob
import os
from tqdm import tqdm
import re
import math
import string
import pandas as pd
from itertools import chain
# reload(sys)
# sys.setdefaultencoding('utf-8')
from collections import defaultdict
from backports import lzma
import gc
import nltk
from nltk import word_tokenize
from nltk.util import ngrams
from nltk.collocations import *
from operator import itemgetter
from pattern.en import parse
from timeit import default_timer as timer
from calendar import monthrange


############################################################

#getting tweets



def get_tweets_json(filename):

	file = open(filename)

	data = json.load(file)

	tweets_list = []

	for (k, v) in data.items():

		x = json.dumps(v)

		tweets_list.append(x)
		
	file.close()

	return tweets_list

# for i in get_tweets_json("20200606_235908-t.json.xz"):

# 	print(i)

# Getting time from tweets

def get_datetime(filename):

	pattern = re.compile(r'(\d+)_(\d+)')

	datetime_list = list(pattern.search(filename).groups())

	x_date = datetime.strptime(datetime_list[0], "%Y%m%d")

	x_time = datetime.strptime(datetime_list[1], "%H%M%S")

	x_day = x_date.day
	x_month = x_date.month
	x_year = x_date.year

	x_days_in_month = monthrange(x_year, x_month)

	if x_time.hour >= 18 and x_time.minute >=30:

		if x_day < x_days_in_month[1]:

			new_x_day = x_day+1
			new_x_month = x_month
			time = x_time + timedelta(hours=5,minutes=30)

		else:

			new_x_day = 01
			new_x_month = x_month+1
			time = x_time + timedelta(hours=5,minutes=30)

		date = x_date.replace(day=new_x_day, month=new_x_month)

	else:

		date = x_date
		time = x_time + timedelta(hours=5,minutes=30)

	

	sec_time = time.second
	min_time = time.minute
	hour_time = time.hour

	day_date = date.day
	month_date = date.month
	year_date = date.year

	days_in_month = monthrange(year_date, month_date)

	if sec_time <= 50:

		new_sec = int(math.ceil(sec_time / 10.0)) * 10
		new_minute = min_time
		new_hour = hour_time
		new_day = day_date
		new_month = month_date
		new_year = year_date

	else:

		if min_time <=58:

			new_sec = 00
			new_minute = min_time+1
			new_hour = hour_time
			new_day = day_date
			new_month = month_date
			new_year = year_date
		else:

			if hour_time <= 22:

				new_sec = 00
				new_minute = 00
				new_hour = hour_time+1
				new_day = day_date
				new_month = month_date
				new_year = year_date

			else:

				if day_date < days_in_month[1]:

					new_sec = 00
					new_minute = 00
					new_hour = 00
					new_day = day_date+1
					new_month = month_date
					new_year = year_date

				else:

					new_sec = 00
					new_minute = 00
					new_hour = 00
					new_day = 01
					new_month = month_date+1
					new_year = year_date

	new_sec_time = time.replace(hour=new_hour, minute=new_minute, second=new_sec)
	new_day_date = date.replace(day=new_day, month=new_month, year=new_year)

	new_time = new_sec_time.strftime("%H:%M:%S")
	new_date = new_day_date.strftime("%Y-%m-%d")

	return [new_date, new_time]
	

#############################################################

# Logging

for handler in logging.root.handlers[:]:
	logging.root.removeHandler(handler)


#Create and configure logger                                                   
logging.basicConfig(filename="tweet-crawler.log", format='INFO %(asctime)s %(message)s', filemode='a')

#Creating an object                                                            
logger=logging.getLogger()                                                     

#Setting the threshold of logger to DEBUG                                      
logger.setLevel(logging.INFO)



################ Model Load Start #################

f = open('42K_5_worddict.pkl', 'rb')																		
dictionary = pickle.load(f)
f.close()

# load json and create model
json_file = open('new_model_CNN_v2.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
loaded_model = model_from_json(loaded_model_json)
# load weights into new model
loaded_model.load_weights("new_model_CNN_v2.h5")
# print("Loaded model from disk")
loaded_model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

#load json for security and create model
json_file_security = open('security.json', 'r')
loaded_model_json_security = json_file_security.read()
json_file_security.close()
loaded_model_security = model_from_json(loaded_model_json_security)

loaded_model_security.load_weights("security.h5")
# print("loaded security model from disk")
loaded_model_security.compile(loss='categorical_crossentropy', optimizer='adam',metrics=['accuracy'])

#load model for communal detection

json_file_communal = open('communal.json', 'r')
load_json_communal = json_file_communal.read()
json_file_communal.close()
loaded_model_communal = model_from_json(load_json_communal)
#load weights into new model
loaded_model_communal.load_weights("communal_model.h5")
# print("loaded communal model from disk")
loaded_model_communal.compile(loss='categorical_crossentropy', optimizer='adam',metrics=['accuracy'])



sample=np.array([[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 36, 451, 35505, 27754, 13695, 3523, 1, 568, 1, 3115, 1, 9792, 451, 27754, 13695, 64, 763, 1]])
result=loaded_model.predict(sample)
# print(result[0])
result_sec = loaded_model_security.predict(sample)
# print(result_sec[0])

sample=np.array([[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 36, 451, 35505, 27754, 13695, 3523, 1, 568, 1, 3115, 1, 9792, 451, 27754, 13695, 64, 763, 1]])
result=loaded_model.predict(sample)
# print(result[0])
result_sec = loaded_model_communal.predict(sample)
# print(result_sec[0])

################# Model Load End ##########################


def extract_words(text):
	result = []
	stop = [u'i', u'me', u'my', u'myself', u'we', u'our', u'ours', u'ourselves', u'you', u"you're", u"you've", u"you'll", u"you'd", u'your', u'yours', u'yourself', u'yourselves', u'he', u'him', u'his', u'himself', u'she', u"she's", u'her', u'hers', u'herself', u'it', u"it's", u'its', u'itself', u'they', u'them', u'their', u'theirs', u'themselves', u'what', u'which', u'who', u'whom', u'this', u'that', u"that'll", u'these', u'those', u'am', u'is', u'are', u'was', u'were', u'be', u'been', u'being', u'have', u'has', u'had', u'having', u'do', u'does', u'did', u'doing', u'a', u'an', u'the', u'and', u'but', u'if', u'or', u'because', u'as', u'until', u'while', u'of', u'at', u'by', u'for', u'with', u'about', u'against', u'between', u'into', u'through', u'during', u'before', u'after', u'above', u'below', u'to', u'from', u'up', u'down', u'in', u'out', u'on', u'off', u'over', u'under', u'again', u'further', u'then', u'once', u'here', u'there', u'when', u'where', u'why', u'how', u'all', u'any', u'both', u'each', u'few', u'more', u'most', u'other', u'some', u'such', u'no', u'nor', u'not', u'only', u'own', u'same', u'so', u'than', u'too', u'very', u's', u't', u'can', u'will', u'just', u'don', u"don't", u'should', u"should've", u'now', u'd', u'll', u'm', u'o', u're', u've', u'y', u'ain', u'aren', u"aren't", u'couldn', u"couldn't", u'didn', u"didn't", u'doesn', u"doesn't", u'hadn', u"hadn't", u'hasn', u"hasn't", u'haven', u"haven't", u'isn', u"isn't", u'ma', u'mightn', u"mightn't", u'mustn', u"mustn't", u'needn', u"needn't", u'shan', u"shan't", u'shouldn', u"shouldn't", u'wasn', u"wasn't", u'weren', u"weren't", u'won', u"won't", u'wouldn', u"wouldn't", 'sir','day','title','shri','crore','day','time',"a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the","&amp;","?",'!',',',';',':','.','\t','$','/','|','amp','url']
	text = re.sub(r'[^\x00-\x7F]+',' ', text)
	text = text.replace('<br />', ' ')
	text = text.replace('--', ' ').replace('\'s', '')
	text = re.sub(r'[^\w\s]','',text)
	words = []
	for word in text.split():
		word = word.lstrip('-\'\"').rstrip('-\'\"')
		if len(word)>2:
			words.append(word.lower())
	text = ' '.join(words)
	result.append(text.strip())
	return result


def grab_data(sentences):
	seqs = [None] * len(sentences)
	for idx, ss in enumerate(sentences):
		words = ss.strip().lower().split()
		seqs[idx] = [dictionary[w] if w in dictionary else 1 for w in words]
	return seqs


def flatten(neste_list):
	flatten_matrix = [val for sublist in neste_list for val in sublist]
	return flatten_matrix

def pad(l, fill_value, width):

	if len(l) >= width:
		return l[0: width]
	else:
		padding = [fill_value] * (width - len(l))
		padding.extend(l)
		return padding

############################## START Keyword extraction #################################

def extract_link(text):
	regex = r'https?://[^\s<>"]+|www\.[^\s<>)"]+'
	match = re.findall(regex, text)
	links = [] 
	for x in match: 
		if x[-1] in string.punctuation: links.append(x[:-1])
		else: links.append(x)
	return links
	
def cleanup(query): 
	try:
		urls = extract_link(" " + query + " ")
		for url in urls: 
			query = re.sub(url, "", query)
		q = query.strip()
	except:
		q = query
	q = re.sub(' RT ', '', ' ' + q + ' ').strip() 
	return q 


def convert_tag_format(query): 
	word = query.split(' ')
	postag = [(x.split('/')[0], x.split('/')[1]) for x in word]
	return postag 
	

def get_pos_tags(text): 
	tagged_sent = parse(text)	
	return convert_tag_format(tagged_sent), tagged_sent
	
def normalise(word):
	word = word.lower()
	return word


## conditions for acceptable word: length, stopword
def acceptable_word(word):
	accepted = bool(4 <= len(word) <= 40
		and word.lower() not in stopwords)
	return accepted

## extract entity from BIO encoding 
def extract_entity(filetext):
	last_entity = '' 
	last_tag = '' 
	mention2entities = {} 
	for line in filetext.split('\n'): 
		line = line.strip() 
		if line == '': 
			continue
		line_split = line.split('\t')
		if re.search('B-', line_split[1]): 
			if last_entity != '': 
				if not last_tag in mention2entities:
					mention2entities[last_tag] = [] 
				mention2entities[last_tag].append(last_entity.strip())
			last_entity = line_split[0] + ' '
			last_tag = line_split[1][2:] 
		elif re.search('I-', line_split[1]): 
			last_entity += line_split[0] + ' '
	if last_entity != '': 
		if not last_tag in mention2entities:
			mention2entities[last_tag] = [] 
		mention2entities[last_tag].append(last_entity.strip())
	return 	mention2entities

	
def get_entities_from_phrase(tagged_sent, phrase2consider): 
	word = tagged_sent.split(' ')
	bio_tags = [normalise(x.split('/')[0])+ '\t'+ x.split('/')[2] for x in word]
	bio_text = '\n'.join(bio_tags)
	mention2entities = extract_entity(bio_text)
	#print mention2entities.keys() 
	
	## strip off unacceptable words 
	_mention2entities = {} 
	for mention in mention2entities: 
		if not mention in phrase2consider: 
			continue
		_mention2entities[mention] = [] 
		for entity in mention2entities[mention]: 
			_entity = ' '.join([word for word in entity.split(' ') if acceptable_word(word)]).strip()
			if _entity != '': 
				_mention2entities[mention].append(_entity)
			
	entities = []
	for mention in _mention2entities: 
		entities.extend(_mention2entities[mention])
	return entities	
	

def getKeywords(text, phrase2consider=['NP', 'ADJP']): 
	_text = cleanup(text)
	try:
		postoks, tagged_sent = get_pos_tags(_text)
		entities = get_entities_from_phrase(tagged_sent, phrase2consider)
	except: 
		return []
	return entities


symbols = ['&amp;', '!',',',';','.','(',')','\'']
stopwords = ['sir','day','title','shri','crore','day','time',"a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the",u'i', u'me', u'my', u'myself', u'we', u'our', u'ours', u'ourselves', u'you', u"you're", u"you've", u"you'll", u"you'd", u'your', u'yours', u'yourself', u'yourselves', u'he', u'him', u'his', u'himself', u'she', u"she's", u'her', u'hers', u'herself', u'it', u"it's", u'its', u'itself', u'they', u'them', u'their', u'theirs', u'themselves', u'what', u'which', u'who', u'whom', u'this', u'that', u"that'll", u'these', u'those', u'am', u'is', u'are', u'was', u'were', u'be', u'been', u'being', u'have', u'has', u'had', u'having', u'do', u'does', u'did', u'doing', u'a', u'an', u'the', u'and', u'but', u'if', u'or', u'because', u'as', u'until', u'while', u'of', u'at', u'by', u'for', u'with', u'about', u'against', u'between', u'into', u'through', u'during', u'before', u'after', u'above', u'below', u'to', u'from', u'up', u'down', u'in', u'out', u'on', u'off', u'over', u'under', u'again', u'further', u'then', u'once', u'here', u'there', u'when', u'where', u'why', u'how', u'all', u'any', u'both', u'each', u'few', u'more', u'most', u'other', u'some', u'such', u'no', u'nor', u'not', u'only', u'own', u'same', u'so', u'than', u'too', u'very', u's', u't', u'can', u'will', u'just', u'don', u"don't", u'should', u"should've", u'now', u'd', u'll', u'm', u'o', u're', u've', u'y', u'ain', u'aren', u"aren't", u'couldn', u"couldn't", u'didn', u"didn't", u'doesn', u"doesn't", u'hadn', u"hadn't", u'hasn', u"hasn't", u'haven', u"haven't", u'isn', u"isn't", u'ma', u'mightn', u"mightn't", u'mustn', u"mustn't", u'needn', u"needn't", u'shan', u"shan't", u'shouldn', u"shouldn't", u'wasn', u"wasn't", u'weren', u"weren't", u'won', u"won't", u'wouldn', u"wouldn't", 'sir','day','title','shri','crore','day','time',"a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves"]
#find keyword from one text
def find_keyword(tweet_text):
	# print tweet_text
	x=tweet_text
	# print type(x)
	if x is not None:
		x=x.strip()	
		#print x
		#sys.exit()
		token = x.strip().split()
		l=[]
		for t in token :
			if t.find('@')>=0 or t.find('#') >=0 or t.find('...') >=0 or t.find('http:') >=0 or t.find('https:') >=0  :
				pass
			else :
				l.append(t)
		bi=[]			
		temp = ' '.join(l)			
		keywords_list = getKeywords(temp)
		return keywords_list


################ END Keyword extraction ########################

def get_category(tweet_text, sentiment_value, security_value, communal_value):

	sentiment = sentiment_value
	security = security_value
	communal = communal_value
	category=0
	if (sentiment == 0 and security == 0  and communal == 1) or (sentiment == 0 and security == 2 and communal == 1): #pos
		category = '001'
	elif sentiment == 1 and security == 0 and communal == 1 or (sentiment == 1 and security == 2 and communal == 1): # neg
		category = '002'
	elif sentiment == 2 and security == 0 and communal == 1 or (sentiment == 2 and security == 2 and communal == 1): # neu
		category = '003'
	elif sentiment == 0 and security == 0 and communal == 0 or (sentiment == 0 and security == 2 and communal == 0): # com pos
		category = '011'
	elif sentiment == 1 and security == 0 and communal == 0 or (sentiment == 1 and security == 2 and communal == 0): # com neg
		category = '012'
	elif sentiment == 2 and security == 0 and communal == 0 or (sentiment == 2 and security == 2 and communal == 0): # com neutral
		category = '013'
	elif sentiment == 0 and security == 1 and communal == 1: # sec pos
		category = '101'
	elif sentiment == 1 and security == 1 and communal == 1: # sec neg
		category = '102'
	elif sentiment == 2 and security == 1 and communal == 1: # sec neu
		category = '103'
	elif sentiment == 0 and security == 1 and communal == 0: # com sec pos
		category = '111'
	elif sentiment == 1 and security == 1 and communal == 0: # com sec neg
		category = '112'
	elif sentiment == 2 and security == 1 and communal == 0: # com sec neu
		category = '113'
	else:
		category = str(sentiment)+str(security)+str(communal)

	return category






def get_s(tweet_text):
	#rt_sentiment
	clean_rtweet = extract_words(retweeted_text)
	train_feature_rt = grab_data(clean_rtweet)
	flatten_data_rt = flatten(train_feature_rt)
	padded_data_rt = pad(flatten_data_rt,0,30)

	new_padded_data_rt = np.array([padded_data_rt])
	result_rt = loaded_model.predict(new_padded_data_rt)

	rt_sentiment_value = result_rt[0].argmax(0)

	return rt_sentiment_value





def on_data(data):

	# print("--------------------")
			
	# start_time = time.time()
	full_tweet = json.loads(data)

	# print(full_tweet)
	# if full_tweet.has_key('retweeted_status'):
	if 'retweeted_status' in full_tweet:
		if not isinstance(full_tweet['retweeted_status'], dict):
			full_tweet['retweeted_status']=full_tweet['retweeted_status'].__dict__ 
		retweeted_text = full_tweet['retweeted_status']['text']
		# print("----------------------------------------------------")

		#rt_sentiment
		clean_rtweet = extract_words(retweeted_text)
		train_feature_rt = grab_data(clean_rtweet)
		flatten_data_rt = flatten(train_feature_rt)
		padded_data_rt = pad(flatten_data_rt,0,30)

		new_padded_data_rt = np.array([padded_data_rt])
		result_rt = loaded_model.predict(new_padded_data_rt)

		rt_sentiment_value = result_rt[0].argmax(0)
		full_tweet['retweeted_status']['sentiment'] = rt_sentiment_value

		#security
		result_rsecurity = loaded_model_security.predict(new_padded_data_rt)
		# print('security',result_rsecurity[0],result_rsecurity[0].argmax(0))
		security_rvalue = result_rsecurity[0].argmax(0)

		#communal 

		result_rcommunal = loaded_model_communal.predict(new_padded_data_rt)
		# print('communal', result_rcommunal[0], result_rcommunal[0].argmax(0))
		communal_rvalue = result_rcommunal[0].argmax(0)

		result_category = get_category(retweeted_text, rt_sentiment_value, security_rvalue, communal_rvalue)
		full_tweet['retweeted_status']['category'] = result_category
		# print("aagaya"+str(rt_sentiment_value))

		# Confidence -------

		flat_rsentiment = [item for sublist in result_rt for item in sublist]
		flat_rsecurity = [item for sublist in result_rsecurity for item in sublist]

		r_confidence = flat_rsentiment[1] * max(flat_rsecurity)
		full_tweet['retweeted_status']['confidence'] = float(r_confidence)/2

		print("rconfidence", float(r_confidence)/2)


	# if full_tweet.has_key('quoted_status'):
	if 'quoted_status' in full_tweet:
		if not isinstance(full_tweet['quoted_status'], dict):
			full_tweet['quoted_status']=full_tweet['quoted_status'].__dict__
		quoted_text = full_tweet['quoted_status']['text']
		result_quoted_keyword = find_keyword(quoted_text)
		full_tweet['quoted_status']['keyword']=result_quoted_keyword


		#qt_sentiment

		clean_qtweet = extract_words(quoted_text)
		train_feature_qt = grab_data(clean_qtweet)
		flatten_data_qt = flatten(train_feature_qt)
		padded_data_qt = pad(flatten_data_qt,0,30)

		new_padded_data_qt = np.array([padded_data_qt])
		result_qt = loaded_model.predict(new_padded_data_qt)

		qt_sentiment_value = result_qt[0].argmax(0)
		full_tweet['quoted_status']['sentiment'] = qt_sentiment_value

		#security
		result_qsecurity = loaded_model_security.predict(new_padded_data_qt)
		# print('security',result_qsecurity[0],result_qsecurity[0].argmax(0))
		security_qvalue = result_qsecurity[0].argmax(0)

		#communal 

		result_qcommunal = loaded_model_communal.predict(new_padded_data_qt)
		# print('communal', result_qcommunal[0], result_qcommunal[0].argmax(0))
		communal_qvalue = result_qcommunal[0].argmax(0)

		result_category = get_category(quoted_text, qt_sentiment_value, security_qvalue, communal_qvalue)
		full_tweet['quoted_status']['category'] = result_category			
		# print(str(qt_sentiment_value))

		# Confidence -------

		flat_qsentiment = [item for sublist in result_qt for item in sublist]
		flat_qsecurity = [item for sublist in result_qsecurity for item in sublist]

		q_confidence = flat_qsentiment[1] * max(flat_qsecurity)
		full_tweet['quoted_status']['confidence'] = float(q_confidence)/2

		print("qconfidence", float(q_confidence)/2)


	try:

		tweet_text = full_tweet['text']	
	except Exception as e:

		logger.info("text is missing------->")
		logger.info(str(e))					
		logger.info(str(datetime.datetime.now()))
		logger.info(data)	
		return

	# print(tweet_text)
	# self.client_socket.send(data)
	clean_tweets = extract_words(tweet_text)
	train_feature = grab_data(clean_tweets)
	flatten_data = flatten(train_feature)
	padded_data = pad(flatten_data,0,30)
	#print(len(padded_data))
	padded_data = np.array([padded_data])
	result =  loaded_model.predict(padded_data)
	#print(padded_data,result[0])
	# b = np.zeros((3,), dtype=int)
	# print(result[0],result[0].argmax(0))
	sentiment_value=result[0].argmax(0)
	full_tweet['sentiment'] = sentiment_value

	result_keyword = find_keyword(tweet_text)
	full_tweet['keyword']=result_keyword


	#security
	result_security = loaded_model_security.predict(padded_data)
	# print('security',result_security[0],result_security[0].argmax(0))
	security_value = result_security[0].argmax(0)
	full_tweet['security'] = security_value

	#communal 

	result_communal = loaded_model_communal.predict(padded_data)
	# print('communal', result_communal[0], result_communal[0].argmax(0))
	communal_value = result_communal[0].argmax(0)
	full_tweet['communal'] = communal_value

	result_category = get_category(tweet_text, sentiment_value, security_value, communal_value)
	full_tweet['category'] = result_category
	# print("The category is ", result_category)

	# Confidence -------

	flat_sentiment = [item for sublist in result for item in sublist]
	flat_security = [item for sublist in result_security for item in sublist]

	confidence = flat_sentiment[1] * max(flat_security)
	full_tweet['confidence'] = float(confidence)/2

	print("confidence", float(confidence)/2)
	

	data=json.dumps(full_tweet,encoding="utf-8")
	

	#print(full_tweet)
	# data=json.dumps(full_tweet)
	
	return data

def merge_dicts(x, y):    
	for key in y:
		if key in x:
			if isinstance(x[key], dict) and isinstance(y[key], dict):
				merge_dicts(x[key], y[key])
		else:
			x[key] = y[key]
	return x
