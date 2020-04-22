class RpsGame {

  constructor(users) {
    this._players = users;
    this._turns = [null, null];

    this._sendToPlayers('Let the Dash Begin!');

    this._players.forEach((player, idx) => {
      if (player.socket != null)
        player.socket.on('turn', (turn) => {
          this._onTurn(idx, turn);
        });
    });
  }

  _sendToPlayer(playerIndex, msg) {
    if (this._players[playerIndex].socket != null)
      this._players[playerIndex].socket.emit('message', msg);
  }

  _sendToPlayers(msg) {
    this._players.forEach((player) => {
      if (player.socket != null)
        player.socket.emit('message', msg);
    });
  }

  _onTurn(playerIndex, turn) {
    this._turns[playerIndex] = turn;
    this._sendToPlayer(playerIndex, `You selected ${turn}`);

    this._checkGameOver();
  }

  _checkGameOver() {
    const turns = this._turns;

    if (turns[0] && turns[1]) {
      this._sendToPlayers('Game over ' + turns.join(' : '));
      this._getGameResult();
      this._turns = [null, null];
      this._sendToPlayers('Next Round!!!!');
    }
  }

  _getGameResult() {

    const p0 = this._decodeTurn(this._turns[0]);
    const p1 = this._decodeTurn(this._turns[1]);

    const distance = (p1 - p0 + 3) % 3;

    switch (distance) {
      case 0:
        this._sendToPlayers('Draw!');
        break;

      case 1:
        this._sendWinMessage(this._players[0], this._players[1]);
        break;

      case 2:
        this._sendWinMessage(this._players[1], this._players[0]);
        break;
    }
  }

  _sendWinMessage(winner, loser) {
    winner.emit('message', 'You won!');
    loser.emit('message', 'You lost.');
  }

  _decodeTurn(turn) {
    switch (turn) {
      case 'rock':
        return 0;
      case 'scissors':
        return 1;
      case 'paper':
        return 2;
      default:
        throw new Error(`Could not decode turn ${turn}`);
    }
  }


}

module.exports = RpsGame;
