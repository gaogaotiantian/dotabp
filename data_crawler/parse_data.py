import json

def GetRegWinRate(rate1, rate2):
    selfPie = (rate1/(100-rate1)) * (rate2/(100-rate2))
    return selfPie / (1+selfPie) * 100

def GetRegWinRateEnemy(rate1, rate2):
    selfPie = WinRateToAdv(rate1)
    enemyPie = WinRateToAdv(rate2)
    return selfPie / (selfPie + enemyPie) * 100

def WinRateToAdv(rate):
    return rate / (100.0 - rate)

def GetTeammateAdv(oldRate, newRate):
    return WinRateToAdv(newRate) / WinRateToAdv(oldRate)

if __name__ == '__main__':
    data = {}
    with open("raw_data.json") as f:
        raw_data = json.load(f)
    for hero in raw_data:
        try:
            data[hero] = {}
            winRate = float(raw_data[hero]["winRate"])
            data[hero]["rate"] = WinRateToAdv(winRate)
            print hero
            ally = raw_data[hero]["Ally"][hero]
            data[hero]["teammate"] = {}
            for allyHero in ally:
                regWinRate = GetRegWinRate(winRate, float(raw_data[allyHero]["winRate"]))
                data[hero]["teammate"][allyHero] = GetTeammateAdv(regWinRate, float(ally[allyHero]["winRateAsAlly"]))
            enemy = raw_data[hero]["Enemy"][hero]
            data[hero]['matchup'] = {}
            for enemyHero in enemy:
                regWinRate = GetRegWinRateEnemy(winRate, float(raw_data[enemyHero]["winRate"]))
                data[hero]["matchup"][enemyHero] = GetTeammateAdv(regWinRate, float(enemy[enemyHero]["winRateAsAlly"]))
        except Exception as e:
            print e
    with open("hero_data.json", "w") as f:
        json.dump(data, f, indent=2, sort_keys=True)
