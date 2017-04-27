import re
import requests
import json
import time
from bs4 import BeautifulSoup
import os 

def makeNewDir(path):
	try: 
	    os.makedirs(path)
	except OSError:
	    if not os.path.isdir(path):
	        raise
	return

headers = { 'Referer':'http://dotamax.com/hero/rate/',
            'Accept-Language':'en-us',
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.113 Safari/537.36'}

def crawler():
    date = time.strftime("%d_%m_%Y")
    allyDir = './html/comb/' + date + '/'
    enemyDir = './html/anti/' + date + '/'
    winRateDir = './html/winRate/' + date + '/'
    makeNewDir(allyDir)
    makeNewDir(enemyDir)
    makeNewDir(winRateDir)

    # download
    with open('herolist.txt') as heros:
        herolist = heros.read().split(',')
        herolist.append("furion")
        herolist.append('spectre')
        
        for hero in herolist:
            # Ally
            url = 'http://dotamax.com/hero/detail/match_up_comb/' + hero + '/'
            req = requests.get(url,headers=headers)
            print('Getting Allies: ',hero,req.status_code)        
            with open(allyDir + hero + '.html', 'w') as f:
                f.write(req.text)
            time.sleep(0.5)

            # Enemy
            url = 'http://dotamax.com/hero/detail/match_up_anti/' + hero + '/'
            req = requests.get(url,headers=headers)
            print('Getting Enemies: ', hero, req.status_code)        
            if (req.status_code != 200):
                print(url)
            with open(enemyDir + hero + '.html', 'w') as f:
                f.write(req.text)
            time.sleep(0.5)
            
        # WinRate
        url = 'http://dotamax.com/hero/rate'
        req = requests.get(url,headers=headers)
        print(req.status_code,'winRate')        
        if (req.status_code != 200):
            print(url)
        with open(winRateDir + 'winRate.html', 'w') as f:
            f.write(req.text)
        time.sleep(0.5)

def WinRate(fileDescriptor):
    getHeroName = re.compile("/hero/detail/([A-Za-z_\'-]+?)'")
    ratePatt = re.compile('10px">(.*)%</div>')

    text = fileDescriptor.read()
    soup = BeautifulSoup(text, 'html.parser')
    trlist = soup.find_all('tr')
    WinRateDict = {}
    for i in range(0,len(trlist)):    
        tdlist = trlist[i].find_all('td')
        nameRaw = re.sub(r'\ ','_',str(trlist[i]))
        if 'natural' in nameRaw and 'prophet' in nameRaw:
            heroName = 'nature_prophet'
        else:
            heroName = getHeroName.search(nameRaw).group(1)
        if len(tdlist) != 3:
            print('Irregular tdlist:\n',tdlist)
            break
        targetHeroWinRate = ratePatt.search(str(tdlist[1])).group(1)
        # ignore total battles for now, will be trivial to add later
        WinRateDict[heroName.lower()] = {'winRate':targetHeroWinRate}
    
    return WinRateDict

# ANTI
def Enemy(fileDescriptor):
    getHeroName = re.compile('/hero/detail/([A-Za-z_\']+?)"')
    ratePatt = re.compile('10px">(.*)%</div>')

    
    text = fileDescriptor.read()
    soup = BeautifulSoup(text, 'html.parser')
    trlist = soup.find_all('tr')
    EnemyHeroDict = {}
    for i in range(1,len(trlist)):
        tdlist = trlist[i].find_all('td')
        if len(tdlist) != 4:
            print('Irregular tdlist:\n',tdlist)
            break
        try:
            nameRaw = re.sub(r'\ ','_',str(tdlist[0])).lower()
            if 'natural' in nameRaw and 'prophet' in nameRaw:
                heroName = 'furion'
            else:
                heroName = getHeroName.search(nameRaw).group(1)
            cooperationIndex = ratePatt.search(str(tdlist[1])).group(1)
            targetHeroWinRate = ratePatt.search(str(tdlist[2])).group(1)
            # ignore total battles for now, will be trivial to add later
            EnemyHeroDict[heroName.lower()] = {'co-opIndex':cooperationIndex,'winRateAsAlly':targetHeroWinRate}
        except:
            print(tdlist)
    return EnemyHeroDict

# ALLY
def Ally(fileDescriptor):
    getHeroName = re.compile('/hero/detail/([A-Za-z_\']+?)"')
    ratePatt = re.compile('10px">(.*)%</div>')

    text = fileDescriptor.read()
    soup = BeautifulSoup(text, 'html.parser')
    trlist = soup.find_all('tr')
    FavoredHeroDict = {}
    for i in range(1,len(trlist)):
        tdlist = trlist[i].find_all('td')
        if len(tdlist) != 4:
            print('Irregular tdlist:\n',tdlist)
            break
        try:
            nameRaw = re.sub(r'\ ','_',str(tdlist[0])).lower()
            if 'natural' in nameRaw and 'prophet' in nameRaw:
                heroName = 'furion'
            else:
                heroName = getHeroName.search(nameRaw).group(1)
            cooperationIndex = ratePatt.search(str(tdlist[1])).group(1)
            targetHeroWinRate = ratePatt.search(str(tdlist[2])).group(1)
            # ignore total battles for now, will be trivial to add later
            FavoredHeroDict[heroName.lower()] = {'co-opIndex':cooperationIndex,'winRateAsAlly':targetHeroWinRate}
        except:
            print(tdlist)

    return FavoredHeroDict

# parse
def parse():
    date = time.strftime("%d_%m_%Y")
    allyDir = './html/comb/' + date + '/'
    enemyDir = './html/anti/' + date + '/'
    winRateDir = './html/winRate/' + date +'/'
    jsonDir = './json/' + date + '/'
    makeNewDir(jsonDir)
    
    with open('herolist.txt') as heros:
        herolist = heros.read().split(',')
        TopLayerDict = {}

        with open(winRateDir + 'winRate.html','r') as f:
            TopLayerDict = WinRate(f)
        
        # special for nature's prophet
        herolist.append('furion')
        herolist.append('spectre')
        
        for hero in herolist:
            print('Processing ', hero,'')
            AllyDict = {}
            EnemyDict = {}

            # Ally
            with open(allyDir + hero + '.html', 'r') as f1:
                AllyDict[hero] = Ally(f1)
        
            # Enemy
            with open(enemyDir + hero + '.html', 'r') as f2:
                EnemyDict[hero] = Enemy(f2)
        
            TopLayerDict[hero.lower()]['Ally'] = AllyDict
            TopLayerDict[hero.lower()]['Enemy'] = EnemyDict
            
                
        out = json.dumps(TopLayerDict, sort_keys=True,indent=4, separators=(',', ': '))
        with open(jsonDir + 'Dota_STAT.json','w') as js:
            js.write(out)

crawler()
parse()

# url = 'http://dotamax.com/hero/detail/match_up_comb/spectre/'
# url = 'http://dotamax.com/hero/detail/match_up_anti/spectre/'
# url = 'http://dotamax.com/hero/rate/'

