import { useRef, useState } from "react";
import WinnerModal from "./WinnerModal";
import { useNavigate } from "react-router-dom";
function TicTacToe() {
  const [board, setBoard] = useState(
    Array.from({ length: 3 }, () => Array(3).fill(null)),
  );
  const navigate = useNavigate();
  const [winnerModal, setwinnerModal] = useState<null | string>(null);
  const currentPlayer = useRef<"X" | "0">("X");
  const toggleCurrentPlayer = () => {
    if (currentPlayer.current == "X") {
      currentPlayer.current = "0";
      return;
    }
    currentPlayer.current = "X";
    return;
  };

  const clearBoard = () => {
    setBoard(Array.from({ length: 3 }, () => Array(3).fill(null)));
    setwinnerModal(null);
  };
  const isGameDraw = (tempBoardRow: string[][]) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (tempBoardRow[i][j] === null) return false;
      }
    }
    return true;
  };
  const checkWinner = (row: number, col: number, currPlayer: string) => {
    const tempBoardRow = [...board];
    tempBoardRow[row][col] = currPlayer;
    const boardRow = tempBoardRow[row];
    const isRowClear = boardRow?.every((item) => item === currPlayer);
    let isColClear = true;
    for (let i = 0; i < 3; i++) {
      if (tempBoardRow[i][col] !== currPlayer) {
        isColClear = false;
        break;
      }
    }
    const isLeftDiagClear = checkLeftDiag(row, col, tempBoardRow, currPlayer);
    const isRightDiagClear = checkRightDiag(row, col, tempBoardRow, currPlayer);
    const result =
      isRowClear || isColClear || isLeftDiagClear || isRightDiagClear;
    if (result) {
      setwinnerModal(currPlayer);
    } else if (isGameDraw(tempBoardRow)) {
      setwinnerModal("D");
    }
  };

  const checkLeftDiag = (
    row: number,
    col: number,
    board: string[][],
    currPlayer: string,
  ) => {
    let count = 0;
    let tempRow = row;
    let tempCol = col;
    while (tempRow >= 0 && tempCol >= 0) {
      count++;
      if (board?.[tempRow]?.[tempCol] !== currPlayer) {
        return false;
      }
      tempRow--;
      tempCol--;
    }
    tempRow = row;
    tempCol = col;
    while (tempRow <= 2 && tempCol <= 2) {
      count++;
      if (board?.[tempRow]?.[tempCol] !== currPlayer) {
        return false;
      }
      tempRow++;
      tempCol++;
    }
    return count - 1 === 3;
  };
  const checkRightDiag = (
    row: number,
    col: number,
    board: string[][],
    currPlayer: string,
  ) => {
    let count = 0;
    let tempRow = row;
    let tempCol = col;
    while (tempRow >= 0 && tempCol <= 2) {
      count++;
      if (board?.[tempRow]?.[tempCol] !== currPlayer) {
        return false;
      }
      tempRow--;
      tempCol++;
    }
    tempRow = row;
    tempCol = col;
    while (tempRow <= 2 && tempCol >= 0) {
      count++;
      if (board?.[tempRow]?.[tempCol] !== currPlayer) {
        return false;
      }
      tempRow++;
      tempCol--;
    }
    return count - 1 === 3;
  };
  const handleCellClick = (row: number, col: number) => {
    if (board?.[row]?.[col] !== null) return;
    setBoard((prev) => {
      const newMatrix = [...prev];
      newMatrix[row][col] = currentPlayer.current;
      return newMatrix;
    });
    toggleCurrentPlayer();
    checkWinner(row, col, currentPlayer?.current);
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {/* Score Card */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Tic Tac Toe</h1>
        <div className="bg-gray-800 px-6 py-3 rounded-xl shadow-lg">
          <div className="flex gap-6 mt-2 text-lg font-semibold">
            <span className="text-blue-400">X</span>
            <span className="text-gray-400">vs</span>
            <span className="text-red-400">O</span>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="bg-gray-800 p-4 rounded-2xl shadow-2xl">
        {board?.map((row, rowInd) => (
          <div key={rowInd} className="flex">
            {row.map((col, colInd) => (
              <button
                key={colInd}
                onClick={() => handleCellClick(rowInd, colInd)}
                className={`w-20 h-20 border border-gray-700 flex items-center justify-center text-3xl font-bold transition
                ${
                  col === "X"
                    ? "text-blue-400"
                    : col === "O"
                      ? "text-red-400"
                      : "text-gray-500"
                }
                ${
                  !col
                    ? "hover:bg-gray-700 hover:scale-105"
                    : "cursor-not-allowed"
                }
              `}
              >
                {col}
              </button>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={clearBoard}
        className="mt-6 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        Restart Game
      </button>

      {winnerModal && (
        <WinnerModal clearBoard={clearBoard} winner={winnerModal} />
      )}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="
    absolute
    top-6
    right-6
    px-5
    py-2
    rounded-xl
    bg-[#1c1f2b]
    hover:bg-[#2a2f42]
    border
    border-[#32384d]
    transition-all
    duration-200
    shadow-lg
    hover:scale-105
  "
      >
        N-Queen →
      </button>
    </div>
  );
}

export default TicTacToe;
