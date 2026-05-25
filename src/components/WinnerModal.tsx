const WinnerModal = ({
  winner,
  clearBoard,
}: {
  winner: string;
  clearBoard: () => void;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-gray-800 text-white rounded-2xl p-8 text-center shadow-2xl w-[280px] animate-scaleIn">
        <h2 className="text-2xl font-bold mb-4">
          {winner != "D" ? `🎉 ${winner} Wins!` : "It's a Draw!"}
        </h2>

        <button
          onClick={clearBoard}
          className="mt-4 px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
export default WinnerModal;
