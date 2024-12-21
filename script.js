const textDisplay = document.getElementById('textDisplay');
const textInput = document.getElementById('textInput');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const pauseBtn = document.getElementById('pauseBtn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const finalSpeed = document.getElementById('finalSpeed');
const finalAccuracy = document.getElementById('finalAccuracy');
const charsTyped = document.getElementById('charsTyped');
const mistakes = document.getElementById('mistakes');
const results = document.getElementById('results');
const speedProgress = document.getElementById('speedProgress');
const accuracyProgress = document.getElementById('accuracyProgress');
const timeProgress = document.getElementById('timeProgress');

const texts = [
    "The quick brown fox jumps over the lazy dog.",
    "Practice makes perfect when learning to type.",
    "Focus on accuracy first, then speed will follow naturally.",
    "Keep your fingers on the home row for better typing.",
    "Good posture is essential for comfortable typing.",
    "Learning to touch type can save you hours of time.",
    "Typing is an essential skill in the digital age.",
    "Regular practice will improve your typing speed."
];

let currentText = '';
let timeLeft = 60;
let timer = null;
let isTyping = false;
let correctCharacters = 0;
let totalCharacters = 0;
let isPaused = false;
let mistakeCount = 0;
let totalChars = 0;
let difficultyLevel = 'intermediate';

const difficultySettings = {
    beginner: {
        texts: [
            "The cat sat on the mat.",
            "I like to type words.",
            "She has a red pen.",
            "The sun is bright.",
            "We play in the park."
        ],
        time: 90
    },
    intermediate: {
        texts: [
            "The quick brown fox jumps over the lazy dog.",
            "Practice makes perfect when learning to type.",
            "Focus on accuracy first, then speed will follow.",
            "Keep your fingers on the home row for better typing.",
            "Good posture is essential for comfortable typing."
        ],
        time: 60
    },
    advanced: {
        texts: [
            "The ability to type quickly and accurately is an essential skill in today's digital world.",
            "Professional typists maintain a steady rhythm and consistent speed while minimizing errors.",
            "Developing muscle memory through regular practice is key to improving typing speed.",
            "Touch typing allows you to focus on the content rather than searching for keys.",
            "Ergonomic keyboards and proper posture can prevent repetitive strain injuries."
        ],
        time: 45
    }
};

function initializeText() {
    currentText = difficultySettings[difficultyLevel].texts[Math.floor(Math.random() * difficultySettings[difficultyLevel].texts.length)];
    textDisplay.innerHTML = currentText.split('').map(char => 
        `<span>${char}</span>`
    ).join('');
}

function startTest() {
    textInput.disabled = false;
    textInput.value = '';
    textInput.focus();
    isTyping = true;
    isPaused = false;
    timeLeft = difficultySettings[difficultyLevel].time;
    correctCharacters = 0;
    totalCharacters = 0;
    mistakeCount = 0;
    totalChars = 0;
    results.classList.add('hidden');
    
    startBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    
    startTimer();
    initializeText();
}

function endTest() {
    clearInterval(timer);
    textInput.disabled = true;
    isTyping = false;
    startBtn.disabled = false;
    calculateResults();
    showResults();
}

function calculateResults() {
    const minutes = (difficultySettings[difficultyLevel].time - timeLeft) / 60;
    const wpm = Math.round((correctCharacters / 5) / minutes);
    const accuracy = Math.round((correctCharacters / totalCharacters) * 100) || 0;
    
    wpmDisplay.textContent = wpm + ' WPM';
    accuracyDisplay.textContent = accuracy + '%';
}

function resetTest() {
    clearInterval(timer);
    textInput.value = '';
    textInput.disabled = true;
    timeLeft = difficultySettings[difficultyLevel].time;
    isTyping = false;
    correctCharacters = 0;
    totalCharacters = 0;
    mistakeCount = 0;
    totalChars = 0;
    startBtn.disabled = false;
    timeDisplay.textContent = difficultySettings[difficultyLevel].time + 's';
    wpmDisplay.textContent = '0 WPM';
    accuracyDisplay.textContent = '100%';
    initializeText();
}

function updateDisplay() {
    const inputText = textInput.value;
    const characters = textDisplay.getElementsByTagName('span');
    
    for (let i = 0; i < characters.length; i++) {
        if (i < inputText.length) {
            if (inputText[i] === currentText[i]) {
                characters[i].className = 'correct';
                if (i === inputText.length - 1) {
                    correctCharacters++;
                    totalChars++;
                }
            } else {
                characters[i].className = 'incorrect';
                if (i === inputText.length - 1) {
                    mistakeCount++;
                    totalChars++;
                }
            }
        } else {
            characters[i].className = '';
        }
    }
    
    if (inputText === currentText) {
        initializeText();
        textInput.value = '';
    }
    
    updateProgress();
}

function updateProgress() {
    const timePercent = (timeLeft / difficultySettings[difficultyLevel].time) * 100;
    const speedPercent = Math.min((parseInt(wpmDisplay.textContent) / 100) * 100, 100);
    const accuracyPercent = parseInt(accuracyDisplay.textContent);

    timeProgress.style.width = `${timePercent}%`;
    speedProgress.style.width = `${speedPercent}%`;
    accuracyProgress.style.width = `${accuracyPercent}%`;
}

function showResults() {
    results.classList.remove('hidden');
    finalSpeed.textContent = wpmDisplay.textContent;
    finalAccuracy.textContent = accuracyDisplay.textContent;
    charsTyped.textContent = totalChars;
    mistakes.textContent = mistakeCount;

    const accuracy = parseInt(accuracyDisplay.textContent);
    const speed = parseInt(wpmDisplay.textContent);
    
    let message = '';
    if (accuracy > 95 && speed > 50) {
        message = 'Outstanding! You\'re a typing master!';
    } else if (accuracy > 90 && speed > 30) {
        message = 'Great job! Keep practicing!';
    } else {
        message = 'Good start! Practice makes perfect!';
    }
    
    document.querySelector('#achievement p').textContent = message;
}

function setDifficulty(level) {
    difficultyLevel = level;
    timeLeft = difficultySettings[level].time;
    timeDisplay.textContent = timeLeft + 's';
    resetTest();
    
    difficultyBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.level === level) {
            btn.classList.add('active');
        }
    });
}

function togglePause() {
    if (!isTyping) return;
    
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(timer);
        textInput.disabled = true;
        pauseBtn.textContent = 'Resume';
    } else {
        startTimer();
        textInput.disabled = false;
        textInput.focus();
        pauseBtn.textContent = 'Pause';
    }
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft + 's';
        updateProgress();
        
        if (timeLeft === 0) {
            endTest();
        }
    }, 1000);
}

// Virtual keyboard functionality
const keys = document.querySelectorAll('.key');

document.addEventListener('keydown', (e) => {
    const key = document.querySelector(`[data-key="${e.key}"]`);
    if (key) {
        key.classList.add('active');
    }
});

document.addEventListener('keyup', (e) => {
    const key = document.querySelector(`[data-key="${e.key}"]`);
    if (key) {
        key.classList.remove('active');
    }
});

textInput.addEventListener('input', updateDisplay);
startBtn.addEventListener('click', startTest);
resetBtn.addEventListener('click', resetTest);
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => setDifficulty(btn.dataset.level));
});
pauseBtn.addEventListener('click', togglePause);

// Initialize the first text
initializeText();
