// Disabled Right click
document.addEventListener('contextmenu', event => event.preventDefault());
// //Prevent selection
// document.addEventListener("selectstart", event=> event.preventDefault());
// document.addEventListener("mousedown", event=> event.preventDefault());
// document.addEventListener("touchstart", event=> event.preventDefault());

var LifeTotalApp = new Vue({
    el: '#app',
    data: {
        format: "CC",
        damageType: "Physical",
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
            Valda: {cc: null, blitz: 21},
            Iyslander: {cc: 36, blitz: 18},
            Kano: {cc: 30, blitz: 15},
            Benji: {cc: null, blitz: 17},
            Default: {cc: 40, blitz: 20}
        }
    },
    methods: {
        setCC: function(){
            this.p1 = this.heroes[this.p1Hero].cc;
            this.p2 = this.heroes[this.p2Hero].cc;
            this.format = "CC";
        },
        setBlitz: function(){
            this.p1 = this.heroes[this.p1Hero].blitz;
            this.p2 = this.heroes[this.p2Hero].blitz;
            this.format = "Blitz";
        },
        lifeChange: function(Player, Amount, Type){
            this.tempLife += Amount;
            this[Player] += Amount;
            lifeDebounce(Player, this.tempLife, Type);
            resetToPhysicalDebounce();
        },
        lifeChangeCommit: function(Player, Amount, Type){
            //this[Player] += Amount;
            //let type = this.damageType;
            
            //heal/correction
            if(Amount > 0) {
                Amount = "+" + Amount;
                Type = "Life Gain";
            }

            this.$set(
                this[Player + 'Log'], 
                this[Player + 'Log'].length, 
                {'Life': this[Player], '#': Amount, 'Type': Type}
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