const words = [
  "usar",
  "reverter",
  "deixei",
  "interferir",
  "orar",
  "demora",
  "beneficio",
  "nomear",
  "sobreviver",
  "escavacao",
  "caloroso",
  "compensar",
  "desfrutar",
  "esmagar",
  "escape",
  "ilustrar",
  "foca",
  "derramar",
  "acho",
  "tiro",
  "equipar",
  "pop",
  "informar",
  "admitir",
  "contemplar",
  "impulso",
  "mudanca",
  "nome",
  "desaparecer",
  "iniciar",
  "longo",
  "sofrer",
  "procriar",
  "sujeito",
  "tratar",
  "hesitar",
  "parte",
  "formular",
  "morrer",
  "saltar",
  "falta",
  "entregar",
  "tentativa",
  "dar",
  "empregar",
  "debate",
  "interpretar",
  "permanecer",
  "selecionar",
  "ponto"
];

let answer = [];
let guessed = [];
let wordStatus = [];
let maxPlayer = 2;
let currentPlayer = 0;
let initialCharacter = 0;
let players = [
  {
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
  }
];

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
  const playerTurn =
    "Vez do jogador: " +
    players[currentPlayer].id +
    " - " +
    players[currentPlayer].score +
    " pontos";

  console.log("playerTurn", playerTurn);

  document.getElementById("player").innerHTML = playerTurn;
};

/**
 * Generate 3 random words when game start
 */
const randomWord = () => {
  for (let i = 0; i < 3; i++) {
    answer.push(words[Math.floor(Math.random() * words.length)]);
  }
  console.log(answer);
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
        value="` +
        letter +
        `"
        name="button"
        id='` +
        letter +
        `1'
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

  // document.getElementById(chosenLetter).setAttribute("disabled", true);
  console.log(answer);
  console.log("Palavras usadas: ", guessed);

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

  if (!foundLetter) {
    nextPlayer();
    handlePlayerTurn();
    updateScoreBoard();
  }
};

/**
 * Next player conditional
 */
const nextPlayer = () => {
  if (currentPlayer === maxPlayer) {
    currentPlayer = initialCharacter;
  } else {
    currentPlayer++;
  }
};

/**
 * Update the score board
 */
const updateScoreBoard = () => {
  const scoreBoard = players.sort(function (a, b) {
    return a.score > b.score ? -1 : a.score < b.score ? 1 : 0;
  });

  console.log("scoreBoard", scoreBoard);

  document.getElementById("numberOnePlayerScore").innerText =
    "Posição 1 - Jogador: " + scoreBoard[0].id + " - " + scoreBoard[0].score;
  document.getElementById("numberTwoPlayerScore").innerText =
    "Posição 2 - Jogador: " + scoreBoard[1].id + " - " + scoreBoard[1].score;
  document.getElementById("numberThreePlayerScore").innerText =
    "Posição 3 - Jogador: " + scoreBoard[2].id + " - " + scoreBoard[2].score;
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

    const playerWon =
      "Jogador " +
      winnerPlayer.id +
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

  console.log("board: ", wordAnswerArray);

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
  initGame,
  handleUserChoice
};
