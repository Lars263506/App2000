type Game = {
    gameId: string;
    course: string;
    players: { _id: string; name: string }[]; 
    scores: { [playerName: string]: number[] }; 
    date: string; 
};

export default Game;
