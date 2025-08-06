// GameState.js
// Singleton for tracking persistent game state across scenes

const GameState = {
  // Game settings
  DEBUG_GRAPHICS: false,
  // volume: 1.0, // Legacy - kept for compatibility
  musicVolume: 1.0, // Background music volume
  sfxVolume: 1.0, // Sound effects and voice volume
  // isMuted: false,
  // isVoicesOn: false,
  // voiceVolume: 1.0, // Legacy - will be replaced by sfxVolume
  // Game milestones
  wokeUp: false,  
  foundSock: false,
  boxUnlocked: false,
  drawerOpened: false,
  flashlightTaken: false,
  glassTaken: false,
  batteryTaken: false,
  checkedMirror: false,

  // Last Scene and Player Position
  lastScene: 'BedroomScene',
  playerX: 400,
  playerY: 240,
  // Inventory
  inventoryItems: [],
  // Add more state flags as needed
};

GameState.reset = function() {
  this.wokeUp = false;
  this.foundSock = false;
  this.boxUnlocked = false;
  this.drawerOpened = false;
  this.flashlightTaken = false;
  this.glassTaken = false;
  this.batteryTaken = false;
  this.checkedMirror = false;
  this.lastScene = 'BedroomScene';
  this.playerX = 400;
  this.playerY = 240;
  this.inventoryItems = [];
};


GameState.setPlayerPosition = function(x, y) {
  this.playerX = x;
  this.playerY = y;
};

// Save game state to localStorage
GameState.saveGame = function() {
  try {
    const saveData = {
      // Game settings
      // volume: this.volume, // Legacy compatibility
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      // isMuted: this.isMuted,
      // isVoicesOn: this.isVoicesOn,
      // voiceVolume: this.voiceVolume, // Legacy compatibility
      // Game milestones
      wokeUp: this.wokeUp,
      foundSock: this.foundSock,
      boxUnlocked: this.boxUnlocked,
      drawerOpened: this.drawerOpened,
      flashlightTaken: this.flashlightTaken,
      glassTaken: this.glassTaken,
      batteryTaken: this.batteryTaken,
      checkedMirror: this.checkedMirror,
      // Last Scene and Player Position
      lastScene: this.lastScene,
      playerX: this.playerX,
      playerY: this.playerY,
      // Inventory
      inventoryItems: [...this.inventoryItems], // Create a copy
      // Save timestamp
      saveTime: new Date().toISOString()
    };
    
    localStorage.setItem('birthdayProblemSave', JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('Failed to save game:', error);
    return false;
  }
};

// Load game state from localStorage
GameState.loadGame = function() {
  try {
    const saveData = localStorage.getItem('birthdayProblemSave');
    if (!saveData) {
      return false; // No save data found
    }
    
    const data = JSON.parse(saveData);
    
    // Restore game settings
    // this.volume = data.volume || 1.0; // Legacy compatibility
    this.musicVolume = data.musicVolume || data.volume || 1.0; // Use musicVolume or fallback to legacy volume
    this.sfxVolume = data.sfxVolume || data.voiceVolume || 1.0; // Use sfxVolume or fallback to legacy voiceVolume
    // this.isMuted = data.isMuted || false;
    // this.isVoicesOn = data.isVoicesOn || false;
    // this.voiceVolume = data.voiceVolume || 1.0; // Legacy compatibility
    
    // Restore game milestones
    this.wokeUp = data.wokeUp || false;
    this.foundSock = data.foundSock || false;
    this.boxUnlocked = data.boxUnlocked || false;
    this.drawerOpened = data.drawerOpened || false;
    this.flashlightTaken = data.flashlightTaken || false;
    this.glassTaken = data.glassTaken || false;
    this.batteryTaken = data.batteryTaken || false;
    this.checkedMirror = data.checkedMirror || false;
    
    // Restore scene and position
    this.lastScene = data.lastScene || 'BedroomScene';
    this.playerX = data.playerX || 400;
    this.playerY = data.playerY || 240;
    
    // Restore inventory
    this.inventoryItems = data.inventoryItems || [];
    
    return true;
  } catch (error) {
    console.error('Failed to load game:', error);
    return false;
  }
};

// Check if save data exists
GameState.hasSaveData = function() {
  return localStorage.getItem('birthdayProblemSave') !== null;
};

export default GameState;
