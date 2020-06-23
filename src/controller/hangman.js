const words = require("../utils/words");

// Variáveis do usuário
let uniqueId;
let playerId;

// Variáveis do jogo
let currentAward = getCurrentAward();
let currentPlayerIdQueue = 0;
let currentUniquePlayerId = 0;
let players = [];

// Variáveis da forca
let answer = [];
let guessed = [];
let wordStatus = [];

/**
 * Método principal (executado quando o body do electron está totalmente carregado)
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
$(document).ready(() => {
  handleUserPrompt();
  initGame();
});

/**
 * Mostra um prompt para o usuário digitar o login.
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
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
 * Função principal para o funcionamento do jogo
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
const initGame = () => {
  handlePlayerTurn();
  randomWord();
  generateButtons();
  wordChoose();
  getCurrentAward();
  handleUserChoice("2");
};

/**
 * Handler para controlar o turno do usuário
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
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
 * Gera três palavras randômicas
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
const randomWord = () => {
  for (let i = 0; i < 3; i++) {
    answer.push(words[Math.floor(Math.random() * words.length)]);
  }
};

/**
 * Renderiza o alfabeto na tela do electron
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
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
 * Handler para verificar a letra escolhida pelo usuário
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
const handleUserChoice = chosenLetter => {
  if (currentPlayerIdQueue === playerId) {
    let foundLetter = false;

    guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
    document.getElementById(chosenLetter).setAttribute("disabled", true);
    answer.forEach(element => {
      if (element.indexOf(chosenLetter) >= 0) {
        getCurrentAward();

        players[currentPlayerIdQueue].score =
          players[currentPlayerIdQueue].score + currentAward;

        foundLetter = true;
        handlePlayerTurn();
        wordChoose();
        winConditional();

        socket.emit("foundletter", { uniqueId: uniqueId });
        socket.emit("updatescoreboard", "");
      }
    });

    if (!foundLetter) {
      socket.emit("updatescoreboard", "");

      setRandomAward();
      getCurrentAward();
      nextPlayer();
      handlePlayerTurn();
    }
  } else {
    toastr.error("Aguarde sua vez");
  }
};

/**
 * Método seta um prêmio randomico para a rodada atual
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
const setRandomAward = () => {
  var award = Math.floor(Math.random() * 2000);

  socket.emit("setnewaward", award);
};

/**
 * Método recupera o prêmio da rodada atual
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
const getCurrentAward = () => {
  socket.emit("getcurrentaward", "");
};

/**
 * Método para enviar comando ao socket para chamar o próximo jogador
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
const nextPlayer = () => {
  socket.emit("nextplayer", "");
};

/**
 * Condição de vitória
 *
 * TODO: MUDAR PARA DEIXAR O JOGO INFINITO
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
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
 * Verifica se a letra escolhida pelo usuário existe nas palavras
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
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
