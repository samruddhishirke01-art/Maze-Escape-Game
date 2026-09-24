// -------------------------------------
// Maze configuration
// -------------------------------------

const maze = [
    [0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [1, 1, 0, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0]
];


const start = [0, 0];

const exit = [6, 6];

let player = [...start];

let moves = 0;

let score = 1000;

let seconds = 0;

let gameOver = false;


// -------------------------------------
// Get HTML elements
// -------------------------------------

const mazeElement =
    document.getElementById("maze");

const timerElement =
    document.getElementById("timer");

const movesElement =
    document.getElementById("moves");

const scoreElement =
    document.getElementById("score");

const messageElement =
    document.getElementById("message");


// -------------------------------------
// Create maze
// -------------------------------------

function createMaze() {

    mazeElement.innerHTML = "";

    for (let row = 0; row < maze.length; row++) {

        for (let col = 0; col < maze[row].length; col++) {

            const cell =
                document.createElement("div");

            cell.classList.add("cell");

            if (maze[row][col] === 1) {

                cell.classList.add("wall");

            } else {

                cell.classList.add("path");
            }


            // Player

            if (
                player[0] === row &&
                player[1] === col
            ) {

                cell.classList.add("player");

                cell.textContent = "🧍";
            }


            // Exit

            if (
                exit[0] === row &&
                exit[1] === col
            ) {

                cell.classList.add("exit");

                cell.textContent = "🏁";
            }


            mazeElement.appendChild(cell);
        }
    }
}


// -------------------------------------
// Move player
// -------------------------------------

function movePlayer(rowChange, colChange) {

    if (gameOver) {
        return;
    }

    const newRow =
        player[0] + rowChange;

    const newCol =
        player[1] + colChange;


    // Check boundaries

    if (
        newRow < 0 ||
        newRow >= maze.length ||
        newCol < 0 ||
        newCol >= maze[0].length
    ) {

        return;
    }


    // Check wall

    if (maze[newRow][newCol] === 1) {

        messageElement.textContent =
            "🧱 You cannot move through a wall!";

        return;
    }


    // Move player

    player[0] = newRow;

    player[1] = newCol;

    moves++;

    score = Math.max(
        0,
        1000 - moves * 10
    );


    updateInformation();

    createMaze();


    // Check exit

    if (
        player[0] === exit[0] &&
        player[1] === exit[1]
    ) {

        gameOver = true;

        messageElement.textContent =
            "🎉 Congratulations! You escaped the maze!";

    } else {

        messageElement.textContent =
            "Keep going! Find the exit 🏁";
    }
}


// -------------------------------------
// Update score and moves
// -------------------------------------

function updateInformation() {

    movesElement.textContent = moves;

    scoreElement.textContent = score;

    timerElement.textContent = seconds;
}


// -------------------------------------
// Keyboard controls
// -------------------------------------

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "ArrowUp") {

            movePlayer(-1, 0);

        }

        else if (event.key === "ArrowDown") {

            movePlayer(1, 0);

        }

        else if (event.key === "ArrowLeft") {

            movePlayer(0, -1);

        }

        else if (event.key === "ArrowRight") {

            movePlayer(0, 1);

        }
    }
);


// -------------------------------------
// Button controls
// -------------------------------------

document
    .getElementById("up")
    .addEventListener(
        "click",
        () => movePlayer(-1, 0)
    );


document
    .getElementById("down")
    .addEventListener(
        "click",
        () => movePlayer(1, 0)
    );


document
    .getElementById("left")
    .addEventListener(
        "click",
        () => movePlayer(0, -1)
    );


document
    .getElementById("right")
    .addEventListener(
        "click",
        () => movePlayer(0, 1)
    );


// -------------------------------------
// Find shortest path using BFS
// -------------------------------------

document
    .getElementById("findPath")
    .addEventListener(
        "click",
        async function() {

            messageElement.textContent =
                "🧠 Calculating shortest path using BFS...";

            try {

                const response =
                    await fetch("/shortest-path");

                const data =
                    await response.json();


                if (data.success) {

                    const cells =
                        document.querySelectorAll(".cell");


                    // Convert path positions
                    // into highlighted cells

                    data.path.forEach(
                        ([row, col]) => {

                            const index =
                                row * maze[0].length + col;

                            cells[index]
                                .classList
                                .add("shortest");
                        }
                    );


                    messageElement.textContent =
                        "🧠 BFS found the shortest path in "
                        + data.steps
                        + " steps!";
                }

            }

            catch (error) {

                messageElement.textContent =
                    "Error finding path.";
            }
        }
    );


// -------------------------------------
// Restart game
// -------------------------------------

document
    .getElementById("restart")
    .addEventListener(
        "click",
        function() {

            player = [...start];

            moves = 0;

            score = 1000;

            seconds = 0;

            gameOver = false;

            messageElement.textContent =
                "Game restarted! Find the exit 🏁";

            updateInformation();

            createMaze();
        }
    );


// -------------------------------------
// Timer
// -------------------------------------

setInterval(
    function() {

        if (!gameOver) {

            seconds++;

            timerElement.textContent =
                seconds;
        }

    },
    1000
);


// -------------------------------------
// Start game
// -------------------------------------

createMaze();

updateInformation();