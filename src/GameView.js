import axios from "axios";
import { useEffect, useState } from "react";

function countEmptyStrings(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === "") {
        count++;
      }
    }
  }
  return count;
}

function getXOGameWinner(board) {
  const size = board.length;

  // Check rows and columns
  for (let i = 0; i < size; i++) {
    if (board[i][0] !== "" && board[i].every((cell) => cell === board[i][0])) {
      return board[i][0] === "X" ? "player1" : "player2";
    }

    let columnWin = true;
    for (let j = 0; j < size; j++) {
      if (board[j][i] !== board[0][i]) {
        columnWin = false;
        break;
      }
    }
    if (columnWin && board[0][i] !== "") {
      return board[0][i] === "X" ? "player1" : "player2";
    }
  }

  // Check diagonals
  let diagonalWin1 = true;
  let diagonalWin2 = true;
  for (let i = 0; i < size; i++) {
    if (board[i][i] !== board[0][0]) {
      diagonalWin1 = false;
    }
    if (board[i][size - 1 - i] !== board[0][size - 1]) {
      diagonalWin2 = false;
    }
  }

  if (diagonalWin1 && board[0][0] !== "") {
    return board[0][0] === "X" ? "player1" : "player2";
  }

  if (diagonalWin2 && board[0][size - 1] !== "") {
    return board[0][size - 1] === "X" ? "player1" : "player2";
  }

  return null; // No winner
}

export default function GameView({ urls }) {
  const [currentPlayer, setCurrentPlayer] = useState("player1");
  const [gameState, setGameState] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  useEffect(() => {
    axios
      .post(urls[currentPlayer], {
        state: gameState,
        isFinished: false,
        sign: currentPlayer === "player1" ? "X" : "O",
      })
      .then((res) => {
        setGameState(res.data.new_state);

        if (
          countEmptyStrings(res.data.new_state) === 0 ||
          getXOGameWinner(res.data.new_state)
        ) {
          Promise.all(
            Object.keys(urls).map((key) =>
              axios.post(urls[key], {
                isFinished: true,
                youAre: key,
                winner: getXOGameWinner(res.data.new_state),
              })
            )
          );
        } else {
          const timer = setTimeout(() => {
            setCurrentPlayer((prev) =>
              prev === "player1" ? "player2" : "player1"
            );
          }, 2000);

          return () => clearTimeout(timer);
        }
      })
      .catch((err) => {
        alert(err.error || "some error!");
      });
  }, [currentPlayer]);

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "lightyellow",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg width="40%" viewBox="0 0 100 100">
        {gameState.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <g>
              <rect
                x={(cellIndex * 100) / 3}
                y={(rowIndex * 100) / 3}
                width={100 / 3}
                height={100 / 3}
                stroke="black"
                fill="none"
              />
              <text
                x={(cellIndex * 100) / 3 + 50 / 3}
                y={(rowIndex * 100) / 3 + 50 / 3}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {cell}
              </text>
            </g>
          ))
        )}
      </svg>
      <h1 display="inline">Winner: {getXOGameWinner(gameState) || "-"}</h1>
    </div>
  );
}
