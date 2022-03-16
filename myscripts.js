const playerFactory = (name, isAI) => {
    let score = 0;
    return { name, score, isAI };
};

let gameBoard = (function(doc, player1, player2) {

    const gameStateDefault = -1;
    const defaultTurn = true;
    const winTitle = 'The Winner is';
    const drawTitle = 'The Game is Draw';

    // store cell states
    // 0 is available
    // 1 is for X
    // 2 is for O
    let cells = [0, 0, 0, 0, 0, 0, 0, 0, 0];  

    let isXTurn = defaultTurn;
    let cellContent = '';
    let winnerName = '';
    let gameTitle = winTitle;

    // gameState:
    // -1 is still running
    // 0: draw
    // 1: player 1 win
    // 2: player 2 win
    let gameState = gameStateDefault;

    let init = function() {
        gameState = gameStateDefault;
        isXTurn = defaultTurn;
        cells = [0, 0, 0, 0, 0, 0, 0, 0, 0]

        winnerName = '';
        gameTitle = winTitle;

        let displayCells = doc.querySelectorAll('.cell');

        Array.from(displayCells).forEach(function(element) {
            element.innerHTML = '';
            element.addEventListener('click', triggerTurn);
        });

        doc.querySelector('.game-board').style.opacity = 1;
    }

    let triggerTurn = function(e) {
        updateCellState(e.target.id.split("-")[1]);

        if (player2.isAI && !isXTurn && gameState == -1) {
            let idAI = 0;
            while (cells[idAI] != 0) {
                idAI = Math.floor(Math.random() * 10);
            }

            setTimeout(() => {
                updateCellState(idAI);
            }, 400); 
        }
    }

    let updateCellState = function(id) {
        // let id = e.target.id.split("-")[1];    
        console.log(id);
        
        if (isXTurn) {
            cellContent = 'X';
            cells[id] = 1;
        } else {
            cellContent = 'O';
            cells[id] = 2;
        }
        
        isXTurn = !isXTurn;
        updateCellDisplay(id, cellContent);

        updateGameState(id);

        calcWinner();
    }

    let updateCellDisplay = function(id, content) {
        let cell = doc.getElementById(`cell-${id}`);
        cell.innerHTML = content;
        // cell.classList.add('spot-appear')
        // disable event listener
        cell.removeEventListener('click', triggerTurn);
        // turn off amination
    }

    // reset gameboard

    // disable gameboard
    let disableGameboard = function() {
        let displayCells = document.querySelectorAll('.cell');

        Array.from(displayCells).forEach(function(element) {
            element.removeEventListener('click', triggerTurn);
            // element.classList.remove('spot-appear')
        });

        doc.querySelector('.game-board').style.opacity = 0.5;
    }

    let updateGameState = function(id) {

        if (cells[0] != 0 && cells[0] == cells[1] && cells[0] == cells[2]) { // 0 - 1 - 2
            gameState = cells[0];
        } else if (cells[0] != 0 && cells[0] == cells[3] && cells[0] == cells[6]) { // 0 - 3 - 6
            gameState = cells[0];
        } else if (cells[0] != 0 && cells[0] == cells[4] && cells[0] == cells[8]) { // 0 - 4 - 8
            gameState = cells[0];
        } else if (cells[4] != 0 && cells[4] == cells[1] && cells[4] == cells[7]) { // 4 - 1 - 7
            gameState = cells[4];
        } else if (cells[4] != 0 && cells[4] == cells[2] && cells[4] == cells[6]) { // 4 - 2 - 6
            gameState = cells[4];
        } else if (cells[4] != 0 && cells[4] == cells[3] && cells[4] == cells[5]) { // 4 - 3 - 5
            gameState = cells[4];
        } else if (cells[8] != 0 && cells[2] == cells[5] && cells[2] == cells[8]) { // 2 - 5 - 8
            gameState = cells[2];
        } else if (cells[8] != 0 && cells[6] == cells[7] && cells[6] == cells[8]) { // 6 - 7 - 8
            gameState = cells[6];
        }  else if (!cells.includes(0)) {
            gameState = 0;
        }

        console.log(`Game State is ${gameState}`);
    }

    let calcWinner = function() {
        if (gameState != -1) {
            if (gameState === 1) {
                player1.score++;
                winnerName = player1.name;
            } else if (gameState === 2) {
                player2.score++;
                winnerName = player2.name;
            } else if (gameState === 0) {
                console.log('Game Draw!');
                gameTitle = drawTitle;
                winnerName = 'Let\'s play again!'
            }

            console.log(`Winner is player ${winnerName}`);

            showModal();
            // disable gameboard
            disableGameboard();
            // update leaderboard
            doc.getElementById('player1-score').innerHTML = player1.score;
            doc.getElementById('player2-score').innerHTML = player2.score;

            // update winner name
            doc.getElementById('winnerName').innerHTML = winnerName;
            doc.getElementById('game-title').innerHTML = gameTitle;
        }
    }

    let showModal = function() {
        // bring up modal to celebrate
        doc.getElementById('modal').classList = "";
        doc.getElementById('modal').classList.add('modal-appear');
        doc.querySelector('.container').classList.add('modal-active');
        
        doc.getElementById('modal').onclick = function(e) {
            doc.getElementById('modal').classList.add('out');
            doc.querySelector('.container').classList.remove('modal-active');
        }
    }

    return {updateCellState, init, cells, gameState};
})(document, playerFactory('TT', false), playerFactory('AI', true));

gameBoard.init();

document.getElementById('restart').addEventListener('click', gameBoard.init);
