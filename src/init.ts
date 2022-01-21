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
            <div class="row tablerow bottom-border" id="tablerow`+(setup.attempts-i-1)+`" onclick="copyPrevious(`+ (setup.attempts-i-1) +`)">
        `
        for(let j=0;j<setup.difficulty;j++){
            inner+=`
                <div class="col align-items-center d-flex justify-content-center attempt`+ (setup.attempts-i-1) +`BoxDiv"><div class="box attemptbox" id="attempt`+ (setup.attempts-i-1) +`box`+ j +`"></div></div>
            `
        }
        inner+=`
            </div>
        `
        elems.tries.innerHTML+=inner
    }
    let attemptrow0=document.querySelector("#tablerow0")
    attemptrow0.classList.add("onattempt")
    let attemptBoxes0=document.querySelectorAll(".attempt0BoxDiv")
    for(let j=0;j<attemptBoxes0.length;j++){
        attemptBoxes0[j].setAttribute("onclick","fillGuessBox("+ j +")")
    }
}
fillTriesBoxes()

function fillResultsDiv(){
    for(let i=0;i<setup.attempts;i++){
        let inner=""
        inner+=`
            <div class="row tablerow bottom-border">
        `
        for(let j=0;j<setup.difficulty;j++){
            inner+=`
                <div class="col align-items-center d-flex justify-content-center"><div class="box resultbox rounded-circle" id="attempt`+ (setup.attempts-i-1) +`resultbox`+ j +`"></div></div>
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

let selectedColor="red";
function fillGuessBox(i: number){
    guesses[i]=selectedColor;
    let attemptbox=document.querySelector("#attempt"+attempt+"box"+i)
    attemptbox.className="box attemptbox";
    attemptbox.classList.add(selectedColor);
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
    if(color!=selectedColor){
        let prevSelBox=document.querySelector("#guess"+selectedColor);
        prevSelBox.classList.remove("selected-color")
        let newSelBox=document.querySelector("#guess"+color);
        newSelBox.classList.add("selected-color")
        selectedColor=color;
    }
    let i=0
    for(let item of guesses){
        if(item==""){
            fillGuessBox(i)
            break;
        }
        i++
    }
}

let attempt=0
let attempts=[];
function guess(){
    if(attempt!=setup.attempts-1){
        //change attempt focused row
        let attemptonbox0=document.querySelector("#tablerow"+attempt);
        attemptonbox0.className="row tablerow bottom-border"
        let attemptonbox1=document.querySelector("#tablerow"+(attempt+1))
        attemptonbox1.classList.add("onattempt")
        //change attempted row
        let attemptBoxes0=document.querySelectorAll(".attempt"+ attempt +"BoxDiv");
        for(let j=0;j<attemptBoxes0.length;j++){
            attemptBoxes0[j].removeAttribute("onclick");
        }
        let attemptBoxes1=document.querySelectorAll(".attempt"+ (attempt+1) +"BoxDiv")
        for(let j=0;j<attemptBoxes1.length;j++){
            attemptBoxes1[j].setAttribute("onclick","fillGuessBox("+ j +")")
        } 
    }
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
    (elems.submitBtn as HTMLButtonElement).disabled=true;
    for(let i=0;i<setup.difficulty;i++){
        let attemptbox=document.querySelector("#attempt"+attempt+"box"+i);
        attemptbox.className="box attemptbox"
    }
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
function copyPrevious(option:number){
    let i=0
    for(let color of attempts[option]){
        guesses[i]=color;
        let attemptbox=document.querySelector("#attempt"+attempt+"box"+i)
        attemptbox.className="box attemptbox";
        attemptbox.classList.add(color);
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