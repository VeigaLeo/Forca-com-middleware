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
let player = {
  id: 1,
  score: 0
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

const handlePlayerTurn = () => {
  let playerTurn =
    "Vez de jogador: " + player.id + " - " + player.score + " pontos";

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
  guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
  document.getElementById(chosenLetter).setAttribute("disabled", true);
  answer.forEach(element => {
    if (element.indexOf(chosenLetter) >= 0) {
      player = {
        id: player.id,
        score: player.score + 500
      };
      handlePlayerTurn();

      wordChoose();
      winConditional();
    } else if (element.indexOf(chosenLetter) === -1) {
      // if (player.id === 1) {
      //   updatePlayerAndScore(2);
      // } else if (player.id === 2) {
      //   updatePlayerAndScore(3);
      // } else if (player.id === 3) {
      //   updatePlayerAndScore(1);
      // }
    }
  });
};

/**
 * Win conditional
 */
const winConditional = () => {
  let answerArray = answer.toString();
  let answerStatusArray = wordStatus.slice(-3).toString();

  if (answerArray === answerStatusArray) {
    let playerWon =
      "Jogador " +
      player.id +
      " ganhou a partida com " +
      player.score +
      " pontos!";

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

// const updatePlayerAndScore = value => {
//   player.id = value;
//   handlePlayerTurn();
// };
