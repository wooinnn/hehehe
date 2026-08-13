const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load Player Image (Greg)
const gregImg = new Image();
gregImg.src = 'roblox_greg-removebg-preview.png';

// Load Caught Sound
const caughtSound = document.getElementById('caughtSound');

// Game State Variables
let currentLevel = 1;
const maxLevels = 3;
let gameState = "PLAYING"; // "PLAYING", "DETENTION", "VICTORY"
let levelNoticeTimer = 120;
let particleEffects = [];

// Level Data
const levelData = [
    { name: "Level 1: Teachers' Lounge", speedMult: 1.0, traps: [240, 480] },
    { name: "Level 2: Principal's Office", speedMult: 1.4, traps: [180, 380, 520] },
    { name: "Level 3: Secure Vault Room", speedMult: 1.8, traps: [160, 300, 450, 580] }
];

// Greg Object
const greg = {
    x: 50,
    y: 220,
    width: 60,
    height: 90,
    speed: 3.5,
    isMoving: false,
    hasAnswers: false
};

// Teacher Object with Dynamic AI States
const teacher = {
    x: 700,
    y: 210,
    width: 50,
    height: 100,
    state: "FACING_AWAY", // "FACING_AWAY", "TURNING", "LOOKING", "COFFEE", "SLEEPING"
    timer: 0,
    zzzTimer: 0,
    dialogue: ""
};

// Key Tracking
const keys = { left: false, right: false };

// Floorboards Array
let floorboards = [];

const fooledDialogues = [
    "Hmm, nice new cardboard cutout.",
    "Did art class make this mannequin?",
    "Statue looks strangely suspicious...",
    "Must be a new school mascot.",
    "I swear that prop was 2 feet left..."
];

window.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.right = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.right = false;
});

function initLevelTraps() {
    floorboards = levelData[currentLevel - 1].traps.map(xPos => ({
        x: xPos,
        width: 35,
        steppedOn: false
    }));
}

function createTextParticle(x, y, text, color) {
    particleEffects.push({ x, y, text, color, life: 40 });
}

function update() {
    if (gameState !== "PLAYING") return;

    if (levelNoticeTimer > 0) levelNoticeTimer--;

    // 1. Movement logic
    greg.isMoving = keys.left || keys.right;

    if (keys.left && greg.x > 20) {
        greg.x -= greg.speed;
    }
    if (keys.right && greg.x < canvas.width - 80) {
        greg.x += greg.speed;
    }

    // 2. Check Squeaky Floorboard Traps
    floorboards.forEach(board => {
        let gregCenter = greg.x + greg.width / 2;
        let isOnBoard = gregCenter >= board.x && gregCenter <= board.x + board.width;

        if (isOnBoard && greg.isMoving) {
            if (!board.steppedOn) {
                board.steppedOn = true;
                createTextParticle(greg.x, greg.y - 10, "SQUEAK!! 🔊", "#ff3333");

                // Squeak consequences: alert teacher instantly!
                if (teacher.state === "SLEEPING" || teacher.state === "COFFEE") {
                    teacher.state = "TURNING";
                    teacher.timer = 20; // Short warning before looking
                    createTextParticle(teacher.x, teacher.y - 20, "WOKE UP! ❗", "#ff9800");
                } else if (teacher.state === "FACING_AWAY") {
                    teacher.state = "TURNING";
                    teacher.timer = 15;
                    createTextParticle(teacher.x, teacher.y - 20, "HEARD THAT! ❗", "#ff9800");
                }
            }
        } else if (!isOnBoard) {
            board.steppedOn = false; // Reset when stepped off
        }
    });

    // 3. Objective checks
    if (greg.x >= 650 && !greg.hasAnswers) {
        greg.hasAnswers = true;
    }

    if (greg.hasAnswers && greg.x <= 40) {
        if (currentLevel < maxLevels) {
            currentLevel++;
            resetLevel();
        } else {
            gameState = "VICTORY";
        }
    }

    // 4. Dynamic Teacher AI Loop
    const currentConfig = levelData[currentLevel - 1];

    if (teacher.state === "FACING_AWAY") {
        teacher.timer += 0.01 * currentConfig.speedMult;
        
        // Randomly transition into TURNING, COFFEE, or SLEEPING
        if (Math.random() < teacher.timer) {
            let roll = Math.random();
            teacher.timer = 0;

            if (roll < 0.45) {
                teacher.state = "TURNING";
                teacher.timer = 40; // Warning animation frames
            } else if (roll < 0.75) {
                teacher.state = "COFFEE";
                teacher.timer = 160; // ~2.5 seconds coffee break
            } else {
                teacher.state = "SLEEPING";
                teacher.timer = 220; // ~3.5 seconds sleep
                teacher.zzzTimer = 0;
            }
        }
    } else if (teacher.state === "COFFEE") {
        teacher.timer--;
        if (teacher.timer <= 0) {
            teacher.state = "FACING_AWAY";
            teacher.timer = 0;
        }
    } else if (teacher.state === "SLEEPING") {
        teacher.timer--;
        teacher.zzzTimer++;

        // Spawn Zzz particle every 30 frames
        if (teacher.zzzTimer % 30 === 0) {
            createTextParticle(teacher.x + 10, teacher.y - 20, "Zzz...", "#00ffcc");
        }

        if (teacher.timer <= 0) {
            teacher.state = "FACING_AWAY";
            teacher.timer = 0;
        }
    } else if (teacher.state === "TURNING") {
        teacher.timer--;
        if (teacher.timer <= 0) {
            teacher.state = "LOOKING";
            teacher.timer = Math.floor(Math.random() * 100) + 80;
            teacher.dialogue = fooledDialogues[Math.floor(Math.random() * fooledDialogues.length)];
        }
    } else if (teacher.state === "LOOKING") {
        teacher.timer--;

        // DETENTION DETECTION! Caught moving while teacher is looking!
        if (greg.isMoving) {
            gameState = "DETENTION";
            playCaughtSound();
        }

        if (teacher.timer <= 0) {
            teacher.state = "FACING_AWAY";
            teacher.timer = 0;
        }
    }

    // Update particles
    for (let i = particleEffects.length - 1; i >= 0; i--) {
        let p = particleEffects[i];
        p.y -= 0.8;
        p.life--;
        if (p.life <= 0) particleEffects.splice(i, 1);
    }
}

