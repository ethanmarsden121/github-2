// ============================================
// RNG PVP GAME LOGIC
// ============================================

let gameState = {
    mode: null, // 'single' or 'multi'
    currentPlayer: 1,
    player1: {
        name: 'Player 1',
        health: 100,
        maxHealth: 100,
        defending: false,
        lastRoll: 0,
        lastDamage: 0
    },
    player2: {
        name: 'Player 2',
        health: 100,
        maxHealth: 100,
        defending: false,
        lastRoll: 0,
        lastDamage: 0
    },
    gameOver: false
};

// ============================================
// START SINGLE PLAYER MODE
// ============================================

function startSinglePlayer() {
    gameState.mode = 'single';
    gameState.player2.name = '🤖 Computer';
    document.getElementById('p2Name').textContent = gameState.player2.name;
    startGame();
}

// ============================================
// START MULTIPLAYER MODE
// ============================================

function startMultiplayer() {
    gameState.mode = 'multi';
    const name = prompt('Enter Player 2 name:') || 'Player 2';
    gameState.player2.name = name;
    document.getElementById('p2Name').textContent = gameState.player2.name;
    startGame();
}

// ============================================
// START GAME
// ============================================

function startGame() {
    document.getElementById('modeSelection').style.display = 'none';
    document.getElementById('gameArea').style.display = 'grid';
    document.getElementById('controlPanel').style.display = 'flex';
    document.getElementById('p1Name').textContent = gameState.player1.name;
    updateUI();
}

// ============================================
// ROLL DICE ATTACK (1-20)
// ============================================

function rollDice() {
    if (gameState.gameOver) return;

    const player = gameState.currentPlayer === 1 ? gameState.player1 : gameState.player2;
    const opponent = gameState.currentPlayer === 1 ? gameState.player2 : gameState.player1;

    // Roll dice
    const roll = Math.floor(Math.random() * 20) + 1;
    player.lastRoll = roll;

    // Calculate damage
    let damage = roll;
    if (opponent.defending) {
        damage = Math.max(0, damage - 5); // Defense reduces damage
        opponent.defending = false;
        showMessage(`${getPlayerName(gameState.currentPlayer)} rolled ${roll}! Defense reduced damage!`);
    } else {
        showMessage(`${getPlayerName(gameState.currentPlayer)} rolled ${roll}! Dealing ${damage} damage!`);
    }

    player.lastDamage = damage;
    opponent.health -= damage;
    opponent.health = Math.max(0, opponent.health);

    checkGameOver();
    if (!gameState.gameOver) {
        switchTurn();
    }
}

// ============================================
// SPECIAL ATTACK (1-30)
// ============================================

function useSpecialAttack() {
    if (gameState.gameOver) return;

    const player = gameState.currentPlayer === 1 ? gameState.player1 : gameState.player2;
    const opponent = gameState.currentPlayer === 1 ? gameState.player2 : gameState.player1;

    // Roll special attack (higher damage potential)
    const roll = Math.floor(Math.random() * 30) + 1;
    player.lastRoll = roll;

    // Calculate damage
    let damage = roll;
    if (opponent.defending) {
        damage = Math.max(0, damage - 8); // Defense is more effective against special
        opponent.defending = false;
        showMessage(`⚡ ${getPlayerName(gameState.currentPlayer)} used Special Attack! Rolled ${roll}. Defense blocked most of it!`);
    } else {
        showMessage(`⚡ ${getPlayerName(gameState.currentPlayer)} used Special Attack! Rolled ${roll}! Massive ${damage} damage!`);
    }

    player.lastDamage = damage;
    opponent.health -= damage;
    opponent.health = Math.max(0, opponent.health);

    checkGameOver();
    if (!gameState.gameOver) {
        switchTurn();
    }
}

// ============================================
// DEFEND
// ============================================

function defend() {
    if (gameState.gameOver) return;

    const player = gameState.currentPlayer === 1 ? gameState.player1 : gameState.player2;
    player.defending = true;
    player.lastRoll = 0;
    player.lastDamage = 0;

    showMessage(`🛡️ ${getPlayerName(gameState.currentPlayer)} is defending! Next damage will be reduced.`);
    switchTurn();
}

