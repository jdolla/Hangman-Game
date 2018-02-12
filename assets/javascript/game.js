function showElement(id){
    var element = document.getElementById(id);
    element.classList.remove("hidden");
}

function hideElement(id){
    var element = document.getElementById(id);
    element.classList.add("hidden");
}

function isAlphaNum(char){
    if (char.length > 1){
        return false;   //single char eval only
    }
    var code = char.charCodeAt(0);

    if (
        (code >= 65 && code <= 90) // A-Z
        || (code >= 97 && code <= 122) //a-z
        || (code >= 48 && code <= 57 ) //0-9
    ){
        return true;
    }
    else {
        return false;
    }
}

var audioBasePath = "./assets/audio/";
function playAudio(clip){
    var audio = new Audio(audioBasePath + clip);
    audio.play();
}

var intro = {
    id: "intro",
    clip: "shall-we-play-a-game.mp3",
    isVisible: true,
    hide: function () {
        hideElement(this.id);
        this.isVisible = false;
    },

    finished: false,
    finish: function(){
        this.prompt.show();
        this.finished = true;
    },

    prompt: {
        id: "introPressKey",
        show: function(){
            showElement(this.id);
        }
    }
};

var banner = {
    id: "gameHeader",
    show: function(){
        showElement(this.id);
    }
};

