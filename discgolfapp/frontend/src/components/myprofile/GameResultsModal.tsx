import React from 'react';

interface GameResultsModalProps {
  game: {
    gameId: string;
    course: string;
    players: string[];
    scores: { [key: string]: number[] };
    date: Date;
  };
  isOpen: boolean;
  onClose: () => void;
  calculateTotalScore: (scores: number[]) => number;
}

const GameResultsModal: React.FC<GameResultsModalProps> = ({ game, isOpen, onClose, calculateTotalScore }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-auto relative">
        <button className="absolute top-2 right-2 text-black text-2xl" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-xl font-bold mb-2">{game.course} - {new Date(game.date).toLocaleDateString("no-NO")}</h2>
        <p className="text-sm"><strong>Spillere:</strong></p>
        <ul className="text-sm mb-2">
          {game.players.map((player, index) => (
            <li key={index}>• {player}</li>
          ))}
        </ul>
        <p className="text-sm"><strong>Poeng:</strong></p>
        <table className="w-full border rounded-lg mb-2 text-sm">
          <thead>
            <tr className="bg-gray-300">
              <th className="p-2">Kurv</th>
              {game.players.map((player, index) => (
                <th key={index} className="p-2">{player}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: game.scores[game.players[0]]?.length || 0 }, (_, index) => (
              <tr key={index} className="text-center border-b">
                <td className="p-2">Kurv {index + 1}:</td>
                {game.players.map((player) => (
                  <td key={player} className="p-2">
                    {game.scores[player] ? game.scores[player][index] : 0}
                  </td>
                ))}
              </tr>
            ))}
            {game.players.map((player) => (
              <tr key={player} className="text-center border-t font-semibold">
                <td colSpan={game.players.length + 1} className="p-2 text-left">
                  <div className="flex justify-between">
                    <span>Totalt score for {player}:</span>
                    <span>{calculateTotalScore(game.scores[player])}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameResultsModal;
