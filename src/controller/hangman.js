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
let maxWrong = 6;
let mistakes = 0;
let guessed = [];
let wordStatus = [];

/**
 * generate 3 random words when game start
 */
function randomWord() {
  for (let i = 0; i < 3; i++) {
    answer.push(
      programming_languages[
        Math.floor(Math.random() * programming_languages.length)
      ]
    );
  }
  console.log(answer);
}

/**
 * Render the alphabet on the screen
 */
function generateButtons() {
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
}

/**
 * Handle the letter that the user has chosen
 * @param {string} chosenLetter the letter of the alphabet that the user has choose
 */
function handleUserChoice(chosenLetter) {
  guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
  document.getElementById(chosenLetter).setAttribute("disabled", true);

  answer.forEach(element => {
    if (element.indexOf(chosenLetter) >= 0) {
      wordChoose();
      winConditional();
    } else if (element.indexOf(chosenLetter) === -1) {
      // mistakes++;
      // updateMistakes();
      // checkIfGameLost();
    }
  });
}

/**
 * Win conditional
 */
function winConditional() {
  let answerArray = answer.toString();
  let answerStatusArray = wordStatus.slice(-3).toString();

  if (answerArray === answerStatusArray) {
    document.getElementById("keyboard").innerHTML = "You Won!!!";
  }
}

/**
 * TODO
 */
function checkIfGameLost() {
  if (mistakes === maxWrong) {
    document.getElementById("wordSpotlight").innerHTML =
      "The answer was: " + answer;
    document.getElementById("keyboard").innerHTML = "You Lost!!!";
  }
}

/**
 * verify if the word the that user has choose exists in the answer array
 */
function wordChoose() {
  answer.forEach(element => {
    wordStatus = [
      ...wordStatus,
      element
        .split("")
        .map(letter => (guessed.indexOf(letter) > -0 ? letter : " _ "))
        .join("")
    ];
  });

  document.getElementById("wordSpotlight").innerHTML = wordStatus.slice(
    wordStatus.length - 3
  );
}

/**
 * Are we gonna use this?
 */
function updateMistakes() {
  document.getElementById("mistakes").innerHTML = mistakes;
}

document.getElementById("maxWrong").innerHTML = maxWrong;

randomWord();
generateButtons();
wordChoose();
handleUserChoice("2");
