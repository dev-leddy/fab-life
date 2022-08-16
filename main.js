var heroSelectHtml = "";
var LifeTotalApp = new Vue({
    el: '#app',
    data: {
        format: "CC",
        p1: 40,
        p2: 40,
        p1Hero: "Default",
        p2Hero: "Default",
        editPlayer: "",
        webcamMode: false,
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
        reset: function(){
            if(this.format == "CC"){
                this.setCC();
            }
            else{
                this.setBlitz();
            }
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
        }
    },
    mounted: function () {
    }
});

//Required to init icons
feather.replace();