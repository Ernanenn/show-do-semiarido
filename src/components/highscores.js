// Function to save a new score
function saveScore(playerName, score, location, locationStade) {
    const highScores = getHighScores();
    highScores.push({ name: playerName, score: score, location: location, locationStade: locationStade });

    // Sort scores in descending order
    highScores.sort((a, b) => b.score - a.score);

    // Keep only top 5 scores
    const top5Scores = highScores.slice(0, 5);

    // Save to localStorage
    localStorage.setItem('highScores', JSON.stringify(top5Scores));
    return top5Scores;
}

// Function to get high scores from localStorage
function getHighScores() {
    const scores = localStorage.getItem('highScores');
    return scores ? JSON.parse(scores) : [];
}

// Function to create and display the high scores table
function createHighScoresTable() {
    const highScores = getHighScores();

    const tableHTML = `
        <div class="high-scores-container">
            <h2>Top 5 Pontuações</h2>
            ${highScores.length > 0 ? `
                <table class="high-scores-table">
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Nome</th>
                            <th>Cidade</th>
                            <th>Estado</th>
                            <th>Pontuação</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${highScores.map((score, index) => `
                            <tr>
                                <td>${index + 1}º</td>
                                <td>${score.name}</td>
                                <td>${score.location || '-'}</td>
                                <td>${score.locationStade || '-'}</td>
                                <td>${score.score}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : '<p>Ainda não há pontuações registradas</p>'}
        </div>
    `;

    return tableHTML;
}

export { saveScore, getHighScores, createHighScoresTable };