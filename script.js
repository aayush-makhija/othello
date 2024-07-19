// script.js
document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const turnIndicator = document.getElementById('turn-indicator');
    const blackScoreElement = document.getElementById('black-score');
    const whiteScoreElement = document.getElementById('white-score');
    const rows = 8;
    const cols = 8;
    const cells = [];
    let currentPlayer = 'black';
    let blackScore = 2;
    let whiteScore = 2;

    // Initialize the board
    for (let row = 0; row < rows; row++) {
        cells[row] = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cells[row][col] = cell;
            board.appendChild(cell);
        }
    }

    // Initial setup of discs
    const mid = rows / 2;
    cells[mid - 1][mid - 1].appendChild(createDisc('white'));
    cells[mid - 1][mid].appendChild(createDisc('black'));
    cells[mid][mid - 1].appendChild(createDisc('black'));
    cells[mid][mid].appendChild(createDisc('white'));

    function createDisc(color) {
        const disc = document.createElement('div');
        disc.classList.add('disc', color);
        return disc;
    }

    function isValidMove(row, col, player) {
        if (cells[row][col].querySelector('.disc')) return false;

        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1], 
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];

        for (const [rowDir, colDir] of directions) {
            if (checkDirection(row, col, player, rowDir, colDir)) return true;
        }
        return false;
    }

    function checkDirection(row, col, player, rowDir, colDir) {
        // Determine opponent's color based on the current player
        let opponent;
        if (player === 'black') {
            opponent = 'white';
        } else {
            opponent = 'black';
        }

        let r = row + rowDir;
        let c = col + colDir;
        let hasOpponentDisc = false;

        while (r >= 0 && r < rows && c >= 0 && c < cols) {
            const cell = cells[r][c];
            const disc = cell.querySelector('.disc');
            if (!disc) return false;
            if (disc.classList.contains(opponent)) {
                hasOpponentDisc = true;
            } else if (disc.classList.contains(player)) {
                return hasOpponentDisc;
            } else {
                return false;
            }
            r += rowDir;
            c += colDir;
        }
        return false;
    }

    function flipDiscs(row, col, player) {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1], 
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];

        for (const [rowDir, colDir] of directions) {
            flipDirection(row, col, player, rowDir, colDir);
        }
    }

    function flipDirection(row, col, player, rowDir, colDir) {
        let opponent;
            if (player === 'black') {
        opponent = 'white';
        } else {
        opponent = 'black';
        }
        let r = row + rowDir;
        let c = col + colDir;
        const cellsToFlip = [];

        while (r >= 0 && r < rows && c >= 0 && c < cols) {
            const cell = cells[r][c];
            const disc = cell.querySelector('.disc');
            if (!disc) return;
            if (disc.classList.contains(opponent)) {
                cellsToFlip.push(cell);
            } else if (disc.classList.contains(player)) {
                for (const flipCell of cellsToFlip) {
                    flipCell.innerHTML = '';
                    flipCell.appendChild(createDisc(player));
                }
                return;
            } else {
                return;
            }
            r += rowDir;
            c += colDir;
        }
    }

    function updateTurnIndicator() {
        const disc = turnIndicator.querySelector('.disc');
        disc.className = `disc ${currentPlayer}`;
    }

    function showPossibleMoves(player) {
        clearPossibleMoves();
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (isValidMove(row, col, player)) {
                    cells[row][col].classList.add('possible-move');
                }
            }
        }
    }

    function clearPossibleMoves() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                cells[row][col].classList.remove('possible-move');
            }
        }
    }

    function updateScores() {
        blackScore = 0;
        whiteScore = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const disc = cells[row][col].querySelector('.disc');
                if (disc) {
                    if (disc.classList.contains('black')) {
                        blackScore++;
                    } else if (disc.classList.contains('white')) {
                        whiteScore++;
                    }
                }
            }
        }
        blackScoreElement.textContent = blackScore;
        whiteScoreElement.textContent = whiteScore;
    }

    function checkGameOver() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (isValidMove(row, col, 'black') || isValidMove(row, col, 'white')) {
                    return false;
                }
            }
        }
        return true;
    }

    function announceWinner() {
        let winner;
        if (blackScore > whiteScore) {
            winner = 'Black';
        } else if (whiteScore > blackScore) {
            winner = 'White';
        } else {
            winner = 'No one, it\'s a tie';
        }
        alert(`Game Over! The winner is ${winner}.`);
    }

    function handleClick(event) {
        const cell = event.target.closest('.cell');
        if (!cell || !cell.classList.contains('possible-move')) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        cell.appendChild(createDisc(currentPlayer));
        flipDiscs(row, col, currentPlayer);
        updateScores();

        if (checkGameOver()) {
            announceWinner();
            return;
        }

        if (currentPlayer === 'black') {
            currentPlayer = 'white';
        } else {
            currentPlayer = 'black';
        }
        updateTurnIndicator();

        if (!hasValidMoves(currentPlayer)) {
            if (currentPlayer === 'black') {
                currentPlayer = 'white';
            } else {
                currentPlayer = 'black';
            }
            let message;
            if (currentPlayer === 'black') {
                message = "White has no valid moves. Turn passes back to Black.";
            } else {
                message = "Black has no valid moves. Turn passes back to White.";
            }
            alert(message);
            
        }

        showPossibleMoves(currentPlayer);
    }

    function hasValidMoves(player) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (isValidMove(row, col, player)) {
                    return true;
                }
            }
        }
        return false;
    }

    board.addEventListener('click', handleClick);

    updateTurnIndicator();
    showPossibleMoves(currentPlayer);
});
