import { useState } from "react";
import PropTypes from "prop-types";
import "./styles.css";

interface SquareProps {
  value: string;
  onSquareClick: () => void;
  isWinningSquare: boolean;
}
function Square({ value, onSquareClick, isWinningSquare }) {
  const squareClassName = isWinningSquare ? "square winning" : "square";
  return (
    <button className={squareClassName} onClick={onSquareClick}>
      {value}
    </button>
  );
}
Square.propTypes = {
  value: PropTypes.string.isRequired, // Assuming value is always a string
  onSquareClick: PropTypes.func.isRequired, // Make sure onSquareClick is a function
  isWinningSquare: PropTypes.bool.isRequired,
};

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
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
  if (winner) {
    status = "Winner is: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  const isWinningSquare = (i) => {
    return winner && winner === squares[i];
  };
  const renderSquare = (i) => {
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinningSquare={isWinningSquare(i)}
      />
    );
  };

  return (
    <div className="game-board">
      <div className="status winning">{status}</div>
      <div className="board-container">
        {Array.from({ length: 3 }, (_, row) => (
          <div className="row">
            {Array.from({ length: 3 }, (_, col) => renderSquare(row * 3 + col))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  // const [squares, setSquares] = useState(Array(9).fill(null));
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move) => {
    let discription;
    if (move > 0) {
      discription = "Go to " + move;
    } else {
      discription = "Go to start of the game";
    }
    return (
      <li key={move}>
        <button className="history-button" onClick={() => jumpTo(move)}>
          {discription}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol className="history-list-parent">{moves}</ol>
      </div>
    </div>
  );
}

// See you later
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
