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
INSERT INTO `configures` VALUES (1,'localhost','cassandra','cassandra','172.16.117.201,172.16.117.204,172.16.117.152','processed_keyspace','9042','172.16.117.202');
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
-- Table structure for table `location_codes`
--

DROP TABLE IF EXISTS `location_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location_codes` (
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location_codes`
--

LOCK TABLES `location_codes` WRITE;
/*!40000 ALTER TABLE `location_codes` DISABLE KEYS */;
INSERT INTO `location_codes` VALUES ('pasan',0),('puranpur',0),('bhongir',0),('ozar',0),('madikeri',0),('jatani',0),('santipur',0),('seohara',0),('nandyal',0),('ramnagar',0),('shahabad',0),('amalapuram',0),('surat',0),('gurdaspur',0),('belonia',0),('ranebennuru',0),('arambagh',0),('nepanagar',0),('sahaswan',0),('sheopur',0),('talwara',0),('surban',0),('naihati',0),('panaji',0),('thoubal',0),('latur',0),('ratangarh',0),('sattenapalle',0),('nargund',0),('pratapgarh',0),('malaj khand',0),('diphu',0),('mandawa',0),('bhilwara',0),('medak',0),('gangarampur',0),('pacode',0),('bhatapara',0),('sahaspur',0),('tenkasi',0),('alwar',0),('new delhi',0),('palanpur',0),('chilakaluripet',0),('sirohi',0),('murliganj',0),('bhopal',0),('bikaner',0),('sankarankovil',0),('mandvi',0),('phalodi',0),('tiruvannamalai',0),('vedaranyam',0),('pindwara',0),('palampur',0),('ramagundam',0),('davanagere',0),('mavelikkara',0),('mulbagal',0),('achalpur',0),('jamshedpur',0),('losal',0),('mahe',0),('motipur',0),('karimnagar',0),('palitana',0),('zirakpur',0),('anantapur',0),('west bengal',1),('natham',0),('rampurhat',0),('lalgudi',0),('fazilka',0),('reengus',0),('purqurban',0),('nangal',0),('tirukalukundram',0),('rasipuram',0),('shahdol',0),('shirdi',0),('pedana',0),('pasighat',0),('margherita',0),('guwahati',0),('odisha',1),('shujalpur',0),('perinthalmanna',0),('sikandrabad',0),('bhawanipatna',0),('urmar tanda',0),('pallapatti',0),('yerraguntla',0),('tiruchirappalli',0),('pukhrayan',0),('munger',0),('sherkot',0),('tarn taran',0),('guruvayoor',0),('deesa',0),('sujangarh',0),('bhadrak',0),('shrirampur',0),('revelganj',0),('savarkundla',0),('aligarh',0),('margao',0),('piriyapatna',0),('dhoraji',0),('tadepalligudem',0),('mandla',0),('nedumangad',0),('machilipatnam',0),('ahmednagar',0),('pernampattu',0),('barh',0),('north lakhimpur',0),('rajgarh',0),('maihar',0),('lahar',0),('nathdwara',0),('sirkali',0),('phaltan',0),('sanchore',0),('kollam',0),('alappuzha',0),('proddatur',0),('mokokchung',0),('risod',0),('vadalur',0),('jamui',0),('masaurhi',0),('talcher',0),('nandurbar',0),('tonk',0),('musabani',0),('tirur',0),('periyakulam',0),('sangamner',0),('vizianagaram',0),('malappuram',0),('rajpipla',0),('gooty',0),('mapusa',0),('agartala',0),('shamgarh',0),('shahabad',0),('puri',0),('lal gopalganj nindaura',0),('pappinisseri',0),('ramanagaram',0),('narkhed',0),('pipar city',0),('rajapalayam',0),('wokha',0),('vaniyambadi',0),('ramgarh',0),('bellampalle',0),('sholingur',0),('sidlaghatta',0),('palani',0),('siddipet',0),('ashok nagar',0),('talegaon dabhade',0),('meghalaya',1),('jalandhar',0),('ranavav',0),('koratla',0),('nagla',0),('shamsabad',0),('kerala',1),('naharlagun',0),('porbandar',0),('sitapur',0),('nagercoil',0),('pithoragarh',0),('bahraich',0),('jalpaiguri',0),('mira-bhayandar',0),('bhagalpur',0),('imphal',0),('cuttack',0),('orai',0),('balangir',0),('thammampatti',0),('athni',0),('chittoor',0),('firozabad',0),('kendujhar',0),('adityapur',0),('mirganj',0),('kovvur',0),('nandivaram-guduvancheri',0),('hindupur',0),('sanawad',0),('ichalkaranji',0),('\"vijainagar',0),('yemmiganur',0),('mohali',0),('ramachandrapuram',0),('shillong',0),('shirpur-warwade',0),('thodupuzha',0),('wani',0),('nagarkurnool',0),('ramngarh',0),('sanand',0),('kurnool',0),('malur',0),('amalner',0),('bharatpur',0),('rajkot',0),('sahjanwa',0),('lalganj',0),('panvel',0),('safipur',0),('dumraon',0),('robertsganj',0),('pilkhuwa',0),('sonipat',0),('sangrur',0),('dimapur',0),('mathura',0),('pachora',0),('dalli-rajhara',0),('sikandra rao',0),('satara',0),('ambikapur',0),('vasai-virar',0),('p.n.patti',0),('pudukkottai',0),('kottayam',0),('memari',0),('shikohabad',0),('malegaon',0),('takhatgarh',0),('satna',0),('sillod',0),('tarana',0),('makhdumpur',0),('giridih',0),('nowgong',0),('nabarangapur',0),('sendhwa',0),('silao',0),('kailasahar',0),('sheohar',0),('sunam',0),('panchkula',0),('silapathar',0),('karnataka',1),('rajagangapur',0),('marhaura',0),('vinukonda',0),('gobindgarh',0),('asansol',0),('taki',0),('keshod',0),('sainthia',0),('tohana',0),('phusro',0),('dhanbad',0),('sambhar',0),('karimganj',0),('pattukkottai',0),('pulgaon',0),('viramgam',0),('eluru',0),('sandila',0),('nawapur',0),('bilaspur',0),('india',2),('uthamapalayam',0),('sholavandan',0),('malerkotla',0),('jaipur',0),('panruti',0),('anjangaon',0),('chandigarh',1),('chandigarh',0),('bharuch',0),('manwath',0),('peringathur',0),('taliparamba',0),('tripura',1),('raisen',0),('pithapuram',0),('nohar',0),('muddebihal',0),('jhansi',0),('saharanpur',0),('nautanwa',0),('anakapalle',0),('jagtial',0),('neemuch',0),('wadi',0),('karjat',0),('coimbatore',0),('uchgaon',0),('kohima',0),('adoni',0),('lar',0),('kolkata',0),('batala',0),('palakkad',0),('nilambur',0),('nandura',0),('sedam',0),('sivaganga',0),('nadbai',0),('periyasemur',0),('rae bareli',0),('vadgaon kasba',0),('arwal',0),('ponnani',0),('nanpara',0),('sirsaganj',0),('ponneri',0),('kyathampalle',0),('reoti',0),('kharagpur',0),('thiruvalla',0),('tanuku',0),('motihari',0),('bhaburban agglomeration',0),('thane',0),('shikaripur',0),('mahalingapura',0),('raver',0),('bahadurgarh',0),('thiruvananthapuram',0),('ranipet',0),('o\' valley',0),('thiruvallur',0),('pauri',0),('sohna',0),('pen',0),('tharangambadi',0),('soyagaon',0),('nagpur',0),('kothagudem',0),('bheemunipatnam',0),('palwancha',0),('ratia',0),('patur',0),('loha',0),('shirur',0),('tiruttani',0),('raikot',0),('tilhar',0),('amroha',0),('tura',0),('warud',0),('muvattupuzha',0),('safidon',0),('tuljapur',0),('samalkot',0),('tandur',0),('makrana',0),('naugawan sadat',0),('rajgarh',0),('laharpur',0),('palladam',0),('raigarh',0),('sheoganj',0),('perumbavoor',0),('viluppuram',0),('gohana',0),('madhepura',0),('erode',0),('terdal',0),('yamunanagar',0),('uravakonda',0),('kagaznagar',0),('porsa',0),('nelamangala',0),('vadodara',0),('uttar pradesh',1),('barmer',0),('rewa',0),('forbesganj',0),('sirsa',0),('haryana',1),('tulsipur',0),('vijapur',0),('hajipur',0),('kharar',0),('thiruthuraipoondi',0),('darjiling',0),('medinipur',0),('mahendragarh',0),('mahidpur',0),('washim',0),('moga',0),('nagaur',0),('adoor',0),('lachhmangarh',0),('vita',0),('soro',0),('neyyattinkara',0),('rath',0),('kot kapura',0),('zamania',0),('vikramasingapuram',0),('ranaghat',0),('maner',0),('shahbad',0),('gudur',0),('nadiad',0),('sarni',0),('uran',0),('mahad',0),('narayanpet',0),('parbhani',0),('uran islampur',0),('sitamarhi',0),('nabadwip',0),('sircilla',0),('srinagar',0),('utraula',0),('nagar',0),('khair',0),('karnatka',1),('mukerian',0),('arakkonam',0),('ujjain',0),('lunawada',0),('firozpur',0),('paradip',0),('raipur',0),('kavali',0),('kolar',0),('bobbili',0),('navalgund',0),('agra',0),('pathankot',0),('aruppukkottai',0),('vatakara',0),('suryapet',0),('manipur',1),('narasaraopet',0),('rawatbhata',0),('pattamundai',0),('sakti',0),('naila janjgir',0),('nagari',0),('jaggaiahpet',0),('mainaguri',0),('sadulpur',0),('madanapalle',0),('yellandu',0),('mathabhanga',0),('shajapur',0),('nagda',0),('sheikhpura',0),('mandya',0),('tiruvethipuram',0),('ramtek',0),('sujanpur',0),('pipariya',0),('umreth',0),('sirsi',0),('warangal',0),('tumkur',0),('srisailam',0),('chaibasa',0),('rehli',0),('mahemdabad',0),('srivilliputhur',0),('dhamtari',0),('kendrapara',0),('bongaigaon city',0),('lalitpur',0),('shahpura',0),('thanjavur',0),('parvathipuram',0),('shivpuri',0),('bhiwandi',0),('udhampur',0),('kalyan-dombivali',0),('sri madhopur',0),('siana',0),('shendurjana',0),('valparai',0),('nagaon',0),('asarganj',0),('balurghat',0),('merta city',0),('pinjore',0),('english bazar',0),('magadi',0),('surandai',0),('wadgaon road',0),('mussoorie',0),('mandi dabwali',0),('kathurban agglomeration',0),('nagina',0),('murshidabad',0),('sri lanka',2),('gwalior',0),('polur',0),('malpura',0),('madhubani',0),('mihijam',0),('vellakoil',0),('sawai madhopur',0),('sidhi',0),('parangipettai',0),('arunachal pradesh',1),('rewari',0),('thuraiyur',0),('panagudi',0),('jamalpur',0),('ramdurg',0),('lunglei',0),('dhubri',0),('savanur',0),('vandavasi',0),('moradabad',0),('mangrol',0),('byasanagar',0),('paschim punropara',0),('virudhunagar',0),('palasa kasibugga',0),('nagaland',1),('pauni',0),('ankleshwar',0),('rayagada',0),('viswanatham',0),('anantnag',0),('nidadavole',0),('goa',1),('rayadurg',0),('guntur',0),('anand',0),('jabalpur',0),('allahabad',0),('katihar',0),('sultanganj',0),('shikarpur',0),('chhapra',0),('medininagar',0),('pehowa',0),('sugauli',0),('khanna',0),('todabhim',0),('morena',0),('morvi',0),('samthar',0),('pune',0),('prithvipur',0),('ranibennur',0),('sullurpeta',0),('bhiwani',0),('dhule',0),('rajgir',0),('habra',0),('nokha',0),('rampur',0),('chandausi',0),('pakistan',2),('aizawl',0),('sahibganj',0),('kishanganj',0),('namagiripettai',0),('palwal',0),('ron',0),('chirala',0),('suri',0),('paramakudi',0),('bathinda',0),('panniyannur',0),('udaipurwati',0),('phulabani',0),('amreli',0),('balaghat',0),('narkatiaganj',0),('mandideep',0),('chalakudy',0),('kapadvanj',0),('itarsi',0),('sawantwadi',0),('yavatmal',0),('salem',0),('dhuri',0),('thakurdwara',0),('saiha',0),('vikarabad',0),('shahjahanpur',0),('manavadar',0),('alirajpur',0),('padrauna',0),('mandi',0),('mansa',0),('salur',0),('noorpur',0),('malout',0),('dharmanagar',0),('barbil',0),('sangli',0),('lakhisarai',0),('sherghati',0),('dehradun',0),('bankura',0),('tenali',0),('mancherial',0),('mattannur',0),('noida',0),('kadapa',0),('madurai',0),('kasaragod',0),('gadwal',0),('kannur',0),('rajula',0),('ludhiana',0),('vaijapur',0),('chikkamagaluru',0),('bhuj',0),('oddanchatram',0),('ujhani',0),('jhumri tilaiya',0),('andhra pradesh',1),('bhadrachalam',0),('sonamukhi',0),('bhilai nagar',0),('tirwaganj',0),('mahesana',0),('rau',0),('firozpur',0),('rawatsar',0),('khammam',0),('patan',0),('shiggaon',0),('madhya pradesh',1),('kapurthala',0),('narasapuram',0),('srinivaspur',0),('port blair',0),('shrirangapattana',0),('roorkee',0),('shenkottai',0),('panchla',0),('hardoi ',0),('sadabad',0),('rangia',0),('hyderabad',0),('lalsot',0),('pusad',0),('unnao',0),('tarikere',0),('telangana',1),('nawabganj',0),('soron',0),('obra',0),('udhagamandalam',0),('lathi',0),('rajpura',0),('nongstoin',0),('ganjbasoda',0),('umred',0),('shoranur',0),('nellikuppam',0),('rajam',0),('simdega',0),('ratnagiri',0),('bhavnagar',0),('una',0),('bengaluru',0),('palghar',0),('venkatagiri',0),('gaya',0),('vijayawada',0),('seoni-malwa',0),('vrindavan',0),('godhra',0),('china',2),('sangareddy',0),('pattran',0),('sattur',0),('kalpi',0),('zunheboto',0),('prantij',0),('maharajpur',0),('sundargarh',0),('bokaro steel city',0),('tuni',0),('panna',0),('pithampur',0),('patti',0),('sultanpur',0),('sakaleshapura',0),('nainital',0),('shimla',0),('naraura',0),('puthuppally',0),('sandi',0),('durg',0),('rishikesh',0),('mungeli',0),('korba',0),('tuensang',0),('dumka',0),('sardhana',0),('pakaur',0),('narsinghgarh',0),('bagaha',0),('hugli-chinsurah',0),('baripada town',0),('tiptur',0),('meerut',0),('mudabidri',0),('bhainsa',0),('tadpatri',0),('haldwani-cum-kathgodam',0),('baleshwar town',0),('khowai',0),('arsikere',0),('puducherry',1),('tekkalakote',0),('sindhagi',0),('kaithal',0),('palia kalan',0),('multai',0),('jammu',0),('unjha',0),('marigaon',0),('shegaon',0),('sadulshahar',0),('afzalpur',0),('bangladesh',2),('supaul',0),('veraval',0),('hisar',0),('chirmiri',0),('raiganj',0),('tiruppur',0),('sadalagi',0),('thana bhawan',0),('naugachhia',0),('sojat',0),('manachanallur',0),('modinagar',0),('nabha',0),('faridabad',0),('mangalvedhe',0),('ballari',0),('phulpur',0),('jodhpur',0),('jorhat',0),('madhugiri',0),('zaidpur',0),('tarakeswar',0),('kunnamkulam',0),('mauganj',0),('upleta',0),('mhaswad',0),('talaja',0),('gokak',0),('siwan',0),('patiala',0),('umarga',0),('mahasamund',0),('nimbahera',0),('akola',0),('azamgarh',0),('muzaffarpur',0),('nandgaon',0),('nashik',0),('saunda',0),('shahabad',0),('jharkhand',1),('hapur',0),('changanassery',0),('vadipatti',0),('mandsaur',0),('mangaldoi',0),('ramganj mandi',0),('thangadh',0),('renigunta',0),('palai',0),('muktsar',0),('shahganj',0),('wardha',0),('silvassa',0),('repalle',0),('zira',0),('radhanpur',0),('fatehpur sikri',0),('japan',2),('saundatti yellamma',0),('rampur maniharan',0),('hardwar',0),('saharsa',0),('punch',0),('naidupet',0),('sivakasi',0),('bettiah',0),('lilong',0),('ladnu',0),('sikanderpur',0),('sonepur',0),('rajasthan',1),('kalimpong',0),('narsipatnam',0),('tirupathur',0),('nirmal',0),('siruguppa',0),('sirhind fatehgarh sahib',0),('lonar',0),('bageshwar',0),('lakshmeshwar',0),('lakhimpur',0),('lakheri',0),('darbhanga',0),('siliguri',0),('pachore',0),('morshi',0),('pollachi',0),('gumia',0),('puliyankudi',0),('hazaribag',0),('madhupur',0),('rajsamand',0),('tamluk',0),('purnia',0),('gobichettipalayam',0),('samana',0),('maharashtra',1),('vadakkuvalliyur',0),('aurangabad',0),('manmad',0),('parli',0),('pilibanga',0),('rajgarh',0),('farooqnagar',0),('karaikal',0),('longowal',0),('palacole',0),('indore',0),('varanasi',0),('tumsar',0),('thrissur',0),('monoharpur',0),('mumbai',0),('dehri-on-sone',0),('sihor',0),('nanjangud',0),('yanam',0),('umarkhed',0),('shivamogga',0),('pathri',0),('raghunathpur',0),('mysore',0),('mahbubnagar',0),('pandurban agglomeration',0),('nilanga',0),('narnaul',0),('niwai',0),('kamareddy',0),('niwari',0),('mudhol',0),('pandhurna',0),('sehore',0),('punalur',0),('barnala',0),('qadian',0),('nakodar',0),('kakinada',0),('malkangiri',0),('rampura phul',0),('najibabad',0),('pandharpur',0),('gujarat',1),('sahawar',0),('mukhed',0),('nawada',0),('pathanamthitta',0),('tamil nadu',1),('gudivada',0),('hubli-dharwad',0),('talikota',0),('attingal',0),('padmanabhapuram',0),('murwara',0),('warora',0),('manasa',0),('sindagi',0),('silchar',0),('rania',0),('pondicherry',0),('karwar',0),('amravati',0),('manawar',0),('kochi',0),('lohardaga',0),('patratu',0),('todaraisingh',0),('thanesar',0),('raayachuru',0),('ponnur',0),('jangaon',0),('shrigonda',0),('nawanshahr',0),('unnamalaikadai',0),('rasra',0),('sitarganj',0),('buxar',0),('purna',0),('loni',0),('malkapur',0),('nellore',0),('neyveli',0),('talode',0),('mariani',0),('namakkal',0),('vapi',0),('adyar',0),('deoghar',0),('sinnar',0),('lingsugur',0),('usilampatti',0),('belagavi',0),('lumding',0),('panamattom',0),('ratlam',0),('tiruchendur',0),('bhubaneswar',0),('kanpur',0),('jamnagar',0),('piro',0),('maddur',0),('mhowgaon',0),('chhattisgarh',1),('tirukkoyilur',0),('manihari',0),('rayachoti',0),('raurkela',0),('parasi',0),('mahuva',0),('manjlegaon',0),('pilibhit',0),('chennai',0),('srikakulam',0),('rajaldesar',0),('srirampore',0),('ladwa',0),('visakhapatnam',0),('kadi',0),('nasirabad',0),('ongole',0),('satana',0),('umbergaon',0),('rahatgarh',0),('lonavla',0),('arrah',0),('karur',0),('sausar',0),('wanaparthy',0),('sangaria',0),('jalandhar',0),('rafiganj',0),('tirupati',0),('sadri',0),('yevla',0),('vijayapura',0),('sindhnur',0),('nanjikottai',0),('sopore',0),('tezpur',0),('sihora',0),('miryalaguda',0),('wankaner',0),('phulera',0),('rajampet',0),('sambalpur',0),('jehanabad',0),('tasgaon',0),('puttur',0),('mandapeta',0),('rabkavi banhatti',0),('assam',1),('yawal',0),('mangaluru',0),('macherla',0),('mandalgarh',0),('raxaul bazar',0),('seoni',0),('thirupuvanam',0),('rajnandgaon',0),('mayang imphal',0),('nainpur',0),('phillaur',0),('solan',0),('adalaj',0),('bhimavaram',0),('wai',0),('samdhan',0),('ahmedabad',0),('pihani',0),('padra',0),('wadhwan',0),('ramanathapuram',0),('barpeta',0),('fatehabad',0),('tharamangalam',0),('visnagar',0),('charkhi dadri',0),('tilda newra',0),('khambhat',0),('sidhpur',0),('manvi',0),('raisinghnagar',0),('tikamgarh',0),('singrauli',0),('mehkar',0),('himachal pradesh',1),('samastipur',0),('mount abu',0),('panipat',0),('sardarshahar',0),('sailu',0),('malavalli',0),('sagwara',0),('gurgaon',0),('mundargi',0),('lucknow',0),('tehri',0),('guntakal',0),('rajura',0),('punganur',0),('jagraon',0),('savner',0),('mavoor',0),('bihar',1),('tiruchengode',0),('sasvad',0),('sadasivpet',0),('parlakhemundi',0),('taranagar',0),('rosera',0),('bapatla',0),('morinda',0),('sasaram',0),('perambalur',0),('varkala',0),('tirunelveli',0),('andaman and nicobar islands',1),('rahuri',0),('vaikom',0),('baharampur',0),('mokameh',0),('sibsagar',0),('shishgarh',0),('sarsod',0),('arvi',0),('sohagpur',0),('suriyampalayam',0),('limbdi',0),('theni allinagaram',0),('cherthala',0),('delhi',1),('delhi',0),('titlagarh',0),('jind',0),('rupnagar',0),('sumerpur',0),('gopalganj',0),('mizoram',1),('adra',0),('shamli',0),('afghanistan',2),('rapar',0),('ottappalam',0),('dharmavaram',0),('tiruvuru',0),('kadiri',0),('tindivanam',0),('peddapuram',0),('murtijapur',0),('sagar',0),('ranchi',0),('pardi',0),('surapura',0),('baramula',0),('mandamarri',0),('pandharkaoda',0),('pavagada',0),('maharajganj',0),('peravurani',0),('hoshiarpur',0),('rajakhera',0),('narwana',0),('dhenkanal',0),('lanka',0),('sanduru',0),('nagapattinam',0),('petlad',0),('sikar',0),('rajahmundry',0),('chatra',0),('manuguru',0),('sankari',0),('alipurdurban agglomerationr',0),('raghogarh-vijaypur',0),('nizamabad',0),('manendragarh',0),('patna',0),('shahpur',0),('udupi',0),('rameshwaram',0),('neem-ka-thana',0),('sambhal',0),('paravoor',0),('solapur',0),('srikalahasti',0),('kayamkulam',0),('tarbha',0),('goalpara',0),('kanhangad',0),('thiruvarur',0),('taraori',0),('sivagiri',0),('paithan',0),('ajmer',0),('mahnar bazar',0),('punjab',1),('warhapur',0),('jhargram',0),('samalkha',0),('rohtak',0),('manglaur',0),('rairangpur',0),('nalbari',0),('chirkunda',0),('karnal',0),('umaria',0),('pudupattinam',0),('sathyamangalam',0),('robertson pet',0),('kozhikode',0),('etawah',0),('pallikonda',0),('thirumangalam',0),('uthiramerur',0),('tinsukia',0),('udgir',0),('nakur',0),('pathardi',0),('kodungallur',0),('achhnera',0),('nanded-waghala',0),('rajauri',0),('yadgir',0),('navsari',0),('sagara',0),('\"shamsabad',0),('rudrapur',0),('sironj',0),('nahan',0),('sira',0),('udaipur',0),('sundarnagar',0),('vijaypur',0),('bargarh',0),('rudauli',0),('mangrulpir',0),('warisaliganj',0),('phagwara',0),('tenu dam-cum-kathhara',0),('pali',0),('brahmapur',0),('vadnagar',0),('jammu and kashmir',1),('jagdalpur',0),('marmagao',0),('kandukur',0),('tirora',0),('nehtaur',0),('adilabad',0),('koyilandy',0),('songadh',0),('raghunathganj',0),('partur',0),('dadra and nagar haveli',1),('valsad',0),('panagar',0),('powayan',0),('araria',0),('sunabeda',0),('nowrozabad',0),('amritsar',0),('mul',0),('hansi',0),('anjar',0),('vellore',0),('ambejogai',0),('purwa',0),('wara seoni',0),('virudhachalam',0),('faridkot',0),('uttarakhand',1),('osmanabad',0),('shahade',0),('akot',0),('begusarai',0),('sangole',0),('mudalagi',0),('renukoot',0),('nuzvid',0),('kancheepuram',0),('bodhan',0),('tittakudi',0),('tanda',0),('chittur-thathamangalam',0),('pilani',0),('malda',0),('kashipur',0),('markapur',0),('dibrugarh',0),('tundla',0),('sankeshwara',0),('mhow cantonment',0),('vidisha',0),('jammalamadugu',0),('modasa',0),('tharad',0),('purulia',0),('vyara',0),('sabalgarh',0),('suratgarh',0),('mundi',0),('jharsuguda',0),('sarangpur',0),('salaya',0),('mankachar',0),('punjaipugalur',0),('udumalaipettai',0),('saidpur',0);
/*!40000 ALTER TABLE `location_codes` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (6,'2020_09_16_104515_create_query_statuses_table',3),(8,'2020_09_21_103011_create_city__states_table',5),(28,'2014_10_12_000000_create_users_table',6),(29,'2014_10_12_100000_create_password_resets_table',6),(30,'2019_08_19_000000_create_failed_jobs_table',6),(31,'2020_08_10_191950_create_sessions_table',6),(32,'2020_09_10_110943_create_tweet_feedback_table',6),(33,'2020_09_18_055000_query_status_table',6),(34,'2020_10_13_054030_create_configures_table',6),(35,'2020_10_13_195603_create_crawler_lists_table',6),(36,'2020_10_22_120934_create_normal_queries_table',7),(37,'2020_12_04_061359_create_projects_table',8),(38,'2020_12_04_061939_create_project_activities_table',9),(39,'2020_12_11_043733_create_project_activities_table',10),(40,'2020_12_14_065232_create_location_codes_table',11),(41,'2021_02_02_024320_create_stories_table',12),(42,'2021_02_02_053114_create_story_contents_table',13);
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
INSERT INTO `normal_queries` VALUES ('1611831969693','9','#COVID19','2020-12-24','2020-12-25','Success','ha','b8617a14','737a7024'),('1612156218294','7','#covid19','2021-02-01','2021-02-01','Success','ha','567fc555','908d80df'),('1612180681315','7','#covid19','2020-12-01','2021-02-01','Success','ha','e726d4eb','765ffbb7'),('1612180721686','7','#india','2020-12-01','2021-02-02','Success','ha','d4d94205','c23b359a'),('1612187808563','7','$2570829264','2020-12-01','2021-02-01','Success','ua','3e034adc','b0334071'),('1612255680484','7','$36327407','2021-01-30','2021-02-02','Success','ua','291ef9d0','36e03be3'),('1612255688090','7','$36327407','2020-12-01','2021-02-02','Success','ua','fe9cc714','44cfa8a5'),('1612256249662','7','$240649814','2020-12-01','2021-02-02','Success','ua','4b8f0670','fab7c550'),('1612256251564','7','$240649814','2020-12-01','2021-02-02','Success','ua','c5b4d23b','0bf1d397'),('1612256253749','7','$240649814','2020-12-01','2021-02-02','Success','ua','90229dcf','4de063d2'),('1612256254656','7','$240649814','2020-12-01','2021-02-02','Success','ua','cc57fdb6','4d50e30e'),('1612259737648','7','#Annaatthe','2020-12-01','2021-02-02','Success','ha','f40455d6','b0c6113d'),('1612264668090','7','$385706946','2020-12-01','2021-02-02','Success','ua','7a79a6b5','4efbe68b'),('1612265228959','9','#Annaatthe','2020-12-01','2021-02-02','Success','ha','8154af30','0914bbdd'),('1612265435038','7','#SaveMyanmar','2021-02-02','2021-02-02','Success','ha','d398545c','1f52822b'),('1612265484424','9','*modi','2021-02-01','2021-02-02','Success','ha','82cfba3c','42d07836'),('1612265512797','9','*covid','2021-02-01','2021-02-02','Success','ha','6c649a17','5871720b'),('1612268607365','9','$759251','2021-01-30','2021-02-02','Success','ua','978de022','052419bd'),('1612268609245','9','$295833852','2021-02-01','2021-02-02','Success','ua','0df4a38d','210cbdc3'),('1612268613495','9','$1346439824','2021-02-01','2021-02-02','Success','ua','b6b16be8','72e82b19'),('1612268614411','9','$2584552812','2021-01-30','2021-02-02','Success','ua','9e40985c','ca45f61a'),('1612268698494','9','$3314976162','2021-01-30','2021-02-02','Success','ua','1fb4f58b','1badf702'),('1612269290754','9','$37034483','2021-01-30','2021-02-02','Success','ua','60462b36','14c4721d'),('1612269298610','9','$37034483','2021-01-30','2021-02-02','Success','ua','46baa007','462d3407'),('1612271756927','9','$3314976162','2020-12-01','2021-02-02','Success','ua','00c8a20b','5d1cfe26'),('uaStatusTable','1611823839053','7','$1447949844','2021-01-25','2021-01-28','Success','ua','7a6e7a6b');
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
-- Table structure for table `project_activities`
--

DROP TABLE IF EXISTS `project_activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_activities` (
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `analysis_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `analysis_datetime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `to_date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_query` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`full_query`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_activities`
--

LOCK TABLES `project_activities` WRITE;
/*!40000 ALTER TABLE `project_activities` DISABLE KEYS */;
INSERT INTO `project_activities` VALUES ('7','503a29fb','@narendramodi','2021-02-02 17:04:01','2020-12-01','2021-02-02','HA','7503a29fb@narendramodi2020-12-012021-02-02HA'),('7','503a29fb','$36327407','2021-02-02 18:23:54','2021-01-30','2021-02-02','UA','7503a29fb$363274072021-01-302021-02-02UA'),('7','503a29fb','#covid19','2021-02-02 17:06:04','2020-12-01','2021-01-01','HA','7503a29fbHASHcovid192020-12-012021-01-01HA'),('7','503a29fb','#covid19','2021-02-02 16:10:39','2020-12-01','2021-02-02','HA','7503a29fbHASHcovid192020-12-012021-02-02HA'),('7','503a29fb','#narendramodi','2021-02-02 17:03:46','2020-12-01','2021-02-02','HA','7503a29fbHASHnarendramodi2020-12-012021-02-02HA'),('9','562fbcec','$759251','2021-02-02 17:53:22','2021-01-30','2021-02-02','UA','9562fbcec$7592512021-01-302021-02-02UA'),('9','562fbcec','#Annaatthe','2021-02-02 15:29:36','2020-12-01','2021-02-02','HA','9562fbcecHASHAnnaatthe2020-12-012021-02-02HA'),('9','562fbcec','#ass','2021-02-02 15:18:48','2021-02-01','2021-02-02','HA','9562fbcecHASHass2021-02-012021-02-02HA'),('9','562fbcec','#covid19','2021-02-02 04:05:00','2020-12-01','2020-12-31','HA','9562fbcecHASHcovid192020-12-012020-12-31HA');
/*!40000 ALTER TABLE `project_activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `project_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_creation_date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) DEFAULT NULL,
  `project_description` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  UNIQUE KEY `projects_project_id_unique` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES ('503a29fb','pandemic2020','2021-01-31','7',1,'A test project created for coronavirus related information.'),('562fbcec','sars_2020','2021-01-31','9',1,'A test project created for coronavirus related information.'),('8d9cbe6f','finalfinalproject','2021-02-02','7',1,'A test project created for coronavirus related information.'),('b880eb4c','finalproject','2021-02-02','7',1,'A test project created for coronavirus related information.'),('cbab0735','pandemic_2020','2021-02-01','7',1,'A test project created for coronavirus related information.'),('da1f99d2','sars_virus','2021-02-02','7',1,'A test project created for coronavirus related information.'),('ffa6a530','virus_2020','2021-01-30','7',1,'A test project created for coronavirus related information.');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
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
INSERT INTO `query_statuses` VALUES ('#COVID19_2020-12-01_2021-01-15_50_Hashtag-Hashtag','10','#COVID19','2020-12-01','2021-01-15','success','na'),('1611206451233','9','(#delhi&@AK52979491)','2020-12-01','2020-12-31','success','ha'),('1611206486424','9','(#delhi&@rsprasad)','2020-12-01','2020-12-31','success','ha'),('1611739986455','7','($36327407&#Covid19)','2020-11-05','2021-01-27','running...','ua'),('1611740003031','7','($36327407&#Covid19)','2020-11-05','2021-01-27','running...','ua'),('#RAW_2020-12-22_2020-12-23_50_Hashtag-Hashtag','9','#RAW','2020-12-22','2020-12-23','success','na'),('#farmerprotest_2020-12-22_2020-12-23_50_Hashtag-Hashtag','9','#farmerprotest','2020-12-22','2020-12-23','success','na'),('#ISI_2020-12-22_2020-12-23_50_Hashtag-Hashtag','9','#ISI','2020-12-22','2020-12-23','success','na'),('#COVID19_2020-12-22_2020-12-23_50_Hashtag-Hashtag','9','#COVID19','2020-12-22','2020-12-23','success','na'),('#COVID19_2020-12-22_2020-12-23_50_Hashtag-Hashtag','7','#COVID19','2020-12-22','2020-12-23','success','na'),('#india_2020-12-22_2020-12-23_50_Hashtag-Hashtag','7','#india','2020-12-22','2020-12-23','success','na');
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
-- Table structure for table `stories`
--

DROP TABLE IF EXISTS `stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stories` (
  `storyID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storyName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storyDescription` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdOn` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`projectID`,`storyName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stories`
--

LOCK TABLES `stories` WRITE;
/*!40000 ALTER TABLE `stories` DISABLE KEYS */;
INSERT INTO `stories` VALUES ('HindustanTimes-analysis-503a29fb','503a29fb','HindustanTimes-analysis','This is a analysis story for HT','2021-02-02'),('NDTV-analysis-503a29fb','503a29fb','NDTV-analysis','This is a test story.','2021-02-02'),('TimesNow-analysis-503a29fb','503a29fb','TimesNow-analysis','This is a story about the news channel called Times now.','2021-02-02');
/*!40000 ALTER TABLE `stories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_contents`
--

DROP TABLE IF EXISTS `story_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story_contents` (
  `storyID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storyName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `analysisID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `analysisName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `analysisDescription` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`storyID`,`analysisID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_contents`
--

LOCK TABLES `story_contents` WRITE;
/*!40000 ALTER TABLE `story_contents` DISABLE KEYS */;
INSERT INTO `story_contents` VALUES ('HindustanTimes-analysis-503a29fb','HindustanTimes-analysis','6019121033725','HindustanTimes-Frequency Dist','This is a freq. distribution for ht over a range of time.','2021-02-02 03:19:20','2021-02-02 03:19:20'),('HindustanTimes-analysis-503a29fb','HindustanTimes-analysis','6019129cc79d7','HindustanTimes-SentimentDist','Sentiment distribution plot for HT','2021-02-02 03:21:40','2021-02-02 03:21:40'),('NDTV-analysis-503a29fb','NDTV-analysis','6019098c9ec92','ndtv-frequencyDistribution','Number of tweets ndtv has posted','2021-02-02 02:43:00','2021-02-02 02:43:00'),('NDTV-analysis-503a29fb','NDTV-analysis','601909b3c3f5e','ndtv-sentimentDistribution','NDTV\'s sentiment distribution over a certain range.','2021-02-02 02:43:39','2021-02-02 02:43:39'),('TimesNow-analysis-503a29fb','TimesNow-analysis','60191436609be','Times now Tweet Frequency','This is a plot about Times now Tweet Frequency over a range of time.','2021-02-02 03:28:30','2021-02-02 03:28:30'),('TimesNow-analysis-503a29fb','TimesNow-analysis','6019188fd3943','Covid Network centrality','This is a centrality network for #covid','2021-02-02 03:47:03','2021-02-02 03:47:03'),('TimesNow-analysis-503a29fb','TimesNow-analysis','601918c88bad8','Covid Network Community','This is a coimmunity network for #covid','2021-02-02 03:48:00','2021-02-02 03:48:00'),('TimesNow-analysis-503a29fb','TimesNow-analysis','60191a73ca408','UnionNetwork','This is a union network.','2021-02-02 03:55:07','2021-02-02 03:55:07'),('TimesNow-analysis-503a29fb','TimesNow-analysis','6019205bbbbbb','Map analysis','Few locations I am interested in.','2021-02-02 04:20:19','2021-02-02 04:20:19'),('TimesNow-analysis-503a29fb','TimesNow-analysis','60194812af743','COVID-frequency plot of tweets','This is a plot for COVID-frequency plot of tweets','2021-02-02 07:09:46','2021-02-02 07:09:46');
/*!40000 ALTER TABLE `story_contents` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tweet_feedback`
--

LOCK TABLES `tweet_feedback` WRITE;
/*!40000 ALTER TABLE `tweet_feedback` DISABLE KEYS */;
INSERT INTO `tweet_feedback` VALUES (1,'2020-10-17 13:21:10','2020-10-17 13:21:10','7','category','1312680455674753025','normal','com'),(2,'2020-11-01 02:01:42','2020-11-01 02:01:42','9','category','1322802830181388289','com','com_sec'),(3,'2020-11-01 02:01:44','2020-11-01 02:01:44','9','sentiment','1322802830181388289','2','2'),(4,'2021-01-22 06:44:20','2021-01-22 06:44:20','9','sentiment','1334555621828554753','0','1');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'pk','iitg','3','$2y$10$0rxpdnuZoeFaJ1OIwq3FMuhT0zKeedlh.J3ijlh3kzdGWglpF.coC',NULL,'2020-10-16 03:14:01','2020-10-16 03:14:01'),(7,'blade365z','iitg','1','$2y$10$yH0UL5X.hSuk/bNQlXj7segMuQAM2z07LxnyS4xE.gmeH9KQbzVWS',NULL,'2020-10-16 03:20:11','2020-10-16 03:20:11'),(9,'ranbir','iitg','3','$2y$10$Zght8upvHbsW1cQXvcos4OejVb7WFbIDoyOXXJklwKlAasGgwEgdS',NULL,'2020-10-16 03:20:43','2020-10-16 03:20:43'),(10,'anurag','iitg','1','$2y$10$wMr/ohfBHTMK6Ynbi8FxX.FMpzUlUK0ON88JUsSSzNkAUYpaQoHa2',NULL,'2021-01-12 04:52:49','2021-01-12 04:52:49');
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

-- Dump completed on 2021-02-02 22:15:31
