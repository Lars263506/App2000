import React from 'react';

interface GameResultsModalProps {
  game: {
    course: string;
    date: string;
    players: { _id: string; name: string }[];
    scores: { [playerName: string]: number[] };
  };
  isOpen: boolean;
  onClose: () => void;
  calculateTotalScore: (scores: number[]) => number;
}

const calculateTotalScore = (scores: number[] = []) => {
  return scores.reduce((total, score) => total + score, 0);
};

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
            <li key={index}>• {player.name || "Unknown Player"}</li>
          ))}
        </ul>
        <p className="text-sm"><strong>Poeng:</strong></p>
        <table className="w-full border rounded-lg mb-2 text-sm">
          <thead>
            <tr className="bg-gray-300">
              <th className="p-2">Kurv</th>
              {game.players.map((player, index) => (
                <th key={index} className="p-2">{player.name || "Unknown Player"}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: game.scores[game.players[0]?.name]?.length || 0 }, (_, index) => (
              <tr key={index} className="text-center border-b">
                <td className="p-2">Kurv {index + 1}:</td>
                {game.players.map((player) => (
                  <td key={player._id} className="p-2">
                    {game.scores[player.name]?.[index] === 0 && index >= game.scores[player.name]?.length
                      ? '-' 
                      : game.scores[player.name]?.[index] || '-'} 
                  </td>
                ))}
              </tr>
            ))}
            {game.players.map((player) => (
              <tr key={player._id} className="text-center border-t font-semibold">
                <td colSpan={game.players.length + 1} className="p-2 text-left">
                  <div className="flex justify-between">
                    <span>Totalt score for {player.name || "Unknown Player"}:</span>
                    <span>{calculateTotalScore(game.scores[player.name] || [])}</span>
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
