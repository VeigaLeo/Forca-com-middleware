var programming_languages = [
  "python",
  "javascript",
  "mongodb",
  "json",
  "java",
  "html",
  "css",
  "c",
  "csharp",
  "golang",
  "kotlin",
  "php",
  "sql",
  "ruby"
];

let answer = [];
let guessed = [];
let wordStatus = [];
let maxPlayer = 2;
let currentPlayer = 0; 
let initialCharacter = 0;
let players = [{
  id: 1,
  score: 0
},
{
  id: 2,
  score: 0
},
{
  id: 3,
  score: 0
}];

/**
 * Main function that executes the game
 */
const initGame = () => {
  handlePlayerTurn();
  randomWord();
  generateButtons();
  wordChoose();
  handleUserChoice("2");
};

const handlePlayerTurn = () => {
  let playerTurn =
    "Vez do jogador: " + players[currentPlayer].id + " - " + players[currentPlayer].score + " pontos";

  document.getElementById("player").innerHTML = playerTurn;
};

/**
 * Generate 3 random words when game start
 */
const randomWord = () => {
  for (let i = 0; i < 3; i++) {
    answer.push(
      programming_languages[
        Math.floor(Math.random() * programming_languages.length)
      ]
    );
  }
  console.log(answer);
};

/**
 * Render the alphabet on the screen
 */
const generateButtons = () => {
  let buttonsHTML = "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map(
      letter =>
        `
      <button
        class="btn btn-lg btn-primary m-2"
        id='` +
        letter +
        `'
        onClick="handleUserChoice('` +
        letter +
        `')"
      >
        ` +
        letter +
        `
      </button>
    `
    )
    .join("");

  document.getElementById("keyboard").innerHTML = buttonsHTML;
};

/**
 * Handle the letter that the user has chosen
 * @param {string} chosenLetter the letter of the alphabet that the user has choose
 */
const handleUserChoice = chosenLetter => {
  let foundLetter = false;

  guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
  document.getElementById(chosenLetter).setAttribute("disabled", true);
  answer.forEach(element => {
    if (element.indexOf(chosenLetter) >= 0) {
      players[currentPlayer].score = players[currentPlayer].score + 500;
      
      foundLetter = true;
      handlePlayerTurn();
      wordChoose();
      winConditional();
      updateScoreBoard();
    }
  });

  if(!foundLetter){
    nextPlayer();
    handlePlayerTurn();
    updateScoreBoard();
  }
};

const nextPlayer = () => {
  if(currentPlayer === maxPlayer){
    currentPlayer = initialCharacter;
  }else{
    currentPlayer++;
  }
}

const updateScoreBoard = () => {
  let scoreBoard = players.sort(function(a,b) {
    return a.score > b.score ? -1 : a.score < b.score ? 1 : 0;
  });

  document.getElementById('numberOnePlayerScore').innerText = 'Posição 1 - Jogador: ' + scoreBoard[0].id + " - " + scoreBoard[0].score;
  document.getElementById('numberTwoPlayerScore').innerText = 'Posição 2 - Jogador: ' + scoreBoard[1].id + " - " + scoreBoard[1].score;
  document.getElementById('numberThreePlayerScore').innerText = 'Posição 3 - Jogador: ' + scoreBoard[2].id + " - " + scoreBoard[2].score;
}

/**
 * Win conditional
 */
const winConditional = () => {
  let answerArray = answer.toString();
  let answerStatusArray = wordStatus.slice(-3).toString();

  if (answerArray === answerStatusArray) {
    var maxScore = Math.max.apply(Math, players.map(function(obj){return obj.score;}));
    var winnerPlayer = players.find(function(obj){ return obj.score == maxScore; })

    let playerWon = "Jogador " + winnerPlayer.id + " ganhou a partida com " + winnerPlayer.score + " pontos";

    document.getElementById("keyboard").innerHTML = playerWon;
    document.getElementById("player").innerHTML = "";
  }
};

/**
 * Verify if the word the that user has choose exists in the answer array
 */
const wordChoose = () => {
  answer.forEach(element => {
    wordStatus = [
      ...wordStatus,
      element
        .split("")
        .map(letter => (guessed.indexOf(letter) > 0 ? letter : " _ "))
        .join("")
    ];
  });

  document.getElementById("wordSpotlight").innerHTML = wordStatus.slice(
    wordStatus.length - 3
  );
};