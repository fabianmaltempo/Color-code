const triesDiv=document.querySelector("#tries");
const guessDiv=document.querySelector("#guess");
const submitBtn=document.querySelector("#submitBtn");
const resultsDiv=document.querySelector("#results")
const colorList=["red","green","yellow","blue","orange","purple"]
const elems={
    tries: triesDiv,
    guess: guessDiv,
    submitBtn: submitBtn,
    results: resultsDiv
}
const setup={
    attempts: 10,
    difficulty: 5
}

interface result{
    correct: number,
    misplaced: number
}

//initialSetup
function fillTriesBoxes(){
    for(let i=0;i<setup.attempts;i++){
        let inner=""
        inner+=`
            <div class="row tablerow">
        `
        for(let j=0;j<setup.difficulty;j++){
            inner+=`
                <div class="col"><div class="box attemptbox" id="attempt`+ (setup.attempts-i-1) +`box`+ j +`"></div></div>
            `
        }
        inner+=`
            </div>
        `
        elems.tries.innerHTML+=inner
    }
}
fillTriesBoxes()

function fillGuessBoxes(){
    let inner="";
    for(let i=0;i<setup.difficulty;i++){
        inner+=`<div class="col" onclick="fillGuessBox(`+ i +`)"><div class="box guessbox" id="box` + i + `"></div></div>`
    }
    elems.guess.innerHTML=inner;
}
fillGuessBoxes()

function fillResultsDiv(){
    for(let i=0;i<setup.attempts;i++){
        let inner=""
        inner+=`
            <div class="row tablerow">
        `
        for(let j=0;j<setup.difficulty;j++){
            inner+=`
                <div class="col"><div class="box resultbox" id="attempt`+ (setup.attempts-i-1) +`resultbox`+ j +`"></div></div>
            `
        }
        inner+=`
            </div>
        `
        elems.results.innerHTML+=inner;
    }
}
fillResultsDiv()

//Features
function clearGuesses(): string[]{
    let guesses=[]
    for(let i=0;i<setup.difficulty;i++){
        let fill="";
        guesses.push(fill)
    }
    return guesses;
}
let guesses=clearGuesses()

function clearGuessBoxes(){
    for(let i=0;i<setup.difficulty;i++){
        let guessbox = document.querySelector("#box" + i);
        guessbox.className="box guessbox";
    }
}

let selectedColor="red";
function fillGuessBox(i: number){
    guesses[i]=selectedColor;
    let guessbox = document.querySelector("#box" + i);
    guessbox.className="box guessbox";
    guessbox.classList.add(selectedColor)
    if(isCompleteGuesses()){
        (elems.submitBtn as HTMLButtonElement).disabled=false;
    }
}

function isCompleteGuesses(): boolean{
    for(let element of guesses){
        if(element==""){return false}
    }
    return true
}

function changeSelectedColor(color: string){
    selectedColor=color;
    (document.querySelector("#radio"+color) as HTMLInputElement).checked=true;
}

let attempt=0
let attempts=[];
function guess(){
    attempts.push(guesses.slice())
    let i=0;
    for(let color of attempts[attempt]){
        let box = document.querySelector("#attempt"+attempt+"box"+i);
        box.className="box attemptbox";
        box.classList.add(color);
        i++;
    }
    attempt++
    clearGuess();
    if(guessIsCode()){
        wonGame();
    } else
    if(attempt==setup.attempts){
        lostGame()
    }
    fillResult(checkGuess());
    (document.querySelector("#copyPrevious") as HTMLButtonElement).disabled=false;
}

function checkGuess(): result{
    let correct=0;
    let misplaced=0;
    let checkedGuess=attempts[attempt-1].slice();
    let checkedColorCode=colorCode.slice();
    let checked: number[]=[]
    //check for correct colors
    let ind=0
    for(let item of checkedGuess){
        if(item==checkedColorCode[ind]){
            correct++
            checked.push(ind);
        }
        ind++
    }
    //remove correct colors
    for(let j=checked.length-1;j>=0;j--){
        checkedColorCode.splice(checked[j],1)
        checkedGuess.splice(checked[j],1)
    }
    //check for misplaced colors
    for(let item of checkedGuess){
        for(let i=0;i<checkedColorCode.length;i++){
            if(checkedColorCode[i]==item){
                misplaced++
                checkedColorCode.splice(i,1)
                break;
            }
        }
    }
    return {correct: correct, misplaced: misplaced}
}

function guessIsCode(): boolean{
    let i=0;
    for(let color of attempts[attempt-1]){
        if (color!=colorCode[i]){
            return false;
        }
        i++
    }
    return true;
}

function clearGuess(){
    guesses=clearGuesses();
    clearGuessBoxes();
    (elems.submitBtn as HTMLButtonElement).disabled=true;
}

//Set color code
let colorCode: string[]=[]
function setColorCode(){
    for(let i=0;i<setup.difficulty;i++){
        let color = colorList[Math.floor(Math.random()*colorList.length)];
        colorCode.push(color)
    }
}
setColorCode()

//Fill Result
function fillResult(options: result){
    let index=0
    for(let i=0;i<options.correct;i++){
        let resbox=document.querySelector("#attempt"+(attempt-1)+"resultbox"+index)
        resbox.classList.add("correct");
        index++;
    }
    for(let i=0;i<options.misplaced;i++){
        let resbox=document.querySelector("#attempt"+(attempt-1)+"resultbox"+index)
        resbox.classList.add("misplaced");
        index++;
    }
}

//Copy previous
function copyPrevious(){
    let i=0
    for(let color of attempts[attempt-1]){
        guesses[i]=color;
        let guessbox = document.querySelector("#box" + i);
        guessbox.className="box guessbox";
        guessbox.classList.add(color)
        i++
    }
    if(isCompleteGuesses()){
        (elems.submitBtn as HTMLButtonElement).disabled=false;
    }
}

//Lost Game
function lostGame(){
    setTimeout(() => {
        alert("You have lost the game")
        document.location.reload()},1000)
}

//Won game
function wonGame(){
    setTimeout(() => {
        alert("You have won the game")
        document.location.reload()},1000)
}