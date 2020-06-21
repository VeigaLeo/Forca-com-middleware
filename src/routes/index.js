const { handleUserChoice } = require("../controller/hangman");

module.exports = function (app, config) {
  app.route("/api/guess").post(function (req, res) {
    if (!req.body) {
      res.sendStatus(500);
    } else {
      res.send(req.body);
      console.log(req.body);

      handleUserChoice(req.body.letter);
    }
  });
};
