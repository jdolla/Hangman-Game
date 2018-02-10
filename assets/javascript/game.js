function showElement(id){
    var element = document.getElementById(id);
    element.classList.remove("hidden");
}

function hideElement(id){
    var element = document.getElementById(id);
    element.classList.add("hidden");
}

var game = {
    introFinished: false,
    gameInProgress: false,
    currentState: 0, //Set the initial state to the intro
    wordsPlayed: 0,
    wins: 0,

    gameSpaceId: "gameWindow",

    wordBank: [
        { word: "WarGames", image: "image source", clip: "audio clip" },
        { word: "WarGames", image: "image source", clip: "audio clip" }
    ],

    isVisible: false,
    show: function () {

    },

    intro: {
        isFinished: false,
        elementId: "intro",

        isVisible: true,
        hide: function () {
            hideElement(this.elementId);
            this.isVisible = false;
        },

        finish: {
            elementId: "introPressKey",
            show: function(){
                showElement(this.elementId);
            }
        }
    }
};


setTimeout(function(){
    showElement("introPressKey");
    game.introFinished = true;   
}, 9000);

document.onkeypress = function(event){
    if (game.introFinished) {
        showGame();
    }
}