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

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

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
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
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
      <div className="status">{status}</div>
      <div className="board">
        {Array.from({ length: 3 }, (_, row) => (
          <div key={row} className="board-row">
            {Array.from({ length: 3 }, (_, col) => renderSquare(row * 3 + col))}
          </div>
        ))}
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