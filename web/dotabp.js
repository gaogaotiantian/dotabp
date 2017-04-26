var heroList;
var selfTeam = [];
var enemyTeam = [];
// heroName has to be Valid!
function AddHero(heroName) {
    if (heroName.toLowerCase() != heroName) {
        heroName = HeroLocalToOfficial(heroName);
    }
    var html = "";
    var imgSrc = 'http://cdn.dota2.com/apps/dota2/images/heroes/' + heroName.toLowerCase() + '_lg.png'
    html += '<div class="hero" heroName="' + heroName + '">';
    html += '<img src="' + imgSrc + '">';
    html += '<div class="hero_data">';
    html += GetHeroData(heroName);
    html += '</div>'
    html += '</div>';
    return html
}
function GetHeroData(heroName) {
    html = ""
    html += "Team +2.0%<br>";
    html += "Opp -2.0%";
    return html
}
function ImageClear() {
    
}
function RefreshHeroDiv(d) {
    d.empty();
    console.log(AddHero('spectre'));
    d.html(AddHero('spectre'));
}
function HeroLocalToOfficial(localName) {
    if (localName == "") {
        return "";
    }
    for (var i = 0; i < heroList.length; i++) {
        if (heroList[i]["localized_name"] == localName) {
            return heroList[i]["name"];
        } 
    }
    alert("There's no hero named "+localName)
}
function RefreshPage() {
    $('#on_stage_hero_self_div').empty();
    $('#on_stage_hero_enemy_div').empty();
    for (i = 0; i < 5; i++) {
        if (i < selfTeam.length) {
            $('#on_stage_hero_self_div').append($("<div>", {"class":"col on_stage_hero self_on_stage_hero"}).append(AddHero(selfTeam[i])));
        } else {
            $('#on_stage_hero_self_div').append($("<div>", {"class":"col on_stage_hero self_on_stage_hero"}));
        }
        if (i < enemyTeam.length) {
            $('#on_stage_hero_enemy_div').append($("<div>", {"class":"col on_stage_hero enemy_on_stage_hero"}).append(AddHero(enemyTeam[i])));
        } else {
            $('#on_stage_hero_enemy_div').append($("<div>", {"class":"col on_stage_hero enemy_on_stage_hero"}));
        }
    }

}
$(document).ready(function() {
    // Put all heros
    var heroStr = ["Axe", "Earthshaker", "Pudge", "Sand King", "Sven", "Tiny", "Kunkka", "Slardar", "Tidehunter", "Beastmaster", "Wraith King", "Dragon Knight", "Clockwerk", "Lifestealer", "Omniknight", "Huskar", "Night Stalker", "Doom", "Spirit Breaker", "Alchemist", "Lycan", "Brewmaster", "Chaos Knight", "Treant Protector", "Undying", "Io", "Centaur Warrunner", "Magnus", "Timbersaw", "Bristleback", "Tusk", "Abaddon", "Elder Titan", "Legion Commander", "Earth Spirit", "Underlord", "Phoenix"].sort();
    var heroAgi = ["Anti-Mage", "Bloodseeker", "Drow Ranger", "Juggernaut", "Mirana", "Morphling", "Shadow Fiend", "Phantom Lancer", "Razor", "Vengeful Spirit", "Riki", "Sniper", "Venomancer", "Faceless Void", "Phantom Assassin", "Templar Assassin", "Viper", "Luna", "Clinkz", "Broodmother", "Bounty Hunter", "Weaver", "Spectre", "Ursa", "Gyrocopter", "Lone Druid", "Meepo", "Nyx Assassin", "Naga Siren", "Slark", "Medusa", "Troll Warlord", "Ember Spirit", "Terrorblade", "Arc Warden", "Monkey King"].sort();
    var heroInt = ["Bane", "Crystal Maiden", "Puck", "Storm Spirit", "Windranger", "Zeus", "Lina", "Lion", "Shadow Shaman", "Witch Doctor", "Lich", "Enigma", "Tinker", "Necrophos", "Warlock", "Queen of Pain", "Death Prophet", "Pugna", "Dazzle", "Leshrac", "Nature's Prophet", "Dark Seer", "Enchantress", "Jakiro", "Batrider", "Chen", "Ancient Apparition", "Invoker", "Silencer", "Outworld Devourer", "Shadow Demon", "Ogre Magi", "Rubick", "Disruptor", "Keeper of the Light", "Visage", "Skywrath Mage", "Techies", "Oracle", "Winter Wyvern"].sort();
    // Read all json data
    $.getJSON("hero_list.json", function(data) {
        // Deep copy here
        heroList = JSON.parse(JSON.stringify(data["heroes"]));
    })
    .done(function() {
        for (i = 0; i < 20; i++) {
            $('#off_stage_hero_div_str_1').append($("<div>", {"class":"col off_stage_hero"}).append(AddHero(HeroLocalToOfficial(heroStr[i]))));
            $('#off_stage_hero_div_agi_1').append($("<div>", {"class":"col off_stage_hero"}).append(AddHero(HeroLocalToOfficial(heroAgi[i]))));
            $('#off_stage_hero_div_int_1').append($("<div>", {"class":"col off_stage_hero"}).append(AddHero(HeroLocalToOfficial(heroInt[i]))));
            if (20 + i < heroStr.length) {
                $('#off_stage_hero_div_str_2').append($("<div>", {"class":"col off_stage_hero"}).append(AddHero(HeroLocalToOfficial(heroStr[i+20]))));
            } else {
                $('#off_stage_hero_div_str_2').append($("<div>", {"class":"col off_stage_hero"}));
            }
            if (20 + i < heroAgi.length) {
                $('#off_stage_hero_div_agi_2').append($("<div>", {"class":"col off_stage_hero"}).append(AddHero(HeroLocalToOfficial(heroAgi[i+20]))));
            } else {
                $('#off_stage_hero_div_agi_2').append($("<div>", {"class":"col off_stage_hero"}));
            }
            if (20 + i < heroInt.length) {
                $('#off_stage_hero_div_int_2').append($("<div>", {"class":"col off_stage_hero"}).append(AddHero(HeroLocalToOfficial(heroInt[i+20]))));
            } else {
                $('#off_stage_hero_div_int_2').append($("<div>", {"class":"col off_stage_hero"}));
            }
        }
    });

    // Setup the on stage slots
    RefreshPage();
    $('body')
    .on('click', 'img', function(e) {
        if ($(this).parent().parent().hasClass("self_on_stage_hero")) {
            var name = $(this).parent().attr("heroName");
            selfTeam.splice(selfTeam.indexOf(name), 1);
        } else if ($(this).parent().parent().hasClass("enemy_on_stage_hero")) {
            var name = $(this).parent().attr("heroName");
            enemyTeam.splice(enemyTeam.indexOf(name), 1);
        } else if ($(this).parent().parent().hasClass("off_stage_hero")) {
            var name = $(this).parent().attr("heroName");
            if (selfTeam.indexOf(name) == -1 && enemyTeam.indexOf(name) == -1) {
                if (e.offsetX < e.target.width/2 && selfTeam.length < 5) {
                    selfTeam.push(name);
                } else if (e.offsetX >= e.target.width/2 && enemyTeam.length < 5){
                    enemyTeam.push(name);
                }
            }
        }
        RefreshPage()
    })
    .on('mousemove', 'img', function(e) {
        if ($(this).parent().parent().hasClass("off_stage_hero")) {
            if (e.offsetX < e.target.width/2) {
                $(this).css({"border-color":"green"});
            } else {
                $(this).css({"border-color":"red"});
            }
        }
    })
    .on('mouseleave', 'img', function(e) {
        if ($(this).parent().parent().hasClass("off_stage_hero")) {
            $(this).css({"border-color":"transparent"});
        }
    });
});