function playCaughtSound() {
    if (caughtSound) {
        caughtSound.currentTime = 0; // Rewind to start if re-triggered
        caughtSound.play().catch(err => {
            console.log("Audio play blocked by browser policy until user interaction:", err);
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Environment: Room Walls & Floor
    ctx.fillStyle = '#393e46';
    ctx.fillRect(0, 0, canvas.width, 310);
    ctx.fillStyle = '#222831';
    ctx.fillRect(0, 310, canvas.width, 90);

    // Draw Squeaky Floorboard Traps
    floorboards.forEach(board => {
        ctx.fillStyle = '#4a2810';
        ctx.fillRect(board.x, 310, board.width, 90);
        
        // Squeaky lines detail
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(board.x + 5, 320);
        ctx.lineTo(board.x + board.width - 5, 380);
        ctx.stroke();

        ctx.fillStyle = '#ff6b6b';
        ctx.font = '6px "Press Start 2P"';
        ctx.fillText("SQUEAK", board.x - 2, 390);
    });

    // Escape Door
    ctx.fillStyle = '#4e3629';
    ctx.fillRect(10, 160, 45, 150);
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(45, 235, 4, 0, Math.PI * 2);
    ctx.fill();

    // Desk & Test Answers
    ctx.fillStyle = '#5c3d2e';
    ctx.fillRect(660, 240, 110, 70);
    
    if (!greg.hasAnswers) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(700, 230, 25, 30);
        ctx.fillStyle = '#ff3333';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText("A+", 708, 248);
    }

    // Draw Teacher Body
    ctx.fillStyle = '#e53935';
    ctx.fillRect(teacher.x, teacher.y, teacher.width, teacher.height);
    ctx.fillStyle = '#ffe0b2';
    ctx.fillRect(teacher.x + 10, teacher.y - 20, 30, 20);

    // Teacher Visual States
    if (teacher.state === "FACING_AWAY") {
        ctx.fillStyle = '#000';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText("< BACK", teacher.x, teacher.y - 30);
    } else if (teacher.state === "COFFEE") {
        ctx.fillStyle = '#ffd369';
        ctx.font = '10px "Press Start 2P"';
        ctx.fillText("☕ SIPPING...", teacher.x - 20, teacher.y - 30);
    } else if (teacher.state === "SLEEPING") {
        ctx.fillStyle = '#00ffcc';
        ctx.font = '10px "Press Start 2P"';
        ctx.fillText("😴 SLEEPING", teacher.x - 20, teacher.y - 30);
    } else if (teacher.state === "TURNING") {
        ctx.fillStyle = '#ff9800';
        ctx.font = '10px "Press Start 2P"';
        ctx.fillText("❗ turning...", teacher.x - 30, teacher.y - 30);
    } else if (teacher.state === "LOOKING") {
        // Red Sight Cone
        ctx.fillStyle = 'rgba(255, 0, 0, 0.18)';
        ctx.beginPath();
        ctx.moveTo(teacher.x, teacher.y + 20);
        ctx.lineTo(0, teacher.y - 100);
        ctx.lineTo(0, teacher.y + 180);
        ctx.closePath();
        ctx.fill();

        // Eyes Looking Left
        ctx.fillStyle = '#fff';
        ctx.fillRect(teacher.x + 5, teacher.y - 15, 8, 8);
        ctx.fillRect(teacher.x + 18, teacher.y - 15, 8, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(teacher.x + 5, teacher.y - 13, 4, 4);
        ctx.fillRect(teacher.x + 18, teacher.y - 13, 4, 4);

        if (!greg.isMoving) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(teacher.x - 220, teacher.y - 50, 210, 28);
            ctx.fillStyle = '#000000';
            ctx.font = '6px "Press Start 2P"';
            ctx.fillText(teacher.dialogue, teacher.x - 212, teacher.y - 33);
        }
    }

    // Draw Greg Player
    if (gregImg.complete && gregImg.naturalWidth !== 0) {
        ctx.drawImage(gregImg, greg.x, greg.y, greg.width, greg.height);
    } else {
        ctx.fillStyle = '#00adb5';
        ctx.fillRect(greg.x, greg.y, greg.width, greg.height);
    }

    // STATUE BASE EFFECT when NOT moving
    if (!greg.isMoving) {
        ctx.fillStyle = '#d4a373';
        ctx.fillRect(greg.x - 8, greg.y + greg.height - 5, greg.width + 16, 10);
        ctx.strokeStyle = '#8c5e34';
        ctx.lineWidth = 2;
        ctx.strokeRect(greg.x - 8, greg.y + greg.height - 5, greg.width + 16, 10);

        ctx.fillStyle = '#00ffcc';
        ctx.font = '6px "Press Start 2P"';
        ctx.fillText("[ STATUE MODE ]", greg.x - 12, greg.y - 10);
    }

    // Draw Stolen Item
    if (greg.hasAnswers) {
        ctx.fillStyle = '#ffd369';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText("📄 EXAM ANSWERS", greg.x - 20, greg.y - 25);
    }

    // Particles Overlay
    particleEffects.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText(p.text, p.x, p.y);
    });

    // HUD Header
    ctx.fillStyle = '#fff';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText(`${levelData[currentLevel - 1].name}`, 15, 25);

    let statusText = greg.hasAnswers ? "STATUS: ESCAPE TO DOOR!" : "STATUS: STEAL TEST ANSWERS!";
    ctx.fillStyle = greg.hasAnswers ? '#00ffcc' : '#ffd369';
    ctx.fillText(statusText, 15, 45);

    // Level Banner
    if (levelNoticeTimer > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(150, 140, 500, 60);
        ctx.fillStyle = '#4ecca3';
        ctx.font = '10px "Press Start 2P"';
        ctx.fillText(`STAGE ${currentLevel}: ${levelData[currentLevel - 1].name}`, 175, 175);
    }

    // Game Over / Victory Overlays
    if (gameState === "DETENTION") {
        ctx.fillStyle = 'rgba(180, 0, 0, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#fff';
        ctx.font = '16px "Press Start 2P"';
        ctx.fillText("BUSTED! SENT TO DETENTION!", 130, 180);

        ctx.font = '9px "Press Start 2P"';
        ctx.fillText("The teacher caught Greg moving!", 220, 220);
    } else if (gameState === "VICTORY") {
        ctx.fillStyle = 'rgba(0, 150, 80, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#fff';
        ctx.font = '16px "Press Start 2P"';
        ctx.fillText("HEIST COMPLETE! 100% GRADE!", 120, 170);

        ctx.font = '9px "Press Start 2P"';
        ctx.fillText("Greg successfully cheated on all exams!", 160, 210);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function resetLevel() {
    greg.x = 50;
    greg.hasAnswers = false;
    teacher.state = "FACING_AWAY";
    teacher.timer = 0;
    levelNoticeTimer = 100;
    particleEffects = [];
    initLevelTraps();
}

function restartGame() {
    currentLevel = 1;
    gameState = "PLAYING";
    resetLevel();
}

// Start Game
initLevelTraps();
gameLoop();