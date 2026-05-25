import { Route, Routes } from "react-router-dom";
import NQueen from "./components/NQueen";
import TicTacToe from "./components/TicTacToe";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<NQueen />} />
      <Route path="/tic-tac-toe" element={<TicTacToe />} />
    </Routes>
  );
};

export default App;
