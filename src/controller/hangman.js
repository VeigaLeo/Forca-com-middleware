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
        onClick="handleGuess('` +
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

function handleGuess(chosenLetter) {
  guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
  document.getElementById(chosenLetter).setAttribute("disabled", true);

  answer.forEach(element => {
    if (element.indexOf(chosenLetter) >= 0) {
      guessedWord();
      checkIfGameWon();
    } else if (element.indexOf(chosenLetter) === -1) {
      // mistakes++;
      // updateMistakes();
      // checkIfGameLost();
      // updateHangmanPicture();
    }
  });
}

function updateHangmanPicture() {
  document.getElementById("hangmanPic").src = "./images/" + mistakes + ".jpg";
}

function compare(arr1, arr2) {
  if (!arr1 || !arr2) return;

  let result;

  arr1.forEach((e1, i) =>
    arr2.forEach(e2 => {
      if (e1.length > 1 && e2.length) {
        result = compare(e1, e2);
      } else if (e1 !== e2) {
        result = false;
      } else {
        result = true;
      }
    })
  );

  return result;
}

function checkIfGameWon() {
  let answerArray = answer.toString();
  let answerStatusArray = wordStatus.slice(-3).toString();

  if (answerArray === answerStatusArray) {
    document.getElementById("keyboard").innerHTML = "You Won!!!";
  }
}

function checkIfGameLost() {
  if (mistakes === maxWrong) {
    document.getElementById("wordSpotlight").innerHTML =
      "The answer was: " + answer;
    document.getElementById("keyboard").innerHTML = "You Lost!!!";
  }
}

function guessedWord() {
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

function updateMistakes() {
  document.getElementById("mistakes").innerHTML = mistakes;
}

function reset() {
  mistakes = 0;
  guessed = [];
  document.getElementById("hangmanPic").src = "./images/0.jpg";

  randomWord();
  guessedWord();
  updateMistakes();
  generateButtons();
}

document.getElementById("maxWrong").innerHTML = maxWrong;

randomWord();
generateButtons();
guessedWord();
handleGuess("2");
