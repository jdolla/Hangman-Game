"use strict";

document.onkeypress = function(event){
    console.log(gameState);
    if(gameState === "post-intro"){
        gameState = gameStates[1];
        hideElement("intro");
        showElement("gameHeader");
        showElement("gameWindow");
    }
}

function showIntroPressKey(){
    showElement("introPressKey");
    gameState = "post-intro";
}

function progressGame(event){
    showElement("introPressKey")
}

function showElement(name){
    element = document.getElementById(name);
    element.classList.remove("hidden");
}

function hideElement(name){
    element = document.getElementById(name);
    element.classList.add("hidden");
}



setTimeout(showIntroPressKey, 9000);
var gameStates = ["intro", "post-intro"
    , "ready-player", "game-on"];

var gameState = gameStates[0]; //Set the game state to "intro"
