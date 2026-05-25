import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Board from "./Board";
const NQueen = () => {
  const [board, setBoard] = useState(
    Array.from({ length: 8 }, () => Array(8).fill(0)),
  );
  const navigate = useNavigate();
  const [gameStatus, setGameStatus] = useState<boolean>(false);
  const undoStack = useRef<number[][]>([]);
  const redoStack = useRef<number[][]>([]);
  const solutions = useRef<number[][][]>([]);
  const rowFill = useRef<number[]>(Array.from({ length: 8 }, () => 0));
  const colFill = useRef<number[]>(Array.from({ length: 8 }, () => 0));
  const leftDiagFill = useRef<number[]>(Array.from({ length: 16 }, () => 0));
  const rightDiagFill = useRef<number[]>(Array.from({ length: 16 }, () => 0));

  const queenCount = useRef<number>(0);

  const handleUndo = () => {
    if (undoStack.current.length === 0) return;
    const currMove = undoStack.current.pop();

    const row = currMove?.[0];
    const col = currMove?.[1];
    const val = currMove?.[2] === 0 ? 1 : 0;
    val === 0 ? queenCount.current-- : queenCount.current++;

    setBoard((prev) => {
      const tempBoard = prev.map((row) => [...row]);
      tempBoard[row][col] = val;
      return tempBoard;
    });

    redoStack.current.push([row, col, val]);
  };
  const handleRedo = () => {
    if (redoStack.current.length === 0) return;
    const currMove = redoStack.current.pop();
    const row = currMove?.[0];
    const col = currMove?.[1];
    const val = currMove?.[2] === 0 ? 1 : 0;
    val === 1 ? queenCount.current++ : queenCount.current--;

    setBoard((prev) => {
      const tempBoard = prev.map((row) => [...row]);
      tempBoard[row][col] = val;
      return tempBoard;
    });
    undoStack.current.push([row, col, val]);
  };

  const checkWin = (board) => {
    if (queenCount.current !== 8) return false;
    for (let i = 0; i < 8; i++) {
      if (rowFill.current[i] == 2 || colFill.current[i] == 2) return false;
    }
    for (let i = 0; i < 16; i++) {
      if (leftDiagFill.current[i] == 2 || rightDiagFill.current[i] == 2)
        return false;
    }
    return true;
  };
  const solve = (res, n, genBoard, col) => {
    if (col === n) {
      console.count();
      const solvedBoard = genBoard.map((row) => [...row]);
      res.push(solvedBoard);
      return;
    }
    for (let i = 0; i < 8; i++) {
      if (
        genBoard[i][col] === 0 &&
        rowFill.current[i] === 0 &&
        leftDiagFill.current[i + col] === 0 &&
        rightDiagFill.current[7 + (col - i)] === 0
      ) {
        genBoard[i][col] = 1;
        rowFill.current[i] = 1;
        leftDiagFill.current[i + col] = 1;
        rightDiagFill.current[7 + (col - i)] = 1;
        solve(res, n, genBoard, col + 1);
        genBoard[i][col] = 0;
        rowFill.current[i] = 0;
        leftDiagFill.current[i + col] = 0;
        rightDiagFill.current[7 + (col - i)] = 0;
      }
    }
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleGenerate = async () => {
    let allPossibleSolutions: number[][][] = [];

    if (solutions?.current?.length >= 1) {
      allPossibleSolutions = solutions.current;
    } else {
      handleReset();
      const tempBoard = Array.from({ length: 8 }, () => Array(8).fill(0));
      solve(allPossibleSolutions, 8, tempBoard, 0);
      solutions.current = allPossibleSolutions;
    }
    queenCount.current = 8;
    const solution = allPossibleSolutions?.[solutions.current?.length - 1];
    solutions.current.pop();

    const animatedBoard = Array.from({ length: 8 }, () => Array(8).fill(0));

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (solution[row][col]) {
          animatedBoard[row][col] = 1;

          document.startViewTransition(() => {
            setBoard(animatedBoard.map((r) => [...r]));
          });

          await sleep(200);
        }
      }
    }
  };
  const isSolutionGenerated = solutions.current.length >= 1;
  const handleReset = () => {
    const tempBoard = Array.from({ length: 8 }, () => Array(8).fill(0));
    queenCount.current = 0;
    rowFill.current = Array.from({ length: 8 }, () => 0);
    colFill.current = Array.from({ length: 8 }, () => 0);
    leftDiagFill.current = Array.from({ length: 16 }, () => 0);
    rightDiagFill.current = Array.from({ length: 16 }, () => 0);
    undoStack.current = [];
    redoStack.current = [];
    solutions.current = [];
    setBoard(tempBoard);
    console.log("temp board :", tempBoard);

    console.log("being resetted");
  };
  const handleClick = (row: number, col: number) => {
    if (queenCount.current === 8) {
      return;
    }
    const move = [row, col, 1];
    undoStack.current.push(move);
    rowFill.current[row]++;
    colFill.current[col]++;
    leftDiagFill.current[row + col]++;

    rightDiagFill.current[7 + (col - row)]++;

    setBoard((prev) => {
      const tempBoard = [...prev];
      if (!tempBoard[row][col]) {
        tempBoard[row][col] = 1;
        queenCount.current++;
        if (queenCount.current === 8 && checkWin(tempBoard)) {
          console.log("we won");
          setGameStatus(true);
        } else if (queenCount.current === 8) {
          console.log("lose");
        } else {
          console.log("queen not filled");
        }
      }
      return tempBoard;
    });
  };
  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex flex-col items-center justify-center p-6">
      <div className="mb-6 text-center">
        <h1 className="text-5xl font-bold tracking-wide">N Queen Visualizer</h1>

        <p className="text-gray-400 mt-2 text-sm">
          Place 8 queens without attacking each other
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {!isSolutionGenerated && (
          <button
            type="button"
            onClick={handleUndo}
            className="px-5 py-2 rounded-xl bg-[#1c1f2b] hover:bg-[#2a2f42] transition-all duration-200 border border-[#32384d]"
          >
            Undo
          </button>
        )}
        {!isSolutionGenerated && (
          <button
            type="button"
            onClick={handleRedo}
            className="px-5 py-2 rounded-xl bg-[#1c1f2b] hover:bg-[#2a2f42] transition-all duration-200 border border-[#32384d]"
          >
            Redo
          </button>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-500/20"
        >
          {isSolutionGenerated ? "Generate More" : "Generate"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 transition-all duration-200 shadow-lg shadow-red-500/20"
        >
          Reset
        </button>
      </div>

      {gameStatus && (
        <div className="mb-4 px-6 py-3 rounded-2xl bg-green-500/10 border border-green-500 text-green-400 font-semibold">
          🎉 You solved the puzzle!
        </div>
      )}

      <div className="p-4 rounded-3xl bg-[#161922] border border-[#2a2f42] shadow-2xl">
        <Board handleClick={handleClick} board={board} />
      </div>
      <button
        type="button"
        onClick={() => navigate("/tic-tac-toe")}
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
        Tic Tac Toe →
      </button>
    </div>
  );
};

export default NQueen;
