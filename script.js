const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let gameMode = "friend"; 
let aiThinking = false;  // Prevents AI from playing twice in a row

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function startGame(mode) {
    gameMode = mode;
    gameActive = true;
    aiThinking = false; // Reset AI flag
    resetGame();
    statusText.textContent = `Player X's Turn`;
}

cells.forEach(cell => {
    cell.addEventListener("click", () => cellClicked(cell));
});

function cellClicked(cell) {
    const index = cell.getAttribute("data-index");

    if (board[index] !== "" || !gameActive || aiThinking) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    checkWinner();

    if (gameActive) {
        if (gameMode === "ai" && currentPlayer === "X") {
            currentPlayer = "O";
            statusText.textContent = "Computer's Turn"; // Show AI turn properly
            aiThinking = true;
            setTimeout(aiMove, 500);
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            statusText.textContent = `Player ${currentPlayer}'s Turn`;
        }
    }
}

// AI Move
function aiMove() {
    let bestMove = findBestMove();
    
    if (bestMove !== null) {
        board[bestMove] = "O";
        cells[bestMove].textContent = "O";
        checkWinner();
    }

    aiThinking = false; 
    if (gameActive) {
        currentPlayer = "X";
        statusText.textContent = `Player X's Turn`; // Back to player
    }
}

// AI picks the best move
function findBestMove() {
    let emptyCells = board.map((val, index) => val === "" ? index : null).filter(val => val !== null);

    for (let index of emptyCells) {
        board[index] = "O";
        if (checkImmediateWin()) {
            board[index] = "";
            return index;
        }
        board[index] = "";
    }

    for (let index of emptyCells) {
        board[index] = "X";
        if (checkImmediateWin()) {
            board[index] = "";
            return index;
        }
        board[index] = "";
    }

    if (board[4] === "") return 4;

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Check if a winning move exists
function checkImmediateWin() {
    return winningCombinations.some(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

// Check Winner
function checkWinner() {
    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            combo.forEach(i => cells[i].classList.add("win"));
            statusText.textContent = `🎉 ${board[a] === "X" ? "Player X" : "Player O"} Wins!`;
            return;
        }
    }

    if (!board.includes("")) {
        gameActive = false;
        statusText.textContent = "It's a Draw!";
    }
}

resetBtn.addEventListener("click", resetGame);
function resetGame() {
    board.fill("");
    gameActive = true;
    aiThinking = false;
    currentPlayer = "X";
    statusText.textContent = "Player X's Turn";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("win");
    });
}
