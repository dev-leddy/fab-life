// Disabled Right click
document.addEventListener('contextmenu', event => event.preventDefault());
// Prevent selection
document.addEventListener("selectstart", event=> event.preventDefault());
document.addEventListener("mousedown", event=> event.preventDefault());
document.addEventListener("touchstart", event=> event.preventDefault());

var LifeTotalApp = new Vue({
    el: '#app',
    data: {
        format: "CC",
        damageType: "Physical",
        damageTypeEnabled: false,
        typeDefaultDisabled: false,
        p1: 40,
        p2: 40,
        p1Hero: "Default",
        p2Hero: "Default",
        p1Log: [], //{Amount: +/- int, Type: Physical, Arcane, Other}
        p2Log: [],
        webcamMode: false,
        diceValue1: -1,
        diceValue2: -1,
        tempLife: 0,
        heroes: {
            Default: {cc: 40, blitz: 20, image: "./images/default.PNG"},
            Azalea: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/azalea_nocopy.height-650.jpg"},
            Benji: {cc: null, blitz: 17, image: "https://storage.googleapis.com/fabmaster/media/images/CRU_NINJA_HERO_Benji_the_Piercing_Wind_Sam_Ya.height-650.jpg"},
            Boltyn: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/bol_main_hero_image_001.height-650.jpg"}, 
            Bravo: {cc: 40, blitz: 20, image: "https://cdna.artstation.com/p/assets/images/images/021/004/498/large/alexander-mokhov-casanova-1700x1219-cr.jpg"},    
            Briar: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/briar_adult_art_cover_img123010325677.height-650.jpg"},
            Chane: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/chane_main_hero_image_001.height-650.jpg"},
            Dash: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/dash_nocopy.height-650.jpg"},
            DataDoll: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/ujJO4W9Wg0.height-650.jpg"},
            Dorinthea: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/101_Dorinthea_Ironsong_Lius_Lasahido.height-650.jpg"},
            Dromai: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/9Y5YqZ1dukn7.height-650.jpg"},
            Fai: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/cH69DlSWS2LC.height-650.jpg"},
            Iyslander: {cc: 36, blitz: 18, image: "https://storage.googleapis.com/fabmaster/media/images/Iyslander_Hero_IVHJpfvav250.height-650.jpg"},
            Ira: {cc: null, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/iraz.height-650.jpg"},
            Kano: {cc: 30, blitz: 15, image: "https://storage.googleapis.com/fabmaster/media/images/kano_old_nocopy.height-650.jpg"},
            Kassai: {cc: null, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/vH90gkpAQ6.height-650.jpg"},
            Lexi: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/lexi_hero_art_full.height-650.jpg"},
            Levia: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/68496456547887.height-650.jpg"},
            Oldhim: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/oldhim_cover_image_12038190238.height-650.jpg"},
            Prism: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/ismpr_main_roeh_image_001.height-650.jpg"},
            Rhinar: {cc: 40, blitz: 20, image: "https://storage.googleapis.com/fabmaster/media/images/101_Rhinar_Reckless_Rampage_Wisnu_Tan.height-650.jpg"},
            Valda: {cc: null, blitz: 21, image: "https://storage.googleapis.com/fabmaster/media/images/hero_uOyFL37z033ISMmboAoC.height-650.jpg"},
            Viserai: {cc: 40, blitz: "BAN", image:"https://storage.googleapis.com/fabmaster/media/images/malthus_nocopy.height-650.jpg"}           
        }
    },
    methods: {
        setCC: function(){
            this.p1 = this.heroes[this.p1Hero].cc;
            this.p2 = this.heroes[this.p2Hero].cc;
            this.format = "CC";
            Cookies.set('format', 'CC', 9999);
        },
        setBlitz: function(){
            this.p1 = this.heroes[this.p1Hero].blitz;
            this.p2 = this.heroes[this.p2Hero].blitz;
            this.format = "Blitz";
            Cookies.set('format', 'Blitz', 9999);
        },
        lifeChange: function(Player, Amount, Type){
            this.tempLife += Amount;
            this[Player] += Amount;
            lifeDebounce(Player, this.tempLife, Type);

            if(this.typeDefaultDisabled == false){
                resetToPhysicalDebounce();
            }          
        },
        lifeChangeCommit: function(Player, Amount, Type){
            //this[Player] += Amount;
            //let type = this.damageType;
            
            //heal/correction
            if(Amount > 0) {
                Amount = "+" + Amount;
                Type = "Life Gain";
            }

            let data = {'Life': this[Player], '#': Amount};

            if(this.damageTypeEnabled){
                data["Type"] = Type;
            }

            this.$set(
                this[Player + 'Log'], 
                this[Player + 'Log'].length, 
                data
            );
            this.tempLife = 0;
        },
        reset: function(){
            if(this.format == "CC"){
                this.setCC();
            }
            else{
                this.setBlitz();
            }

            this.p1Log.splice(0);
            this.p2Log.splice(0);
        },
        setPlayerHero: function(player, heroName){
            this[player + "Hero"] = heroName;
            if(this.format == "CC")
            {
                this[player] = this.heroes[heroName].cc;
            }
            else{
                this[player] = this.heroes[heroName].blitz;
            }
            this.p1Log.splice(0);
            this.p2Log.splice(0);
        },
        getDiceValue(){
            const delay = async (ms = 1000) =>
            new Promise(resolve => setTimeout(resolve, ms));

            async function diceLoop() {
                for (let i = 0; i < 5; i += 1) {
                    LifeTotalApp.diceValue1 = rollDice(1,6);
                    LifeTotalApp.diceValue2 = rollDice(1,6);
                    await delay(100)
                }
            }

            diceLoop();
        }
    },
    watch: {
        // damageTypeEnabled: false,
        // typeDefaultDisabled: false,
        // webcamMode
        damageTypeEnabled: function(newValue, oldValue){
            Cookies.set('damageTypeEnabled', newValue, 9999);
        },
        typeDefaultDisabled: function(newValue, oldValue){
            Cookies.set('typeDefaultDisabled', newValue, 9999);
        }
    },
    created: function(){
        //grab cookies
        this.format = Cookies.get('format') != undefined ? Cookies.get('format') : "CC";

        this.p1 = this.format == "CC" ? 40 : 20;
        this.p2 = this.format == "CC" ? 40 : 20;

        this.damageTypeEnabled = Cookies.get('damageTypeEnabled') != undefined ? Cookies.get('damageTypeEnabled') : false;
    }
});

function rollDice(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1))
}

var lifeDebounce = debounce(function(Player, Amount, Type){
    LifeTotalApp.lifeChangeCommit(Player, Amount, Type);
}, 750);

var resetToPhysicalDebounce = debounce(function(){
    LifeTotalApp.damageType = "Physical";
}, 2000);

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};