// ============================================
// SWITCH TURN
// ============================================

function switchTurn() {
    if (gameState.mode === 'single' && gameState.currentPlayer === 1) {
        // Switch to computer turn
        gameState.currentPlayer = 2;
        updateUI();
        setTimeout(computerTurn, 1500);
    } else if (gameState.mode === 'single' && gameState.currentPlayer === 2) {
        gameState.currentPlayer = 1;
        updateUI();
    } else {
        // Multiplayer - switch players
        gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
        updateUI();
    }
}

// ============================================
// COMPUTER AI
// ============================================

function computerTurn() {
    if (gameState.gameOver) return;

    const actions = ['attack', 'special', 'defend', 'defend'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    if (randomAction === 'attack') {
        rollDice();
    } else if (randomAction === 'special') {
        useSpecialAttack();
    } else {
        defend();
    }
}

// ============================================
// CHECK GAME OVER
// ============================================

function checkGameOver() {
    if (gameState.player1.health <= 0) {
        endGame(gameState.player2.name);
    } else if (gameState.player2.health <= 0) {
        endGame(gameState.player1.name);
    }
}

// ============================================
// END GAME
// ============================================

function endGame(winner) {
    gameState.gameOver = true;
    document.getElementById('controlPanel').style.display = 'none';

    const winnerText = `🎉 ${winner} WINS! 🎉`;
    const finalStats = `
        ${gameState.player1.name}: ${gameState.player1.health} HP remaining<br>
        ${gameState.player2.name}: ${gameState.player2.health} HP remaining
    `;

    document.getElementById('winnerText').textContent = winnerText;
    document.getElementById('finalStats').innerHTML = finalStats;
    document.getElementById('gameOverScreen').style.display = 'flex';
}

// ============================================
// UPDATE UI
// ============================================

function updateUI() {
    // Player 1
    const p1HealthPercent = (gameState.player1.health / gameState.player1.maxHealth) * 100;
    document.getElementById('p1Health').style.width = p1HealthPercent + '%';
    document.getElementById('p1HealthText').textContent = `${gameState.player1.health} / ${gameState.player1.maxHealth}`;
    document.getElementById('p1LastRoll').textContent = gameState.player1.lastRoll || '-';
    document.getElementById('p1Damage').textContent = gameState.player1.lastDamage || '0';

    // Player 2
    const p2HealthPercent = (gameState.player2.health / gameState.player2.maxHealth) * 100;
    document.getElementById('p2Health').style.width = p2HealthPercent + '%';
    document.getElementById('p2HealthText').textContent = `${gameState.player2.health} / ${gameState.player2.maxHealth}`;
    document.getElementById('p2LastRoll').textContent = gameState.player2.lastRoll || '-';
    document.getElementById('p2Damage').textContent = gameState.player2.lastDamage || '0';

    // Turn display
    const currentName = getPlayerName(gameState.currentPlayer);
    document.getElementById('turnDisplay').textContent = `${currentName}'s Turn`;
}

// ============================================
// SHOW MESSAGE
// ============================================

function showMessage(message) {
    document.getElementById('messageBox').textContent = message;
    updateUI();
}

// ============================================
// GET PLAYER NAME
// ============================================

function getPlayerName(playerNum) {
    return playerNum === 1 ? gameState.player1.name : gameState.player2.name;
}

// ============================================
// RESTART GAME
// ============================================

function restartGame() {
    // Reset game state
    gameState = {
        mode: null,
        currentPlayer: 1,
        player1: {
            name: 'Player 1',
            health: 100,
            maxHealth: 100,
            defending: false,
            lastRoll: 0,
            lastDamage: 0
        },
        player2: {
            name: 'Player 2',
            health: 100,
            maxHealth: 100,
            defending: false,
            lastRoll: 0,
            lastDamage: 0
        },
        gameOver: false
    };

    // Reset UI
    document.getElementById('modeSelection').style.display = 'block';
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('controlPanel').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('messageBox').textContent = '';
}

console.log('🎮 RNG PvP Game loaded! Choose your battle mode.');
