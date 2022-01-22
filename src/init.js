var confetti;
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
        inner += "\n            <div class=\"row tablerow bottom-border attemptrow\" id=\"tablerow" + (setup.attempts - i - 1) + "\">\n        ";
        for (var j = 0; j < setup.difficulty; j++) {
            inner += "\n                <div class=\"col align-items-center d-flex justify-content-center attempt" + (setup.attempts - i - 1) + "BoxDiv\"><div class=\"box attemptbox shadow\" id=\"attempt" + (setup.attempts - i - 1) + "box" + j + "\"></div></div>\n            ";
        }
        inner += "\n            </div>\n        ";
        elems.tries.innerHTML += inner;
    }
    var attemptrow0 = document.querySelector("#tablerow0");
    attemptrow0.classList.add("onattempt");
    var attemptBoxes0 = document.querySelectorAll(".attempt0BoxDiv");
    for (var j = 0; j < attemptBoxes0.length; j++) {
        attemptBoxes0[j].setAttribute("onclick", "fillGuessBox(" + j + ")");
    }
}
fillTriesBoxes();
function fillResultsDiv() {
    for (var i = 0; i < setup.attempts; i++) {
        var inner = "";
        inner += "\n            <div class=\"row tablerow bottom-border\">\n        ";
        for (var j = 0; j < setup.difficulty; j++) {
            inner += "\n                <div class=\"col align-items-center d-flex justify-content-center\"><div class=\"circle resultbox rounded-circle shadow\" id=\"attempt" + (setup.attempts - i - 1) + "resultbox" + j + "\"></div></div>\n            ";
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
var selectedColor = "red";
function fillGuessBox(i) {
    if (!guessIsCode()) {
        guesses[i] = selectedColor;
        var attemptbox = document.querySelector("#attempt" + attempt + "box" + i);
        attemptbox.className = "box attemptbox shadow";
        attemptbox.classList.add(selectedColor);
        if (isCompleteGuesses()) {
            elems.submitBtn.disabled = false;
        }
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
    if (!guessIsCode()) {
        if (color != selectedColor) {
            var prevSelBox = document.querySelector("#guess" + selectedColor);
            prevSelBox.classList.remove("selected-color");
            var newSelBox = document.querySelector("#guess" + color);
            newSelBox.classList.add("selected-color");
            selectedColor = color;
        }
        var i = 0;
        for (var _i = 0, guesses_2 = guesses; _i < guesses_2.length; _i++) {
            var item = guesses_2[_i];
            if (item == "") {
                fillGuessBox(i);
                break;
            }
            i++;
        }
    }
}
var attempt = 0;
var attempts = [];
function guess() {
    //change attempt focused row
    var attemptonbox0 = document.querySelector("#tablerow" + attempt);
    attemptonbox0.className = "row tablerow bottom-border attemptrow";
    //change attempted row
    var attemptBoxes0 = document.querySelectorAll(".attempt" + attempt + "BoxDiv");
    for (var j = 0; j < attemptBoxes0.length; j++) {
        attemptBoxes0[j].removeAttribute("onclick");
    }
    if (attempt != setup.attempts - 1) {
        attemptonbox0.setAttribute("onclick", "copyPrevious(" + attempt + ")");
        var attemptonbox1 = document.querySelector("#tablerow" + (attempt + 1));
        attemptonbox1.classList.add("onattempt");
        var attemptBoxes1 = document.querySelectorAll(".attempt" + (attempt + 1) + "BoxDiv");
        for (var j = 0; j < attemptBoxes1.length; j++) {
            attemptBoxes1[j].setAttribute("onclick", "fillGuessBox(" + j + ")");
        }
    }
    attempts.push(guesses.slice());
    var i = 0;
    for (var _i = 0, _a = attempts[attempt]; _i < _a.length; _i++) {
        var color = _a[_i];
        var box = document.querySelector("#attempt" + attempt + "box" + i);
        box.className = "box attemptbox shadow";
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
    if (attempts.length > 0) {
        var i = 0;
        for (var _i = 0, _a = attempts[attempt - 1]; _i < _a.length; _i++) {
            var color = _a[_i];
            if (color != colorCode[i]) {
                return false;
            }
            i++;
        }
    }
    else
        return false;
    return true;
}
function clearGuess() {
    guesses = clearGuesses();
    elems.submitBtn.disabled = true;
    if (!guessIsCode() && attempt != setup.attempts) {
        for (var i = 0; i < setup.difficulty; i++) {
            var attemptbox = document.querySelector("#attempt" + attempt + "box" + i);
            attemptbox.className = "box attemptbox shadow";
        }
    }
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
function copyPrevious(option) {
    if (!guessIsCode()) {
        var i = 0;
        for (var _i = 0, _a = attempts[option]; _i < _a.length; _i++) {
            var color = _a[_i];
            guesses[i] = color;
            var attemptbox = document.querySelector("#attempt" + attempt + "box" + i);
            attemptbox.className = "box attemptbox shadow";
            attemptbox.classList.add(color);
            i++;
        }
        if (isCompleteGuesses()) {
            elems.submitBtn.disabled = false;
        }
    }
}
//Lost Game
function lostGame() {
    flipSecretCode();
    document.querySelector("#message").innerHTML = "Almost! You will crack it next time!";
    /*
    setTimeout(() => {
        alert("You have lost the game")
        document.location.reload()},1000)
        */
}
//Won game
function wonGame() {
    flipSecretCode();
    document.querySelector("#message").innerHTML = "Congratulations! You have Won!";
    confetti.start();
    /*
    setTimeout(() => {
        alert("You have won the game")
        document.location.reload()},1000)
        */
}
function flipSecretCode() {
    document.querySelector("#flip-card").classList.add("flipped");
    var secretCodeDiv = document.querySelector("#secret-code");
    var inner = "\n        <div class=\"row tablerow2 align-items-center d-flex justify-content-center secret-back rounded shadow\">\n            <div class=\"row\">\n    ";
    for (var _i = 0, colorCode_1 = colorCode; _i < colorCode_1.length; _i++) {
        var color = colorCode_1[_i];
        inner += "\n            <div class=\"col align-items-center d-flex justify-content-center\">    \n                <div class=\"box secretbox shadow\" style=\"background-color: " + color + ";\"></div>\n            </div>\n            ";
    }
    inner += "</div></div>";
    secretCodeDiv.innerHTML = inner;
}
