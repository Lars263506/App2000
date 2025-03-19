const temporaryGames = [
    { id: 1, name: "The Legend of Zelda: Breath of the Wild", genre: "Adventure" },
    { id: 2, name: "Elden Ring", genre: "RPG" },
    { id: 3, name: "God of War", genre: "Action" }
  ]
  
  const getAllGames = async () => {
    return temporaryGames; 
  }
  
  const getGameById = async (id) => {
    return temporaryGames.find(g => g.id === id) || null;
  }
  
  export { getAllGames, getGameById }
  