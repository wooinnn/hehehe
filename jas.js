var firstSelection = null;

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("puzzleScreen").style.display = "block";
    document.getElementById("backgroundMusic").pause();
}

function exitGame() {
    alert("Thanks for playing! You can now close this tab.");
    window.location.href = "about:blank";
}

function selectCard(cardElement, cardType) {
    cardElement.style.border = "3px solid gold";

    if (firstSelection === null) {
        firstSelection = { element: cardElement, type: cardType };
    } else {
        var secondSelection = { element: cardElement, type: cardType };

        if (firstSelection.type === secondSelection.type && firstSelection.element !== secondSelection.element) {
            var msg = document.getElementById("puzzleMsg");
            if (msg) {
                msg.style.color = "green";
                msg.innerText = "Match found! Entering the party...";
            }
            
            setTimeout(function() {
                document.getElementById("puzzleScreen").style.display = "none";
                document.getElementById("partyScreen").style.display = "flex";
            }, 1000);

        } else {
            var msg = document.getElementById("puzzleMsg");
            if (msg) {
                msg.style.color = "red";
                msg.innerText = "Wrong match! Try again.";
            }
            
            var prevCard = firstSelection.element;
            setTimeout(function() {
                prevCard.style.border = "3px solid #333";
                secondSelection.element.style.border = "3px solid #333";
            }, 500);
        }
        firstSelection = null;
    }
}

function goToLightScreen() {
    document.getElementById('partyScreen').style.display = 'none';
    document.getElementById('lightScreen').style.display = 'flex';

    var music = document.getElementById('gregMusic');
    if (music) {
        var playPromise = music.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {}).catch(error => {
                console.log("Playback blocked or failed");
            });
        }
    }

    var escapeBtn = document.getElementById('escapeBtn');
    if (escapeBtn) {
        escapeBtn.style.display = 'block';
        escapeBtn.style.position = 'absolute';
        
        escapeBtn.style.left = (window.innerWidth / 2 - 145) + 'px';
        escapeBtn.style.top = (window.innerHeight / 2 - 40) + 'px';
    }

    var img = document.getElementById('gregPic');
    if (img) {
        img.style.display = "block";
        img.style.margin = "20px auto";
        img.style.borderRadius = "10px";
        img.style.zIndex = "1000";
    }

    const partyColors = [
        "rgba(255, 255, 255, 0.95)", 
        "rgba(255, 0, 0, 0.85)", 
        "rgba(0, 255, 0, 0.85)", 
        "rgba(0, 0, 255, 0.85)", 
        "rgba(255, 255, 0, 0.85)", 
        "rgba(255, 0, 255, 0.85)", 
        "rgba(0, 255, 255, 0.85)"
    ];
    
    setInterval(function() {
        var randomColor = partyColors[Math.floor(Math.random() * partyColors.length)];
        var overlay = document.getElementById('flashOverlay');
        if (overlay) {
            overlay.style.backgroundColor = randomColor;
        }
    }, 15);
}


document.addEventListener('mousemove', (e) => {
    const escapeBtn = document.getElementById('escapeBtn');
    if (escapeBtn && escapeBtn.style.display === 'block') {
        const btnRect = escapeBtn.getBoundingClientRect();
        
        const btnX = btnRect.left + btnRect.width / 2;
        const btnY = btnRect.top + btnRect.height / 2;

        const distanceX = e.clientX - btnX;
        const distanceY = e.clientY - btnY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        
        if (distance < 200) {
            const minX = 20;
            const minY = 20;
            const maxX = window.innerWidth - btnRect.width - 20;
            const maxY = window.innerHeight - btnRect.height - 20;

            const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

            escapeBtn.style.left = `${randomX}px`;
            escapeBtn.style.top = `${randomY}px`;
        }
    }
});

document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'escapeBtn') {
        alert("You actually caught it! Exiting...");
        window.location.href = "about:blank";
    }
});