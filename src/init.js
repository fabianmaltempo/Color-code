var triesDiv = document.querySelector("#tries");
var guessDiv = document.querySelector("#guess");
var submitBtn = document.querySelector("#submitBtn");
var resultsDiv = document.querySelector("#results");
var colorList = ["red", "green", "yellow", "blue", "orange", "purple"];
var elems = {
    tries: triesDiv,
    guess: guessDiv,
    submitBtn: submitBtn,
    results: resultsDiv
};
var setup = {
    attempts: 10,
    difficulty: 5
};
//initialSetup
function fillTriesBoxes() {
    for (var i = 0; i < setup.attempts; i++) {
        var inner = "";
        inner += "\n            <div class=\"row tablerow\">\n        ";
        for (var j = 0; j < setup.difficulty; j++) {
            inner += "\n                <div class=\"col d-flex justify-content-center\"><div class=\"box attemptbox\" id=\"attempt" + (setup.attempts - i - 1) + "box" + j + "\"></div></div>\n            ";
        }
        inner += "\n            </div>\n        ";
        elems.tries.innerHTML += inner;
    }
}
fillTriesBoxes();
function fillGuessBoxes() {
    var inner = "";
    for (var i = 0; i < setup.difficulty; i++) {
        inner += "<div class=\"col d-flex justify-content-center\" onclick=\"fillGuessBox(" + i + ")\"><div class=\"box guessbox\" id=\"box" + i + "\"></div></div>";
    }
    elems.guess.innerHTML = inner;
}
fillGuessBoxes();
function fillResultsDiv() {
    for (var i = 0; i < setup.attempts; i++) {
        var inner = "";
        inner += "\n            <div class=\"row tablerow\">\n        ";
        for (var j = 0; j < setup.difficulty; j++) {
            inner += "\n                <div class=\"col d-flex justify-content-center\"><div class=\"box resultbox\" id=\"attempt" + (setup.attempts - i - 1) + "resultbox" + j + "\"></div></div>\n            ";
        }
        inner += "\n            </div>\n        ";
        elems.results.innerHTML += inner;
    }
}
fillResultsDiv();
//Features
function clearGuesses() {
    var guesses = [];
    for (var i = 0; i < setup.difficulty; i++) {
        var fill = "";
        guesses.push(fill);
    }
    return guesses;
}
var guesses = clearGuesses();
function clearGuessBoxes() {
    for (var i = 0; i < setup.difficulty; i++) {
        var guessbox = document.querySelector("#box" + i);
        guessbox.className = "box guessbox";
    }
}
var selectedColor = "red";
function fillGuessBox(i) {
    guesses[i] = selectedColor;
    var guessbox = document.querySelector("#box" + i);
    guessbox.className = "box guessbox";
    guessbox.classList.add(selectedColor);
    if (isCompleteGuesses()) {
        elems.submitBtn.disabled = false;
    }
}
function isCompleteGuesses() {
    for (var _i = 0, guesses_1 = guesses; _i < guesses_1.length; _i++) {
        var element = guesses_1[_i];
        if (element == "") {
            return false;
        }
    }
    return true;
}
function changeSelectedColor(color) {
    selectedColor = color;
    document.querySelector("#radio" + color).checked = true;
}
var attempt = 0;
var attempts = [];
function guess() {
    attempts.push(guesses.slice());
    var i = 0;
    for (var _i = 0, _a = attempts[attempt]; _i < _a.length; _i++) {
        var color = _a[_i];
        var box = document.querySelector("#attempt" + attempt + "box" + i);
        box.className = "box attemptbox";
        box.classList.add(color);
        i++;
    }
    attempt++;
    clearGuess();
    if (guessIsCode()) {
        wonGame();
    }
    else if (attempt == setup.attempts) {
        lostGame();
    }
    fillResult(checkGuess());
    document.querySelector("#copyPrevious").disabled = false;
}
function checkGuess() {
    var correct = 0;
    var misplaced = 0;
    var checkedGuess = attempts[attempt - 1].slice();
    var checkedColorCode = colorCode.slice();
    var checked = [];
    //check for correct colors
    var ind = 0;
    for (var _i = 0, checkedGuess_1 = checkedGuess; _i < checkedGuess_1.length; _i++) {
        var item = checkedGuess_1[_i];
        if (item == checkedColorCode[ind]) {
            correct++;
            checked.push(ind);
        }
        ind++;
    }
    //remove correct colors
    for (var j = checked.length - 1; j >= 0; j--) {
        checkedColorCode.splice(checked[j], 1);
        checkedGuess.splice(checked[j], 1);
    }
    //check for misplaced colors
    for (var _a = 0, checkedGuess_2 = checkedGuess; _a < checkedGuess_2.length; _a++) {
        var item = checkedGuess_2[_a];
        for (var i = 0; i < checkedColorCode.length; i++) {
            if (checkedColorCode[i] == item) {
                misplaced++;
                checkedColorCode.splice(i, 1);
                break;
            }
        }
    }
    return { correct: correct, misplaced: misplaced };
}
function guessIsCode() {
    var i = 0;
    for (var _i = 0, _a = attempts[attempt - 1]; _i < _a.length; _i++) {
        var color = _a[_i];
        if (color != colorCode[i]) {
            return false;
        }
        i++;
    }
    return true;
}
function clearGuess() {
    guesses = clearGuesses();
    clearGuessBoxes();
    elems.submitBtn.disabled = true;
}
//Set color code
var colorCode = [];
function setColorCode() {
    for (var i = 0; i < setup.difficulty; i++) {
        var color = colorList[Math.floor(Math.random() * colorList.length)];
        colorCode.push(color);
    }
}
setColorCode();
//Fill Result
function fillResult(options) {
    var index = 0;
    for (var i = 0; i < options.correct; i++) {
        var resbox = document.querySelector("#attempt" + (attempt - 1) + "resultbox" + index);
        resbox.classList.add("correct");
        index++;
    }
    for (var i = 0; i < options.misplaced; i++) {
        var resbox = document.querySelector("#attempt" + (attempt - 1) + "resultbox" + index);
        resbox.classList.add("misplaced");
        index++;
    }
}
//Copy previous
function copyPrevious() {
    var i = 0;
    for (var _i = 0, _a = attempts[attempt - 1]; _i < _a.length; _i++) {
        var color = _a[_i];
        guesses[i] = color;
        var guessbox = document.querySelector("#box" + i);
        guessbox.className = "box guessbox";
        guessbox.classList.add(color);
        i++;
    }
    if (isCompleteGuesses()) {
        elems.submitBtn.disabled = false;
    }
}
//Lost Game
function lostGame() {
    setTimeout(function () {
        alert("You have lost the game");
        document.location.reload();
    }, 1000);
}
//Won game
function wonGame() {
    setTimeout(function () {
        alert("You have won the game");
        document.location.reload();
    }, 1000);
}
