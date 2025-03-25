type Game = {
    gameId: string,
    course: string,
    players: string[],
    scores: Map<string, number[]>,
    date: Date
    par: number
}
 
export default Game
