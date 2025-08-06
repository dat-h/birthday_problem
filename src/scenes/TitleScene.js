import Phaser from 'phaser';
import GameState from '../GameState.js';

class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  preload() {

    this.load.html('voices-form', 'voices-form.html');
  }


  async loadJSONData(url) {
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error('Error loading JSON data:', error);
      return null;
    }
  }

  filterAvailableVoices(jsonData) {
    if (!jsonData) return [];

    const availableVoices = [];
    const voices = speechSynthesis.getVoices();

    jsonData.voices.forEach(
      function (voice) {
        if (voices.some(apiVoice => apiVoice.name === voice.name)) {
          if (voice.gender === 'male') {
            availableVoices.push(voice);
          }
        }
        else {
          if (voice.altNames) {
            voice.altNames.forEach(
              function (altName) {
                if (voices.some(apiVoice => apiVoice.name === altName)) {
                  voice.name = altName;
                  if (voice.gender === 'male') {
                    availableVoices.push(voice);
                  }
                }
              }
            )
          }
        }
      }
    );
    if (availableVoices.length === 0) {
      jsonData.voices.forEach(
        function (voice) {
          if (voices.some(apiVoice => apiVoice.name === voice.name)) { availableVoices.push(voice); }
          else {
            if (voice.altNames) {
              voice.altNames.forEach(
                function (altName) {
                  if (voices.some(apiVoice => apiVoice.name === altName)) {
                    voice.name = altName;
                    availableVoices.push(voice);
                  }
                }
              )
            }
          }
        }
      );
    }
    if (availableVoices.length === 0) {
      // Fallback: add all voices
      // Filter for English voices only

      voices.filter(v => v.lang.startsWith('en')).forEach(v => {
            availableVoices.push({ name: v.name, label: v.name, language: v.lang });
        });
    }
    return availableVoices;
  }


  groupVoicesByRegion(voices) {
      const regions = {};

      voices.forEach(voice => {
          const region = this.extractRegionFromLang(voice.language) || 'Other';
          if (!regions[region]) {
              regions[region] = [];
          }
          regions[region].push(voice);
      });

      return regions;
  }

  extractRegionFromLang(lang) {
      if (!lang) return null;
      const parts = lang.split('-');
      return parts.length > 1 ? parts[1] : null;
  }

  sortVoicesByRegionPreference(groupedVoices) {
      const acceptLanguages = navigator.languages;
      const primaryRegion = acceptLanguages.map(lang => this.extractRegionFromLang(lang) || 'Other');

      const sortedVoices = [];

      primaryRegion.forEach(region => {
          if (groupedVoices[region]) {
              sortedVoices.push(...groupedVoices[region]);
              delete groupedVoices[region];
          }
      });

      for (const region in groupedVoices) {
          sortedVoices.push(...groupedVoices[region]);
      }

      return sortedVoices;
  }

  generateVoiceDropdownHTML(jsonData) {
      if (!jsonData) return '';

      const voiceSelect = document.createElement('select');
      voiceSelect.id = 'voice-select';

      (jsonData || []).forEach(function (voice) {
          const voiceOption = document.createElement('option');
          voiceOption.value = voice.name;
          voiceOption.textContent = voice.label;
          voiceSelect.appendChild(voiceOption);
      });

      return voiceSelect.outerHTML;
  }

  readTextWithSelectedVoice() {
    const textToRead = document.getElementById('text-to-read').value;
    const selectedVoice = document.getElementById('voice-select').value;
    const voices = window.speechSynthesis.getVoices();

    if (!textToRead || !selectedVoice) return;

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = textToRead;

    for (const voice of voices) {
      if (voice.name === selectedVoice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
        break;
      }
    }

    speechSynthesis.speak(utterance);
  }

  create() {

    this.cameras.main.setBackgroundColor('#222');
    const cam = this.cameras.main;
    const centerX = cam.width / 2;
    const centerY = cam.height / 2;
    const synth = window.speechSynthesis;
    // Add and center the title image
    const title = this.add.image(centerX, centerY - 150, 'title').setOrigin(0.5);
    const element = this.add.dom(400, 400).createFromCache('voices-form');
    
    synth.getVoices(); // Trigger loading voices

    // Detect if Safari or iOS
    const ua = navigator.userAgent.toLowerCase();
    // const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    // const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    // if (isSafari || isIOS) {
    //   const warningText = this.add.text(centerX, centerY + 200, 'Note: Safari/iOS may have limited voice support.', { font: '16px Arial', fill: '#ffaaaa' }).setOrigin(0.5);
    // } 

    // Detect if mobile device
    // const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const isMobile = true; // Force mobile for testing);
    if (isMobile) {
      let voices = synth.getVoices();

      setTimeout(async () => {
        let jsonData = await this.loadJSONData("voices_en.json");

        if (jsonData) {
          const defaultText = element.getChildByID('text-to-read');
          defaultText.value = "Hello";

          const availableVoices = this.filterAvailableVoices(jsonData);
          const groupedVoices = this.groupVoicesByRegion(availableVoices);
          const sortedVoices = this.sortVoicesByRegionPreference(groupedVoices);
          const voiceDropdownHTML = this.generateVoiceDropdownHTML(sortedVoices);
          const voiceselect = element.getChildByID('voice-select');
          voiceselect.outerHTML = voiceDropdownHTML;
        }
      }, 700);      
    }
    else {
      synth.addEventListener("voiceschanged", async () => {
        let voices = synth.getVoices();

        const jsonData = await this.loadJSONData("voices_en.json");
        if (jsonData) {
          const defaultText = element.getChildByID('text-to-read');
          defaultText.value = "Hello";
          const availableVoices = this.filterAvailableVoices(jsonData);
          const groupedVoices = this.groupVoicesByRegion(availableVoices);
          const sortedVoices = this.sortVoicesByRegionPreference(groupedVoices);
          const voiceDropdownHTML = this.generateVoiceDropdownHTML(sortedVoices);
          const voiceselect = element.getChildByID('voice-select');
          voiceselect.outerHTML = voiceDropdownHTML;
        }
      });
    }

    element.addListener('click');

    element.on('click', (event) => {
      if (event.target.id === 'read-button') {
        // const inputText = element.getChildByID('text-to-read').value;
        // const selectedVoice = element.getChildByID('voice-select').value;
        
        this.readTextWithSelectedVoice();
      } else if (event.target.id === 'play-button') {
        const defaultText = element.getChildByID('text-to-read');
        defaultText.value = "Alright";        
        // Start the game
        this.readTextWithSelectedVoice();
        // Hide the form
        element.setVisible(false);

        // Set GameState voice
        const selectedVoiceName = element.getChildByID('voice-select').value;
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === selectedVoiceName);
        GameState.selectedVoice = selectedVoice || null;
        GameState.isVoicesOn = true;

        startText.setVisible(true);
        optionsText.setVisible(true);

        // Tween show the startText and optionsText
        this.tweens.add({
          targets: [
            startText, optionsText
          ],
          alpha: { from: 0, to: 1 },
          duration: 1000,
          ease: 'Power2',
          onStart: () => {

          }
        });
        // this.scene.start('BedroomScene');
      }
    });

    const textStyle = { font: '34px Berkelium', fill: '#fff' };

    const startText = this.add.text(centerX, centerY + 50, 'Start', textStyle).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const optionsText = this.add.text(centerX, centerY + 120, 'Options', textStyle).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startText.setVisible(false); // Hide start button until voices are loaded
    optionsText.setVisible(false); // Hide options button until voices are loaded

    startText.on('pointerdown', () => {
      this.scene.start('WakeUpScene');
    });
    optionsText.on('pointerdown', () => {
      // Placeholder for options menu
      optionsText.setText('Options (not implemented)');
    });
  }
}

export default TitleScene;
