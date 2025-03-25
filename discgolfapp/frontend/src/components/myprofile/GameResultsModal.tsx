import React from 'react';

interface GameResultsModalProps {
  game: {
    gameId: string;
    course: string;
    players: string[];
    scores: { [key: string]: number[] };
    date: Date;
    par: number;
  };
  isOpen: boolean;
  onClose: () => void;
  calculateTotalScore: (scores: number[]) => number;
  getScoreDescription: (score: number, par: number) => string;
}

const GameResultsModal: React.FC<GameResultsModalProps> = ({ game, isOpen, onClose, calculateTotalScore, getScoreDescription }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-full overflow-y-auto relative">
        <button className="absolute top-4 right-4 text-black" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">{game.course} - {new Date(game.date).toLocaleDateString("no-NO")}</h2>
        <p><strong>Spillere:</strong></p>
        <ul>
          {game.players.map((player, index) => (
            <li key={index}> • {player}</li>
          ))}
        </ul>
        <p><strong>Poeng:</strong></p>
        <table className="w-full border rounded-lg mb-4">
          <thead>
            <tr className="bg-gray-300">
              <th className="p-3 text-base">Kurv</th>
              {game.players.map((player, index) => (
                <th key={index} className="p-4 text-xl">{player}</th>
              ))}
              <th className="p-3 text-base"></th>
              <th className="p-3 text-base">Par</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: game.scores[game.players[0]]?.length || 0 }, (_, index) => (
              <tr key={index} className="text-center border-b text-base">
                <td className="p-3">Kurv {index + 1}:</td>
                {game.players.map((player) => (
                  <td key={player} className="p-3">
                    {game.scores[player] ? game.scores[player][index] : 0}
                  </td>
                ))}
                <td className="p-3">
                  {game.par}
                </td>
                <td className="p-3">
                  {game.players.map((player) => (
                    <span key={player}>
                      {getScoreDescription(game.scores[player][index], game.par)}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
            {game.players.map((player) => (
              <tr key={player} className="text-center border-b text-base">
                <td colSpan={(game.scores[game.players[0]]?.length || 0) + 1} className="p-3 text-left">
                  <div className="flex justify-between">
                    <span>Totalt score for {player}:</span>
                    <span className="mr-6">{calculateTotalScore(game.scores[player])}</span>
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
