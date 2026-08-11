var firstSelection = null;

function startGame() {
    // Hide start screen and show puzzle screen
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("puzzleScreen").style.display = "block";
}

function exitGame() {
    // Safe exit fallback since modern browsers block window.close()
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
            document.getElementById("puzzleMsg").style.color = "green";
            document.getElementById("puzzleMsg").innerText = "Match found! Entering the party...";
            
            setTimeout(function() {
                document.getElementById("puzzleScreen").style.display = "none";
                document.getElementById("partyScreen").style.display = "flex";
            }, 1000);

        } else {
            document.getElementById("puzzleMsg").style.color = "red";
            document.getElementById("puzzleMsg").innerText = "Wrong match! Try again.";
            
            var prevCard = firstSelection.element;
            setTimeout(function() {
                prevCard.style.border = "3px solid #333";
                secondSelection.element.style.border = "3px solid #333";
            }, 500);
        }
        firstSelection = null;
    }
}

function showGreg() {
    var btn = document.getElementById('gregButton');
    var img = document.getElementById('gregPic');
    var title = document.getElementById('mainTitle');
    var text = document.getElementById('mainText');
    var greg2 = document.getElementById('greg2Img');
    var partyScreen = document.getElementById('partyScreen');
    var escapeBtn = document.getElementById('escapeBtn');

    greg2.style.display = 'none';
    title.style.display = 'none';
    
    // Reveal and activate the escaping EXIT button on the party screen
    escapeBtn.style.display = 'block';
    escapeBtn.style.left = '50%';
    escapeBtn.style.top = '75%';

    var music = document.getElementById('gregMusic');
    var playPromise = music.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {}).catch(error => {
            console.log("Playback blocked or failed");
        });
    }

    const messages = [
        "Warning!!",
        "Haha Warning",
        "Warning Nakakabulag!!",
        "Warning!! Warning!!",
        "Warning!!",
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    btn.innerText = messages[randomIndex];

    // Party Light Flash Effect
    const partyColors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    setInterval(function() {
        var randomColor = partyColors[Math.floor(Math.random() * partyColors.length)];
        partyScreen.style.backgroundColor = randomColor;
    }, 2);

    title.style.color = "#ffffff";
    text.style.color = "#ffffff";

    btn.style.backgroundColor = "#ff6600";
    btn.style.color = "#8f19df";
    btn.style.fontWeight = "bold";

    img.style.display = "block"; 
}

// Escaping Exit Button Logic (Runs away from the mouse)
document.addEventListener('mousemove', (e) => {
    const escapeBtn = document.getElementById('escapeBtn');
    if (escapeBtn && escapeBtn.style.display === 'block') {
        const btnRect = escapeBtn.getBoundingClientRect();
        
        const btnX = btnRect.left + btnRect.width / 2;
        const btnY = btnRect.top + btnRect.height / 2;

        const distanceX = e.clientX - btnX;
        const distanceY = e.clientY - btnY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Runs away if mouse gets closer than 120 pixels
        if (distance < 160) {
            const randomX = Math.random() * (window.innerWidth - btnRect.width - 50);
            const randomY = Math.random() * (window.innerHeight - btnRect.height - 50);

            escapeBtn.style.left = `${randomX}px`;
            escapeBtn.style.top = `${randomY}px`;
        }
    }
});

// Event listener for when they somehow catch and click the escaping exit button
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'escapeBtn') {
        alert("You actually caught it! Exiting...");
        window.location.href = "about:blank";
    }
});