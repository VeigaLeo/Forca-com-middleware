// Variáveis do usuário
let uniqueId;
let playerId;

// Variáveis do jogo
let currentAward = 0;
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
  getCurrentAward();
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
    socket.emit("getchosenletters", "");
    socket.emit("getcurrentwords", "");
    socket.emit("getcurrentplayerqueue", "");

    $("#playerName").html("<b>Você: </b>" + value);
    wordChoose("");
    handleUserChoice();
  });
};

/**
 * Função principal para o funcionamento do jogo
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
const initGame = () => {
  generateButtons();
  getCurrentAward();
  wordChoose("");
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
    socket.emit("chosenletter", chosenLetter);

    guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;

    document.getElementById(chosenLetter).setAttribute("disabled", true);
    answer.forEach(element => {
      if (element.indexOf(chosenLetter) >= 0) {
        foundLetter = true;
        getCurrentAward();

        players[currentPlayerIdQueue].score =
          players[currentPlayerIdQueue].score + currentAward;

        wordChoose(element);
        checkGameState();

        socket.emit("foundletter", { uniqueId: uniqueId });
        socket.emit("updatescoreboard", "");

        handlePlayerTurn();
      }
    });

    if (!foundLetter) {
      socket.emit("updatescoreboard", "");

      setRandomAward();
      getCurrentAward();
      nextPlayer();
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
  handlePlayerTurn();
};

/**
 * Verifica o estado da rodada atual, e se necessário, inicia uma nova para manter o jogo infinito
 *
 *
 * @author Guilherme Martin
 * @author Leonardo Veiga
 */
const checkGameState = () => {
  let answerArray = answer.toString();
  let answerStatusArray = wordStatus.slice(-3).toString();

  if (answerArray === answerStatusArray) {
    toastr.info("Rodada encerrada, aguarde...");
    setTimeout(() => {
      socket.emit("nextround", "");
    }, 3000);
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
        .map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ "))
        .join("")
    ];
  });

  const wordAnswerArray = wordStatus.slice(wordStatus.length - 3).slice(",");

  if (wordAnswerArray.length > 0) {
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
  }
};
