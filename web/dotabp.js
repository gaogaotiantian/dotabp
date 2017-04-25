var heroList = {"spectre":{}}
function AddHero(heroName) {
    var html = "";
    if (heroName in heroList) {
        var imgSrc = 'http://cdn.dota2.com/apps/dota2/images/heroes/' + heroName.toLowerCase() + '_lg.png'
        html += '<div class="hero">';
        html += '<img src="' + imgSrc + '">';
        html += '<div class="hero_data">';
        html += GetHeroData(heroName);
        html += '</div>'
        html += '</div>';
    }
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
$(document).ready(function() {
    for (i = 0; i < 5; i++) {
        $('#on_stage_hero_self_div').append('<div class="col on_stage_hero"><button>HERO</button></div>');
        $('#on_stage_hero_enemy_div').append('<div class="col on_stage_hero"><button>HERO</button></div>');
    }
    for (i = 0; i < 20; i++) {
        $('#off_stage_hero_div_str_1').append('<div class="col off_stage_hero"><button>HERO</button></div>');
        $('#off_stage_hero_div_str_2').append('<div class="col off_stage_hero"><button>HERO</button></div>');
        $('#off_stage_hero_div_dex_1').append('<div class="col off_stage_hero"><button>HERO</button></div>');
        $('#off_stage_hero_div_dex_2').append('<div class="col off_stage_hero"><button>HERO</button></div>');
    }
    $('body').on('click', 'img', function() {
       $(this).parent().empty(); 
    });
});
