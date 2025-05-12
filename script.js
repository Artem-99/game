let player = document.getElementById('player');
let gameContainer = document.getElementById('gameContainer');
let scoreElement = document.getElementById('score');
let startButton = document.getElementById('start');
let restartButton = document.getElementById('restart');
let score = 0;
let gameActive = false;
let playerX = 180;
let playerY = 50;
let gameInterval;
let lasers = [];
let canShoot = true;

function movePlayer(direction) {
    if (!gameActive) return;
    
    switch(direction) {
        case 'left': if(playerX > 0) playerX -= 20; break;
        case 'right': if(playerX < 360) playerX += 20; break;
        case 'up': if(playerY < 560) playerY += 20; break;
        case 'down': if(playerY > 0) playerY -= 20; break;
    }
    
    player.style.left = playerX + 'px';
    player.style.bottom = playerY + 'px';
}

function shootLaser() {
    if (!gameActive || !canShoot) return;
    
    const laser = document.createElement('div');
    laser.className = 'laser';
    laser.style.left = (playerX + 18) + 'px';
    laser.style.bottom = (playerY + 40) + 'px';
    gameContainer.appendChild(laser);
    lasers.push(laser);

    canShoot = false;
    setTimeout(() => canShoot = true, 200);

    const moveLaser = () => {
        if (!gameActive) return;
        
        const bottom = parseInt(laser.style.bottom) || 0;
        laser.style.bottom = (bottom + 15) + 'px';

        document.querySelectorAll('.obstacle').forEach(obstacle => {
            const laserRect = laser.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();

            if (checkCollision(laserRect, obstacleRect)) {
                createExplosion(obstacleRect);
                obstacle.remove();
                laser.remove();
                lasers.splice(lasers.indexOf(laser), 1);
                score += 50;
                scoreElement.textContent = 'SCORE: ' + score;
            }
        });

        if (bottom < 600) requestAnimationFrame(moveLaser);
        else laser.remove();
    };
    
    requestAnimationFrame(moveLaser);
}

function checkCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

function createExplosion(rect) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = (rect.left - gameContainer.getBoundingClientRect().left - 20) + 'px';
    explosion.style.top = (rect.top - gameContainer.getBoundingClientRect().top - 20) + 'px';
    gameContainer.appendChild(explosion);
    setTimeout(() => explosion.remove(), 400);
}

function createObstacle() {
    if (!gameActive) return;
    
    let obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.left = Math.random() * 370 + 'px';
    obstacle.style.top = '-30px';
    gameContainer.appendChild(obstacle);

    const moveObstacle = () => {
        if (!gameActive) return;
        
        let top = parseInt(obstacle.style.top);
        obstacle.style.top = (top + 3) + 'px';

        if (checkCollision(player.getBoundingClientRect(), obstacle.getBoundingClientRect())) {
            gameOver();
        }

        if (top < 600) requestAnimationFrame(moveObstacle);
        else {
            obstacle.remove();
            score += 10;
            scoreElement.textContent = 'SCORE: ' + score;
        }
    };
    
    requestAnimationFrame(moveObstacle);
}

function gameOver() {
    gameActive = false;
    startButton.style.display = 'none';
    restartButton.style.display = 'block';
    player.style.filter = 'hue-rotate(90deg)';
    clearInterval(gameInterval);
    lasers.forEach(laser => laser.remove());
}

function startGame() {
    gameContainer.innerHTML = '<div id="player"></div>';
    player = document.getElementById('player');
    playerX = 180;
    playerY = 50;
    player.style.left = playerX + 'px';
    player.style.bottom = playerY + 'px';
    player.style.filter = 'none';
    score = 0;
    scoreElement.textContent = 'SCORE: 0';
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    gameActive = true;
    lasers = [];
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(createObstacle, 800);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') movePlayer('left');
    if (e.key === 'ArrowRight') movePlayer('right');
    if (e.key === 'ArrowUp') movePlayer('up');
    if (e.key === 'ArrowDown') movePlayer('down');
    if (e.key === ' ') shootLaser();
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

startButton.style.display = 'block';
restartButton.style.display = 'none';