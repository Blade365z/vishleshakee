-- MariaDB dump 10.17  Distrib 10.5.5-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: smat
-- ------------------------------------------------------
-- Server version	10.5.5-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `city_states`
--

DROP TABLE IF EXISTS `city_states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `city_states` (
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city_states`
--

LOCK TABLES `city_states` WRITE;
/*!40000 ALTER TABLE `city_states` DISABLE KEYS */;
INSERT INTO `city_states` VALUES ('gohana','haryana','india'),('madhepura','bihar','india'),('erode','tamil nadu','india'),('pachora','maharashtra','india'),('dalli-rajhara','chhattisgarh','india'),('sikandra rao','uttar pradesh','india'),('shahabad','karnataka','india'),('patratu','jharkhand','india'),('todaraisingh','rajasthan','india'),('thanesar','haryana','india'),('thodupuzha','kerala','india'),('wani','maharashtra','india'),('sasaram','bihar','india'),('perambalur','tamil nadu','india'),('varkala','kerala','india'),('tirunelveli','tamil nadu','india'),('sawai madhopur','rajasthan','india'),('sidhi','madhya pradesh','india'),('margao','goa','india'),('piriyapatna','karnataka','india'),('nagla','uttarakhand','india'),('warisaliganj','bihar','india'),('phagwara','punjab','india'),('tenu dam-cum-kathhara','jharkhand','india'),('pali','rajasthan','india'),('pali','madhya pradesh','india'),('brahmapur','odisha','india'),('vadnagar','gujarat','india'),('siliguri','west bengal','india'),('pachore','madhya pradesh','india'),('morshi','maharashtra','india'),('pollachi','tamil nadu','india'),('nagda','madhya pradesh','india'),('sheikhpura','bihar','india'),('mandya','karnataka','india'),('tiruvethipuram','tamil nadu','india'),('yavatmal','maharashtra','india'),('neyveli (ts)','tamil nadu','india'),('talode','maharashtra','india'),('raayachuru','karnataka','india'),('ponnur','andhra pradesh','india'),('jangaon','telangana','india'),('shrigonda','maharashtra','india'),('nawanshahr','punjab','india'),('unnamalaikadai','tamil nadu','india'),('rasra','uttar pradesh','india'),('sitarganj','uttarakhand','india'),('buxar','bihar','india'),('purna','maharashtra','india'),('arsikere','karnataka','india'),('tekkalakote','karnataka','india'),('sindhagi','karnataka','india'),('kaithal','haryana','india'),('palia kalan','uttar pradesh','india'),('multai','madhya pradesh','india'),('jammu','jammu and kashmir','india'),('unjha','gujarat','india'),('marigaon','assam','india'),('satara','maharashtra','india'),('tadepalligudem','andhra pradesh','india'),('machilipatnam','andhra pradesh','india'),('farooqnagar','telangana','india'),('karaikal','puducherry','india'),('hajipur','bihar','india'),('kharar','punjab','india'),('thiruthuraipoondi','tamil nadu','india'),('kohima','nagaland','india'),('adoni','andhra pradesh','india'),('city','state','country'),('lar','uttar pradesh','india'),('kolkata','west bengal','india'),('batala','punjab','india'),('palakkad','kerala','india'),('nilambur','kerala','india'),('nandura','maharashtra','india'),('sedam','karnataka','india'),('mandvi','gujarat','india'),('phalodi','rajasthan','india'),('tenali','andhra pradesh','india'),('mancherial','telangana','india'),('mattannur','kerala','india'),('noida','uttar pradesh','india'),('kadapa','andhra pradesh','india'),('madurai','tamil nadu','india'),('madhubani','bihar','india'),('mihijam','jharkhand','india'),('parangipettai','tamil nadu','india'),('rewari','haryana','india'),('hansi','haryana','india'),('nagapattinam','tamil nadu','india'),('petlad','gujarat','india'),('sikar','rajasthan','india'),('rajahmundry','andhra pradesh','india'),('rameshwaram','tamil nadu','india'),('neem-ka-thana','rajasthan','india'),('sambhal','uttar pradesh','india'),('paravoor','kerala','india'),('solapur','maharashtra','india'),('srikalahasti','andhra pradesh','india'),('kayamkulam','kerala','india-'),('pandhurna','madhya pradesh','india'),('sehore','madhya pradesh','india'),('tulsipur','uttar pradesh','india'),('coimbatore','tamil nadu','india'),('uchgaon','maharashtra','india'),('barh','bihar','india'),('north lakhimpur','assam','india'),('aurangabad','maharashtra','india'),('aurangabad','bihar','india'),('manmad','maharashtra','india'),('parli','maharashtra','india'),('pilibanga','rajasthan','india'),('rajgarh','madhya pradesh','india'),('purnia','bihar','india'),('gobichettipalayam','tamil nadu','india'),('samana','punjab','india'),('sangaria','rajasthan','india'),('soron','uttar pradesh','india'),('obra','uttar pradesh','india'),('udhagamandalam','tamil nadu','india'),('lathi','gujarat','india'),('mysore','karnatka','india'),('mahbubnagar','telangana','india'),('pandurban agglomeration','west bengal','india'),('nilanga','maharashtra','india'),('narnaul','haryana','india'),('niwai','uttar pradesh','india'),('kamareddy','telangana','india'),('niwari','madhya pradesh','india'),('jagdalpur','chhattisgarh','india'),('rajgarh (alwar)','rajasthan','india'),('malur','karnataka','india'),('koyilandy','kerala','india'),('samastipur','bihar','india'),('bhiwandi','maharashtra','india'),('udhampur','jammu and kashmir','india'),('ramdurg','karnataka','india'),('lunglei','mizoram','india'),('dhubri','assam','india'),('baripada town','odisha','india'),('tiptur','karnataka','india'),('meerut','uttar pradesh','india'),('mudabidri','karnataka','india'),('sahaswan','uttar pradesh','india'),('sheopur','madhya pradesh','india'),('pindwara','rajasthan','india'),('shiggaon','karnataka','india'),('kapurthala','punjab','india'),('narasapuram','andhra pradesh','india'),('srinivaspur','karnataka','india'),('port blair','andaman and nicobar islands','india'),('savanur','karnataka','india'),('vandavasi','tamil nadu','india'),('moradabad','uttar pradesh','india'),('bhuj','gujarat','india'),('oddanchatram','tamil nadu','india'),('darjiling','west bengal','india'),('medinipur','west bengal','india'),('mahendragarh','haryana','india'),('mahidpur','madhya pradesh','india'),('washim','maharashtra','india'),('moga','punjab','india'),('bhiwani','haryana','india'),('kunnamkulam','kerala','india'),('mauganj','madhya pradesh','india'),('upleta','gujarat','india'),('mhaswad','maharashtra','india'),('nowgong','madhya pradesh','india'),('nabarangapur','odisha','india'),('sendhwa','madhya pradesh','india'),('silao','bihar','india'),('kailasahar','tripura','india'),('sheohar','bihar','india'),('sunam','punjab','india'),('panchkula','haryana','india'),('silapathar','assam','india'),('rajagangapur','odisha','india'),('marhaura','bihar','india'),('vinukonda','andhra pradesh','india'),('gobindgarh','punjab','india'),('asansol','west bengal','india'),('taki','west bengal','india'),('keshod','gujarat','india'),('sainthia','west bengal','india'),('tohana','haryana','india'),('repalle','andhra pradesh','india'),('zira','punjab','india'),('radhanpur','gujarat','india'),('fatehpur sikri','uttar pradesh','india'),('nagpur','maharashtra','india'),('phusro','jharkhand','india'),('amroha','uttar pradesh','india'),('tura','meghalaya','india'),('warud','maharashtra','india'),('muvattupuzha','kerala','india'),('safidon','haryana','india'),('makhdumpur','bihar','india'),('palladam','tamil nadu','india'),('malkapur','maharashtra','india'),('bhagalpur','bihar','india'),('imphal','manipur','india'),('cuttack','odisha','india'),('pipariya','madhya pradesh','india'),('umreth','gujarat','india'),('sirsi','uttar pradesh','india'),('sirsi','karnataka','india'),('warangal','telangana','india'),('tumkur','karnataka','india'),('srisailam project (right flank colony) township','andhra pradesh','india'),('chaibasa','jharkhand','india'),('mhowgaon','madhya pradesh','india'),('saunda','jharkhand','india'),('\"shahabad',' rampur\"','uttar pradesh'),('orai','uttar pradesh','india'),('ahmednagar','maharashtra','india'),('pernampattu','tamil nadu','india'),('sopore','jammu and kashmir','india'),('vellore','tamil nadu','india'),('ambejogai','maharashtra','india'),('purwa','uttar pradesh','india'),('wara seoni','madhya pradesh','india'),('virudhachalam','tamil nadu','india'),('faridkot','punjab','india'),('osmanabad','maharashtra','india'),('shahade','maharashtra','india'),('amalapuram','andhra pradesh','india'),('surat','gujarat','india'),('gurdaspur','punjab','india'),('visnagar','gujarat','india'),('charkhi dadri','haryana','india'),('tilda newra','chhattisgarh','india'),('arrah','bihar','india'),('karur','tamil nadu','india'),('sironj','madhya pradesh','india'),('nahan','himachal pradesh','india'),('sira','karnataka','india'),('udaipur','tripura','india'),('udaipur','rajasthan','india'),('sundarnagar','himachal pradesh','india'),('vijaypur','madhya pradesh','india'),('bargarh','odisha','india'),('rudauli','uttar pradesh','india'),('mangrulpir','maharashtra','india'),('ajmer','rajasthan','india'),('mahnar bazar','bihar','india'),('sohagpur','madhya pradesh','india'),('kalpi','uttar pradesh','india'),('zunheboto','nagaland','india'),('prantij','rajasthan','india'),('maharajpur','madhya pradesh','india'),('guntakal','andhra pradesh','india'),('rajura','maharashtra','india'),('tezpur','assam','india'),('anantapur','andhra pradesh','india'),('natham','tamil nadu','india'),('rampurhat','west bengal','india'),('lalgudi','tamil nadu','india'),('pusad','maharashtra','india'),('yevla','maharashtra','india'),('\"morinda',' india\"','punjab'),('fazilka','punjab','india'),('reengus','rajasthan','india'),('sohna','haryana','india'),('pen','maharashtra','india'),('tharangambadi','tamil nadu','india'),('soyagaon','maharashtra','india'),('seoni','madhya pradesh','india'),('thirupuvanam','tamil nadu','india'),('macherla','andhra pradesh','india'),('mandalgarh','rajasthan','india'),('raxaul bazar','bihar','india'),('nedumangad','kerala','india'),('thanjavur','tamil nadu','india'),('parvathipuram','andhra pradesh','india'),('shivpuri','madhya pradesh','india'),('dumraon','bihar','india'),('gudivada','andhra pradesh','india'),('hubli-dharwad','karnataka','india'),('talikota','karnataka','india'),('attingal','kerala','india'),('padmanabhapuram','tamil nadu','india'),('murwara (katni)','madhya pradesh','india'),('warora','maharashtra','india'),('chirmiri','chhattisgarh','india'),('raiganj','west bengal','india'),('tiruppur','tamil nadu','india'),('sadalagi','karnataka','india'),('kasaragod','kerala','india'),('gadwal','telangana','india'),('kannur','kerala','india'),('rajula','gujarat','india'),('ludhiana','punjab','india'),('vaijapur','maharashtra','india'),('chikkamagaluru','karnataka','india'),('bhavnagar','gujarat','india'),('una','gujarat','india'),('bengaluru','karnataka','india'),('palghar','maharashtra','india'),('venkatagiri','andhra pradesh','india'),('rajgir','bihar','india'),('habra','west bengal','india'),('nokha','rajasthan','india'),('nokha','bihar','india'),('rampur','uttar pradesh','india'),('chandausi','uttar pradesh','india'),('aizawl','mizoram','india'),('ramtek','maharashtra','india'),('sujanpur','punjab','india'),('ahmedabad','gujarat','india'),('sailu','maharashtra','india'),('pallikonda','tamil nadu','india'),('thirumangalam','tamil nadu','india'),('uthiramerur','tamil nadu','india'),('tinsukia','assam','india'),('udgir','maharashtra','india'),('nakur','uttar pradesh','india'),('pathardi','maharashtra','india'),('kodungallur','kerala','india'),('\"shamsabad',' farrukhabad\"','uttar pradesh'),('sarangpur','madhya pradesh','india'),('salaya','gujarat','india'),('mankachar','assam','india'),('punjaipugalur','tamil nadu','india'),('medak','telangana','india'),('gangarampur','west bengal','india'),('talwara','punjab','india'),('surban agglomerationr','uttar pradesh','india'),('naihati','west bengal','india'),('panaji','goa','india'),('thoubal','manipur','india'),('latur','maharashtra','india'),('ratangarh','rajasthan','india'),('sattenapalle','andhra pradesh','india'),('mudhol','karnataka','india'),('ballari','karnataka','india'),('mariani','assam','india'),('murtijapur','maharashtra','india'),('nidadavole','andhra pradesh','india'),('rayadurg','andhra pradesh','india'),('guntur','andhra pradesh','india'),('anand','gujarat','india'),('jabalpur','madhya pradesh','india'),('allahabad','uttar pradesh','india'),('katihar','bihar','india'),('saundatti-yellamma','karnataka','india'),('rampur maniharan','uttar pradesh','india'),('hardwar','uttarakhand','india'),('saharsa','bihar','india'),('punch','jammu and kashmir','india'),('naidupet','andhra pradesh','india'),('sivakasi','tamil nadu','india'),('bettiah','bihar','india'),('naraura','uttar pradesh','india'),('puthuppally','kerala','india'),('sandi','uttar pradesh','india'),('pandharpur','maharashtra','india'),('dhoraji','gujarat','india'),('tirora','maharashtra','india'),('nehtaur','uttar pradesh','india'),('santipur','west bengal','india'),('seohara','uttar pradesh','india'),('nandivaram-guduvancheri','tamil nadu','india'),('hindupur','andhra pradesh','india'),('arambagh','west bengal','india'),('akot','maharashtra','india'),('begusarai','bihar','india'),('sangole','maharashtra','india'),('mudalagi','karnataka','india'),('modasa','gujarat','india'),('tharad','gujarat','india'),('purulia','west bengal','india'),('vyara','gujarat','india'),('sabalgarh','madhya pradesh','india'),('suratgarh','rajasthan','india'),('akola','maharashtra','india'),('azamgarh','uttar pradesh','india'),('muzaffarpur','bihar','india'),('nandgaon','maharashtra','india'),('nashik','maharashtra','india'),('malappuram','kerala','india'),('kagaznagar','telangana','india'),('porsa','madhya pradesh','india'),('nelamangala','karnataka','india'),('anantnag','jammu and kashmir','india'),('mount abu','rajasthan','india'),('panipat','haryana','india'),('sakaleshapura','karnataka','india'),('sundargarh','odisha','india'),('bokaro steel city','jharkhand','india'),('tuni','andhra pradesh','india'),('eluru','andhra pradesh','india'),('sandila','uttar pradesh','india'),('nawapur','maharashtra','india'),('bilaspur','chhattisgarh','india'),('godhra','gujarat','india'),('mayang imphal','manipur','india'),('jind','haryana','india'),('rupnagar','punjab','india'),('koratla','telangana','india'),('sanawad','madhya pradesh','india'),('ichalkaranji','maharashtra','india'),('\"vijainagar',' ajmer\"','rajasthan'),('yemmiganur','andhra pradesh','india'),('mohali','punjab','india'),('ramachandrapuram','andhra pradesh','india'),('shillong','meghalaya','india'),('shirpur-warwade','maharashtra','india'),('nadiad','gujarat','india'),('sarni','madhya pradesh','india'),('uran','maharashtra','india'),('mahad','maharashtra','india'),('narayanpet','telangana','india'),('nautanwa','uttar pradesh','india'),('tundla','uttar pradesh','india'),('vadipatti','tamil nadu','india'),('mandsaur','madhya pradesh','india'),('mangaldoi','assam','india'),('ramganj mandi','rajasthan','india'),('thangadh','gujarat','india'),('renigunta','andhra pradesh','india'),('palai','kerala','india'),('muktsar','punjab','india'),('nanpara','uttar pradesh','india'),('sirsaganj','uttar pradesh','india'),('ponneri','tamil nadu','india'),('kyathampalle','telangana','india'),('reoti','uttar pradesh','india'),('kharagpur','west bengal','india'),('thiruvalla','kerala','india'),('tanuku','andhra pradesh','india'),('tarakeswar','west bengal','india'),('kandukur','andhra pradesh','india'),('nepanagar','madhya pradesh','india'),('terdal','karnataka','india'),('yamunanagar','haryana','india'),('phulpur','uttar pradesh','india'),('jodhpur','rajasthan','india'),('jorhat','assam','india'),('madhugiri','karnataka','india'),('zaidpur','uttar pradesh','india'),('shivamogga','karnataka','india'),('pathri','maharashtra','india'),('raghunathpur','west bengal','india'),('salem','tamil nadu','india'),('dhuri','punjab','india'),('thakurdwara','uttar pradesh','india'),('saiha','mizoram','india'),('vikarabad','telangana','india'),('shahjahanpur','uttar pradesh','india'),('manavadar','gujarat','india'),('alirajpur','madhya pradesh','india'),('padrauna','uttar pradesh','india'),('mandi','himachal pradesh','india'),('mansa','punjab','india'),('mansa','gujarat','india'),('salur','andhra pradesh','india'),('noorpur','uttar pradesh','india'),('malout','punjab','india'),('naila janjgir','chhattisgarh','india'),('nagari','andhra pradesh','india'),('jaggaiahpet','andhra pradesh','india'),('taliparamba','kerala','india'),('raisen','madhya pradesh','india'),('pithapuram','andhra pradesh','india'),('sadri','rajasthan','india'),('nuzvid','andhra pradesh','india'),('kancheepuram','tamil nadu','india'),('bodhan','telangana','india'),('tittakudi','tamil nadu','india'),('tanda','uttar pradesh','india'),('chittur-thathamangalam','kerala','india'),('pilani','rajasthan','india'),('malda','west bengal','india'),('kashipur','uttarakhand','india'),('markapur','andhra pradesh','india'),('dibrugarh','assam','india'),('mundargi','karnataka','india'),('lucknow','uttar pradesh','india'),('tehri','uttarakhand','india'),('vadakkuvalliyur','tamil nadu','india'),('srikakulam','andhra pradesh','india'),('rajaldesar','rajasthan','india'),('srirampore','west bengal','india'),('limbdi','gujarat','india'),('theni allinagaram','tamil nadu','india'),('cherthala','kerala','india'),('delhi','delhi','india'),('titlagarh','odisha','india'),('tuljapur','maharashtra','india'),('samalkot','andhra pradesh','india'),('tandur','telangana','india'),('makrana','rajasthan','india'),('punalur','kerala','india'),('barnala','punjab','india'),('qadian','punjab','india'),('nakodar','punjab','india'),('kakinada','andhra pradesh','india'),('malkangiri','odisha','india'),('rampura phul','punjab','india'),('najibabad','uttar pradesh','india'),('rajpura','punjab','india'),('nongstoin','meghalaya','india'),('ganjbasoda','madhya pradesh','india'),('umred','maharashtra','india'),('shoranur','kerala','india'),('nellikuppam','tamil nadu','india'),('rajam','andhra pradesh','india'),('namakkal','tamil nadu','india'),('srinagar','uttarakhand','india'),('srinagar','jammu and kashmir','india'),('utraula','uttar pradesh','india'),('nagar','rajasthan','india'),('khair','uttar pradesh','india'),('mukerian','punjab','india'),('srivilliputhur','tamil nadu','india'),('dhamtari','chhattisgarh','india'),('kendrapara','odisha','india'),('bongaigaon city','assam','india'),('lalitpur','uttar pradesh','india'),('shahpura','rajasthan','india'),('tirukkoyilur','tamil nadu','india'),('manihari','bihar','india'),('rayachoti','andhra pradesh','india'),('raurkela','odisha','india'),('parasi','uttar pradesh','india'),('mahuva','gujarat','india'),('manjlegaon','maharashtra','india'),('mandla','madhya pradesh','india'),('miryalaguda','telangana','india'),('wankaner','gujarat','india'),('phulera','rajasthan','india'),('rajampet','andhra pradesh','india'),('sambalpur','odisha','india'),('sahawar','uttar pradesh','india'),('mukhed','maharashtra','india'),('nawada','bihar','india'),('pathanamthitta','kerala','india'),('panamattom','kerala','india'),('ratlam','madhya pradesh','india'),('tiruchendur','tamil nadu','india'),('bhubaneswar','odisha','india'),('kanpur','uttar pradesh','india'),('jamnagar','gujarat','india'),('piro','bihar','india'),('maddur','karnataka','india'),('mundi','madhya pradesh','india'),('jharsuguda','odisha','india'),('nohar','rajasthan','india'),('muddebihal','karnataka','india'),('jhansi','uttar pradesh','india'),('udumalaipettai','tamil nadu','india'),('thuraiyur','tamil nadu','india'),('panagudi','tamil nadu','india'),('jamalpur','bihar','india'),('revelganj','bihar','india'),('savarkundla','gujarat','india'),('aligarh','uttar pradesh','india'),('sardarshahar','rajasthan','india'),('lumding','assam','india'),('renukoot','uttar pradesh','india'),('seoni-malwa','madhya pradesh','india'),('vrindavan','uttar pradesh','india'),('taraori','haryana','india'),('sivagiri','tamil nadu','india'),('paithan','maharashtra','india'),('dhanbad','jharkhand','india'),('perumbavoor','kerala','india'),('viluppuram','tamil nadu','india'),('panna','madhya pradesh','india'),('pithampur','madhya pradesh','india'),('patti','punjab','india'),('sultanpur','uttar pradesh','india'),('parbhani','maharashtra','india'),('uran islampur','maharashtra','india'),('sitamarhi','bihar','india'),('nabadwip','west bengal','india'),('sattur','tamil nadu','india'),('nasirabad','rajasthan','india'),('tharamangalam','tamil nadu','india'),('suriyampalayam','tamil nadu','india'),('mangrol','rajasthan','india'),('mangrol','gujarat','india'),('pukhrayan','uttar pradesh','india'),('munger','bihar','india'),('sherkot','uttar pradesh','india'),('tarn taran','punjab','india'),('guruvayoor','kerala','india'),('deesa','gujarat','india'),('bankura','west bengal','india'),('arakkonam','tamil nadu','india'),('ujjain','madhya pradesh','india'),('lunawada','gujarat','india'),('bhimavaram','andhra pradesh','india'),('wai','maharashtra','india'),('samdhan','uttar pradesh','india'),('ongole','andhra pradesh','india'),('tiruvannamalai','tamil nadu','india'),('vedaranyam','tamil nadu','india'),('amalner','maharashtra','india'),('bharatpur','rajasthan','india'),('rajkot','gujarat','india'),('bhilai nagar','chhattisgarh','india'),('tirwaganj','uttar pradesh','india'),('mahesana','gujarat','india'),('rau','madhya pradesh','india'),('firozpur','punjab','india'),('rawatsar','rajasthan','india'),('khammam','telangana','india'),('patan','gujarat','india'),('robertsganj','uttar pradesh','india'),('pilkhuwa','uttar pradesh','india'),('sonipat','haryana','india'),('sangrur','punjab','india'),('dimapur','nagaland','india'),('mathura','uttar pradesh','india'),('mira-bhayandar','maharashtra','india'),('sunabeda','odisha','india'),('nowrozabad (khodargama)','madhya pradesh','india'),('pattamundai','odisha','india'),('navsari','gujarat','india'),('sagara','karnataka','india'),('\"shamsabad',' agra\"','uttar pradesh'),('rudrapur','uttarakhand','india'),('rudrapur','uttar pradesh','india'),('uravakonda','andhra pradesh','india'),('sangli','maharashtra','india'),('lakhisarai','bihar','india'),('sherghati','bihar','india'),('mumbai','maharashtra','india'),('dehri-on-sone','bihar','india'),('porbandar','gujarat','india'),('sitapur','uttar pradesh','india'),('ujhani','uttar pradesh','india'),('jhumri tilaiya','jharkhand','india'),('jehanabad','bihar','india'),('tasgaon','maharashtra','india'),('puttur','karnataka','india'),('puttur','andhra pradesh','india'),('mandapeta','andhra pradesh','india'),('rabkavi banhatti','karnataka','india'),('yawal','maharashtra','india'),('mangaluru','karnataka','india'),('periyakulam','tamil nadu','india'),('sangamner','maharashtra','india'),('vizianagaram','andhra pradesh','india'),('sujangarh','rajasthan','india'),('bhadrak','odisha','india'),('sircilla','telangana','india'),('sanchore','rajasthan','india'),('kollam','kerala','india'),('peravurani','tamil nadu','india'),('hoshiarpur','punjab','india'),('nagercoil','tamil nadu','india'),('pithoragarh','uttarakhand','india'),('bahraich','uttar pradesh','india'),('jalpaiguri','west bengal','india'),('tindivanam','tamil nadu','india'),('peddapuram','andhra pradesh','india'),('pallapatti','tamil nadu','india'),('marmagao','goa','india'),('wokha','nagaland','india'),('umarkhed','maharashtra','india'),('tenkasi','tamil nadu','india'),('alwar','rajasthan','india'),('new delhi','delhi','india'),('palanpur','gujarat','india'),('chilakaluripet','andhra pradesh','india'),('sirohi','rajasthan','india'),('murliganj','bihar','india'),('bhopal','madhya pradesh','india'),('bikaner','rajasthan','india'),('sankarankovil','tamil nadu','india'),('pilibhit','uttar pradesh','india'),('chennai','tamil nadu','india'),('shegaon','maharashtra','india'),('sadulshahar','rajasthan','india'),('afzalpur','karnataka','india'),('supaul','bihar','india'),('achhnera','uttar pradesh','india'),('nanded-waghala','maharashtra','india'),('sahjanwa','uttar pradesh','india'),('lalganj','uttar pradesh','india'),('lalganj','bihar','india'),('panvel','maharashtra','india'),('safipur','uttar pradesh','india'),('sidhpur','gujarat','india'),('manvi','karnataka','india'),('raisinghnagar','rajasthan','india'),('tikamgarh','madhya pradesh','india'),('faridabad','haryana','india'),('mangalvedhe','maharashtra','india'),('pauni','maharashtra','india'),('ankleshwar','gujarat','india'),('rayagada','odisha','india'),('viswanatham','tamil nadu','india'),('haldwani-cum-kathgodam','uttarakhand','india'),('baleshwar town','odisha','india'),('khowai','tripura','india'),('asarganj','bihar','india'),('balurghat','west bengal','india'),('merta city','rajasthan','india'),('pinjore','haryana','india'),('english bazar','west bengal','india'),('magadi','karnataka','india'),('surandai','tamil nadu','india'),('wadgaon road','maharashtra','india'),('guwahati','assam','india'),('shujalpur','madhya pradesh','india'),('perinthalmanna','kerala','india'),('sikandrabad','uttar pradesh','india'),('mul','maharashtra','india'),('null','west bengal','india'),('null','uttarakhand','india'),('null','uttar pradesh','india'),('null','tripura','india'),('null','telangana','india'),('null','tamil nadu','india'),('null','rajasthan','india'),('null','punjab','india'),('null','puducherry','india'),('null','odisha','india'),('null','nagaland','india'),('null','mizoram','india'),('null','meghalaya','india'),('null','manipur','india'),('null','maharashtra','india'),('null','madhya pradesh','india'),('null','kerala','india'),('null','karnatka','india'),('null','karnataka','india'),('null','jharkhand','india'),('null','jammu and kashmir','india'),('null','himachal pradesh','india'),('null','haryana','india'),('null','gujarat','india'),('null','goa','india'),('null','delhi','india'),('null','dadra and nagar haveli','india'),('null','chhattisgarh','india'),('null','chandigarh','india'),('null','bihar','india'),('null','assam','india'),('null','arunachal pradesh','india'),('null','andhra pradesh','india'),('null','andaman and nicobar islands','india'),('khambhat','gujarat','india'),('talaja','gujarat','india'),('gokak','karnataka','india'),('siwan','bihar','india'),('patiala','punjab','india'),('umarga','maharashtra','india'),('mahasamund','chhattisgarh','india'),('nimbahera','rajasthan','india'),('uthamapalayam','tamil nadu','india'),('sholavandan','tamil nadu','india'),('malerkotla','punjab','india'),('jaipur','rajasthan','india'),('panruti','tamil nadu','india'),('anjangaon','maharashtra','india'),('chandigarh','chandigarh','india'),('bharuch','gujarat','india'),('manwath','maharashtra','india'),('peringathur','kerala','india'),('kothagudem','telangana','india'),('bheemunipatnam','andhra pradesh','india'),('lakheri','rajasthan','india'),('darbhanga','bihar','india'),('purqurban agglomerationzi','uttar pradesh','india'),('nangal','punjab','india'),('tirukalukundram','tamil nadu','india'),('rasipuram','tamil nadu','india'),('shahdol','madhya pradesh','india'),('shirdi','maharashtra','india'),('pedana','andhra pradesh','india'),('pasighat','arunachal pradesh','india'),('margherita','assam','india'),('tirur','kerala','india'),('mussoorie','uttarakhand','india'),('mahalingapura','karnataka','india'),('raver','maharashtra','india'),('bahadurgarh','haryana','india'),('thiruvananthapuram','kerala','india'),('ranipet','tamil nadu','india'),('o\' valley','tamil nadu','india'),('thiruvallur','tamil nadu','india'),('pauri','uttarakhand','india'),('bhawanipatna','odisha','india'),('urmar tanda','punjab','india'),('sheoganj','rajasthan','india'),('raigarh','chhattisgarh','india'),('rajnandgaon','chhattisgarh','india'),('durg','chhattisgarh','india'),('rishikesh','uttarakhand','india'),('mungeli','chhattisgarh','india'),('korba','chhattisgarh','india'),('tuensang','nagaland','india'),('dumka','jharkhand','india'),('taranagar','rajasthan','india'),('todabhim','rajasthan','india'),('morena','madhya pradesh','india'),('morvi','gujarat','india'),('samthar','uttar pradesh','india'),('pune','maharashtra','india'),('prithvipur','madhya pradesh','india'),('ranibennur','karnataka','india'),('sullurpeta','andhra pradesh','india'),('rahuri','maharashtra','india'),('vaikom','kerala','india'),('baharampur','west bengal','india'),('mokameh','bihar','india'),('sibsagar','assam','india'),('shishgarh','uttar pradesh','india'),('sarsod','haryana','india'),('arvi','maharashtra','india'),('singrauli','madhya pradesh','india'),('mehkar','maharashtra','india'),('ramngarh','rajasthan','india'),('sanand','gujarat','india'),('kurnool','andhra pradesh','india'),('saidpur','uttar pradesh','india'),('rajakhera','rajasthan','india'),('narwana','haryana','india'),('dhenkanal','odisha','india'),('lanka','assam','india'),('sanduru','karnataka','india'),('hapur','uttar pradesh','india'),('changanassery','kerala','india'),('giridih','jharkhand','india'),('manasa','madhya pradesh','india'),('sindagi','karnataka','india'),('chhapra','gujarat','india'),('chhapra','bihar','india'),('medininagar (daltonganj)','jharkhand','india'),('pehowa','haryana','india'),('sugauli','bihar','india'),('khanna','punjab','india'),('nagarkurnool','telangana','india'),('sivaganga','tamil nadu','india'),('nadbai','rajasthan','india'),('periyasemur','tamil nadu','india'),('rae bareli','uttar pradesh','india'),('maihar','madhya pradesh','india'),('lahar','madhya pradesh','india'),('nathdwara','rajasthan','india'),('sirkali','tamil nadu','india'),('phaltan','maharashtra','india'),('mavelikkara','kerala','india'),('mulbagal','karnataka','india'),('achalpur','maharashtra','india'),('jamshedpur','jharkhand','india'),('vadodara','gujarat','india'),('barmer','rajasthan','india'),('rewa','madhya pradesh','india'),('forbesganj','bihar','india'),('sirsa','haryana','india'),('sultanganj','bihar','india'),('\"shikarpur',' bulandshahr\"','uttar pradesh'),('tarbha','odisha','india'),('goalpara','assam','india'),('kanhangad','kerala','india'),('thiruvarur','tamil nadu','india'),('nainital','uttarakhand','india'),('shimla','himachal pradesh','india'),('nainpur','madhya pradesh','india'),('phillaur','punjab','india'),('solan','himachal pradesh','india'),('adalaj','gujarat','india'),('simdega','jharkhand','india'),('ratnagiri','maharashtra','india'),('sahibganj','jharkhand','india'),('kishanganj','bihar','india'),('namagiripettai','tamil nadu','india'),('palwal','haryana','india'),('ron','karnataka','india'),('chirala','andhra pradesh','india'),('suri','west bengal','india'),('paramakudi','tamil nadu','india'),('bathinda','punjab','india'),('panniyannur','kerala','india'),('udaipurwati','rajasthan','india'),('phulabani','odisha','india'),('amreli','gujarat','india'),('balaghat','madhya pradesh','india'),('narkatiaganj','bihar','india'),('mandideep','madhya pradesh','india'),('chalakudy','kerala','india'),('kapadvanj','gujarat','india'),('itarsi','madhya pradesh','india'),('sawantwadi','maharashtra','india'),('proddatur','andhra pradesh','india'),('mokokchung','nagaland','india'),('dhule','maharashtra','india'),('shikaripur','karnataka','india'),('nellore','andhra pradesh','india'),('naharlagun','arunachal pradesh','india'),('jalandhar','punjab','india'),('rafiganj','bihar','india'),('tirupati','andhra pradesh','india'),('kadi','gujarat','india'),('umbergaon','gujarat','india'),('rahatgarh','madhya pradesh','india'),('lonavla','maharashtra','india'),('monoharpur','west bengal','india'),('songadh','gujarat','india'),('raghunathganj','west bengal','india'),('partur','maharashtra','india'),('valsad','gujarat','india'),('sojat','rajasthan','india'),('manachanallur','tamil nadu','india'),('modinagar','uttar pradesh','india'),('nabha','punjab','india'),('baramula','jammu and kashmir','india'),('mandamarri','telangana','india'),('pandharkaoda','maharashtra','india'),('pavagada','karnataka','india'),('maharajganj','bihar','india'),('shrirangapattana','karnataka','india'),('roorkee','uttarakhand','india'),('shenkottai','tamil nadu','india'),('panchla','west bengal','india'),('nagaur','rajasthan','india'),('palampur','himachal pradesh','india'),('ramagundam','telangana','india'),('davanagere','karnataka','india'),('bhadrachalam','telangana','india'),('sonamukhi','west bengal','india'),('warhapur','uttar pradesh','india'),('jhargram','west bengal','india'),('dehradun','uttarakhand','india'),('palwancha','telangana','india'),('ratia','haryana','india'),('patur','maharashtra','india'),('loha','maharashtra','india'),('shirur','maharashtra','india'),('tiruttani','tamil nadu','india'),('palitana','gujarat','india'),('zirakpur','punjab','india'),('gaya','bihar','india'),('vijayawada','andhra pradesh','india'),('dharmanagar','tripura','india'),('barbil','odisha','india'),('chatra','jharkhand','india'),('manuguru','telangana','india'),('sankari','tamil nadu','india'),('gumia','jharkhand','india'),('puliyankudi','tamil nadu','india'),('hazaribag','jharkhand','india'),('madhupur','jharkhand','india'),('rajsamand','rajasthan','india'),('tamluk','west bengal','india'),('samalkha','haryana','india'),('rohtak','haryana','india'),('manglaur','uttarakhand','india'),('sihora','madhya pradesh','india'),('belonia','tripura','india'),('ranebennuru','karnataka','india'),('rehli','madhya pradesh','india'),('mahemdabad','gujarat','india'),('rajgarh (churu)','rajasthan','india'),('bhongir','telangana','india'),('ozar','maharashtra','india'),('madikeri','karnataka','india'),('jatani','odisha','india'),('vijayapura','karnataka','india'),('satana','maharashtra','india'),('anakapalle','andhra pradesh','india'),('sangareddy','telangana','india'),('pattran','punjab','india'),('bhainsa','telangana','india'),('tadpatri','andhra pradesh','india'),('punganur','andhra pradesh','india'),('thammampatti','tamil nadu','india'),('athni','karnataka','india'),('chittoor','andhra pradesh','india'),('firozabad','uttar pradesh','india'),('kendujhar','odisha','india'),('adityapur','jharkhand','india'),('mirganj','bihar','india'),('kovvur','andhra pradesh','india'),('lilong','manipur','india'),('ladnu','rajasthan','india'),('sikanderpur','uttar pradesh','india'),('sonepur','bihar','india'),('kalimpong','west bengal','india'),('narsipatnam','andhra pradesh','india'),('tirupathur','tamil nadu','india'),('nirmal','telangana','india'),('siruguppa','karnataka','india'),('sirhind fatehgarh sahib','punjab','india'),('lonar','maharashtra','india'),('bageshwar','uttarakhand','india'),('lakshmeshwar','karnataka','india'),('lakhimpur','uttar pradesh','india'),('vadgaon kasba','maharashtra','india'),('arwal','bihar','india'),('ponnani','kerala','india'),('amritsar','punjab','india'),('ambikapur','chhattisgarh','india'),('vasai-virar','maharashtra','india'),('p.n.patti','tamil nadu','india'),('pudukkottai','tamil nadu','india'),('kottayam','kerala','india'),('memari','west bengal','india'),('shikohabad','uttar pradesh','india'),('malegaon','maharashtra','india'),('takhatgarh','rajasthan','india'),('satna','madhya pradesh','india'),('sillod','maharashtra','india'),('tarana','madhya pradesh','india'),('anjar','gujarat','india'),('sausar','madhya pradesh','india'),('wanaparthy','telangana','india'),('vita','maharashtra','india'),('soro','odisha','india'),('neyyattinkara','kerala','india'),('rath','uttar pradesh','india'),('kot kapura','punjab','india'),('zamania','uttar pradesh','india'),('vikramasingapuram','tamil nadu','india'),('ranaghat','west bengal','india'),('loni','uttar pradesh','india'),('yellandu','telangana','india'),('mathabhanga','west bengal','india'),('shajapur','madhya pradesh','india'),('nargund','karnataka','india'),('pratapgarh','tripura','india'),('pratapgarh','rajasthan','india'),('malaj khand','madhya pradesh','india'),('diphu','assam','india'),('mandawa','rajasthan','india'),('bhilwara','rajasthan','india'),('unnao','uttar pradesh','india'),('tarikere','karnataka','india'),('nawabganj','uttar pradesh','india'),('jagraon','punjab','india'),('savner','maharashtra','india'),('mavoor','kerala','india'),('tiruchengode','tamil nadu','india'),('sasvad','maharashtra','india'),('sadasivpet','telangana','india'),('parlakhemundi','odisha','india'),('sumerpur','uttar pradesh','india'),('sumerpur','rajasthan','india'),('gopalganj','bihar','india'),('adra','west bengal','india'),('shamli','uttar pradesh','india'),('rapar','gujarat','india'),('ottappalam','kerala','india'),('dharmavaram','andhra pradesh','india'),('tiruvuru','andhra pradesh','india'),('kadiri','andhra pradesh','india'),('sagar','madhya pradesh','india'),('ranchi','jharkhand','india'),('pardi','gujarat','india'),('surapura','karnataka','india'),('panagar','madhya pradesh','india'),('powayan','uttar pradesh','india'),('araria','bihar','india'),('yerraguntla','andhra pradesh','india'),('tiruchirappalli','tamil nadu','india'),('vellakoil','tamil nadu','india'),('balangir','odisha','india'),('veraval','gujarat','india'),('ladwa','haryana','india'),('visakhapatnam','andhra pradesh','india'),('vijapur','gujarat','india'),('pasan','madhya pradesh','india'),('puranpur','uttar pradesh','india'),('vaniyambadi','tamil nadu','india'),('ramgarh','jharkhand','india'),('bellampalle','telangana','india'),('sholingur','tamil nadu','india'),('sidlaghatta','karnataka','india'),('palani','tamil nadu','india'),('siddipet','telangana','india'),('ashok nagar','madhya pradesh','india'),('talegaon dabhade','maharashtra','india'),('jalandhar cantt.','punjab','india'),('ranavav','gujarat','india'),('rosera','bihar','india'),('bapatla','andhra pradesh','india'),('raikot','punjab','india'),('tilhar','uttar pradesh','india'),('manawar','madhya pradesh','india'),('kochi','kerala','india'),('hardoi','uttar pradesh','india'),('sadabad','uttar pradesh','india'),('rangia','assam','india'),('hyderabad','telangana','india'),('lalsot','rajasthan','india'),('losal','rajasthan','india'),('mahe','puducherry','india'),('motipur','bihar','india'),('karimnagar','telangana','india'),('padra','gujarat','india'),('vapi','gujarat','india'),('adyar','karnataka','india'),('deoghar','jharkhand','india'),('sinnar','maharashtra','india'),('lingsugur','karnataka','india'),('usilampatti','tamil nadu','india'),('belagavi','karnataka','india'),('saharanpur','uttar pradesh','india'),('mandi dabwali','haryana','india'),('kathurban agglomeration','jammu and kashmir','india'),('nagina','uttar pradesh','india'),('murshidabad','west bengal','india'),('bhatapara','chhattisgarh','india'),('sahaspur','uttar pradesh','india'),('risod','maharashtra','india'),('vadalur','tamil nadu','india'),('jamui','bihar','india'),('masaurhi','bihar','india'),('talcher','odisha','india'),('nandurbar','maharashtra','india'),('tonk','rajasthan','india'),('musabani','jharkhand','india'),('sambhar','rajasthan','india'),('karimganj','assam','india'),('pattukkottai','tamil nadu','india'),('pulgaon','maharashtra','india'),('viramgam','gujarat','india'),('sardhana','uttar pradesh','india'),('pakaur','jharkhand','india'),('narsinghgarh','madhya pradesh','india'),('bagaha','bihar','india'),('hugli-chinsurah','west bengal','india'),('sindhnur','karnataka','india'),('nanjikottai','tamil nadu','india'),('silchar','assam','india'),('rania','haryana','india'),('pondicherry','puducherry','india'),('karwar','karnataka','india'),('amravati','maharashtra','india'),('malavalli','karnataka','india'),('sagwara','rajasthan','india'),('gurgaon','haryana','india'),('rairangpur','odisha','india'),('nalbari','assam','india'),('chirkunda','jharkhand','india'),('karnal','haryana','india'),('umaria','madhya pradesh','india'),('pudupattinam','tamil nadu','india'),('sathyamangalam','tamil nadu','india'),('robertson pet','karnataka','india'),('kozhikode','kerala','india'),('shahganj','uttar pradesh','india'),('kalyan-dombivali','maharashtra','india'),('sri madhopur','rajasthan','india'),('siana','uttar pradesh','india'),('shendurjana','maharashtra','india'),('valparai','tamil nadu','india'),('nagaon','assam','india'),('motihari','bihar','india'),('bhaburban agglomeration','bihar','india'),('thane','maharashtra','india'),('nandyal','andhra pradesh','india'),('ramnagar','uttarakhand','india'),('ramnagar','bihar','india'),('pacode','tamil nadu','india'),('maner','bihar','india'),('shahbad','haryana','india'),('gudur','andhra pradesh','india'),('rawatbhata','rajasthan','india'),('rajauri','jammu and kashmir','india'),('yadgir','karnataka','india'),('mainaguri','west bengal','india'),('sadulpur','rajasthan','india'),('madanapalle','andhra pradesh','india'),('gwalior','madhya pradesh','india'),('polur','tamil nadu','india'),('malpura','rajasthan','india'),('firozpur cantt.','punjab','india'),('paradip','odisha','india'),('raipur','chhattisgarh','india'),('kavali','andhra pradesh','india'),('kolar','karnataka','india'),('bobbili','andhra pradesh','india'),('navalgund','karnataka','india'),('agra','uttar pradesh','india'),('pathankot','punjab','india'),('aruppukkottai','tamil nadu','india'),('vatakara','kerala','india'),('suryapet','telangana','india'),('narasaraopet','andhra pradesh','india'),('longowal','punjab','india'),('palacole','andhra pradesh','india'),('indore','madhya pradesh','india'),('varanasi','uttar pradesh','india'),('tumsar','maharashtra','india'),('thrissur','kerala','india'),('alipurdurban agglomerationr','west bengal','india'),('raghogarh-vijaypur','madhya pradesh','india'),('nizamabad','telangana','india'),('manendragarh','chhattisgarh','india'),('patna','bihar','india'),('shahpur','karnataka','india'),('udupi','karnataka','india'),('sihor','gujarat','india'),('nanjangud','karnataka','india'),('yanam','puducherry','india'),('sankeshwara','karnataka','india'),('mhow cantonment','madhya pradesh','india'),('vidisha','madhya pradesh','india'),('jammalamadugu','andhra pradesh','india'),('thana bhawan','uttar pradesh','india'),('naugachhia','bihar','india'),('sakti','chhattisgarh','india'),('etawah','uttar pradesh','india'),('jagtial','telangana','india'),('neemuch','madhya pradesh','india'),('wadi','karnataka','india'),('karjat','maharashtra','india'),('naugawan sadat','uttar pradesh','india'),('rajpipla','gujarat','india'),('gooty','andhra pradesh','india'),('mapusa','goa','india'),('agartala','tripura','india'),('shamgarh','madhya pradesh','india'),('\"shahabad',' hardoi\"','uttar pradesh'),('puri','odisha','india'),('lal gopalganj nindaura','uttar pradesh','india'),('pappinisseri','kerala','india'),('ramanagaram','karnataka','india'),('narkhed','maharashtra','india'),('pipar city','rajasthan','india'),('rajapalayam','tamil nadu','india'),('pihani','uttar pradesh','india'),('wadhwan','gujarat','india'),('ramanathapuram','tamil nadu','india'),('barpeta','assam','india'),('adilabad','telangana','india'),('alappuzha','kerala','india'),('hisar','haryana','india'),('adoor','kerala','india'),('lachhmangarh','rajasthan','india'),('lohardaga','jharkhand','india'),('byasanagar','odisha','india'),('paschim punropara','west bengal','india'),('virudhunagar','tamil nadu','india'),('palasa kasibugga','andhra pradesh','india'),('laharpur','uttar pradesh','india'),('fatehabad','haryana','india'),('wardha','maharashtra','india'),('silvassa','dadra and nagar haveli','india'),('shrirampur','maharashtra','india');
/*!40000 ALTER TABLE `city_states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configures`
--

DROP TABLE IF EXISTS `configures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `configures` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `appUrl` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dbUser` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dbPass` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dbNodes` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dbKeyspace` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dbPort` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sparkEngine` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configures`
--

LOCK TABLES `configures` WRITE;
/*!40000 ALTER TABLE `configures` DISABLE KEYS */;
INSERT INTO `configures` VALUES (1,'localhost','cassandra','cassandra','172.16.117.201,172.16.117.157,172.16.117.204,172.16.117.152','processed_keyspace','9042','172.16.117.202');
/*!40000 ALTER TABLE `configures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crawler_lists`
--

DROP TABLE IF EXISTS `crawler_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crawler_lists` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `track` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `handle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crawler_lists`
--

LOCK TABLES `crawler_lists` WRITE;
/*!40000 ALTER TABLE `crawler_lists` DISABLE KEYS */;
INSERT INTO `crawler_lists` VALUES (2,'#arnabGoswami','NULL','track','1','2020-10-09'),(3,'#Joker2020','NULL','track','1','2020-10-19'),(4,'suicide','NULL','track','1','2020-10-25'),(5,'pandemic','NULL','track','1','2020-10-21'),(6,'pnemonia','NULL','track','1','2020-10-31'),(7,'#SARS2020','NULL','track','1','2020-10-39'),(8,'#COVID19','NULL','track','1','2020-10-45'),(9,'#EndSWAT','NULL','track','1','2020-10-02'),(13,'$37034483','@ndtv','user','1','2020-10-27'),(14,'$18839785','@narendramodi','user','1','2020-10-27'),(15,'$207809313','@BJP4India','user','1','2020-10-27'),(16,'$3171712086','@RahulGandhi','user','1','2020-10-27'),(17,'$16343974','@Telegraph','user','1','2020-10-27'),(18,'$1447949844','@AmitShah','user','1','2020-10-27'),(19,'$24705126','@ShashiTharoor','user','1','2020-10-27'),(20,'$39240673','@ABPNews','user','1','2020-10-27'),(21,'$267158021','@Sports_NDTV','user','1','2020-10-27'),(22,'$39240673','ABPNews','user','1','2020-10-29'),(23,'$405427035','ArvindKejriwal','user','1','2020-10-29'),(24,'$131188226','himantabiswa','user','1','2020-11-02'),(25,'$776063255198388226','PragNews','user','1','2020-11-03'),(26,'$811972460560019456','republic','user','1','2020-11-03'),(27,'$20751449','the_hindu','user','1','2020-11-03'),(28,'$112404600','DY365','user','1','2020-11-03'),(29,'$759251','CNN','user','1','2020-11-03');
/*!40000 ALTER TABLE `crawler_lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (6,'2020_09_16_104515_create_query_statuses_table',3),(8,'2020_09_21_103011_create_city__states_table',5),(28,'2014_10_12_000000_create_users_table',6),(29,'2014_10_12_100000_create_password_resets_table',6),(30,'2019_08_19_000000_create_failed_jobs_table',6),(31,'2020_08_10_191950_create_sessions_table',6),(32,'2020_09_10_110943_create_tweet_feedback_table',6),(33,'2020_09_18_055000_query_status_table',6),(34,'2020_10_13_054030_create_configures_table',6),(35,'2020_10_13_195603_create_crawler_lists_table',6),(36,'2020_10_22_120934_create_normal_queries_table',7);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `normal_queries`
--

DROP TABLE IF EXISTS `normal_queries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `normal_queries` (
  `queryID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `query` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fromDate` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `toDate` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hashtagID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mentionID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`queryID`,`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `normal_queries`
--

LOCK TABLES `normal_queries` WRITE;
/*!40000 ALTER TABLE `normal_queries` DISABLE KEYS */;
INSERT INTO `normal_queries` VALUES ('1604258816889','7','#COVID19','2020-07-01','2020-07-05','Success','ha','ba52ed84','708102d8'),('1604304499121','7','#COVID19','2020-06-15','2020-11-02','Success','ha','8bf11814','f7ec9efa'),('1604342768670','7','#ARMYSelcaDay','2020-11-03','2020-11-03','Success','ha','67eb9b96','83d58e09'),('1604342790573','7','#COVID19','2020-07-01','2020-07-01','Success','ha','292e07d5','2f044479'),('1604378772437','9','#COVID19','2020-07-01','2020-07-01','Success','ha','b5249c44','19b4e408'),('1604378848363','9','^india','2020-11-03','2020-11-03','Success','ha','307d11e8','ccf61e99'),('1604379465889','9','#COVID19','2020-11-03','2020-11-03','Success','ha','c6dbcf5c','6494c2c5'),('1604379494060','9','#COVID19','2020-07-01','2020-07-01','Success','ha','2a038dea','3647f14a'),('1604381211607','7','#ARMYSeIcaDay','2020-11-03','2020-11-03','Success','ha','9a749f97','2fc59bce'),('1604382241010','7','#ARMYSelcaDay','2020-11-03','2020-11-03','Success','ha','5a2b3fa2','0c22f568'),('1604383444834','7','#ARSD','2020-11-03','2020-11-03','Success','ha','3aeaa151','17e64958'),('1604467346913','9','#ArnabGoswami','2020-11-04 10:36:00','2020-11-04 10:51:00','Success','ha','83e8536a','a00cff54'),('1604467365024','9','#ArnabGoswami','2020-11-04 10:36:00','2020-11-04 10:51:00','Success','ha','6342000f','5469a505'),('1604634766470','9','$18839785','2020-10-01','2020-11-06','Success','ua','c27fc1f2','b42a76cf'),('1604635385413','9','$207809313','2020-11-03','2020-11-06','Success','ua','2ece1d3c','0c20fc20'),('1604640198464','9','#FranceTerrorAttack','2020-08-01','2020-11-03','Success','ha','e1727045','65598fec'),('1604640876583','9','@realDonaldTrump','2020-11-04','2020-11-04','Success','ha','fdd52963','8c2264ec'),('1604653154424','7','$16343974','2020-10-01','2020-11-06','Success','ua','df0106f0','f69b5d3a'),('1604653200017','7','$1924722175','2020-09-27','2020-11-06','Success','ua','6d2ec975','06d63edb'),('1604653214531','7','@SovernNation','2020-09-27','2020-11-06','Success','ha','3c197e57','d298455a'),('1605552514148','9','$37034483','2020-11-14','2020-11-17','Success','ua','8988e817','c7754253'),('1605552700754','9','$37034483','2020-11-02','2020-11-04','Success','ua','1bdc53cd','099872da'),('1605553226731','9','$37034483','2020-11-02','2020-11-04','Success','ua','834f07f6','0a9ef633'),('1605612132120','7','$112404600','2020-11-14','2020-11-17','Success','ua','5c49579c','44682034'),('1605612136128','7','$811972460560019456','2020-11-14','2020-11-17','Success','ua','cb5659d5','663b82f6'),('1605612141262','7','$811972460560019456','2020-11-14','2020-11-17','Success','ua','ef9155ea','b5a67be2'),('1605612145885','7','$37034483','2020-11-14','2020-11-17','Success','ua','5b84712a','7d150f3d'),('1605612149380','7','$37034483','2020-11-14','2020-11-17','Success','ua','8d48486d','ac5e7c36'),('1605612156970','7','$16343974','2020-09-03','2020-11-06','Success','ua','d06f1e7e','aec938ef');
/*!40000 ALTER TABLE `normal_queries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `query_statuses`
--

DROP TABLE IF EXISTS `query_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `query_statuses` (
  `queryID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `query` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fromDate` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `toDate` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `query_statuses`
--

LOCK TABLES `query_statuses` WRITE;
/*!40000 ALTER TABLE `query_statuses` DISABLE KEYS */;
INSERT INTO `query_statuses` VALUES ('1602840585701','2','(#COVID19&#herdimmunity)','2020-10-16','2020-10-16','success','ha'),('1602844321920','2','(#EndSARS&#EndSWAT)','2020-10-14','2020-10-16','success','ha'),('1604039521044','7','(#GoBackStalin&#தேவர்ஜெயந்தி)','2020-10-30','2020-10-30','dead','ha'),('1604039546233','7','(#GoBackStalin&#Goback_Stalin)','2020-10-30','2020-10-30','dead','ha'),('1604217310686','9','(#Sunday&#party)','2020-11-01','2020-11-01','dead','ha'),('1604261109677','9','(#MUNARS&#PL)','2020-11-02','2020-11-02','success','ha'),('1605552539180','9','($37034483&#BTS)','2020-11-02','2020-11-04','success','ua'),('1605552748065','9','($37034483&#ResultsWithNDTV)','2020-11-02','2020-11-04','success','ua');
/*!40000 ALTER TABLE `query_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payload` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL,
  UNIQUE KEY `sessions_id_unique` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tweet_feedback`
--

DROP TABLE IF EXISTS `tweet_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tweet_feedback` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `userID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `feedbackType` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tweetID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `originalTag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `feedbackTag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tweet_feedback`
--

LOCK TABLES `tweet_feedback` WRITE;
/*!40000 ALTER TABLE `tweet_feedback` DISABLE KEYS */;
INSERT INTO `tweet_feedback` VALUES (1,'2020-10-17 13:21:10','2020-10-17 13:21:10','7','category','1312680455674753025','normal','com'),(2,'2020-11-01 02:01:42','2020-11-01 02:01:42','9','category','1322802830181388289','com','com_sec'),(3,'2020-11-01 02:01:44','2020-11-01 02:01:44','9','sentiment','1322802830181388289','2','2');
/*!40000 ALTER TABLE `tweet_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `organization` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'pk','iitg','3','$2y$10$0rxpdnuZoeFaJ1OIwq3FMuhT0zKeedlh.J3ijlh3kzdGWglpF.coC',NULL,'2020-10-16 03:14:01','2020-10-16 03:14:01'),(7,'blade365z','iitg','1','$2y$10$yH0UL5X.hSuk/bNQlXj7segMuQAM2z07LxnyS4xE.gmeH9KQbzVWS',NULL,'2020-10-16 03:20:11','2020-10-16 03:20:11'),(9,'ranbir','iitg','3','$2y$10$Zght8upvHbsW1cQXvcos4OejVb7WFbIDoyOXXJklwKlAasGgwEgdS',NULL,'2020-10-16 03:20:43','2020-10-16 03:20:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-17 17:44:38
