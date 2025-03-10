import { questions } from './src/data/questions.js';
import { saveScore, createHighScoresTable } from './src/components/highscores.js';
import { audio1, audio2 } from './src/utils/audios.js';

// Seleciona todos os elementos do DOM que serão utilizados no quiz.
const $startButton = document.querySelector(".start-quiz");
const $nextQuestionButton = document.querySelector(".next-question");
const $questionsContainer = document.querySelector(".questions-container");
const $questionText = document.querySelector(".question");
const $answersContainer = document.querySelector(".answers-container");
const $answers = document.querySelectorAll(".answer");
const $restartButton = document.querySelector(".restart-button");
const $welcomeScreen = document.querySelector("#welcomeScreen");
const $playerNameInput = document.querySelector("#playerName");
const $controlsContainer = document.querySelector(".controls-container");

// Variáveis para controlar o estado do quiz.
let currentQuestionIndex = 0;
let totalCorrect = 0;
let error = false;
let playerName = "";
let playerLocation = "";
let playerLocationStade = "";

// Função para embaralhar um array de perguntas.
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Adiciona um listener de evento ao botão "Iniciar Quiz".
$startButton.addEventListener("click", () => {
    if ($playerNameInput.value.trim() === "") {
        alert("Por favor, digite seu nome antes de começar!");
        return;
    }
    playerName = $playerNameInput.value.trim();
    playerLocation = document.querySelector("#playerLocation").value.trim();
    playerLocationStade = document.querySelector("#playerLocationStade").value.trim();
    startGame();
});

// Adiciona um listener de evento ao botão "Próxima Pergunta".
$nextQuestionButton.addEventListener("click", displayNextQuestion);

// Função para iniciar o quiz.
function startGame() {
    $welcomeScreen.classList.add("hide");
    $questionsContainer.classList.remove("hide");
    $controlsContainer.classList.remove("hide");
    currentQuestionIndex = 0;
    totalCorrect = 0;
    error = false;

    // First shuffle the questions array itself
    const shuffledQuestions = shuffleArray([...questions]);
    // Then shuffle the answers for each question
    const fullyShuffledQuestions = shuffledQuestions.map(q => ({
        ...q,
        answers: shuffleArray([...q.answers])
    }));
    questions.length = 0;
    questions.push(...fullyShuffledQuestions);

    displayNextQuestion();
}

//Função para mostrar a questão seguinte.
function displayNextQuestion() {
    resetState();
    audio1.pause();
    audio1.currentTime = 0;
    responsiveVoice.cancel(); // Stop any ongoing speech

    if (currentQuestionIndex >= questions.length) {
        return finishGame();
    }

    $questionText.textContent = questions[currentQuestionIndex].question;
    speakQuestion();

    questions[currentQuestionIndex].answers.forEach(answer => {
        const newAnswer = document.createElement("button");
        newAnswer.classList.add("button", "answer");
        newAnswer.textContent = answer.text;
        if (answer.correct) {
            newAnswer.dataset.correct = answer.correct;
        }
        $answersContainer.appendChild(newAnswer);
        newAnswer.addEventListener("click", selectAnswer);
    });
}

function speakQuestion() {
    responsiveVoice.speak($questionText.textContent, 'Brazilian Portuguese Female', { rate: 1.2 });
}

function resetState() {
    while ($answersContainer.firstChild) {
        $answersContainer.removeChild($answersContainer.firstChild);
    }
    document.body.removeAttribute("class");
    $nextQuestionButton.classList.add("hide");
}

function selectAnswer(event) {
    const answerClicked = event.target;

    if (answerClicked.dataset.correct) {
        document.body.classList.add("correct");
        totalCorrect++;
        audio1.play();
    } else {
        document.body.classList.add("incorrect");
        audio2.play();
        error = true;
    }

    document.querySelectorAll(".answer").forEach(button => {
        button.disabled = true;
        if (button.dataset.correct) {
            button.classList.add("correct");
        } else {
            button.classList.add("incorrect");
        }
    });

    if (error) {
        finishGame();
    } else {
        $nextQuestionButton.classList.remove("hide");
        currentQuestionIndex++;
    }
}

$restartButton.addEventListener("click", () => {
    $welcomeScreen.classList.remove("hide");
    $welcomeScreen.insertAdjacentHTML('beforeend', createHighScoresTable());
    $questionsContainer.classList.add("hide");
    $playerNameInput.value = "";
});

function finishGame() {
    const totalQuestions = questions.length;
    const performance = Math.floor(totalCorrect * 100 / totalQuestions);

    let message = "";
    switch (true) {
        case (performance >= 75):
            message = `Excelente!`;
            break;
        case (performance >= 50):
            message = `Muito bom!`;
            break;
        case (performance >= 25):
            message = `Bom!`;
            break;
        default:
            message = `Pode melhorar!`;
    }

    const finalScore = Math.floor(totalCorrect * 100 / totalQuestions);
    saveScore(playerName, finalScore, playerLocation, playerLocationStade);

    $questionsContainer.innerHTML = `
        <p class="final-message">
        <span>Resultado:
        <br> 
        <br> 
            ${playerName}, você acertou ${totalCorrect} questões!
            <br>
            <br> 
            ${message}</span>
        </p>
        <button onclick="window.location.reload()" class="button">Reiniciar</button>
    `;

    // Update high scores display
    const highScoresSection = document.querySelector('#highScoresSection');
    if (highScoresSection) {
        highScoresSection.innerHTML = createHighScoresTable();
    }

    $nextQuestionButton.classList.add("hide");
    $restartButton.classList.add("hide");
}

// Esconde os elementos de pergunta e resposta inicialmente
document.addEventListener('DOMContentLoaded', () => {
    $questionsContainer.classList.add('hide');
    $controlsContainer.classList.add('hide');
});

// Initialize high scores table when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const highScoresSection = document.querySelector('#highScoresSection');
    highScoresSection.innerHTML = createHighScoresTable();
});