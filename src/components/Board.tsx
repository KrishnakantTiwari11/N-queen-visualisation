interface IBoardProps {
  board: number[][];
  handleClick: (row: number, col: number) => void;
}

interface IBoardProps {
  board: number[][];
  handleClick: (row: number, col: number) => void;
}

const Board = ({ board, handleClick }: IBoardProps) => {
  console.log("board render :", board);

  return (
    <div className="flex justify-center w-full px-2">
      <div
        className="
          grid
          grid-cols-8
          rounded-2xl
          overflow-hidden
          border
          border-[#343a4d]
          shadow-2xl
          
          max-w-[70vw]
          max-h-[70vh]
          aspect-square
        "
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isDark = (rowIndex + colIndex) % 2 === 0;

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                onClick={() => handleClick(rowIndex, colIndex)}
                className={`
                  aspect-square
                  flex
                  items-center
                  justify-center
                  relative
                  transition-all
                  duration-200
                  group
                  ${isDark ? "bg-[#242836]" : "bg-[#181b24]"}
                  hover:scale-105
                  hover:z-10
                `}
              >
                {/* Hover Glow */}
                <div
                  className="
                    absolute
                    inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition
                    duration-200
                    bg-white/5
                  "
                />

                {/* Queen */}
                {cell === 1 ? (
                  <span
                    className="
                      text-yellow-400
                      text-[6vw]
                      sm:text-5xl
                      select-none
                      drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]
                      transition-transform
                      duration-200
                      group-hover:scale-110
                    "
                  >
                    ♛
                  </span>
                ) : (
                  <div className="min-w-[3.5vw] min-h-[3.5vh]"> </div>
                )}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
};

export default Board;
