const words = require("../utils/words");

// Variáveis do usuário
let uniqueId;
let playerId;

// Variáveis do jogo
let currentAward = 0;
let currentPlayerIdQueue = 0;
let currentUniquePlayerId = 0;

let players = [];
let answer = [];
let guessed = [];
let wordStatus = [];

$(document).ready(() => {
  handleUserPrompt();
  initGame();
});

const handleUserPrompt = () => {
  swal("Usuário:", {
    content: "input"
  }).then(value => {
    socket.emit("registernewplayer", { uniqueId: value });
    socket.emit("getallplayers", "");
    socket.emit("updatescoreboard", "");
  });
};

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

/**
 * handle which player is playing
 */
const handlePlayerTurn = () => {
  if (players.length !== 0) {
    let playerTurn =
      "Vez do jogador: " +
      players[currentPlayerIdQueue].uniqueId +
      " - " +
      players[currentPlayerIdQueue].score +
      " pontos";

    document.getElementById("player").innerHTML = playerTurn;
  }
};

/**
 * Generate 3 random words when game start
 */
const randomWord = () => {
  for (let i = 0; i < 3; i++) {
    answer.push(words[Math.floor(Math.random() * words.length)]);
  }
};

/**
 * Render the alphabet on the screen
 */
const generateButtons = () => {
  const buttonsHTML = "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map(
      letter =>
        `
      <button
        class="button"
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
  if (currentPlayerIdQueue === playerId) {
    let foundLetter = false;

    guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
    document.getElementById(chosenLetter).setAttribute("disabled", true);
    answer.forEach(element => {
      if (element.indexOf(chosenLetter) >= 0) {
        players[currentPlayerIdQueue].score =
          players[currentPlayerIdQueue].score + 500;

        foundLetter = true;
        handlePlayerTurn();
        wordChoose();
        winConditional();

        socket.emit("foundletter", { socketId: socket.id });
      }
    });

    if (!foundLetter) {
      nextPlayer();
      handlePlayerTurn();
    }
  } else {
    toastr.error("Aguarde sua vez");
  }
};

/**
 * Next player conditional
 */
const nextPlayer = () => {
  socket.emit("nextplayer", "");
};

/**
 * Win conditional
 */
const winConditional = () => {
  const answerArray = answer.toString();
  const answerStatusArray = wordStatus.slice(-3).toString();

  if (answerArray === answerStatusArray) {
    var maxScore = Math.max.apply(
      Math,
      players.map(function (obj) {
        return obj.score;
      })
    );
    var winnerPlayer = players.find(function (obj) {
      return obj.score == maxScore;
    });

    let playerWon =
      "Jogador " +
      winnerPlayer.uniqueId +
      " ganhou a partida com " +
      winnerPlayer.score +
      " pontos";

    document.getElementById("playerWon").innerHTML = playerWon;
    document.getElementById("player").innerHTML = "";
    document.getElementById("keyboard").innerHTML = "";
    document.getElementById("instructions").innerHTML =
      "As palavras sorteadas foram: ";
  }
};

/**
 * Verify if the word that user has choose exists in the answer array
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

  const wordAnswerArray = wordStatus.slice(wordStatus.length - 3).slice(",");

  document.getElementById("wordSpotlight").innerHTML =
    `
    <p
      class="word"
    >
      ` +
    wordAnswerArray[0] +
    `
    </p>
    <p
    class="word"
    >
      ` +
    wordAnswerArray[1] +
    `
    </p>
    <p
    class="word"
    >
      ` +
    wordAnswerArray[2] +
    `
    </p>
  `;
};

module.exports = {
  initGame
};
