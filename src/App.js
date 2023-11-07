import React, { useEffect, useState } from "react";

function Square({ value, onSquareClick, isWinner }) {
  console.log(isWinner);
  return (
    <button
      className={`square ${isWinner ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  //const [xIsNext, setXIsNext] = useState(true);
  //const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  let line = [];
  if (winner) {
    status = "Winner: " + winner[0];
    line = winner[1];
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((s, i) => {
          return (
            <Square
              isWinner={winner ? winner[1].includes(i) : false}
              key={i}
              value={s}
              onSquareClick={() => handleClick(i)}
            />
          );
        })}
      </div>
    </>
  );
}

function ToggleMoves({ historyArr, jumpTo }) {
  const [isToggle, setIsToggle] = useState(false);

  return (
    <>
      <button onClick={() => setIsToggle(!isToggle)}>Reverse</button>
      {isToggle ? (
        <ol>
          {historyArr
            .slice()
            .reverse()
            .map((square, move) => (
              <li key={historyArr.indexOf(square)}>
                <button onClick={() => jumpTo(historyArr.indexOf(square))}>
                  {historyArr.indexOf(square) > 0
                    ? `Go to move # ${historyArr.indexOf(square)}`
                    : "Go to game start"}
                </button>
              </li>
            ))}
        </ol>
      ) : (
        <ol>
          {historyArr.map((square, move) => (
            <li key={historyArr.indexOf(square)}>
              <button onClick={() => jumpTo(historyArr.indexOf(square))}>
                {move > 0
                  ? `Go to move # ${historyArr.indexOf(square)}`
                  : "Go to game start"}
              </button>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <p>You are at move #{currentMove}</p>
        <ToggleMoves historyArr={history} jumpTo={jumpTo} />
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
