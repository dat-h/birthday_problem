// GameState.js
// Singleton for tracking persistent game state across scenes

const GameState = {
  // Game settings
  DEBUG_GRAPHICS: true,
  // Game milestones
  wokeUp: false,  
  foundSock: false,
  boxUnlocked: false,
  flashlightTaken: false,
  glassTaken: false,
  batteryTaken: false,
  checkedMirror: false,
  // Add more state flags as needed
};

export default GameState;
