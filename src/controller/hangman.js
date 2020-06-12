const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];

const categories = ["comida", "objeto", "cidade"];
const cities = ["londrina", "maringa"];

/**
 * Main function to start the game
 */
function initGame() {
  options();
  word();
}

/**
 * render the alphabet on the screen
 */
function options() {
  options = document.getElementById("options");
  letters = document.createElement("ul");

  for (var i = 0; i < alphabet.length; i++) {
    letters.id = "alphabet";
    list = document.createElement("li");
    list.id = "letter";
    list.innerHTML = alphabet[i];
    options.appendChild(letters);
    letters.appendChild(list);
  }
}

/**
 * render the word to guess on the screen
 */
function word() {
  word = document.getElementById("word");
  wordLetter = document.createElement("ul");

  randomCity = cities[Math.floor(Math.random() * cities.length)];
  for (var i = 0; i < randomCity.length; i++) {
    wordLetter.id = "word";
    list = document.createElement("li");
    list.id = "wordLetter";
    //list.innerHTML = randomCity[i]; // display the full word
    list.innerHTML = ["_"]; // display the "hidden" word
    word.appendChild(wordLetter);
    wordLetter.appendChild(list);
  }
}

/**
 * set a random category
 */
function setCategory() {
  const item = categories[Math.floor(Math.random() * categories.length)];
  document.write(item);
  return item;
}

/**
 * Set a random word to guess based on the category
 */
function setWord() {
  //TODO: generate random word from cities array
  //TODO: the generated word must be in the category above
}

/**
 * Get the word that the user has clicked
 * @param {object} MouseEvent
 */
function getLetter(event) {
  //TODO: compare if the letter exists in the word and render it on the screen
  //TODO: disabled button if the user has already clicked once
  console.log(event.target.innerText);
}
