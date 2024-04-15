
// static/script.js

const output = document.getElementById('output');
const historyList = document.getElementById('historyList'); // Reference to the ul for history
const startButton = document.getElementById('startButton');
const englishButton = document.getElementById('englishButton');
const hindiButton = document.getElementById('hindiButton');
const spanishButton = document.getElementById('spanishButton');
const resetButton = document.getElementById('resetButton'); // New button for resetting history

let recognition = new webkitSpeechRecognition();
let selectedVoice = null;
let history = [];

// Check if history exists in localStorage and load it if available
if (localStorage.getItem('conversationHistory')) {
    history = JSON.parse(localStorage.getItem('conversationHistory'));
    renderHistory();
}

recognition.continuous = false;

recognition.onresult = function(event) {
    const result = event.results[0][0].transcript;
    output.innerText = result;
    askQuestion(result);
};

function startRecording() {
    recognition.start();
}

function askQuestion(question) {
    fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `question=${encodeURIComponent(question)}`,
    })
    .then(response => response.json())
    .then(data => {
        output.innerText = data.answer;
        speakText(data.answer);
        updateHistory(question, data.answer);
    });
}

function speakText(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    synth.speak(utterance);
}

function updateHistory(question, answer) {
    history.push({ question, answer });
    renderHistory();
    saveHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${item.question}</strong><br>${item.answer}`;
        historyList.appendChild(listItem);
    });
}

function saveHistory() {
    localStorage.setItem('conversationHistory', JSON.stringify(history));
}

function resetHistory() {
    history = [];
    localStorage.removeItem('conversationHistory');
    renderHistory();
}

englishButton.addEventListener('click', () => {
    selectedVoice = window.speechSynthesis.getVoices().find(voice => voice.lang === 'en-US');
});

hindiButton.addEventListener('click', () => {
    selectedVoice = window.speechSynthesis.getVoices().find(voice => voice.lang === 'hi-IN');
});

spanishButton.addEventListener('click', () => {
    selectedVoice = window.speechSynthesis.getVoices().find(voice => voice.lang === 'es-ES');
});

startButton.addEventListener('click', startRecording);
resetButton.addEventListener('click', resetHistory);

document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('startButton'); // Assuming the button's ID is 'startButton'

    button.addEventListener('click', function() {
        this.classList.toggle('clicked'); // Toggle the 'clicked' class on the button
    });
});
