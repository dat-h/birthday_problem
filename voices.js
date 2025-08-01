let voices = speechSynthesis.getVoices();
document.getElementById('read-button').addEventListener('click', readTextWithSelectedVoice);
const inputForm = document.querySelector("form");
// inputForm.addEventListener('submit', function(event) {
//     event.preventDefault();
//     readTextWithSelectedVoice();
// });
window.addEventListener("DOMContentLoaded", OnLoad());


async function OnLoad() {
    const jsonData = await loadJSONData("voices_en.json");
    if (jsonData) {
        const defaultText = document.getElementById('text-to-read');
        defaultText.value = "Hello! This is me!";

        let voices = speechSynthesis.getVoices();

        const availableVoices = filterAvailableVoices(jsonData);
        const groupedVoices = groupVoicesByRegion(availableVoices);
        const sortedVoices = sortVoicesByRegionPreference(groupedVoices);
        const voiceDropdownHTML = generateVoiceDropdownHTML(sortedVoices);
        // const voiceDropdownHTML = generateVoiceDropdownHTML(voices);
        document.getElementById('voice-select').outerHTML = voiceDropdownHTML;
        document.getElementById('read-button').addEventListener('click', readTextWithSelectedVoice);
        const inputForm = document.querySelector("form");
        inputForm.addEventListener('submit', function(event) {
            event.preventDefault();
            readTextWithSelectedVoice();
        });
    }
}

async function loadJSONData(url) {
    try {
        const response = await fetch(url);
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error loading JSON data:', error);
        return null;
    }
}

function filterAvailableVoices(jsonData) {
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
        voices.forEach(v => {
            availableVoices.push({ name: v.name, label: v.name, language: v.lang });
        });
    }

    return availableVoices;
}

function groupVoicesByRegion(voices) {
    const regions = {};

    voices.forEach(voice => {
        const region = extractRegionFromLang(voice.language) || 'Other';
        if (!regions[region]) {
            regions[region] = [];
        }
        regions[region].push(voice);
    });

    return regions;
}

function extractRegionFromLang(lang) {
    if (!lang) return null;
    const parts = lang.split('-');
    return parts.length > 1 ? parts[1] : null;
}

function sortVoicesByRegionPreference(groupedVoices) {
    const acceptLanguages = navigator.languages;
    const primaryRegion = acceptLanguages.map(lang => extractRegionFromLang(lang) || 'Other');

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

function generateVoiceDropdownHTML(jsonData) {
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

function readTextWithSelectedVoice() {
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