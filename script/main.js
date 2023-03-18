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
        p1: 40, //Life total for player 1
        p2: 40, //Life total for player 2
        p1TempLife: 0,
        p2TempLife: 0,
        p1Hero: "Default",
        p2Hero: "Default",
        p1Log: [], //{Amount: +/- int, Type: Physical, Arcane, Other}
        p2Log: [],
        webcamMode: false,
        diceValue1: -1,
        diceValue2: -1,
		diceRolled: " ",
		userHoldingLifeChange: false,
		resetConfirm: false,
        heroes: {
            Default: {cc: 40, blitz: 20},
			Arakni: {cc: 40, blitz: 20}, 
            Azalea: {cc: 40, blitz: 20},
            Benji: {cc: null, blitz: 17},
            Boltyn: {cc: 40, blitz: 20}, 
            Bravo: {cc: 40, blitz: 20},    
            Briar: {cc: 40, blitz: 20},
            Chane: {cc: 40, blitz: 20},
            Dash: {cc: 40, blitz: 20},
            DataDoll: {cc: null, blitz: 20},
            Dorinthea: {cc: 40, blitz: 20},
			Emperor: {cc: null, blitz: 15},
            Dromai: {cc: 40, blitz: 20},
            Fai: {cc: 40, blitz: 20},
            Genis: {cc: null, blitz: 20},
            Iyslander: {cc: 36, blitz: 18},
            Ira: {cc: null, blitz: 20},
            Kano: {cc: 30, blitz: 15},
            Kassai: {cc: null, blitz: 20},
			Katsu: {cc: 40, blitz: 20},
            Kavdaen: {cc: null, blitz: 20},
            Kayo: {cc: null, blitz: 20},
            Lexi: {cc: 40, blitz: 20},
            Levia: {cc: 40, blitz: 20},
            Oldhim: {cc: 40, blitz: 20},
            Prism: {cc: 40, blitz: 20},
			Riptide: {cc: 38, blitz: 19},
            Rhinar: {cc: 40, blitz: 20},
            Shiyana: {cc: null, blitz: 20},
            Starvo: {cc: null, blitz: 20},
			Uzuri: {cc: 40, blitz: 20},
            Valda: {cc: null, blitz: 21},
            Viserai: {cc: 40, blitz: 20},
			Yoji: {cc: null, blitz: 20}           
        }
    },
    methods: {
        setCC: function(){
            if(this.heroes[this.p1Hero].cc == null){
                this.p1Hero = "Default";
            }

            if(this.heroes[this.p2Hero].cc == null){
                this.p2Hero = "Default";
            }

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
            this[Player + "TempLife"] += Amount;
            this[Player] += Amount;
            lifeDebounce(Player, this[Player + "TempLife"], Type);

            if(this.typeDefaultDisabled == false){
                resetToPhysicalDebounce();
            }          
        },
        lifeChangeCommit: function(Player, Amount, Type){
            if(Amount == 0) return;

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
            this[Player + "TempLife"] = 0;
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

			this.resetConfirm = false;
        },
        setPlayerHero: function(player, heroName){
            this[player + "Hero"] = heroName;

            if(player == "p2"){
                Cookies.set("p2Hero", heroName, 9999);
            }

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
        getDiceValue(maxDiceValue){
			LifeTotalApp.diceRolled = "1d" + maxDiceValue;
            const delay = async (ms = 1000) =>
            new Promise(resolve => setTimeout(resolve, ms));

            async function diceLoop() {
                for (let i = 0; i < 5; i += 1) {
                    LifeTotalApp.diceValue1 = rollDice(1,maxDiceValue);
                    LifeTotalApp.diceValue2 = rollDice(1,maxDiceValue);
                    await delay(100)
                }
            }

            diceLoop();
        },
        getImage(hero){
            if(this.format == "CC"){
                return "./images/hero_adult/" + hero.toLowerCase() + "_adult.jpg";
            }
            else{
                return "./images/hero_young/" + hero.toLowerCase() + "_young.jpg";
            }
        },
		refreshPageForUpdates(){
			location.reload(true);
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
        },
		resetConfirm: function(){
			resetConfirmTimeout();
		}
    },
    created: function(){
        //grab cookies
        this.format = Cookies.get('format') != undefined ? Cookies.get('format') : "CC";
        this.p2Hero = Cookies.get('p2Hero') != undefined ? Cookies.get('p2Hero') : "Default";

        this.damageTypeEnabled = Cookies.get('damageTypeEnabled') == 'true' ? true : false;

        this.p1 = this.format == "CC" ? 40 : 20;
        this.p2 = this.format == "CC" ? 40 : 20;
    }
});

function rollDice(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
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

var resetConfirmRunning = false;

function resetConfirmTimeout(){
	if(resetConfirmRunning == true) return;
	resetConfirmRunning = true;

	setTimeout(() => {
		LifeTotalApp.resetConfirm = false;
		resetConfirmRunning = false;
	}, 2000);
}