var game = {
    id: "gameWindow",
    state: "off",

    wordBank: [
        { word: "WarGames", wordUpper: null, image: "wargames.jpg", clip: "audio clip" },
        { word: "Terminator", wordUpper: null, image: "terminator.jpg", clip: "audio clip" },
        { word: "Highlander", wordUpper: null, image: "highlander.jpg", clip: "audio clip" }
    ],

    gamePanel: {
        id: "gamePanel",

        wordInPlay: {
            id: "wordInPlay",
            word: null,
            lettersRemaining: [],

            showPlaceHolders: function(placeHolders){
                var elem = document.getElementById(this.id);
                for ( var i = 0; i < placeHolders.length; i++){
                    elem.appendChild(placeHolders[i]);
                }
            },

            clearPlaceHolders: function(){
                var elem = document.getElementById(this.id);
                while (elem.firstChild){
                    elem.removeChild(elem.firstChild);
                }
            },

            setWord: function(word) {
                
                this.word = word;
                this.word.wordUpper = word.word.toUpperCase();

                //Reset placeholders & letters remaining
                this.lettersRemaining = [];
                this.clearPlaceHolders();
                this.clearPlays();

                var placeHolders = [];
                //populate letters remaining & setup display
                for(var i = 0; i < word.word.length; i++){
                    var letter = word.wordUpper.charAt(i);
                    if (!this.lettersRemaining.includes(letter)){
                        this.lettersRemaining.push(letter);
                    }

                    var newDiv = document.createElement("DIV");
                    newDiv.setAttribute("id", "letter" + i);
                    newDiv.classList.add("place-holder");

                    if(!isAlphaNum(letter)){
                        newDiv.innerText = letter;
                    }
                    placeHolders.push(newDiv);
                }

                this.showPlaceHolders(placeHolders);
            },
            
            hasLetter: function(letter){
                return this.lettersRemaining.includes(letter);
            },

            showLetter: function(letter){
                var letterIdx = this.lettersRemaining.indexOf(letter);
                var removed = this.lettersRemaining.splice(letterIdx, 1);

                var word = this.word.wordUpper;
                for(var i = 0; i < word.length; i++){
                    if (word.charAt(i) === letter){
                        var divId = "letter" + i;
                        var elem = document.getElementById(divId);
                        elem.innerText = letter;
                    }
                }
            },

            showBadPlay: function(letter){
                var elem = document.getElementById("playedLetters");
                elem.innerText += letter;
            },

            clearPlays: function(){
                var elem = document.getElementById("playedLetters");
                elem.innerText = "";
            }
        }
    },

    guesses: {
        id: "guessesRemaining",
        letters:[],
        remaining: 6,

        reset: function(){
            this.letters = [];
            this.remaining = 6;
            this.showRemaining();
        },

        showRemaining: function(){
            var elem = document.getElementById(this.id);
            elem.innerText = this.remaining;
        },

        wasGuessed: function(letter){
            var result = false;
            if ( this.letters.includes(letter)){
                result = true;
            }
            return result;
        },

        newGuess: function(letter, isCorrect){
            this.letters.push(letter);
            if (!isCorrect){
                this.remaining--;
            }
        }
    },

    guess: function(letter){
        var upperLetter = letter.toUpperCase();
        if(
            this.guesses.remaining > 0
            && isAlphaNum(upperLetter)
            && !this.guesses.wasGuessed(upperLetter)
        ){
            var isCorrect = this.gamePanel.wordInPlay.hasLetter(upperLetter);
            this.guesses.newGuess(upperLetter, isCorrect);

            if (isCorrect){
                this.gamePanel.wordInPlay.showLetter(upperLetter);
                if (this.gamePanel.wordInPlay.lettersRemaining.length === 0){
                    this.showWin();
                }
            }
            else {
                this.gamePanel.wordInPlay.showBadPlay(upperLetter);
                this.guesses.showRemaining();
                if (this.guesses.remaining === 0){
                    this.showLoss();
                }
            }
        }
    },

    showWin: function(){
        this.infoPanel.addMovie(this.gamePanel.wordInPlay.word, true);
        this.showPlayAgain();
    },

    showPlayAgain: function(){
        
        if(this.wordBank.length === 0){
            this.state = "finished";
        }
        else{
            this.state = "paused";
        }
        this.showRounds();
    },

    showLoss: function() {
        this.infoPanel.addMovie(this.gamePanel.wordInPlay.word, false);

        this.showPlayAgain();
    },

    showRounds: function(){
        var remaining = document.getElementById("roundsRemaining");
        remaining.innerText = this.wordBank.length;

        var p1 = document.getElementById("plural1");
        var p2 = document.getElementById("plural2");

        if(this.wordBank.length === 1){   
            p1.innerText = " is ";
            p2.innerText = " round ";
        }
        else {
            p1.innerText = " are ";
            p2.innerText = " rounds ";
        }

        if (this.wordBank.length === 0){
            hideElement("playAgain");
        }

        showElement("rounds");
    },

    setWord: function(){
        if (this.wordBank.length > 0){
            this.state = "inProgress";
            hideElement("rounds");
            this.guesses.reset();
            var wordIdx = 0;
            if(this.wordBank.length > 0){
                var wordIdx = Math.round(Math.random() * (this.wordBank.length - 1));
            }
            this.gamePanel.wordInPlay.setWord(this.wordBank.splice(wordIdx, 1)[0]);
        }
    },

    start: function () {
        showElement(this.id);   
        this.setWord();
    },

    infoPanel: {
        id: "movies",
        addMovie: function(word, isWin) {
            var ip = document.getElementById(this.id);
            var newMovie = document.createElement("DIV");

            var newImage = document.createElement("IMG");
            newImage.setAttribute("src", imageBasePath + word.image);
            newImage.setAttribute("alt", word.word);
            newImage.classList.add("moviePoster");

            newMovie.appendChild(newImage);
            ip.insertBefore(newMovie, ip.firstChild);

        }
    }
};

var imageBasePath = "./assets/images/";



setTimeout(function(){
    intro.finish();
}, 9000);

playAudio(intro.clip);

document.onkeypress = function(event){
    if(intro.finished && game.state === "off"){
        intro.hide();
        banner.show();
        game.start();
    }
    else if (game.state === "inProgress"){
        game.guess(event.key.toUpperCase());
    }
    else if (game.state === "paused"){
        game.setWord();
    }
}