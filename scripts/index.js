//view
const view = (() => {
    const main = document.getElementsByTagName("main");
    const div = document.createElement("div");
    const initPlayerButtons = (callback) => {
        const xButton = document.getElementById("x");
        const oButton = document.getElementById("o");
        xButton.addEventListener("click", (e) => {
            callback(e.target.innerText);
            disableButton(xButton);
            disableButton(oButton);
        });
        oButton.addEventListener("click", (e) => {
            callback(e.target.innerText);
            disableButton(xButton);
            disableButton(oButton);
        });
    };

    const renderBoard = (board, handleClick) => {
        const parentDiv = document.getElementById("field");
        console.log(parentDiv);
        parentDiv.textContent = "";
        board.forEach((element, index) => {
            const field = document.createElement("button");
            field.setAttribute("id", `${index}`);
            field.setAttribute("class", "field-button");
            field.addEventListener("click", (e) => {
                handleClick(e);
            });
            parentDiv.appendChild(field);
        });
    };

    const disableButton = (button) => {
        button.disabled = true;
    };

    const fillField = (e, sign) => {
        e.target.innerText = sign;
    };

    const playerWins = (sign) => {
        return `Player ${sign} wins!`;
    };

    const renderPlayerWon = (sign) => {
        div.innerText = `${playerWins(sign)}`;
        div.setAttribute("class", "result");
        main[0].prepend(div);
    };

    const renderDraw = () => {
        div.innerText = "Draw!";
        div.setAttribute("class", "result");
        main[0].prepend(div);
    };

    const highlightWinningSequence = (arr) => {
        arr.forEach((element) => {
            const field = document.getElementById(element);
            field.setAttribute("class", "highlighted");
        });
    };
    const renderCurrentTurn = (sign) => {
        div.innerText = `Player ${sign}'s turn`;
        div.setAttribute("class", "result");
        main[0].prepend(div);
    };
    const renderRestartButton = (restart) => {
        const button = document.createElement("button");
        button.innerText = "Restart";
        button.setAttribute("id", "restart");
        button.addEventListener("click", () => restart());
        main[0].append(button);
    };
    return {
        initPlayerButtons,
        renderBoard,
        fillField,
        disableButton,
        playerWins,
        renderPlayerWon,
        renderDraw,
        highlightWinningSequence,
        renderCurrentTurn,
        renderRestartButton,
    };
})();
//model
const gameBoard = (() => {
    const board = new Array(9).fill(null);
    let end = false;

    let winningSequence = [];

    const getBoard = () => board;

    const setField = (sign, i) => (board[i] = sign);

    const fieldIsEmpty = (i) => {
        if (board[i] === null) {
            console.log(i);
            return true;
        }
    };

    const gameEnds = (sign) => {
        if (board[0] === sign && board[1] === sign && board[2] === sign) {
            winningSequence = [0, 1, 2];
            end = true;
            return true;
        }
        if (board[3] === sign && board[4] === sign && board[5] === sign) {
            winningSequence = [3, 4, 5];
            end = true;
            return true;
        }
        if (board[6] === sign && board[7] === sign && board[8] === sign) {
            winningSequence = [6, 7, 8];
            end = true;
            return true;
        }
        if (board[0] === sign && board[3] === sign && board[6] === sign) {
            winningSequence = [0, 3, 6];
            end = true;
            return true;
        }
        if (board[1] === sign && board[4] === sign && board[7] === sign) {
            winningSequence = [1, 4, 7];
            end = true;
            return true;
        }
        if (board[2] === sign && board[5] === sign && board[8] === sign) {
            winningSequence = [2, 5, 8];
            end = true;
            return true;
        }
        if (board[0] === sign && board[4] === sign && board[8] === sign) {
            winningSequence = [0, 4, 8];
            end = true;
            return true;
        }
        if (board[2] === sign && board[4] === sign && board[6] === sign) {
            winningSequence = [2, 4, 6];
            end = true;
            return true;
        }
        return false;
    };

    const gameOver = () => {
        return end;
    };

    const getWinningSequence = () => winningSequence;

    return {
        getBoard,
        setField,
        fieldIsEmpty,
        gameEnds,
        gameOver,
        getWinningSequence,
    };
})();

//Player object which has a sign, if it's their turn and how many matches they won
const Player = (sign) => {
    let playerSign = sign;
    let turn = 0;
    const setSign = (s) => {
        playerSign = s;
    };
    const getSign = () => playerSign;
    const setTurn = (state) => (turn = state);
    const getTurn = () => turn;
    return { getSign, getWins, setSign, setTurn, getTurn };
};

const gameFlowController = (() => {
    let turns = [];
    const checkWhoseTurn = () => {
        if (turns[0].getTurn() == 1) return turns[0].getSign();
        else return turns[1].getSign();
    };
    const initPlayers = (sign) => {
        if (sign === "X") {
            const player1 = Player(sign);
            const player2 = Player("O");
            player1.setTurn(1);
            return [player1, player2];
        }
        if (sign === "O") {
            const player1 = Player(sign);
            const player2 = Player("X");
            player1.setTurn(1);
            return [player1, player2];
        }
    };

    const initGame = (sign) => {
        const players = initPlayers(sign);
        const [player1, player2] = players;
        turns.push(player1);
        turns.push(player2);
        view.renderBoard(gameBoard.getBoard(), handleClick, players);
        view.renderCurrentTurn(checkWhoseTurn());
    };

    const handleClick = (e) => {
        const sign = checkWhoseTurn();
        if (gameBoard.fieldIsEmpty(e.target.id) && !gameBoard.gameOver()) {
            view.fillField(e, sign);
            gameBoard.setField(sign, e.target.id);
            if (gameBoard.gameEnds(sign)) {
                view.highlightWinningSequence(gameBoard.getWinningSequence());
                view.renderPlayerWon(sign);
                swapTurns();
                return;
            } else if (!gameBoard.getBoard().includes(null)) {
                view.renderDraw();
                return;
            }
            swapTurns();
            view.renderCurrentTurn(checkWhoseTurn());
        }
    };
    const swapTurns = () => {
        if (turns[0].getTurn() == 1) {
            turns[0].setTurn(0);
            turns[1].setTurn(1);
        } else {
            turns[1].setTurn(0);
            turns[0].setTurn(1);
        }
    };
    const restart = () => {
        location.reload();
    };
    view.initPlayerButtons(initGame);
    view.renderRestartButton(restart);
})();
