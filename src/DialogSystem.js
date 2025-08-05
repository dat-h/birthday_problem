class DialogSystem {
  constructor(scene, opts = {}) {
    this.scene = scene;
    this.isActive = false;
    this.currentDialog = null;
    this.currentNodeId = null;
    
    // UI Configuration
    this.x = opts.x ?? 50;
    this.y = opts.y ?? 50;
    this.width = opts.width ?? 700;
    this.height = opts.height ?? 400;
    this.depth = opts.depth ?? 15000;
    
    // UI Elements
    this.background = null;
    this.npcText = null;
    this.responseButtons = [];
    this.npcNameText = null;
    
    this.setupUI();
  }

  setupUI() {
    // Create background panel
    this.background = this.scene.add.graphics();
    this.background.setDepth(this.depth);
    this.background.setVisible(false);
    
    // NPC name text
    this.npcNameText = this.scene.add.text(
      this.x + 20,
      this.y + 15,
      '',
      {
        font: 'bold 20px Berkelium',
        fill: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0)',
        padding: { x: 8, y: 4 }
      }
    ).setDepth(this.depth + 1).setVisible(false);
    
    // NPC dialog text
    this.npcText = this.scene.add.text(
      this.x + 20,
      this.y + 60,
      '',
      {
      font: '18px Berkelium',
      fill: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0)',
      padding: { x: 12, y: 8 },
      wordWrap: { width: this.width - 40, useAdvancedWrap: true }
      }
    ).setDepth(this.depth + 1).setVisible(false);
    }

  drawBackground() {
    this.background.clear();
    
    // Main dialog background
    this.background.fillStyle(0x000033, 0);
    this.background.fillRoundedRect(this.x, this.y, this.width, this.height, 10);
    
    // Border
    this.background.lineStyle(3, 0xffffff, 0);
    this.background.strokeRoundedRect(this.x, this.y, this.width, this.height, 10);
  }

  startDialog(dialogData, startNodeId = 'start') {
    if (this.isActive) return;
    
    this.isActive = true;
    this.currentDialog = dialogData;
    this.currentNodeId = startNodeId;
    
    this.drawBackground();
    this.background.setVisible(true);
    this.npcNameText.setVisible(false);
    this.npcText.setVisible(true);
    
    // Set NPC name
    this.npcNameText.setText(dialogData.npcName || 'NPC');
    
    this.showCurrentNode();
  }

  showCurrentNode() {
    const node = this.currentDialog.nodes[this.currentNodeId];
    if (!node) {
      console.warn(`Dialog node '${this.currentNodeId}' not found`);
      this.endDialog();
      return;
    }

    // Display NPC text
    this.npcText.setText(node.text);
    
    // Clear existing response buttons
    this.clearResponseButtons();
    
    // Create response buttons
    if (node.responses && node.responses.length > 0) {
      this.createResponseButtons(node.responses);
    } else {
      // No responses - create a "Continue" button to end dialog
      this.createContinueButton();
    }
  }

  createResponseButtons(responses) {
    const buttonStartY = this.y + this.height - 150;
    const buttonHeight = 35;
    const buttonSpacing = 5;
    
    responses.forEach((response, index) => {
      const buttonY = buttonStartY + index * (buttonHeight + buttonSpacing);
      
      // Button background
      const buttonBg = this.scene.add.graphics();
      buttonBg.setDepth(this.depth + 2);
      buttonBg.fillStyle(0x444444, 0.2);
      buttonBg.fillRoundedRect(this.x + 20, buttonY, this.width - 40, buttonHeight, 5);
      buttonBg.lineStyle(2, 0xcccccc, 1);
      buttonBg.strokeRoundedRect(this.x + 20, buttonY, this.width - 40, buttonHeight, 5);
      
      // Button text
      const buttonText = this.scene.add.text(
        this.x + 30,
        buttonY + buttonHeight / 2,
        response.text,
        {
          font: '18px Berkelium',
          fill: '#ffffff',
          wordWrap: { width: this.width - 80, useAdvancedWrap: true }
        }
      ).setDepth(this.depth + 3).setOrigin(0, 0.5);
      
      // Make button interactive
      const hitArea = this.scene.add.rectangle(
        this.x + 20 + (this.width - 40) / 2,
        buttonY + buttonHeight / 2,
        this.width - 40,
        buttonHeight
      ).setDepth(this.depth + 4).setVisible(true).setInteractive({ useHandCursor: true });
      
      // Button hover effects
      hitArea.on('pointerover', () => {
        buttonBg.clear();
        buttonBg.fillStyle(0x666666, 0.9);
        buttonBg.fillRoundedRect(this.x + 20, buttonY, this.width - 40, buttonHeight, 5);
        buttonBg.lineStyle(2, 0xffffff, 1);
        buttonBg.strokeRoundedRect(this.x + 20, buttonY, this.width - 40, buttonHeight, 5);
      });
      
      hitArea.on('pointerout', () => {
        buttonBg.clear();
        buttonBg.fillStyle(0x444444, 0.2);
        buttonBg.fillRoundedRect(this.x + 20, buttonY, this.width - 40, buttonHeight, 5);
        buttonBg.lineStyle(2, 0xcccccc, 1);
        buttonBg.strokeRoundedRect(this.x + 20, buttonY, this.width - 40, buttonHeight, 5);
      });
      
      // Button click handler
      hitArea.on('pointerdown', () => {
        this.handleResponse(response);
      });
      
      this.responseButtons.push({ bg: buttonBg, text: buttonText, hitArea: hitArea });
    });
  }

  createContinueButton() {
    const buttonY = this.y + this.height - 60;
    const buttonHeight = 35;
    
    // Button background
    const buttonBg = this.scene.add.graphics();
    buttonBg.setDepth(this.depth + 2);
    buttonBg.fillStyle(0x006600, 0.8);
    buttonBg.fillRoundedRect(this.x + this.width - 120, buttonY, 100, buttonHeight, 5);
    buttonBg.lineStyle(2, 0x00ff00, 1);
    buttonBg.strokeRoundedRect(this.x + this.width - 120, buttonY, 100, buttonHeight, 5);
    
    // Button text
    const buttonText = this.scene.add.text(
      this.x + this.width - 70,
      buttonY + buttonHeight / 2,
      'Continue',
      {
        font: '16px Berkelium',
        fill: '#ffffff'
      }
    ).setDepth(this.depth + 3).setOrigin(0.5, 0.5);
    
    // Make button interactive
    const hitArea = this.scene.add.rectangle(
      this.x + this.width - 70,
      buttonY + buttonHeight / 2,
      100,
      buttonHeight
    ).setDepth(this.depth + 4).setVisible(true).setInteractive({ useHandCursor: true });
    
    hitArea.on('pointerdown', () => {
      this.endDialog();
    });
    
    this.responseButtons.push({ bg: buttonBg, text: buttonText, hitArea: hitArea });
  }

  handleResponse(response) {
    // Execute any action associated with the response
    if (response.action) {
      response.action();
    }
    
    // Navigate to next dialog node
    if (response.nextNode) {
      this.currentNodeId = response.nextNode;
      this.showCurrentNode();
    } else {
      this.endDialog();
    }
  }

  clearResponseButtons() {
    this.responseButtons.forEach(button => {
      button.bg.destroy();
      button.text.destroy();
      button.hitArea.destroy();
    });
    this.responseButtons = [];
  }

  endDialog() {
    this.isActive = false;
    this.currentDialog = null;
    this.currentNodeId = null;
    
    this.background.setVisible(false);
    this.npcNameText.setVisible(false);
    this.npcText.setVisible(false);
    
    this.clearResponseButtons();
  }

  destroy() {
    this.clearResponseButtons();
    if (this.background) this.background.destroy();
    if (this.npcNameText) this.npcNameText.destroy();
    if (this.npcText) this.npcText.destroy();
  }
}

export default DialogSystem;
